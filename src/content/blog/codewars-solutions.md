---
title: "Codewars Solutions"
subtitle: "Mostly Haskell"
date: "2025-03-27"
category: "Algorithm"
tags:
  - Haskell
  - Algorithm
readTime: "8 min"
preview: "Interesting problems"
---

This blog post include some interesting codewars katas I solved. Mostly in haskell.
I will update this blog post from time to time.

## Haskell

1. [Lensmaker](https://www.codewars.com/kata/54258ffb430ca2e4b5000239)(1 kyu)

   solution:

```haskell
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE DeriveFunctor #-}
{-# LANGUAGE TupleSections #-}

module MicroLens where

import Prelude hiding (sum)
import Data.Monoid
import Control.Applicative
import qualified Data.Traversable as T

---------------------------------------------------------
-- Some basic libraries

class Profunctor p where
  dimap :: (a' -> a) -> (b -> b') -> (p a b -> p a' b')
  dimap f g = lmap f . rmap g
  lmap ::  (a' -> a) -> (p a b -> p a' b)
  lmap f = dimap f id
  rmap ::  (b -> b') -> (p a b -> p a b')
  rmap f = dimap id f

class Profunctor p => Choice p where
  left'  :: p a b -> p (Either a c) (Either b c)
  right' :: p a b -> p (Either c a) (Either c b)

instance Profunctor (->) where
  dimap f g h = g . h . f

instance Choice (->) where
  left'  f = either (Left . f) Right
  right' f = either Left (Right . f)

class Contravariant f where
  contramap :: (a' -> a) -> (f a -> f a')

-- Control.Applicative.Const replicated here for your
-- convenience
newtype K b a = K { getK :: b } deriving Functor

instance Monoid b => Applicative (K b) where
  pure _ = K mempty
  K e <*> K f = K (e <> f)

instance Contravariant (K b) where
  contramap f (K b) = K b

newtype Id a = Id { getId :: a } deriving Functor

instance Applicative Id where
  pure = Id
  Id f <*> Id x = Id (f x)

---------------------------------------------------------
-- The lens types you'll implement

-- | Optic is the general pattern for all other lens types.
type Optic p f s t a b =
  p a (f b) -> p s (f t)

type Iso s t a b =
  forall p f . (Profunctor p, Functor f) =>
  Optic p f s t a b

type Lens s t a b =
  forall f . Functor f =>
  Optic (->) f s t a b

type Traversal s t a b =
  forall f . Applicative f =>
  Optic (->) f s t a b

type Fold s a =
  forall f . (Contravariant f, Applicative f) =>
  Optic (->) f s s a a

type Prism s t a b =
  forall p f . (Choice p, Applicative f) =>
  Optic p f s t a b

---------------------------------------------------------
---------------------------------------------------------
-- Todo

-- | A lens focusing on the first element in a pair
_1 :: Lens (a, x) (b, x) a b
_1 f (a, b) = (,b) <$> f a

-- | A lens focusing on the second element in a pair
_2 :: Lens (x, a) (x, b) a b
_2 f (a, b) = (a,) <$> f b

{- | A function which takes a lens and looks through it.
The type given is specialized to provide a hint as to
how to write 'view'. The more intuitive type for its use
is

@
view :: Lens s t a b -> (s -> a)
@
-}
view :: Optic (->) (K a) s t a b -> (s -> a)
view l s = getK (l K s)

{- | A function which takes a lens and a transformation function
and applies that transformer at the focal point of the lens.
The type given is specialized to provide a hint as to how to
write 'over'. The more intuitive type for its use is

@
over :: Lens s t a b -> (a -> b) -> (s -> t)
@
-}
over :: Optic (->) Id s t a b -> (a -> b) -> (s -> t)
over l f = getId . l (Id . f)

{- | A function from a lens and a value which sets the value
at the focal point of the lens. The type given has been
specialized to provide a hint as to how to write 'set'. The
more intuitive type for its use is

@
set :: Lens s t a b -> b -> (s -> t)
@
-}
set :: Optic (->) Id s t a b -> b -> (s -> t)
set l b = over l (const b)

{- | A traversal which focuses on each element in any
Traversable container.
-}
elements :: (T.Traversable f) => Traversal (f a) (f b) a b
elements = traverse

{- | A function which takes a Traversal and pulls out each
element it focuses on in order. The type has been
specialized, as the others, but a more normal type might be

@
toListOf :: Traversal s s a a -> (s -> [a])
@
-}
toListOf :: Optic (->) (K (Endo [a])) s s a a -> (s -> [a])
toListOf l s = appEndo (getK (l (\a -> K (Endo (a :))) s)) []

{- | A function which takes any kind of Optic which might
be focused on zero subparts and returns Just the first
subpart or else Nothing.

@
preview :: Traversal s s a a -> (s -> Maybe a)
@
-}
preview :: Optic (->) (K (First a)) s s a a -> (s -> Maybe a)
preview l s = getFirst (getK (l (K . First . Just) s))

{- | A helper function which witnesses the fact that any
container which is both a Functor and a Contravariant
must actually be empty.
-}
coerce :: (Contravariant f, Functor f) => f a -> f b
coerce = contramap (const undefined)

-- | A Fold which views the result of a function application
to :: (a -> b) -> Fold a b
to f g a = coerce (g (f a))

prism ::
  (Choice p, Applicative f) =>
  (b -> t) ->
  (s -> Either t a) ->
  p a (f b) ->
  p s (f t)
prism bt seta = dimap seta (either pure (fmap bt)) . right'

-- | A prism which focuses on the left branch of an Either
_Left :: Prism (Either a x) (Either b x) a b
_Left = prism Left setter
 where
  setter :: Either a x -> Either (Either b x) a
  setter (Left a) = Right a
  setter (Right x) = Left (Right x)

-- | A prism which focuses on the right branch of an Either
_Right :: Prism (Either x a) (Either x b) a b
_Right = prism Right setter
 where
  setter :: Either x a -> Either (Either x b) a
  setter (Right a) = Right a
  setter (Left x) = Left (Left x)

{- | An iso which witnesses that tuples can be flipped without
losing any information
-}
_flip :: Iso (a, b) (a, b) (b, a) (b, a)
_flip = dimap swap (fmap swap)
 where
  swap (x, y) = (y, x)
```

2. [Dependent Typed List](https://www.codewars.com/kata/54750ed320c64c64e20002e2)(2 kyu)

solution:

```haskell
{-# LANGUAGE NoImplicitPrelude, GADTs , DataKinds, TypeFamilies, TypeOperators, RankNTypes, DeriveFunctor #-}
{-# LANGUAGE UndecidableInstances #-}

module Singletons where

import Prelude hiding (drop, take, head, tail, index, zipWith, replicate, map, (++))
import Data.Type.Equality (type (==))

data Vec a n where
  VNil :: Vec a Zero
  VCons :: a -> Vec a n -> Vec a (Succ n)

-- promoted to type level by data kinds
data Nat = Zero | Succ Nat

data SNat a where
  SZero :: SNat Zero
  SSucc :: SNat a -> SNat (Succ a)

type family (a :: Nat) :< (b :: Nat) :: Bool
type instance m :< Zero = False
type instance Zero :< Succ n = True
type instance (Succ m) :< (Succ n) = m :< n

type family (a :: Bool) || (b :: Bool) where
  'True || _ = 'True
  'False || b = b

type family (a :: Nat) :<= (b :: Nat) :: Bool where
  a :<= b = (a :< b) || (a == b)

type family Minus (n :: Nat) (m :: Nat) :: Nat where
  Minus n 'Zero = n
  Minus ('Succ n) ('Succ m) = Minus n m
  Minus 'Zero m = 'Zero

type family Add (a :: Nat) (b :: Nat) :: Nat where
  Add 'Zero n = n
  Add ('Succ n) m = 'Succ (Add n m)

type family Min (n :: Nat) (m :: Nat) :: Nat where
  Min 'Zero m          = 'Zero
  Min n 'Zero          = 'Zero
  Min (Succ n) (Succ m) = Succ (Min n m)

map :: (a -> b) -> Vec a n -> Vec b n
map f VNil = VNil
map f (VCons x xs) = VCons (f x) (map f xs)

index :: ((a :< b) ~ True) => SNat a -> Vec s b -> s
index SZero (VCons x _) = x
index (SSucc n) (VCons _ xs) = index n xs

replicate :: s -> SNat a -> Vec s a
replicate _ SZero = VNil
replicate s (SSucc n) = VCons s (replicate s n)

zipWith :: ((x == y) ~ 'True) => (a -> b -> c) -> Vec a x -> Vec b y -> Vec c x
zipWith f VNil VNil = VNil
zipWith f (VCons x xs) (VCons y ys) = VCons (f x y) (zipWith f xs ys)

take :: SNat x -> Vec a y -> Vec a (Min x y)
take SZero _ = VNil
take (SSucc n) (VCons x xs) = VCons x (take n xs)
take (SSucc n) VNil = VNil

drop :: SNat x -> Vec a y -> Vec a (Minus y x)
drop SZero xs = xs
drop (SSucc n) (VCons x xs) = drop n xs
drop (SSucc n) VNil = VNil

head :: (('Zero :< y) ~ 'True) => Vec a y -> a
head (VCons x xs) = x

tail :: (('Zero :< y) ~ 'True) => Vec a y -> Vec a (Minus y ('Succ 'Zero))
tail (VCons x xs) = xs

(++) :: Vec a x -> Vec a y -> Vec a (Add x y)
(++) VNil x = x
(++) (VCons x xs) y = VCons x (xs ++ y)
```

3. [The most imperative functional language?](https://www.codewars.com/kata/5453af58e6c920858d000823)(2 kyu)

   solution:

```haskell
module Imperative (
  def, var, lit, while, (+=), (-=), (*=)
) where

import Control.Monad.State
import qualified Data.Map as M
import Data.Map (Map)

data Value = Var Int | Lit Integer deriving (Show)
data Env = Env { nextId :: Int, vars :: Map Int Integer}

initialEnv :: Env
initialEnv = Env { nextId = 0, vars = M.empty }

evalValue :: Value -> State Env Integer
evalValue (Lit i) = return i
evalValue (Var id) = do
  env <- get
  case M.lookup id (vars env) of
    Just i -> return i
    Nothing -> error "var not found"

-- update state
modifyVar :: Value -> (Integer -> Integer) -> State Env ()
modifyVar (Lit i) _ = error "cant modify lit"
modifyVar (Var i) f = do
  env <- get
  put env { vars = M.adjust f i (vars env)}

-- use State Env a

-- update state, return Value
var :: Integer -> State Env Value
var n = do
  env <- get
  let i = nextId env
  put env { nextId = i + 1, vars = M.insert i n (vars env) }
  return $ Var i

lit :: Integer -> Value
lit = Lit

def :: State Env Value -> Integer
def m = evalState (m >>= evalValue) initialEnv

while :: Value -> (Integer -> Bool) -> State Env () -> State Env ()
while r f act = do
  v <- evalValue r
  if f v then
    act *> while r f act
  else return ()

(+=) :: Value -> Value -> State Env ()
a += b = evalValue b >>= modifyVar a . (+)

(*=) :: Value -> Value -> State Env ()
a *= b = evalValue b >>= modifyVar a . (*)

(-=) :: Value -> Value -> State Env ()
a -= b = do
  y <- evalValue b
  modifyVar a (+ (negate y))
```

