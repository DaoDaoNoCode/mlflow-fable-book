---
outline: deep
---

# 握手协议

> **对应概念：** Span Links *(即将推出)*

::: warning 即将推出
Span Links 目前处于 RFC 阶段（[RFC 0003](https://github.com/mlflow/rfcs/tree/main/rfcs/0003-otel-spanlinks)）。这里描述的概念和数据结构基于已批准的设计，实际实现时可能会有调整。
:::

## 故事

小梅厨房里有三个 AI 助手，从来不同时干活。

**Agent A** 是趋势监测员。每小时跑一次，扫社交媒体上的蛋糕趋势。每次跑完是自己的一条 Trace——老陈档案里一次独立调查。周二上午，Agent A 的 Trace #A-117 标记了一波海盐焦糖的需求激增。

**Agent B** 是总结员。每天跑一次，读 Agent A 所有的小时报告，浓缩成一份趋势简报。Agent B 不是 Agent A 的子任务——不在同一条 Trace 里，也不可能嵌套成子 Span。它在几个小时后、一条独立的 Trace 里跑。但它的工作依赖 Agent A 的输出。

**Agent C** 是周报发布员。每周跑一次，拿 Agent B 的总结编成小梅的客户周报。

先说没有 Span Link 之前的事。一个顾客投诉周报推荐的「海盐焦糖趋势」过期两周了。老陈去查——Agent C 的 Trace 显示用了一份总结，但追不到是 Agent B 的*哪份*总结，更追不回 Agent A 的*哪次*扫描。每个 Trace 边界都是死路。

后来有了 **Span Link**。Agent B 的总结 Span 里加了一个 Link，指向 Agent A 在 Trace #A-117 里的监测 Span，属性里注明「特别是市场趋势那一节」。Agent C 的发布 Span 也 link 回 Agent B 的总结 Span，注明「素材来源」。

Link 是单向的。B 指向 A，但 A 上什么都没写——它甚至不知道谁会消费自己的输出。

有了这条链子，老陈几秒钟就查到了 bug：Agent B 用了一份过期的缓存总结，没拿最新的扫描结果。三条 Trace，一路追下来，畅通无阻。

「父子 Span 是给发生在彼此*内部*的事情用的，」老陈说。「Span Link 是给*因为*彼此才发生的事情用的。」

## 概念解读

在 OpenTelemetry 里，**Span Link** 连接的是两个有关系但不是父子关系的 Span。父子关系描述的是同步的、嵌套的调用——「这个函数调了那个函数」。但很多真实场景不是这种模式：

- 异步多 Agent 系统：Agent A 在一条 Trace 里产出了结果，几小时后 Agent B 在另一条完全不同的 Trace 里消费了它。
- 批处理器从队列读消息——每条处理后的消息要 link 回当初入队的那个 Span。
- 重试机制：重试的 Span 要 link 回原来失败的那个 Span。

MLflow 现在把 Span Links 作为一等公民来支持。每个 Link 包含：

- **`trace_id`**——被链接 Span 所在的 Trace（特工 A 的那条 Trace）
- **`span_id`**——具体链接到哪个 Span（特工 A 的「整理卷宗」Span）
- **`attributes`**——可选的键值对，描述关系的性质（`"relationship": "input_source"`、`"section": "market_trends"`）

Link 是**单向的**。B link 到 A 的 Span，A 的 Span 不会自动 link 回 B。你知道谁消费了谁的产出，但生产者不一定知道自己的消费者是谁。

Link 存在 Span 已有的 `content` JSON 里——不需要新加数据库列。

**怎么创建 Link：**

- 创建 Span 时：给 `start_span()` 或 `@mlflow.trace` 传 `links=` 参数
- 创建之后：调 `span.add_link()` 往已有 Span 上追加 Link
- 所有创建 Span 的方式都支持——装饰器、上下文管理器、fluent API

::: tip 一句话总结
- **Span Link** = 连接两个非父子关系 Span 的纽带
- 包含 `trace_id`、`span_id` 和可选的 `attributes`
- **单向的**——A link 到 B，B 不自动 link 回 A
- 核心场景：**异步多 Agent** 工作流、批处理、重试链
- 存在 Span 的 `content` 里——不需要数据库迁移
- 通过 `links=` 参数或 `span.add_link()` 创建
:::

## 前端开发者参考

Span Links 在 `model-trace-explorer` 的 **Span 详情视图**里新增了一块内容。当一个 Span 有 Link 时，它们和现有的输入、输出、属性一起展示。

每个 Link 展示的信息：

- **Trace ID**——如果被链接的 Trace 可访问，会渲染成可点击的导航链接，点击直接跳转到那条 Trace
- **Span ID**——标识被链接 Trace 里的具体 Span
- **Attributes**——键值对，渲染方式跟其他属性展示一致

Link 从 Span 的 content 里读取，不需要新的 API 端点——它们随现有的 Span 数据一起返回。

| 组件 | 对应什么 |
|------|---------|
| `model-trace-explorer` | Span 详情视图新增「Links」区域 |
| Span 详情面板 | 每个 Link 展示 Trace ID（可点击）、Span ID、属性 |
| Trace 导航 | 点击 Link 的 Trace ID 跳转到那条 Trace 的详情 |

### 数据长什么样

```typescript
// Link — 核心数据结构（Python SDK 侧）
// Link { trace_id: string, span_id: string, attributes?: Record<string, any> }

// ModelTraceSpanLink（前端 TypeScript 类型）
{
  trace_id: "tr-research-001",       // 被链接 Span 所在的 Trace
  span_id: "span-compile-dossier",   // 具体链接到的 Span
  attributes: {                       // 可选的关系描述
    "relationship": "input_source",
    "section": "market_trends",
  },
}

// Link 出现在现有的 ModelTraceSpanV3 content 里：
// ModelTraceSpanV3.content.links: ModelTraceSpanLink[]

// 例子：一个带两个 Link 的 Span
{
  name: "summarize_article",
  span_id: "span-editor-42",
  parent_span_id: null,
  // ... 其他 Span 字段 ...
  attributes: {
    "mlflow.spanType": "CHAIN",
    "mlflow.spanInputs": { ... },
    "mlflow.spanOutputs": { ... },
  },
  // Link 在 Span 的 content 里
  links: [
    {
      trace_id: "tr-research-001",
      span_id: "span-compile-dossier",
      attributes: { "relationship": "input_source" },
    },
    {
      trace_id: "tr-review-055",
      span_id: "span-fact-check",
      attributes: { "relationship": "validation" },
    },
  ],
}
```

### 跟现有概念的关系

| 概念 | 关系 |
|------|------|
| **Tracing / Span** | Link 扩展了 Span 的数据模型——跟输入、输出、属性、事件并列的新字段 |
| **父子 Span** | 父子 = 一条 Trace 内的同步嵌套。Link = 跨 Trace 的、非层级的连接 |
| **Assessment** | Assessment 评判质量；Link 描述 Span 之间的数据流和依赖关系 |
| **多 Agent 工作流** | Link 是连接跨 Trace Agent 交接的核心机制 |

::: info 什么时候用户会看到 Link？
Link 最常出现在多 Agent 或异步流水线的场景里。如果你的应用是简单的单 Trace 请求-响应流程，大概率看不到任何 Link。当你有多条 Trace 组成一个更大的工作流时——一个 Agent 的输出喂给另一个 Agent、重试链、扇出/扇入模式——Link 就变得很有价值。UI 应该把它们渲染成可导航的连接：「此 Span 使用了 [Trace tr-research-001 > Span compile-dossier] 的输出。」
:::

---

::: details 相关寓言
- [侦探的红线](./tracing-and-spans) — Span Link 扩展了 Tracing 模型，支持异步多 Agent 场景
:::
