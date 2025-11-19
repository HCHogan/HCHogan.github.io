---
title: "单纯复形的可视化艺术"
subtitle: "Visualizing Simplicial Complexes"
date: "2023-11-15"
category: "Algebraic Topology"
tags:
  - Topology
  - MathArt
  - Creative
readTime: "15 min"
preview: "单纯复形是构建高维形状的乐高积木。在这个项目中，我尝试用 React 和 WebGL 来渲染动态的 Betti 数变化过程..."
---

### 构造单纯形

一个 $n$-单纯形是 $n+1$ 个点的凸包。

* 0-simplex: 点 (Vertex)
* 1-simplex: 线段 (Edge)
* 2-simplex: 三角形 (Triangle)
* 3-simplex: 四面体 (Tetrahedron)

我们在代码中不仅是在计算，更是在**构建结构**。代码是现代的混凝土。
