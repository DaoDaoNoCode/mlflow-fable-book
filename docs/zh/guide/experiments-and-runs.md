# 大厨的厨房

> **对应概念：** 实验（Experiment）与 Run

## 故事

小梅是榆树街一家小面包坊的主厨，满脑子只有一件事：做出完美的巧克力蛋糕。周一试了黑巧克力，干。周二换成牛奶巧克力加植物油，太腻。周三她把两种巧克力混在一起，烤箱温度调低了十度，还提前两分钟出炉。这一次——全厨房的人都认了——这是她做过的最好的巧克力蛋糕。

周四早上，老板走进厨房：「周三那个蛋糕——周六客户宴会要用。配方是什么？」

小梅愣住了。她没记。两种巧克力混合她记得，但是黑巧和牛奶巧的比例是六四还是七三？用的黄油还是植物油？烤箱温度到底是 163 度还是 168 度？她凭记忆试着复现，蛋糕出来又扁又油。再试一次，更糟。周三的杰作就这么没了，完全找不回来。

那个周末，小梅买了一本笔记本。封面上写着**「完美巧克力蛋糕」**——这是她的实验。从那天起，每一次尝试都有自己的一页——一个 Run——记下每种原料、每个烤箱设定、每个结果。失败的也不撕掉，一页都不撕。她的朋友老王——街对面书店的老板——后来帮她用三色笔把笔记分类整理，一扫一目了然。至于做出来的蛋糕实物——值得留的那些——她开始存到隔壁莉娜的恒温保管库里，因为配方毕竟不是蛋糕本身。

副厨问她为什么不只留一页，每次擦掉重写。小梅摇头：「因为周三那个蛋糕就藏在这些页码里，我再也不会弄丢它了。」

## 概念解读

**实验**是一组相关 Run 的集合，通常围绕同一个任务或目标。比如「欺诈检测模型」「推荐算法优化」都可以是一个实验。

**Run** 就是一次具体的代码执行——跑一次 `python train.py` 就产生一个 Run。每个 Run 自动记录元数据（参数、指标、起止时间等）和 Artifact（产出文件，如模型权重、图表等）。

一个实验下面可以有成百上千个 Run，而且从来不删——历史记录本身就是最宝贵的资产。

::: tip 一句话总结
- **实验** = 一组 Run 的集合，围绕同一个目标
- **Run** = 一次代码执行，自动记录参数、指标和产出文件
- 永远不删历史记录
:::

## 前端开发者参考

你做的**实验列表页**就是小梅的厨房——把所有实验排出来让用户挑。用户点进去一个实验，看到的是**带标签页的布局**——Runs、Traces、Models 等并排展示。**Runs 标签页**就是小梅的笔记本——每个 Run 一行，用 ag-grid 表格展示，方便对比。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentListView` | 实验列表 |
| `ExperimentPageTabs` | 某个实验的详情，带标签页布局（Runs、Traces、Models 等） |
| `ExperimentRunsPage` | Runs 标签页——ag-grid 表格展示所有 Run |
| `RunPage` | 某个 Run 的详情 |

### 数据长什么样

```typescript
// ExperimentEntity（前端类型）
{
  experimentId: "123",
  name: "Perfect Chocolate Cake",
  lifecycleStage: "active",    // 或 "deleted"
  artifactLocation: "s3://...",
  creationTime: 1700000000000,
  lastUpdateTime: 1700003600000,
  tags: [{ key: "team", value: "nlp" }],
}

// RunEntity（前端类型）—— 注意嵌套的 info/data 结构
{
  info: {
    runUuid: "abc-def-456",
    experimentId: "123",
    runName: "dark-chocolate-attempt",
    status: "FINISHED",       // RUNNING, SCHEDULED, FAILED, KILLED
    startTime: 1700000000000,
    endTime: 1700003600000,
    artifactUri: "s3://bucket/path",
    lifecycleStage: "active",
  },
  data: {
    params: [{ key: "lr", value: "0.001" }],
    metrics: [{ key: "accuracy", value: 0.95, step: 10, timestamp: 1700000000000 }],
    tags: [{ key: "team", value: "nlp" }],
  },
}
```

---

::: details 相关寓言
- [面包师的三色笔记](./parameters-metrics-tags) — 每个 Run 记录的参数、指标和 Tag
- [博物馆的仓库](./artifacts) — 每个 Run 产出的文件都存为 Artifact
- [自动驾驶仪](./autologging) — 自动帮你记录 Run 的一切数据
:::
