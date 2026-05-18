# 信号弹

> **对应概念：** Webhook（事件回调）

## 故事

小丹事故之后，团队复盘发现一个更大的问题：不是小丹删了 `@champion` Alias——是删了之后两个小时没人知道。帕特尔医生的服务端点挂着，值班工程师在喝咖啡，小梅在调参数。出了灾，全是事后才发现。

小梅团队决定装**信号弹**。

每发信号弹就是一份约定：一个名字，一个 URL，一个验证密钥，加一条触发规则。触发规则很简单——一个实体加一个动作，比如 `model_version.created`，或者 `model_version.alias_changed`。事件一触发，MLflow 往那个 URL 发一个 HTTP POST。发完就完，信号弹不管后续，也不存通知记录。信号弹是触发协议，不是通知日志。

团队立刻设了三发。

第一发盯着阿赫迈德的图书馆：新模型版本一注册，信号弹发到 Slack 频道。第二发盯着罗莎的评估流水线：评估跑完，信号弹触发 CI/CD 做部署检查。第三发是小丹主管的主意——`@champion` Alias 一动，信号弹直接通知值班工程师。「谁要是碰了皇冠，」他说，「我几秒钟之内就要知道，不是几小时。」

每发信号弹带密钥，接收方能验证信号是真的。信号弹不管 Slack 拿到消息之后做什么——只管发。收到的人自己决定怎么行动。

「我们防不了每一个错误，」小梅跟团队说。「但我们能确保没有人是最后一个知道的。」

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

::: info 相关寓言
- [皇家图书馆](./model-registry) — Webhook 可在模型注册事件时触发
- [美食大赛的评委](./evaluation-and-scorers) — Webhook 可在评估分数变化时告警
:::
