---
title: "Typeclasses V2"
subtitle: "Using dict passing"
date: "2025-07-04"
category: "Haskell"
tags:
  - Haskell
  - Compilers
readTime: "12 min"
preview: "My thoughts about implementing typeclasses"
---

I recently finished reading the book Types and Programming Languages(TAPL), and I found that there's a better perspective on typeclass elaboration than the one in the previous post. Let's dive in.

## Prelude
We use typeclasses in Haskell to support function overloading (ad-hoc polymorphism) and to abstract common behaviour across different types—from Eq and Ord through Functor to Monad. What surprised me most is that we can implement this feature without extending the underlying type system; type classes are (roughly) syntactic sugar on top of a System F-ω-like core.

Before we start, let's go through some common approaches implementing typeclasses.

### Non-Solution 1: Type Dispatch
The most naive implementation is type dispatch. In this approach, if you have some operation like show, you can think of it as implemented by looking at the type of its argument and do some dispatch on it using some hypothetical syntax like:
```haskell
show x = case typeof x of
  Bool -> showBool x
  Char -> showChar x
  String -> showString x
```
There are two major problems with it.
+ It requires whole program compilation, you need to know all the types show operates on in order to generate a working function.
+ We need to keep the type information of a value in runtime, which takes up memory and slows the program down.

