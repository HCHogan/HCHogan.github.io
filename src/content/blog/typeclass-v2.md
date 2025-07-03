---
title: "Typeclasses V2"
description: "using dictionary passing"
pubDate: "Jul 4 2025"
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
> Class ⇒ Dict Type · Instance ⇒ Dict Value · Constraint ⇒ Extra Param
1. Class declarations generate a record-typed type constructor.
2. Instances generate a value for the corresponding type and class.
3. The right dictionary was resolved and inserted in the call side.

## Step-By-Step Translation
### Class without super class (Eq)
Every class was turned into a type constructor`CDictClass :: * -> *`
```haskell
-- original class decl
class Eq a where 
  (==) :: a -> a -> Bool

-- generated tycon
type EqDict :: * → * = λA.*. { eq : A → A → Bool }

-- generated method selector
(==) :: ΛA:*. λd:Eq A. d.eq             -- top-level
(==) [Int] eqIntDict  x y               -- use site

-- original instance
instance Eq Int where
  x == y = primIntEq x y

-- generated dict value
eqIntDict : EqDict Int
eqIntDict = { eq = λx:Int. λy:Int. primIntEq x y }

-- function that uses the constraint
f :: Eq a => a -> Bool
f x = ...

g = f 3

-- was desugared into
f :: ∀A:*. Eq A → A → Bool

g = f [Int] eqIntDict  3
```

### Class with super class (Ord)
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

### Class with hkt (Functor)
Same steps also applies:
```haskell
class Functor f where
  fmap :: (a -> b) -> f a -> f b

-- type argument f :: * -> *, indicate that f is a tycon
-- fmap needs to quantify over A and B, so we use a forall here
type FunctorDict :: (* → *) → * = λF:*→*. { fmap :: ∀A:*. ∀B:*. (A → B) → F A → F B }

instance Functor Maybe where
  fmap _ Nothing  = Nothing
  fmap f (Just x) = Just (f x)

maybeFunctor :: FunctorDict Maybe
maybeFunctor =
  { fmap = ΛA. ΛB. λf:A→B. λm:Maybe A. case m of 
      Nothing -> Nothing
      Just x  -> Just (f x)
  }

class Functor f => Applicative f where
  pure  :: a -> f a
  (<*>) :: f (a->b) -> f a -> f b

type ApplicativeDict :: (*→*) → * = λF:*→*.
  { functor  :: FunctorDict F        -- parent dict instance
  ; pure     :: ∀A. A → F A
  ; ap       :: ∀A B. F (A→B) → F A → F B }

maybeApplicative :: ApplicativeDict Maybe
maybeApplicative =
  { functor = maybeFunctor                       -- superclass
  ; pure    = ΛA. λx:A. Just x
  ; ap      = ΛA B. λmf:Maybe (A→B). λma:Maybe A.
               case mf of
                 Nothing   -> Nothing
                 Just f    -> maybeFunctor.fmap [A] [B] f ma }

liftA2 :: Applicative f => (a->b->c) -> f a -> f b -> f c
liftA2 g fa fb = pure g <*> fa <*> fb

u = liftA2 (+) (Just 1) (Just 2)

-- desugared u and liftA2
liftA2 :: ∀(f:*→*). ApplicativeDict f ->           -- new dict passing
         ∀a b c. (a->b->c) -> f a -> f b -> f c
liftA2 = ΛF. λdApp:ApplicativeDict F.
           ΛA B C. λg fa fb.
             let p   = dApp.pure   [ (A→B→C) ] g
                 ap' = dApp.ap     [A] [B→C]
                 ap''= dApp.ap     [B] [C]
             in  ap'' (ap' p fa) fb

u = liftA2 [Maybe] maybeApplicative [Int] [Int] [Int] plus (Just 1) (Just 2)
```

## Wrap up
In GHC, these generated type constructor for class have a special kind: `Constraint`
