# 匠人的出厂记录

> **对应概念：** LoggedModel

## 故事

**阿毕**是小梅厨房里的记录员，坐在门口一张小桌子旁。

每次小梅做完一个蛋糕——也就是每次调用 `log_model()`——阿毕就翻开记录簿，写一条新记录。不是随手一划，是一份正经的出生证明。

「小梅，巧克力蛋糕实验，Run 52，用托马斯的 sklearn 转换头，存在莉娜保管库七号架。老王在这个 Run 上记了三个参数、两个指标。」

每一条记录都把蛋糕跟所有东西关联起来——实验、Run、Artifact、Flavor。阿毕的记录簿里，没有东西是孤零零存在的。

大多数记录就这么留在簿子里。几十个 Run 下来，小梅试过的每一个配方都有记录，哪怕做砸了的。但真正好的呢？小梅会调用 `register_model()`，蛋糕就送进了阿赫迈德的皇家图书馆，变成一个正式的**模型版本**——有版本号，可以打上 `@champion` 这样的 Alias。图书馆的版本通过 `model_id` 链回阿毕的记录簿，血统关系永远断不了。

有天早上小莲问阿毕：「你的记录簿跟阿赫迈德的图书馆有什么区别？」

阿毕放下笔：「我的记录簿是蛋糕出生的地方。小梅一做完，我就自动写，好的坏的全有。阿赫迈德的图书馆是蛋糕成为正式作品的地方——得有人拍板说，嘿，这个够格。没有出生证明，什么都进不去。」

## 概念解读

**LoggedModel** 是 MLflow 3 引入的一等公民实体。当你调用 `log_model()` 时会自动创建，它贯穿模型的整个生命周期——跨环境、跨 Run。

LoggedModel 不只是一条简单的记录，它还关联着 Artifact（模型文件）、指标、参数、以及产出这个模型的代码。设置了 active model context 之后，后续所有的 Trace 也会自动关联到这个 LoggedModel 上，不需要手动操作。

不是每个 LoggedModel 最终都会进入 Model Registry。Registry 是给要上线的模型用的，LoggedModel 是更完整的记录。

::: tip 一句话总结
- **LoggedModel** = 调用 `log_model()` 时自动创建的模型记录
- 关联着 Artifact、指标、参数和代码
- 贯穿模型的整个生命周期，Trace 可以自动关联
- **model_type** = 用什么 ML 框架创建的（PyTorch、sklearn、transformers 等）
:::

## 前端开发者参考

LoggedModel 出现在实验的 **Models 标签页**里——汇总这个实验所有 Run 产出的模型。每个 LoggedModel 有详情页，可以浏览 Artifact，也可以一键提升到 Model Registry。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentLoggedModelListPage` | Models 标签页——实验里所有 LoggedModel |
| `ExperimentLoggedModelDetailsPage` | LoggedModel 详情，包含 Artifact 和元数据 |
| 「注册模型」操作 | 把 LoggedModel 提升到 Model Registry |

### 数据长什么样

```typescript
// LoggedModelProto（前端类型）—— 嵌套的 info/data 结构
{
  info: {
    model_id: "lm-789",
    name: "my-classifier",
    experiment_id: "123",
    source_run_id: "abc-def-456",    // 哪个 Run 产出的
    artifact_uri: "s3://bucket/path/model",
    model_type: "sklearn",           // 用的什么 ML 框架
    status: "LOGGED_MODEL_READY",
    creation_timestamp_ms: 1700000000000,
  },
  data: {
    params: [{ key: "n_estimators", value: "100" }],
    metrics: [{ key: "accuracy", value: 0.95 }],
  },
}
```

::: info model_type 是什么？
故事里托马斯的转换头类型（sklearn、pytorch）说的是用哪种烤箱烤的蛋糕。在 MLflow 里，`model_type` 说的是用哪个 ML 框架创建的模型——PyTorch、TensorFlow、scikit-learn、transformers 等。不同框架存取模型的方式不一样，model_type 告诉 MLflow 该怎么处理模型文件。
:::

---

::: details 相关寓言
- [万能转换头](./flavors-and-packaging) — model_type 反映用了哪种 Flavor
- [皇家图书馆](./model-registry) — LoggedModel 可以提升到 Model Registry
- [大厨的厨房](./experiments-and-runs) — LoggedModel 在 Run 中产生
:::