### Non-Solution 2: Monomorphization
suppose we have a function:
```haskell
exclaim :: Show a => a -> String
exclaim x = show x ++ "!"
```
When we compile this function, we generate no code for `exclaim`, however, we record `exclaim`'s definition in the interface file, and everytime we see a call to `exclaim`, we look up it's definition and generates a monomorphized version of this function on the fly:
```haskell
exclaim_Bool :: Bool -> String
exclaim_Bool x = show_Bool x ++ "!"
```
and `exclaim True` was substituted by `exclaim_Bool True`.
This is the most common approach in popular Languages like rust('s static dispatch), and the benefit is obvious that the overloading has no runtime cost, but it can create a lot of code bloat. Imagine we have a giant function like:
```haskell
reallyBig :: (Foo a , Bar b, Baz c) => ...
reallyBig = someReallyBigRHS
```
now we have to generate a separate copy of the function for all combination of the three types. This code bloat will not only slows the compiler down, but also increase the binary size and cause less of the program to fit in the cache at once which can cause some cache misses and slow your program down. Also, we loss separate compilation (a downstream module change forces recompilation of every specialisation that uses that type)

### Our approach: Dictionary passing
The key move is compilation-time desugaring. Instead of compiling a polymorphic function directly, we turn each class constraint into an extra argument that carries the methods — a dictionary.
```haskell
-- source (with a Show constraint)
exclaim :: Show a => a -> String
exclaim x = show x ++ "!"

-- after elaboration
exclaim  :: ShowDict a      -- dictionary argument
         -> a
         -> String
exclaim dShow x = show_ dShow x ++ "!"
```
At every call-site the compiler inserts the appropriate dictionary:
```haskell
exclaim (showDictInt) 42        -- specialise for Int
exclaim (showDictBool) True     -- specialise for Bool
```
Now the function body is compiled exactly once, all variety is captured in the first argument!

> What about multiple methods, higher-kinded classes, or super-class constraints?
> No problem—each dictionary is simply a record that can itself contain other dictionaries or higher-rank functions. Actually, this is the approach that Ghc takes in today's haskell.

In the sections that follow we’ll dissect the desugaring step in detail and demonstrate how it handles virtually every use case.

## Basics of system F/F-omega
![definition of system F-omega 1](/typeclassv2-1.png)
![definition of system F-omega 2](/typeclassv2-2.png)

## The Three Step Recipe

| Step |   What it does                                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------- |
| 1    | **Class ⇨ dictionary type-constructor**<br>Each class declaration yields a record-typed type constructor `C Dict :: … → *`. |
| 2    | **Instance ⇨ dictionary value**<br>An `instance` fills that record for a concrete type.                                     |
| 3    | **Constraint ⇨ extra parameter**<br>The compiler passes the right dictionary at every call-site.                            |


## Step-by-step translation

### 1 · Class without superclass  (`Eq`)

| Haskell source                                               | After desugaring                                                                                                                                                        |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `class Eq a where (==) :: a -> a -> Bool`      | `EqDict :: * → * = λA:*. { eq : A → A → Bool } (==) = ΛA. λd : EqDict A.  d.eq` |
| `instance Eq Int where  x == y = primIntEq x y` | `eqIntDict : EqDict InteqIntDict =  { eq = λx:Int. λy:Int. primIntEq x y }`                                                                               |
| `f :: Eq a => a -> Boolf x = … g = f 3`     | `-- constraint becomes first parameter f :: ∀A:* .  EqDict A → A → Bool-- call-site gets a dictionary g = f [Int] eqIntDict  3`                      |

---

### 2 · Class with superclass  (`Ord` inherits `Eq`)
```haskell
-- original class decl
class (Eq a) => Ord a where
  compare :: a -> a -> Ordering

-- generated tycon
type OrdDict :: * -> * = λA:*. { eqDict :: EqDict A;             -- ① superclass
                                 compare :: A -> A -> Ordering } -- ②  our own method

instance Ord Int where
  compare = if x == y then Eq
            else if primIntLess x y then LT
            else GT

ordIntDict :: OrdDict Int
ordIntDict =
  let dEq :: EqDict Int = eqIntDict
  { eqDict  = dEq                  -- reuse parent instance
  ; compare = \x::Int y::Int ->       -- ③ use it inside 'compare'
                if (dEq.eq x y) then EQ
                else if primIntLess x y then LT
                else GT
  }

-- if instance requires addtional bounds
instance (Ord a) => Ord [a] where
  compare = ...

-- The dictionary was turned into a function that receives the additional class dict
ordListDict :: ∀A:*. OrdDict A -> OrdDict (List A)
ordListDict = ΛA. λdA. { eqDict  = eqListDict dA.eqDict
                       ; compare = ... uses dA.compare ...
                       }
```

---

### 3 · High-kind class  (`Functor`, `Applicative`)

#### 3.1 `Functor`

```haskell
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

```fomega
FunctorDict :: (* → *) → *
FunctorDict = λF:*→*.
  { fmap : ∀A:* . ∀B:* . (A → B) → F A → F B }
```

```haskell
instance Functor Maybe where
  fmap _ Nothing  = Nothing
  fmap f (Just x) = Just (f x)
```

```fomega
maybeFunctor : FunctorDict Maybe
maybeFunctor =
  { fmap = ΛA. ΛB. λf:A→B. λm:Maybe A.
               case m of
                 Nothing -> Nothing
                 Just x  -> Just (f x) }
```

#### 3.2 `Applicative` (has superclass `Functor`)

```haskell
class Functor f => Applicative f where
  pure  :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

```fomega
ApplicativeDict :: (* → *) → *
ApplicativeDict = λF:*→*.
  { functor : FunctorDict F
  ; pure    : ∀A. A → F A
  ; ap      : ∀A B. F (A→B) → F A → F B }
```

```haskell
instance Applicative Maybe where …
```

```fomega
maybeAp : ApplicativeDict Maybe
maybeAp =
  { functor = maybeFunctor
  ; pure    = ΛA. λx:A. Just x
  ; ap      = ΛA B. λmf:Maybe (A→B). λma:Maybe A.
                case mf of
                  Nothing -> Nothing
                  Just f  -> maybeFunctor.fmap [A] [B] f ma }
```

#### 3.3 Dictionary-passing at call-sites

```haskell
liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
```

desugars to

```fomega
liftA2 :: ∀F:*→* .
          ApplicativeDict F ->
          ∀A B C. (A→B→C) -> F A -> F B -> F C
```

Compiler supplies `maybeAp` when `f ~ Maybe`:

```fomega
liftA2 [Maybe] maybeAp [Int] [Int] [Int] plus (Just 1) (Just 2)
```

---

## Wrap up
Every class becomes a dictionary type constructor;
every instance becomes one value of that type;
every constraint becomes a hidden parameter.

In GHC these dictionary types all live at kind Constraint, the dedicated kind for “things that turn into dictionaries during elaboration.”

