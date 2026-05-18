# 自动驾驶仪

> **对应概念：** Autologging（自动记录）

## 故事

小莲是小梅团队新来的，手快脑快，创意一个接一个，就是讨厌做笔记。

小梅把整套系统给她演示了一遍：笔记本怎么记，老王的三色笔怎么分，莉娜保管库怎么存。小莲听的时候猛点头，一转身全忘了。

有一个周五，老板把大家叫到一块儿。「小莲的 Run 47——可可脂比例特别高那个——试吃评分 9.8，我们有史以来最高。下周投资人午宴就用这个。」他看向小莲：「可可脂比例多少？烤箱温度？烤了多久？」

小莲脸一白。试吃评分她记了，小梅提醒过。但配方呢？翻开笔记本，一片空白，没有蓝色笔迹。那天她光顾着调比例，根本没拿起老王的蓝色笔。团队做出过最好的蛋糕，没人说得出是怎么做的。

完蛋。

丢完这次脸以后，小莲发现了一个东西——自动驾驶仪，就是 `mlflow.autolog()`。这玩意一开，Run 一启动，所有参数、指标、Artifact 全自动记。蓝色笔自己写，红色笔自己画，绿色标签自己贴。连莉娜保管库的存档都自动安排上了。

小莲还是自己做蛋糕，自己选配方，自己调温度。自动驾驶仪只管文书——安安静静地跟在后面，一字不漏。Run 47 那样的谜团再也不会有了。

「以前觉得记录是负担，」小莲跟小梅说，「现在觉得*不*记录是犯罪。」

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
Autologging 用的是 Python 的 monkey-patching。`mlflow.autolog()` 会把 `sklearn.base.BaseEstimator.fit` 等函数包装一层，在原始函数执行的前后自动调用 `mlflow.log_param()`、`mlflow.log_metric()`、`mlflow.log_model()`。自动记录出来的 Run 会带上 `mlflow.autologging` 这个 Tag，方便区分。
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

::: info 相关寓言
- [大厨的厨房](./experiments-and-runs) — Autologging 自动创建 Run
- [面包师的三色笔记](./parameters-metrics-tags) — Autologging 自动记录参数和指标，不用手写
:::
