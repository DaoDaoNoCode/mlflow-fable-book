# The Chef's Kitchen

> **MLflow Concept:** Experiments & Runs

## The Story

Maya was the head chef at a small bakery on Elm Street, and she was obsessed with one thing: the perfect chocolate cake. She tried dark chocolate on Monday. Dry. She tried milk chocolate with oil on Tuesday. Too dense. On Wednesday, she mixed both chocolates, dropped the oven temperature ten degrees, and pulled the cake two minutes early. It was the best chocolate cake she'd ever made. Her entire team agreed.

On Thursday morning, Maya's boss walked into the kitchen. "That Wednesday cake — we want it for the client dinner Saturday. What was the recipe?"

Maya froze. She hadn't written it down. She remembered the two-chocolate idea, but was it 60/40 dark-to-milk or 70/30? Did she use butter or oil? What was the oven temperature — was it 325 or 335? She tried to recreate it from memory. The cake came out flat and oily. She tried again. Worse. Wednesday's masterpiece was gone, and she had no way to get it back.

That weekend, Maya bought a journal. She labeled the cover **"Project: Perfect Chocolate Cake"** — her *Experiment*. Every attempt from that day forward got its own page — a *Run* — with every ingredient, every oven setting, every result. She never tore out a page, not even the failures. Her friend Thomas, who worked at the bookshop across the street, later helped her organize the notes by color so she could scan them at a glance. And the actual cakes — the ones worth keeping — she started storing in Lena's temperature-controlled vault next door, because a recipe is not the cake itself.

Her sous chef asked why she didn't just keep one page and erase it each time. Maya shook her head. "Because Wednesday's cake is somewhere in these pages, and I'm never losing it again."

## The Lesson

An **Experiment** is a named project — a question you're trying to answer ("What's the best chocolate cake?"). A **Run** is one execution of your code — one attempt to answer that question. Each Run automatically records its parameters, metrics, tags, start/end time, and output files.

You can have hundreds of Runs in one Experiment, and you never delete them, because the history *is* the knowledge.

::: tip Key Takeaway
- **Experiment** = a named project grouping related Runs
- **Run** = one code execution, automatically recording params, metrics, and artifacts
- Runs are never deleted — the history is the value
:::

## For Frontend Developers

When you build the **Experiment List page**, you're showing Maya's kitchen — all her projects laid out. When the user clicks into one, you show the **Runs tab** — every attempt, side by side, so Maya can compare Tuesday's cake to Wednesday's cake at a glance.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentListView` | All experiments |
| `ExperimentPageTabs` | One experiment with tabbed layout (Runs, Traces, Models, etc.) |
| `ExperimentRunsPage` | Runs tab — all runs in an experiment with ag-grid table |
| `RunPage` | Details of one specific run |

### Data Shape

```typescript
// ExperimentEntity (frontend)
{
  experimentId: "123",
  name: "Perfect Chocolate Cake",
  lifecycleStage: "active",    // or "deleted"
  artifactLocation: "s3://...",
  creationTime: 1700000000000,
  lastUpdateTime: 1700003600000,
  tags: [{ key: "team", value: "nlp" }],
}

// RunEntity (frontend) — note the nested info/data structure
{
  info: {
    runUuid: "abc-def-456",
    experimentId: "123",
    runName: "dark-chocolate-attempt",
    status: "FINISHED",       // RUNNING, SCHEDULED, FAILED, KILLED
    startTime: 1700000000000,
    endTime: 1700003600000,
    artifactUri: "s3://bucket/path",
    lifecycleStage: "active",
  },
  data: {
    params: [{ key: "lr", value: "0.001" }],
    metrics: [{ key: "accuracy", value: 0.95, step: 10, timestamp: 1700000000000 }],
    tags: [{ key: "team", value: "nlp" }],
  },
}
```

---

::: details See Also
- [The Baker's Notebook](./parameters-metrics-tags) — every Run records params, metrics, and tags
- [The Museum Vault](./artifacts) — every Run stores its output files as artifacts
- [The Autopilot](./autologging) — autologging records Run data automatically
:::
