# The Quality Inspector

> **MLflow Concept:** Issues & Quality Monitoring

## The Story

Detective Chen dealt in individual cases. A customer got the wrong cake — Chen pulled the trace and found the bottleneck. A response was slow — Chen's spans showed which supplier call lagged. Each trace was one story, one customer, one red thread on the corkboard. Useful, but reactive.

Then the town hired **Inspector Voss**.

Voss didn't look at individual traces. She looked at *patterns*. On Monday, a customer named Mrs. Okafor complained that her chocolate cake tasted slightly bitter. Chen pulled the trace — the Yara template was correct, the oven call was clean, the timing was normal. Just an unhappy customer. An assessment: one thumbs-down, one data point. On Tuesday, two more complaints. Wednesday, six. By Friday, Voss had forty-seven customers in one week — all reporting the same slight bitterness, all at the same step in Chen's traces, all from cakes made after Rodrigo's gateway had fallen back to the backup cocoa supplier in Ghent.

One unhappy customer is an Assessment. Forty-seven is a systematic **Issue**.

Voss opened her report: **Issue #23 — Bitter Chocolate from Ghent Supplier**. Severity: High. Root causes: new supplier's cocoa had a higher alkaloid content that Maya's recipe didn't account for; Rosa's tournament scorer for flavor hadn't been calibrated for the new ingredient. Status: Open. Affected traces: 47. The Issue linked to the specific model version in Ahmed's registry — the cake recipe that had earned `@champion` before the supplier switch. It also linked to Rosa's safety scorer, the one that *should* have caught the flavor deviation in evaluation but hadn't been run against the new supplier's ingredients.

"Chen tells you what happened to one customer," Voss explained to Maya. "I tell you what's happening to all of them. He finds the needle. I notice the haystack is on fire."

## The Lesson

An **Issue** represents a systematic quality problem detected across production traces. While an Assessment is feedback on a single trace ("this response was unhelpful"), an Issue aggregates a pattern ("our model consistently hallucinates dates in financial queries").

Each Issue belongs to an experiment and has:
- A **name** and **description** — what the problem is
- A **severity** — how bad it is
- **Categories** — classification tags for the type of problem
- **Root causes** — what's causing the problem
- A **status** — Open, Resolved, etc.
- A **trace count** — how many traces are affected
- A **source Run** — the evaluation Run that discovered the issue

Issues can be linked to individual Assessments via `IssueReference`, connecting the big-picture pattern to specific trace-level evidence.

::: tip Key Takeaway
- **Issue** = a systematic quality problem detected across multiple traces
- **Assessment** = feedback on a single trace (individual defect)
- Issues have severity, categories, root causes, and trace counts
- Issues are discovered by evaluation Runs and linked to individual Assessments
:::

::: info Issues vs. Assessments
Think of it as two levels of quality monitoring. Assessments are bottom-up: "this trace was bad." Issues are top-down: "we have a pattern of bad traces, and here's what's causing it." Both are essential — Assessments provide evidence, Issues provide actionable insight.
:::

## For Frontend Developers

Issues have their own tab within Run detail. Issue detection runs are shown in the evaluation runs page with drill-down to individual issue details.

| Component | What It Shows |
|-----------|--------------|
| `RunViewIssuesTab` | Issues tab within a Run detail page |
| `ExperimentEvaluationRunsPage` | Evaluation runs that detected issues |
| `IssueDetectionRunDetailsPage` | Drill-down into a specific issue detection run |

### Data Shape

```typescript
// Issue entity
{
  issue_id: "iss-789",
  experiment_id: "42",
  name: "Date Hallucination in Financial Queries",
  description: "Model consistently generates incorrect dates when answering questions about earnings reports",
  status: "OPEN",                     // OPEN, RESOLVED, etc.
  severity: "HIGH",                   // severity level
  root_causes: [
    "Training data lacks recent financial calendar",
    "No grounding to real-time data source",
  ],
  source_run_id: "eval-run-456",      // the evaluation Run that found this
  created_timestamp: 1700000000000,
  last_updated_timestamp: 1700003600000,
  created_by: "quality-team",
  categories: ["hallucination", "factual-accuracy"],
  trace_count: 47,                    // number of affected traces
}
```

---

::: details See Also
- [The Detective's Thread](./tracing-and-spans) — issues are detected from patterns in traces
- [The Judge's Tournament](./evaluation-and-scorers) — issue detection runs are a type of evaluation
:::
