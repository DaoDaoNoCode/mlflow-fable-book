# 港口调度员

> **对应概念：** AI Gateway

## 故事

小梅的巧克力蛋糕需要从多个供应商进原料。巧克力来自一家——比如贝尔蒙特可可公司。香草精来自另一家——马尚父子。特殊装饰——食用金箔、高级可可碎——来自第三家。每家供应商有不同的订单格式、不同的价格档、不同的交货方式。有一阵子小梅的厨房跟每家单独对接。**罗德里戈**负责管供应链。

然后贝尔蒙特一夜之间改了订单格式。没有任何预告。新表格、新最低起订量、交货流程完全重组。罗德里戈的巧克力订单卡了三天。两百个顾客走到帕特尔医生的柜台前什么都买不到——烤箱里没原料。等罗德里戈手忙脚乱学完新规矩，小梅已经亏了一周的收入，半条街的顾客都失去了信任。

这时候罗德里戈变成了**港口调度员**。他给小梅的厨房做了一张统一的标准订单表。一张表，一种格式，每次都一样。罗德里戈负责翻译成每家供应商需要的格式——贝尔蒙特的新规矩、马尚的老式发票、特种店的 API。三个月后贝尔蒙特又改了规矩，罗德里戈自己消化了。小梅的厨房完全没感觉。

罗德里戈还设了限流——「巧克力每小时最多下 10 单，否则贝尔蒙特收溢价」——以及备用路线。贝尔蒙特要是挂了，罗德里戈自动切到根特的备用供应商。他把所有费用记在一本账上，小梅随时能看到每个蛋糕的原料成本。罗德里戈路由的每一笔原料订单都会出现在侦探老陈的 Trace 里，作为一个 Span——清清楚楚地记着调了哪个供应商、花了多长时间、返回了什么。

「我以前觉得背下所有供应商的规矩才显得我不可替代，」罗德里戈跟小梅说。「其实那只是让你的厨房变得脆弱。现在我不可替代，是因为什么都不会出故障。」

## 概念解读

**AI Gateway** 是你的应用和各家 LLM 供应商（OpenAI、Anthropic、Google 等）之间的统一代理。它提供一个标准化的高层接口，简化了跟各家 LLM 服务的对接。

没有 Gateway 的话，你要跟每家供应商对接不同的 API 格式。有了 Gateway，你的代码只需要用一种标准格式发请求。Gateway 还集中管理 API Key——不再需要把密钥散落在各处代码里。

**路由（Endpoint）** 是 Gateway 上的一条配置。每条路由指定用哪个供应商、哪个模型、什么类型的请求（`llm/v1/chat`、`llm/v1/completions`、`llm/v1/embeddings`）、限流多少。Gateway 还支持 **Passthrough Endpoint**，可以直接用供应商的原生格式透传请求。

::: tip 一句话总结
- **AI Gateway** = 应用和 LLM 供应商之间的统一代理
- **路由/Endpoint** = 一条配置（供应商 + 模型 + 限流 + 备选方案）
- 集中管理 API Key、限流、流量分发、安全策略
- 动态配置，不需要重启
:::

## 前端开发者参考

**Gateway 板块**就是调度员的工作台。每个 Endpoint 卡片上标着供应商、模型和状态。**创建 Endpoint 的页面**让用户配置模型映射、路由策略和安全策略。**用量页面**展示请求量、延迟、token 数和费用——调度员的账本。

| 组件 | 对应什么 |
|------|---------|
| `GatewayPage` | Gateway 根布局，包含子路由 |
| `CreateEndpointPage` | 新建 Endpoint，配置模型映射 |
| `EndpointPage` | Endpoint 详情、模型配置、安全策略 |
| `GatewayUsagePage` | 请求量、延迟、token、费用 |

### 数据长什么样

```typescript
// Gateway Endpoint（前端类型）
{
  endpoint_id: "ep-abc-123",
  name: "chat-completion",
  model_mappings: [
    {
      model_definition_id: "md-456",
      weight: 100,          // 流量分发权重
    }
  ],
  routing_strategy: "round_robin",
  fallback_config: { ... },
  experiment_id: "123",     // 关联的实验，用于 Tracing
  usage_tracking: { ... },
}

// ModelDefinition（被 Endpoint 引用）
{
  model_definition_id: "md-456",
  name: "gpt-4-prod",
  provider: "openai",
  model_name: "gpt-4",
  secret_id: "sec-789",    // 引用一个 GatewaySecretInfo
}
```

---

::: details 相关寓言
- [侦探的红线](./tracing-and-spans) — 通过网关的 LLM 调用会被 Trace 捕获
- [写信人的模板](./prompts) — Prompt 通过网关端点发送
- [发射台](./model-serving) — 网关可以代理到已部署的 MLflow 模型
:::
