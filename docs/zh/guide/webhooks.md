# 信号弹

> **对应概念：** Webhook（事件回调）

## 故事

小丹那次事故之后——因为没人知道他删了 `@champion` Alias，服务挂了两个小时——小梅的团队决定不再事后才知道出了大事。他们要在重要的事情发生的那一刻就知道，而不是第二天早上。

办法就是**信号弹**。每发信号弹是一份简单的约定：一个名字、一个要调用的 URL、一个用于验证的密钥，以及一条触发规则——一个实体加一个动作，比如 `model_version.created` 或 `model_version.alias_changed`。事件触发时，MLflow 向那个 URL 发一个 HTTP POST。不问后续，信号弹本身也不存通知历史。信号弹是通知的约定，不是通知的日志。

他们立刻设了三发信号弹。第一发盯着阿赫迈德的图书馆：每当有新模型版本注册，信号弹就发到团队的 Slack 频道。第二发盯着罗莎的评估流水线：评估完成时，信号弹触发 CI/CD 系统跑部署检查。第三发是小丹主管的主意——每当有模型拿到 `@champion` Alias，信号弹通知值班工程师。「谁要是动了皇冠，」他说，「我要几秒钟之内就知道，不是几小时。」

每发信号弹带着一个密钥，接收方可以验证信号是真的。信号弹不管 Slack 或 CI/CD 流水线拿到信息之后做什么——它只管发。看到信号的人自己决定怎么行动。

「我们没法防止每一个错误，」小梅跟团队说。「但我们能确保没有人是最后一个知道的。」

## 概念解读

**Webhook** 是一个事件触发的 HTTP 回调。你在 MLflow 里注册一个 URL，当指定事件发生时，MLflow 会向这个 URL 发一个 HTTP POST 请求，把事件详情放在请求体里。

每个 Webhook 有：
- **名称** — 人看的标签
- **URL** — 把回调发到哪里
- **状态** — 启用还是禁用
- **密钥** — 用于签名验证（接收方可以确认请求真的来自 MLflow）
- **描述** — 这个 Webhook 是干嘛的

**Webhook Event** 定义什么情况下触发——哪个实体（比如模型版本）发生了什么操作（比如创建）。当指定事件发生时，MLflow 向 Webhook 的 URL 发送 HTTP POST。

常见用法：
- 新模型版本注册时通知 Slack 频道
- 模型晋升到生产环境时触发 CI/CD 流水线
- 评估分数低于阈值时告警
- 把模型元数据同步到外部目录

::: tip 一句话总结
- **Webhook** = MLflow 事件触发的 HTTP 回调
- 每个 Webhook 有名称、URL、状态和密钥
- **Webhook Event** 定义触发条件——实体 + 操作的组合
- 用途：Slack 通知、CI/CD 触发、监控告警
:::

::: warning 安全提示
一定要用 Webhook 密钥做签名验证。不然只要有人发现了你的回调 URL，就能给你的下游服务发假事件。
:::

## 前端开发者参考

Webhook 在设置区域管理。API 支持完整的增删改查，外加一个测试端点来验证连通性。

| 组件 | 对应什么 |
|------|---------|
| Settings — Webhooks 部分（`/settings/webhooks`） | 列出、创建、编辑、删除和测试 Webhook |

### API 层

Webhook API 在 settings 的 API 模块里。操作包括：
- 列出所有 Webhook
- 创建新 Webhook
- 更新已有 Webhook
- 删除 Webhook
- 测试 Webhook（发一个测试事件验证 URL 是否通）

### 数据长什么样

```typescript
// Webhook
{
  webhook_id: "wh-001",
  name: "模型注册通知器",
  description: "新模型版本注册时通知 Slack",
  url: "https://hooks.slack.com/services/T00/B00/xxx",
  status: "ACTIVE",                    // ACTIVE 或 DISABLED
  secret: "••••••••",                  // UI 里脱敏显示，用于签名验证
  creation_timestamp: 1700000000000,
  last_updated_timestamp: 1700003600000,
}

// WebhookEvent —— 定义什么情况下触发（实体 + 操作）
{
  entity: "model_version",             // 哪种资源类型
  action: "created",                   // 发生了什么操作
}
```

---

::: details 相关寓言
- [皇家图书馆](./model-registry) — Webhook 可在模型注册事件时触发
- [美食大赛的评委](./evaluation-and-scorers) — Webhook 可在评估分数变化时告警
:::
