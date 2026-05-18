---
outline: deep
---

# 冷库里的旧档案

> **对应概念：** Trace Archival *(即将推出)*

::: warning 即将推出
Trace Archival 目前处于 RFC 阶段（[RFC 0001](https://github.com/mlflow/rfcs/tree/main/rfcs/0001-trace-archival)）。这里描述的概念和数据结构基于已批准的设计，实际实现时可能会有调整。
:::

## 故事

六个月下来，老陈的档案柜快撑不住了。

小梅的实验、罗德里戈的网关路由、罗莎的评估——几千条 Trace 堆在数据库里。每条 Trace 是一棵 Span 树，有些 Span 带着好几 MB 的 LLM 输入输出。柜子越来越贵，搜索一周比一周慢。

老陈提了个方案：搞**冷库**。

近期的 Trace——30 天以内——留在档案柜里，查起来快。这些是热门案件，天天有人翻。更老的 Trace 打包装箱，搬到城对面的仓库——对象存储，又大又便宜，就是取的时候稍慢一点。

关键是：每条 Trace 的目录卡片始终留在柜子里。卡片上记着 Trace ID、时间戳、状态、Tag，还有 Span 级别的信息——类型、耗时这些。只有大块的 Span 内容——原始输入输出——搬走了。

搜索的时候，不管数据在热的还是冷的地方，查的是同一套目录。归档的 Trace 照样能按 Span 类型、状态、耗时过滤，因为那些列从没离开柜子。唯一做不到的是在 Span 原始内容里搜——那些文本已经在仓库了。

小梅的实验可以单独设保留策略——比如 90 天，因为她团队常回看旧 Run。小普的 Workspace 也能覆盖服务器默认值。每天晚上一个后台任务安安静静扫一遍柜子，检查日期，把过期的搬走。不用人操心。

「案子没有消失，」老陈跟小梅说。「只是换了个便宜的架子。索引永远记得它们去了哪。」

## 概念解读

规模大了以后，把所有 Trace 数据都存在 tracking 数据库里会越来越贵。一条 Trace 里面是一棵 Span 树，每个 Span 都带着可能很大的 JSON——输入、输出、属性、事件。几百万条 Trace 下来，数据库膨胀得很快。

**Trace Archival** 的核心思路是把元数据和内容分开存：

- **热数据**（近期的 Trace）：完整的 Span 内容留在数据库里，查询快，所有过滤器都能用。
- **冷数据**（归档的 Trace）：轻量的元数据留在数据库（trace ID、时间戳、状态、Tag，以及 Span 级别的列如类型、耗时、状态），但大块的 Span 内容搬到更便宜的**对象存储**——S3、GCS、Azure Blob 或者任何配置好的存储服务。

归档的 Span 数据用的是 **OTLP protobuf 格式**（`TracesData`），跟 OpenTelemetry 的标准一致，紧凑又通用。

**保留策略**决定什么时候归档：

- **Server 级别**：全局默认值（比如"30天以上的 Trace 自动归档"）
- **Workspace 级别**：对特定 Workspace 的覆盖
- **实验级别**：对特定实验的覆盖（就像科学区的14天策略）

归档是一个**定期运行的服务端后台任务**——不需要用户触发，自动巡检。

**归档后还能做什么：**

- `search_traces` 和 `get_trace` 照常返回归档的 Trace——API 会自动从对象存储取数据，调用方不需要知道区别。
- 基于数据库列的 Span 过滤器依然可用：按 Span 类型、状态、耗时过滤都没问题，因为这些列还留在数据库里。

**归档后做不到什么：**

- 在 Span 的原始内容里做 JSON 属性搜索不行了——那些数据已经不在数据库里了。

`trace_archival_location` 可以独立于 Artifact 存储单独配置，你可以用一个专门的 bucket 或存储层级来放归档的 Trace。

::: tip 一句话总结
- **热 Trace** = 近期的，完整存在数据库里，所有查询都能用
- **冷 Trace** = 归档的，元数据在数据库，Span 内容在对象存储
- **保留策略** = Server、Workspace、实验三级可配
- **归档格式** = OTLP protobuf（`TracesData`）
- **透明获取** = `search_traces` 和 `get_trace` 的用法完全不变
- **过滤限制** = 列级过滤器（类型、状态、耗时）可用；JSON 属性搜索不可用
:::

## 前端开发者参考

好消息：Trace Archival 对前端来说**基本上是透明的**。归档的 Trace 出现在同一个列表里，点进去用的是同一个 Trace 探索器。数据从对象存储获取的逻辑全在 API 层处理了。

用户可能感知到的区别：

- **加载稍慢**——很久以前的 Trace 加载可能多花几百毫秒，因为 API 要从对象存储而不是数据库拉 Span 内容。
- **实验设置**里可能会多一个保留策略的配置项，让用户设定这个实验的 Trace 热存储周期。
- **搜索限制**——如果 UI 支持在 Span 输入输出内容里做全文搜索，那对归档的 Trace 搜不到。UI 可能需要给用户一个提示说明这个边界。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentTracesPage` | Traces 标签页——归档的 Trace 出现在同一个列表里 |
| `genai-traces-table` | 不需要改动——数据结构不变 |
| `model-trace-explorer` | Span 详情从归档透明加载（可能稍慢） |
| 实验设置（潜在） | Trace 保留策略配置 |

### 数据长什么样

不引入新的前端类型。现有的 `ModelTraceInfoV3` 和 `ModelTraceSpanV3` 保持不变——归档层完全在服务端。

```typescript
// ModelTraceInfoV3 —— 不变
{
  trace_id: "tr-abc-123",
  request_time: "2024-11-15T10:00:00Z",
  execution_duration: "257ms",
  state: "OK",
  trace_metadata: { ... },
  tags: { ... },
  assessments: [...],
}

// ModelTraceSpanV3 —— 不管是热存储还是冷存储，结构都一样
{
  name: "call_llm",
  span_id: "span-456",
  parent_span_id: "span-123",
  start_time_unix_nano: "1700000000000000000",
  end_time_unix_nano: "1700000200000000000",
  status: { code: "STATUS_CODE_OK" },
  attributes: {
    "mlflow.spanInputs": { prompt: "What is MLflow?" },
    "mlflow.spanOutputs": { response: "MLflow is..." },
    "mlflow.spanType": "LLM",
  },
  events: [...],
}

// 唯一新增的配置面（服务端，可能在设置 UI 中暴露）：
// 保留策略：{ retention_days: 30, archival_location: "s3://my-bucket/traces/" }
```

::: info 为什么前端几乎感觉不到？
归档系统的设计目标就是后端优化，而不是用户可感知的功能。API 的契约不变——`search_traces` 返回的数据结构，不管 Trace 是热的还是冷的都一模一样。唯一可观测的差异是延迟。这跟 CDN 的原理类似：用户不知道内容是从缓存还是源站来的，只看到结果。
:::

---

::: details 相关寓言
- [侦探的红线](./tracing-and-spans) — 归档管理的就是 Trace 数据的生命周期
:::
