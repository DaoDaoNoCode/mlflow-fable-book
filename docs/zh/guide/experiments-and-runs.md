# 大厨的厨房

> **对应概念：** 实验（Experiment）与 Run

## 故事

小梅在榆树街开了家烘焙坊，自己当主厨。她这人别的不想，就想做出一块完美的巧克力蛋糕。

周一，用纯黑巧，干得掉渣。周二换了牛奶巧加植物油，腻得发慌。周三她灵光一闪，两种巧克力掺一块儿，烤箱温度调低十度，提前两分钟出炉。这回全厨房的人都服了——就是这个味儿。

周四一早，老板推门进来：「周三那个蛋糕，周六宴会要用。配方给我。」

小梅愣住了。没记。两种巧克力混合她记得，黑巧和牛奶巧是六四开还是七三开？用的黄油还是植物油？烤箱到底调到 163 还是 168？全凭脑子回忆，硬来了一炉，又扁又油。再来一炉，更离谱。周三那个蛋糕，就这么没了。

那个周末，小梅买了一本厚笔记本。封面写了四个字：**「完美巧克力蛋糕计划」**——这就是她的实验。

从那天起，每一次尝试单独占一页，就是一个 Run。用了什么料，烤箱几度，烤了多久，结果怎么样，全记。失败的也不撕，一页都不撕。

街对面书店的老王，后来帮她用三色笔把笔记分门别类。蓝的记配方，红的记结果，绿的贴标签，翻起来一目了然。做出来的蛋糕实物呢？隔壁莉娜开了个恒温保管库，值得留的全存那儿。配方毕竟不是蛋糕本身。

副厨问她：干嘛留那么多页，每次擦了重写不就行了？

小梅摇摇头：「因为周三那个蛋糕就藏在这些页面里，我再也不会弄丢了。」

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
