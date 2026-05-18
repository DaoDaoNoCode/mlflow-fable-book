# The Baker's Notebook

> **MLflow Concept:** Parameters, Metrics & Tags

## The Story

Thomas ran the bookshop on Elm Street, right across from Maya's bakery. When Maya started her journal of chocolate cake experiments, she brought it to Thomas for help. The problem was obvious: her notes were a disaster. Ingredient amounts were scrawled next to taste scores, which were tangled up with reminders like "try this for the holiday menu." Thomas couldn't tell what she'd decided before baking from what she'd measured after.

So Thomas gave her three colored pens and a stack of sticky notes.

**Blue ink** was for choices made *before* baking — her Parameters. Cocoa ratio: 70/30 dark-to-milk. Oven temp: 325°F. Bake time: 28 minutes. These were inputs, locked in before the oven door closed.

**Red ink** was for results measured *after* — her Metrics. Moisture level: 8.2/10. Rise height: 4.1cm. Taste panel score: 9.0/10. Sometimes she measured at multiple points (internal temp at 10 min, 20 min, 30 min) — a *metric history* that showed how the cake evolved.

**Green sticky notes** were for labels — her Tags. "Wednesday's best." "Too dry — skip." "Holiday candidate." These didn't affect the recipe or the results; they were just bookmarks for finding things later.

Within a week Maya could flip to any Run in her journal and instantly see: what went in (blue), what came out (red), and how she'd categorized it (green). Rosa, who ran the town's annual bake-off, later adopted the same red-ink system so her judges could score contestants on a common scale.

## The Lesson

**Parameters** are configuration values set before a Run — learning rate, batch size, optimizer choice, model depth. Both keys and values are stored as strings. They're fixed for each Run.

**Metrics** are numeric outcomes — accuracy, loss, F1 score, latency. They answer "how good was this attempt?" They can be logged at multiple steps (like measuring accuracy after each training epoch), creating a history over time.

**Tags** are extra metadata for search and filtering — owner, dataset version, Git commit, environment. They help you organize and find Runs, but don't affect the ML process.

::: tip Key Takeaway
- **Parameters** = inputs (set before the run, never change, always strings)
- **Metrics** = outputs (numeric results, can have history over steps)
- **Tags** = labels (for organization and search, no effect on the ML process)
:::

## For Frontend Developers

Your Run table columns are exactly this: parameter columns (blue), metric columns (red), and tag columns (green). The **metric charts** show the red ink plotted over steps. The **search bar** lets users filter by any of these three types.

| Component | What It Shows |
|-----------|--------------|
| Run table columns (ag-grid) | Parameters, metrics, and tags as sortable columns |
| `RunViewMetricCharts` | Metric values plotted over steps (the "history") |
| Search/filter bar | Filter runs by parameter, metric, or tag values |
| Run detail panel | All params, metrics, and tags for one run |

### Data Shape

```typescript
// Parameter — simple key-value, both strings
{ key: "learning_rate", value: "0.001" }

// Metric — numeric, with step and millisecond timestamp for history
{ key: "accuracy", value: 0.95, step: 100, timestamp: 1700000000000 }

// Tag — simple key-value label
{ key: "team", value: "nlp" }
```

::: info Why are parameter values always strings?
In the fable, Thomas writes "12 hours" — it's text in a notebook. Parameters are stored as strings because they can be anything: numbers, paths, JSON configs, model names. The UI renders them as-is. Metrics, on the other hand, are always numeric — you need numbers to plot charts and compute comparisons.
:::

---

::: details See Also
- [The Chef's Kitchen](./experiments-and-runs) — params, metrics, and tags belong to Runs
- [The Judge's Tournament](./evaluation-and-scorers) — evaluation produces metrics on evaluation Runs
:::
