# 自动驾驶仪

> **对应概念：** Autologging（自动记录）

## 故事

小莲是小梅团队的新人，手脚麻利，创意十足，就是讨厌做文书。小梅给她看过笔记本、老王的三色笔系统、莉娜的保管库——整套流程走了一遍。小莲点头如捣蒜，然后转头就忘了用。

一个周五，老板把大家叫到一起。「小莲的 Run 47——可可脂比例特别高的那个——试吃评分 9.8，我们有史以来最高的分。下周投资人午宴就用这个蛋糕。」他转向小莲：「可可脂比例多少？烤箱温度？烘烤时间？」

小莲愣住了。试吃评分她记了，因为小梅提醒过。但输入呢？她没写。翻开笔记本，没有蓝色笔迹。那天她一直在快速调配比例，根本没拿起老王的蓝色笔。团队做出的最好的蛋糕，她说不出是怎么做的。

丢完这次脸之后，小莲发现了自动驾驶仪——一个系统，Run 一启动就自动记录所有的参数、指标和 Artifact。不需要手动记录。自动驾驶仪自己用老王的三色笔写——蓝色记输入、红色记结果、绿色贴标签——不用谁动一根手指。它甚至还会自动在莉娜的保管库里存一份每个成品蛋糕的记录。小莲还是自己在做蛋糕，还是自己选配方和比例。自动驾驶仪只管文书，安安静静、一字不漏，让 Run 47 这样的谜团不再发生。

「我以前觉得记录是额外负担，」小莲跟小梅说。「现在我觉得不记录才是自毁前程。」

## 概念解读

**Autologging** 是 MLflow 的一行代码自动追踪功能。调用 `mlflow.autolog()` 之后，MLflow 会给 30 多个 ML 框架的训练函数打补丁——每次你调用 `.fit()`、`.train()` 之类的方法，MLflow 自动记录：

- **参数** — 学习率、epoch 数量、batch size 等超参数
- **指标** — 每一步的训练/验证指标（loss、accuracy 等）
- **模型** — 训练好的模型文件，用对应的 Flavor 保存
- **Artifact** — 附加产出物，比如特征重要性图、混淆矩阵

支持的框架包括：scikit-learn、PyTorch、TensorFlow/Keras、XGBoost、LightGBM、Transformers、Spark MLlib、Statsmodels，还有很多。

Autologging 和手动记录不冲突——你可以在开启 autolog 的同时继续调用 `log_param()` 和 `log_metric()`。Autologging 管通用的部分，手动记录管你业务特有的细节。

::: tip 一句话总结
- `mlflow.autolog()` = 一行代码自动追踪参数、指标、模型和 Artifact
- 支持 30+ 框架（sklearn、pytorch、transformers、xgboost 等）
- 不需要手动写 `log_param()` / `log_metric()`
- 可以和手动记录混合使用
:::

::: info 底层是怎么做的
Autologging 用的是 Python 的 monkey-patching。`mlflow.autolog()` 会把 `sklearn.base.BaseEstimator.fit` 等函数包装一层，在原始函数执行的前后自动调用 `mlflow.log_param()`、`mlflow.log_metric()`、`mlflow.log_model()`。被自动记录的 Run 会带上 `mlflow.autologging` 这个 Tag，方便区分。
:::

## 前端开发者参考

自动记录的 Run 在 UI 上和手动记录的 Run 长得一模一样。同一张 Run 表格，同样的参数、指标、Artifact——没有任何专门为 autologging 设计的页面。

想区分的话，过滤 `mlflow.autologging` 这个 Tag 就行。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentRunsPage` | 所有 Run（自动记录和手动记录的）在同一个 ag-grid 表格里 |
| `RunPage` | Run 详情——参数、指标、Artifact 全部自动填充 |
| Run 对比视图 | 像对比普通 Run 一样对比 autologged Run |

### 数据长什么样

自动记录的 Run 在结构上和手动 Run 完全一样。唯一的区分标记是 `mlflow.autologging` Tag：

```typescript
// 自动记录的 Run —— 和普通 RunEntity 结构一样
{
  info: {
    runUuid: "auto-run-789",
    experimentId: "42",
    runName: "sklearn-autolog-1",
    status: "FINISHED",
    startTime: 1700000000000,
    endTime: 1700003600000,
    artifactUri: "s3://bucket/auto-run-789/artifacts",
    lifecycleStage: "active",
  },
  data: {
    params: [
      { key: "n_estimators", value: "100" },
      { key: "max_depth", value: "5" },
      { key: "learning_rate", value: "0.1" },
      // ... autologging 会把所有构造函数参数全记下来
    ],
    metrics: [
      { key: "training_score", value: 0.97, step: 0, timestamp: 1700000000000 },
      { key: "training_accuracy_score", value: 0.95, step: 0, timestamp: 1700000000000 },
    ],
    tags: [
      { key: "mlflow.autologging", value: "sklearn" },  // <-- 区分标记
      { key: "mlflow.source.type", value: "LOCAL" },
    ],
  },
}
```

---

::: details 相关寓言
- [大厨的厨房](./experiments-and-runs) — Autologging 自动创建 Run
- [面包师的三色笔记](./parameters-metrics-tags) — Autologging 自动记录参数和指标，不用手写
:::
