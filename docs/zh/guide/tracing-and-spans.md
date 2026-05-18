# 侦探的红线

> **对应概念：** Tracing、Trace、Span

## 故事

小梅的巧克力蛋糕在帕特尔医生的发射台上线那天，订单涌进来。顾客在柜台下单，蛋糕从另一头出来，大部分时候一切正常。

但上线第三天早上，一位叫田中先生的顾客点了巧克力蛋糕，收到的却是香草的。没人解释得了。

镇上请来了**侦探老陈**。

老陈干什么的呢？追踪每一笔订单——从到帕特尔医生柜台的那一刻，到蛋糕交到顾客手上。每一次完整的追踪，他叫做一条 **Trace**，就像软木板上的一根红线，串起整个过程。红线上每一步叫一个 **Span**：接收订单、查配方模板（镇上的模板专家雅拉写的）、给原料采购员罗德里戈发请求、启动烤箱、摆盘出品。

Span 之间是套在一起的，树形结构。「准备蛋糕」里面包着「混合面糊」和「烘烤」。「混合面糊」里又包着「称面粉」和「化巧克力」。时间顺序和嵌套关系，拉出来一目了然。

老陈拉出田中先生那条 Trace，答案立刻就清楚了。「调用烤箱」那个 Span 花了 4200 毫秒——平时只要 200。系统等不及，超时了，返回了一个缓存的旧蛋糕：昨天的香草。再往下查，烤箱调用经过罗德里戈转接到一个新供应商，就是这里卡住了。雅拉的 `@chocolate-classic` 模板没问题，配方指令是对的，故障在供应商调用上。

老陈还让所有人能在 Trace 上留 **Assessment**。田中先生留了一个差评。一个自动的新鲜度检测器标记了过期响应。小梅的质量团队加了一条 Expectation：巧克力订单不应该返回香草。每一条 Assessment 都成为永久记录，把每笔订单变成一堂课。

「我不解决问题，」老陈跟小梅说。「我让问题可见。之后问题自己会解决。」

## 概念解读

**Tracing** 是 MLflow 给 LLM 应用和 AI Agent 做的可观测性系统，兼容 OpenTelemetry 标准。它能捕获每一步的输入、输出、耗时和开销。

一条 **Trace** 记录的是一个请求从进来到出去的完整过程。每个步骤是一个 **Span**——有名字、有耗时、有输入输出、有状态。Span 之间是树形嵌套的：最外层可能是「回答用户问题」，里面套着「检索文档」「调用 LLM」「格式化回复」。

MLflow Tracing 跟很多主流框架集成了——OpenAI、LangChain、DSPy、Vercel AI 等，通常一行代码就能开启自动 Tracing。

**Assessment** 是贴在 Trace 上的质量判断——可以是用户的点赞点踩，也可以是自动化的质量评分。配合 MLflow 的评估功能，你甚至可以直接在 Trace UI 上跑 LLM 评委来打分，不需要写代码。

::: tip 一句话总结
- **Trace** = 一个请求的完整旅程记录
- **Span** = 旅程中的一个步骤（有耗时、有输入输出）
- Span 之间是**树形嵌套**——大步骤包含小步骤
- **Assessment** = 对 Trace 质量的打分（人工或自动）
:::

## 前端开发者参考

实验里的 **Traces 标签页**就是老陈的案件板——所有 Trace 记录排成一列。点进去看到的是 **Trace 探索器**——一个瀑布式的时间线视图，父子嵌套一目了然，每个 Span 有一条长短不同的时间条。展开某个 Span 可以看到它的输入输出和属性。旁边还有 Assessment 图标（点赞点踩、评分）。

这是 UI 里交互最复杂的部分之一——树的展开折叠、JSON 美化、时间条的比例计算、Assessment 状态的展示。如果你用过浏览器开发者工具的 Network 面板或火焰图，Trace UI 的感觉和那个很像。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentTracesPage` | 实验里的 Traces 标签页 |
| `genai-traces-table`（共享模块） | Trace 列表，支持过滤和自定义列渲染 |
| `model-trace-explorer`（共享模块） | Trace 详情：Span 树、时间线、输入/输出 |
| Assessment 指标 | 点赞/点踩图标、质量评分 |

### 数据长什么样

```typescript
// ModelTraceInfoV3（前端类型）
{
  trace_id: "tr-abc-123",
  request_time: "2024-11-15T10:00:00Z",  // ISO 时间戳字符串
  execution_duration: "257ms",             // 格式化的耗时字符串
  state: "OK",                             // STATE_UNSPECIFIED | OK | ERROR | IN_PROGRESS
  trace_metadata: { "run_id": "abc-456" },
  tags: { "user": "alice" },
  assessments: [...],
}

// ModelTraceSpanV3（前端类型）—— 输入输出在 attributes 里
{
  name: "call_llm",
  span_id: "span-456",
  parent_span_id: "span-123",          // 根节点为 null
  start_time_unix_nano: "1700000000000000000",
  end_time_unix_nano: "1700000200000000000",
  status: { code: "STATUS_CODE_OK" },  // STATUS_CODE_UNSET | STATUS_CODE_OK | STATUS_CODE_ERROR
  attributes: {
    "mlflow.spanInputs": { prompt: "What is MLflow?" },
    "mlflow.spanOutputs": { response: "MLflow is..." },
    "mlflow.spanType": "LLM",          // LLM, CHAIN, TOOL, RETRIEVER 等
  },
  events: [...],
}

// Assessment
{
  assessment_id: "asmt-789",
  assessment_name: "user_feedback",
  trace_id: "tr-abc-123",
  source: { source_type: "HUMAN" },    // HUMAN, LLM_JUDGE, CODE
  // value 是以下之一：Feedback、Expectation 或 IssueReference
}
```

---

::: details 相关寓言
- [写信人的模板](./prompts) — Prompt 是 Trace 中 LLM 调用所用的模板
- [港口调度员](./ai-gateway) — 网关负责路由 Trace 捕获的 LLM 调用
- [质检员](./issues) — Issue 是从 Trace 中发现的系统性质量问题
- [握手](./span-links) — Span Link 连接不同 Trace 中的 Span
:::
