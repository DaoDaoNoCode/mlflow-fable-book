# 质量督察员

> **对应概念：** Issue（质量问题）与质量监控

## 故事

老陈查的是一个一个的案子。哪个顾客的蛋糕出了问题，他拉出 Trace，找到卡在哪一步。每条 Trace 是一个故事、一个顾客、软木板上的一根红线。有用，但只能事后补救。

后来镇上请来了**督察沃斯**。

沃斯不看个案，看规律。周一，一个顾客投诉巧克力蛋糕有苦味。老陈拉了 Trace——雅拉的模板没问题，烤箱调用正常，时间也对。就是一条差评，一个 Assessment，一个数据点。

周二又来两条。周三六条。到周五，四十七个顾客报了同样的苦味。老陈翻 Trace，全都出现在同一个步骤——全都是罗德里戈的网关切换到根特新可可供应商之后做的蛋糕。

一条投诉是反馈。四十七条是系统性的 **Issue**。

沃斯开了报告：**Issue #23——根特供应商的苦巧克力**。严重程度：高。根因：新供应商可可碱含量偏高，小梅的配方没做调整；罗莎的口味 Scorer 也没拿新原料重新校准。状态：待处理。受影响 Trace：47 条。

这个 Issue 关联到阿赫迈德图书馆里的模型版本——供应商切换前拿到 `@champion` 的那个配方。也关联到罗莎的 Scorer——本该在评估中发现偏差，但从没拿新原料测过。

「老陈告诉你一个顾客发生了什么，」沃斯跟小梅说。「我告诉你所有顾客正在发生什么。他找到针。我发现干草堆着火了。」

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
可以理解成两层质量监控。Assessment 从下往上看：「这条 Trace 不好。」Issue 从上往下看：「有一类 Trace 普遍不好，原因在这里。」缺了哪个都不行——Assessment 攒证据，Issue 告诉你该动手修什么。
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
