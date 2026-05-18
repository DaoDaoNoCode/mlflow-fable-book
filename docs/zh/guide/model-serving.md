# 发射台

> **对应概念：** 模型部署（Model Serving & Deployments）

## 故事

小梅的 `@champion` 巧克力蛋糕躺在阿赫迈德的皇家图书馆里——罗莎测试通过，注册为版本 7，打磨得漂漂亮亮。

但图书馆里的蛋糕喂不了任何人。顾客也不能走进图书馆点一块。

这时候**帕特尔医生**出场了。她是镇上的部署工程师，管着发射台——一个服务柜台，专门把注册过的蛋糕变成能下单的商品。

帕特尔医生从阿赫迈德图书馆拿出 `@champion` 蛋糕，放到柜台后面，开了一个 REST API。医院食堂往 `/invocations` 发一个请求，几秒钟蛋糕就到手了。没人需要知道小梅用的什么烤箱——托马斯的万能转换头 pyfunc 搞定了翻译。PyTorch 烤箱也好，sklearn 烤箱也好，柜台接口都一样。

接着需求涨了。医院想在本地跑。河对岸的连锁面包店要在 AWS 上用。学校跑的是 Azure。帕特尔医生没有搭三个柜台。发射台有插件系统，同一个蛋糕部署到不同地方——本地一条命令，AWS 一条命令，Azure 一条命令。同一个蛋糕，同一个转换头，不同的发射台。

蛋糕上了柜台以后，侦探老陈会追踪每一笔订单。小梅随时能看到她的作品在真实世界里表现如何。

「我的活就是最后一公里，」帕特尔医生说，「确保有人真的能点到。」

## 概念解读

**模型部署**把一个训练好的模型变成一个可以调用的 API。最简单的方式：

```bash
mlflow models serve -m "models:/my-model/1" --port 5001
```

这会启动一个 Gunicorn REST 服务器，暴露 `/invocations` 端点。发 JSON 或 CSV 数据过去，它会根据模型签名校验输入，通过 pyfunc 接口跑预测，返回结果。

不想启服务器，只想批量预测：

```bash
mlflow models predict -m "models:/my-model/1" -i data.csv
```

要部署到生产环境，MLflow 提供了**插件系统** `mlflow.deployments`。每个部署目标（SageMaker、Azure ML、Databricks 等）实现一个 `BaseDeploymentClient`，知道怎么把模型推到对应平台。不管哪个平台，你用的是同一套 API：

```python
from mlflow.deployments import get_deploy_client
client = get_deploy_client("sagemaker")
client.create_deployment(name="prod-model", model_uri="models:/my-model/1")
```

所有部署路径底下用的都是 **pyfunc 接口**——就是 Flavor 那篇讲的万能转换头。所以任何模型都能上任何发射台。

::: tip 一句话总结
- `mlflow models serve` = 本地 REST 服务，暴露 `/invocations` 端点
- `mlflow models predict` = 不起服务器的批量预测
- `mlflow.deployments` 插件系统 = 部署到 SageMaker、Azure ML、Databricks 等
- 所有部署都走 pyfunc 接口——同一个模型，任何目的地
:::

::: warning 部署 vs. 网关
别把模型部署和 AI 网关搞混。模型部署是把**你的**模型变成端点。AI 网关是代理请求到**外部** LLM 提供商（OpenAI、Anthropic 等），带限流和安全护栏。它们可以配合使用——网关可以把请求路由到一个已部署的模型。
:::

## 前端开发者参考

模型部署主要是 CLI 和 SDK 的概念——MLflow UI 里目前没有专门的「部署」页面。不过模型注册中心的页面会展示和部署相关的信息，AI 网关也可以代理到已部署的模型。

| 组件 | 对应什么 |
|------|---------|
| 模型注册中心页面 | 可以部署的模型——版本信息、Alias、阶段 |
| AI 网关配置 | 网关路由可以指向已部署模型的端点 |
| `RunPage` Artifact 标签页 | 部署出去的那个模型 Artifact |

### 数据长什么样

模型部署没有引入新的前端实体。相关数据就是模型的 Artifact URI 和签名，这些在 Run 和模型注册中心的实体上已经有了：

```typescript
// 部署出去的模型版本
{
  name: "fraud-detector",
  version: "3",
  source: "runs:/abc-def/model",
  status: "READY",
  aliases: ["champion"],
  // pyfunc 接口加载这个模型来做部署
}

// /invocations 端点期望的输入（由模型签名定义）
// POST http://localhost:5001/invocations
// Content-Type: application/json
{
  "inputs": [
    { "feature_1": 0.5, "feature_2": "category_a" }
  ]
}

// 返回结果
{
  "predictions": [0, 1, 0]
}
```

---

::: info 相关寓言
- [皇家图书馆](./model-registry) — 模型从 Registry 部署到生产环境
- [万能转换头](./flavors-and-packaging) — pyfunc 提供统一的 predict() 接口
- [港口调度员](./ai-gateway) — 网关可以把请求路由到已部署的模型
:::
