# 质量督察员

> **对应概念：** Issue（质量问题）与质量监控

## 故事

侦探老陈处理的是单个案件。一个顾客收到了错的蛋糕——老陈拉出 Trace 找到了瓶颈。一个响应太慢——老陈的 Span 显示是哪个供应商调用卡了。每条 Trace 是一个故事、一个顾客、软木板上的一根红线。有用，但是被动的。

然后镇上请来了**督察沃斯**。

沃斯不看单条 Trace，她看的是**规律**。周一，一位叫奥卡福太太的顾客投诉巧克力蛋糕有点苦。老陈拉出 Trace——雅拉的模板没问题，烤箱调用干净，时间正常。就是一个不满意的顾客。一条 Assessment：一个差评，一个数据点。周二，又来两条投诉。周三，六条。到周五，一周之内四十七个顾客——全都反映同样的微苦，全都出现在老陈 Trace 的同一个步骤，全都是罗德里戈的网关切换到根特新可可供应商之后做的蛋糕。

一个不满意的顾客是一条 Assessment。四十七个是一个系统性的 **Issue**。

沃斯打开了她的报告：**Issue #23 — 根特供应商的巧克力发苦**。严重程度：高。根本原因：新供应商的可可碱含量更高，小梅的配方没有针对性调整；罗莎大赛的口味 Scorer 没有为新原料重新校准。状态：待处理。受影响的 Trace：47 条。这个 Issue 关联着阿赫迈德图书馆里的那个模型版本——在供应商切换之前拿到 `@champion` 的蛋糕配方。它还关联着罗莎的安全 Scorer——那个本应在评估中发现口味偏差、但没有用新供应商的原料重新测试过的评委。

「老陈告诉你一个顾客发生了什么，」沃斯跟小梅解释。「我告诉你所有顾客正在发生什么。他找的是针，我发现的是干草堆着了火。」

## 概念解读

**Issue** 代表一个在生产 Trace 中发现的系统性质量问题。Assessment 是对单条 Trace 的反馈（「这个回答没有帮助」），Issue 则是把一类问题聚合起来（「我们的模型在金融查询里经常编造日期」）。

每个 Issue 属于一个实验，包含：
- **名称和描述** — 什么问题
- **严重程度** — 有多严重
- **分类标签** — 问题的类型归类
- **根本原因** — 为什么会出这个问题
- **状态** — 待处理、已解决等
- **Trace 数量** — 受影响的 Trace 有多少条
- **来源 Run** — 发现这个问题的那次评估 Run

Issue 可以通过 `IssueReference` 关联到具体的 Assessment，把宏观的问题模式和微观的 Trace 级证据连起来。

::: tip 一句话总结
- **Issue** = 跨多条 Trace 发现的系统性质量问题
- **Assessment** = 对单条 Trace 的反馈（个别瑕疵）
- Issue 有严重程度、分类、根本原因和 Trace 数量
- Issue 由评估 Run 发现，关联到具体的 Assessment
:::

::: info Issue 和 Assessment 的关系
可以理解成两个层级的质量监控。Assessment 是自下而上的：「这条 Trace 不好。」Issue 是自上而下的：「我们有一类 Trace 普遍不好，原因是这个。」两者缺一不可——Assessment 提供证据，Issue 提供可操作的洞察。
:::

## 前端开发者参考

Issue 在 Run 详情页有自己的标签页。Issue 检测的 Run 在评估 Run 页面展示，可以钻取到具体的 Issue 详情。

| 组件 | 对应什么 |
|------|---------|
| `RunViewIssuesTab` | Run 详情页里的 Issues 标签页 |
| `ExperimentEvaluationRunsPage` | 发现了 Issue 的评估 Run |
| `IssueDetectionRunDetailsPage` | 某次 Issue 检测 Run 的详情钻取 |

### 数据长什么样

```typescript
// Issue 实体
{
  issue_id: "iss-789",
  experiment_id: "42",
  name: "金融查询中的日期幻觉",
  description: "模型在回答财报相关问题时经常生成错误的日期",
  status: "OPEN",                     // OPEN, RESOLVED 等
  severity: "HIGH",                   // 严重程度
  root_causes: [
    "训练数据缺少最新的财务日历",
    "没有接入实时数据源做事实校验",
  ],
  source_run_id: "eval-run-456",      // 发现这个问题的评估 Run
  created_timestamp: 1700000000000,
  last_updated_timestamp: 1700003600000,
  created_by: "quality-team",
  categories: ["hallucination", "factual-accuracy"],
  trace_count: 47,                    // 受影响的 Trace 数量
}
```

---

::: details 相关寓言
- [侦探的红线](./tracing-and-spans) — Issue 从 Trace 的规律中发现
- [美食大赛的评委](./evaluation-and-scorers) — Issue 检测是评估的一种形式
:::
