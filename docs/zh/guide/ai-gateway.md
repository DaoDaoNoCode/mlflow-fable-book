# 港口调度员

> **对应概念：** AI Gateway

## 故事

小梅的巧克力蛋糕要从好几家供应商进原料。巧克力找贝尔蒙特可可公司，香草精找马尚父子，食用金箔和高级可可碎找第三家。每家订单格式不一样，价格档不一样，交货方式也不一样。厨房一直跟每家单独对接，**罗德里戈**管这条供应链。

然后贝尔蒙特一夜之间改了订单格式。没有任何预告。新表格，新起订量，交货流程全变了。罗德里戈的巧克力订单直接卡了三天。帕特尔医生柜台前，两百个顾客来了什么都买不到——烤箱里没原料。等罗德里戈手忙脚乱学完新规矩，小梅已经亏了一周的钱，半条街的顾客跑了。

这以后，罗德里戈变成了**港口调度员**。

他给小梅厨房做了一张统一的标准订单表。一张表，一种格式，次次一样。小梅只管填这张表，罗德里戈负责翻译——贝尔蒙特的新规矩他来对付，马尚的老式发票他来转，特种店的 API 他来接。三个月后贝尔蒙特又改了规矩，罗德里戈自己消化了，小梅的厨房完全没感觉。

罗德里戈还加了限流——巧克力每小时最多下十单，超了贝尔蒙特要收溢价。还有备用路线：贝尔蒙特要是挂了，自动切到根特的备用供应商。所有费用记在一本账上，小梅随时能查每个蛋糕的原料成本。

罗德里戈路由的每一笔原料订单，都会出现在侦探老陈的 Trace 里，作为一个 Span——记着调了哪个供应商，花了多长时间，返回了什么。

「以前觉得背熟每家供应商的规则让我不可替代，」罗德里戈跟小梅说。「其实那只是让厨房变得脆弱。现在我不可替代是因为什么都不会断。」

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
- [侦探的红线](./tracing-and-spans) — 经过网关的 LLM 调用会记进 Trace
- [写信人的模板](./prompts) — Prompt 通过网关端点发送
- [发射台](./model-serving) — 网关可以代理到已部署的 MLflow 模型
:::
