# 美食大赛的评委

> **对应概念：** 评估（Evaluation）与 Scorer

## 故事

**罗莎**的大赛只干一件事：决定谁拿阿赫迈德图书馆里的 `@champion` Alias。

规则简单。每个蛋糕用美香的标准测试包来测。一组评委各管一个维度——口味、质地、摆盘。还有一台机器，永远不眨眼：安全评委。

小梅带着黑巧蛋糕来了，信心满满。帕特尔医生在柜台上已经卖了两周，顾客都说好。老陈的 Trace 干干净净——罗德里戈供应线上的烤箱调用很快，雅拉的模板也没问题。小梅走进赛场，觉得拿冠军就是走个过场。

口味评委：9.4，全场最高。质地：8.9。摆盘：9.1。小梅笑开了花。

接着安全评委亮了红灯。

厨房里有块共用台面，小梅从没想过要清洗。台面上残留了微量榛子过敏原，沾进了蛋糕里。不是口味问题，不是创意问题——是小梅压根不知道存在的隐患，被一个她从没担心过的评委抓了出来。

小梅愣住了。这蛋糕通过帕特尔医生的柜台卖了几百份，没一个人提过。可那些顾客也没测过敏原啊——他们只管吃。自信和系统评估是两回事。

评估结果记在一个专门的评估 Run 上——老王看到那些红色指标会觉得眼熟，跟他平时记小梅训练实验的指标用的是同一套基础设施，只不过这回记的是安全评分和过敏原标记。

成绩单摊在桌上：每个蛋糕、每个评委、每个维度的分数，一目了然。小梅的蛋糕口味全场第一，同时安全标记也是全场最重的。两个事实都成立。

这就是「我觉得挺好」和「每个维度上到底有多好」的区别。

## 概念解读

**评估**就是拿一个数据集，让多个 **Scorer** 系统化地给模型打分。

Scorer 就是一个函数，接收模型的输出，返回一个分数。它可以是：
- 简单规则（输出里有没有脏话？有没有幻觉？关键词覆盖率？）
- 统计指标（BLEU score、精确匹配率）
- LLM 评委（让另一个大模型来判断「这个回答有没有帮助，1-5 分」）
- 人工评分

配合 Tracing，你甚至可以直接在 Trace UI 上跑 LLM 评委来打分，不需要切换到 Python SDK——只需要选一个 AI Gateway Endpoint 就能跑。

在整个数据集上跑一遍，你就得到一张详细的成绩单：每一行是一个测试样例，每一列是一个 Scorer 的打分。这样比较模型就不是拍脑袋说「A 比 B 好」，而是「A 在安全性上更好，但 B 在创意上更强」。

::: tip 一句话总结
- **评估** = 用数据集系统化地给模型打分
- **Scorer** = 从某一个维度打分的函数
- Scorer 可以是规则、统计公式、LLM 评委、或者人
- 结果是一张表：行是测试样例，列是各 Scorer 的分数
:::

## 前端开发者参考

实验里的 **Evaluation Runs 标签页**展示评估结果。**Judges（Scorers）标签页**让用户管理和运行 Scorer。评估结果以 Run 指标的形式存储，可以用标准的 Run 对比视图来比较。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentEvaluationRunsPage` | 实验里的 Evaluation Runs 标签页 |
| `ExperimentScorersPage` | Judges/Scorers 标签页——管理和运行 Scorer |
| `ExperimentEvaluationDatasetsPage` | Datasets 标签页——管理评估数据集 |
| Run 对比视图 | 跨 Run 比较评估指标 |

### 数据长什么样

评估使用标准的 Run 和 Metric 实体——没有特殊的「评估」类型。评估 Run 就是一个普通 Run，打上了评估元数据的 Tag：

```typescript
// 评估 Run 和普通 Run 一样，只是带了特定的 Tag：
{
  info: { runUuid: "eval-run-123", status: "FINISHED", ... },
  data: {
    tags: [
      { key: "mlflow.runSourceType", value: "EVALUATION" },
    ],
    metrics: [
      { key: "relevance/mean", value: 4.2 },
      { key: "safety/pass_rate", value: 0.95 },
    ],
    params: [...],
  },
}

// Scorer 实体
{
  scorer_id: "sc-123",
  scorer_name: "relevance",
  scorer_version: 1,
  experiment_id: "123",
}
```

---

::: info 相关寓言
- [试菜间的食材单](./datasets) — Scorer 基于标准化数据集打分
- [皇家图书馆](./model-registry) — 模型在晋升到 Registry 前通常要先评估
- [侦探的红线](./tracing-and-spans) — Scorer 可以直接在 Trace 上运行
:::
