# 万能转换头

> **对应概念：** 模型 Flavor 与打包

## 故事

小梅终于做到了。在厨房里跑了几十个 Run——老王的三色笔记本写满了，莉娜的保管库塞得满满的，小莲的自动驾驶仪连每一个细节都自动记下来了——她终于做出了最好的巧克力蛋糕。无可挑剔。

然后对面镇上来了一个订单：医院食堂想供应小梅的蛋糕，但他们的厨房用的是完全不同的烤箱。小梅用的是 PyTorch 烤箱，医院用的是 Java 烤箱。配方毫无问题，但根本塞不进人家的设备。就像带着一个欧标插头去了美国——设备没毛病，但插不上。

这时候**托马斯**——镇上的包装工程师——出手了。「你不需要重新烤蛋糕，」他说，「你需要一个转换头。」托马斯给小梅看了**万能转换头**——一个标准包装层，叫 **pyfunc**，能让任何蛋糕在任何烤箱里工作。蛋糕本身没变，还是那个巧克力蛋糕。但转换头给了它一个通用插口。医院的 Java 烤箱不用改一行代码就加载了。

小梅看着医院那天下午就开始供应她的蛋糕。「我差点花一整个星期去转换配方格式，」她说。托马斯耸耸肩：「这就是转换头的意义。而且等阿毕在他的记录簿里登记你的蛋糕时，`model_type` 字段会记下我用了哪种转换头——以后谁看到这条记录都知道该怎么加载。」

## 概念解读

**Flavor** 是一套约定，规定了某个框架的模型怎么存、怎么读。调用 `mlflow.sklearn.log_model()` 就是用 sklearn 这个 Flavor 来保存，调用 `mlflow.pytorch.log_model()` 就是用 pytorch 的 Flavor。每种 Flavor 知道对应框架的序列化格式。

每个保存的模型都会有一个 **MLmodel 文件**——一个 YAML 清单，声明这个模型支持哪些 Flavor。典型情况下至少有两种：框架原生的 Flavor 加上 `python_function`（pyfunc）。

**pyfunc**（`mlflow.pyfunc`）就是那个通用接口。任何模型都可以这样加载：

```python
model = mlflow.pyfunc.load_model("runs:/abc/model")
predictions = model.predict(data)
```

sklearn 可以、pytorch 可以、transformers 可以、xgboost 也可以——万能转换头就是这么用的。

**模型签名**（Model Signature）定义了模型期望的输入输出格式——列名、数据类型、形状。在部署时可以做输入校验，也方便 UI 展示模型需要什么数据。

内置 Flavor 包括：`sklearn`、`pytorch`、`tensorflow`、`keras`、`transformers`、`xgboost`、`lightgbm`、`onnx`、`spark`、`langchain`、`openai`、`sentence_transformers` 等。还可以通过继承 `mlflow.pyfunc.PythonModel` 来创建**自定义 Flavor**。

::: tip 一句话总结
- **Flavor** = 某个框架的存取约定
- **pyfunc** = 通用接口——加载任何模型，都有 `.predict()`
- **MLmodel 文件** = YAML 清单，列出模型支持哪些 Flavor
- **模型签名** = 输入输出的 schema，用于校验和文档化
:::

::: info MLmodel 文件长什么样
MLmodel 是一个 YAML 文件，和模型 Artifact 放在一起：
```yaml
flavors:
  python_function:
    loader_module: mlflow.sklearn
    python_version: 3.10.0
  sklearn:
    sklearn_version: 1.3.0
    serialization_format: cloudpickle
signature:
  inputs: '[{"name": "feature_1", "type": "double"}]'
  outputs: '[{"name": "prediction", "type": "long"}]'
```
:::

## 前端开发者参考

Flavor 在 UI 上主要通过 LoggedModel 的 **model_type** 字段和 **Artifact 浏览器**（可以查看 MLmodel 文件内容）体现。

| 组件 | 对应什么 |
|------|---------|
| `RunPage` Artifact 标签页 | 在 Artifact 浏览器里查看 MLmodel YAML 文件 |
| LoggedModel 卡片 | `model_type` 字段显示 Flavor（如 "sklearn"、"pytorch"） |
| 模型版本详情 | 展示签名——输入输出的列名和数据类型 |

### 数据长什么样

```typescript
// LoggedModelProto —— 嵌套的 info/data 结构
{
  info: {
    model_id: "lm-abc-123",
    experiment_id: "42",
    source_run_id: "run-456",
    model_type: "sklearn",             // <-- Flavor
    artifact_uri: "runs:/run-456/model",
    creation_timestamp_ms: 1700000000000,
    status: "LOGGED_MODEL_READY",
  },
  data: {
    params: [...],
    metrics: [...],
  },
}

// 模型签名 —— 在模型详情页展示
{
  inputs: [
    { name: "feature_1", type: "double" },
    { name: "feature_2", type: "string" },
  ],
  outputs: [
    { name: "prediction", type: "long" },
  ],
}
```

---

::: details 相关寓言
- [匠人的出厂记录](./logged-models) — Flavor 决定了 LoggedModel 上的 model_type
- [发射台](./model-serving) — pyfunc 是部署任何 Flavor 模型的通用接口
:::
