---
title: "同伦类型论与我的登山靴"
subtitle: "Homotopy Type Theory & Gorpcore Essentials"
date: "2023-10-24"
category: "Lean4"
tags:
  - HoTT
  - Type Theory
  - Philosophy
readTime: "12 min"
preview: "在 Lean4 中定义路径归纳原理时，我突然意识到这与我在优胜美地寻找攀岩路径的过程惊人地相似。连续性不仅存在于拓扑空间，也存在于思维的流动中..."
---

### 路径归纳 (Path Induction)

当我们谈论 Lean4 中的 `Eq.rec` 时，我们实际上是在讨论一种在这个空间中移动的方式。

就像选择一双合适的 Vibram 大底登山靴一样，选择正确的归纳原则能让你在证明的湿滑岩面上站稳脚跟。

```lean4
-- 归纳原理的基础定义
def pathInd {A : Type} {x : A} (P : ∀ (y : A), x = y → Type)
  (r : P x (Eq.refl x)) {y : A} (p : x = y) : P y p :=
  Eq.rec r p
```

这种构造的美妙之处在于它的**极简主义**。没有多余的装饰，只有纯粹的功能。这非常 Gorpcore。

### 拓扑直觉

想象两个点 $x$ 和 $y$，连接它们的路径 $p$ 是可以连续形变的。在代数拓扑中，我们关注的是这些路径的等价类。
