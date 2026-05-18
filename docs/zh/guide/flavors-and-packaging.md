# 万能转换头

> **对应概念：** 模型 Flavor 与打包

## 故事

小梅终于做到了。跑了几十个 Run，老王的三色笔写满了一本又一本，莉娜的保管库也塞得满满当当，小莲的自动驾驶仪把每个细节记得清清楚楚——她做出了最好的巧克力蛋糕。没得挑。

接着来了个麻烦。对面医院食堂想供应小梅的蛋糕，但他们厨房用的烤箱跟小梅的完全不一样。小梅用的是 PyTorch 烤箱，医院用的是 Java 烤箱。蛋糕没问题，配方没问题，就是插不上。欧标插头插美标插座——设备都是好的，就是对不上。

这时候**托马斯**出场了。镇上的包装工程师，专门干这个。

「蛋糕不用重做，」托马斯说，「你差的是一个转换头。」

他拿出一个叫 **pyfunc** 的万能转换头——标准包装层，套上以后任何烤箱都认。蛋糕还是那个蛋糕，巧克力还是那个巧克力，多了一层通用接口。医院的 Java 烤箱直接就加载了，一行代码都不用改。

当天下午，医院就开始供应小梅的蛋糕了。

「我差点花一整个星期去改配方格式，」小梅说。

托马斯耸耸肩：「转换头就是干这个的。等阿毕在记录簿里登记你这个蛋糕，`model_type` 那栏会记下用了哪种转换头——以后谁来取，看一眼就知道该怎么加载。」

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

内置 Flavor 包括：`sklearn`、`pytorch`、`tensorflow`、`keras`、`transformers`、`xgboost`、`lightgbm`、`onnx`、`spark`、`langchain`、`openai`、`sentence_transformers` 等。想自定义 Flavor，继承 `mlflow.pyfunc.PythonModel` 就行。

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

::: info 相关寓言
- [匠人的出厂记录](./logged-models) — Flavor 决定了 LoggedModel 上的 model_type
- [发射台](./model-serving) — pyfunc 是部署任何 Flavor 模型的通用接口
:::
