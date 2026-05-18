# The Judge's Tournament

> **MLflow Concept:** Evaluation & Scorers

## The Story

**Rosa** ran the tournament that decided which cake earned the `@champion` alias in Ahmed's registry. The rules were simple: every cake was tested against Mika's standardized ingredient kits, and a panel of judges scored it — each judge evaluating one dimension. Judge Flavor. Judge Texture. Judge Presentation. And one automated machine that never blinked: Judge Safety.

Maya entered her latest dark chocolate cake confident. Dr. Patel had been serving it for two weeks. Customers loved it. Detective Chen's traces showed clean execution — fast oven calls through Rodrigo's supply line, correct Yara templates, no errors. Maya had data. Maya had momentum. She walked into Rosa's tournament expecting a coronation.

Judge Flavor gave her a 9.4 — the highest score in the competition. Judge Texture: 8.9. Judge Presentation: 9.1. Maya was beaming. Then Judge Safety flagged her cake. Trace amounts of undeclared hazelnut allergens, transferred from a shared surface in the kitchen she hadn't thought to sanitize. Not a taste problem. Not a creativity problem. A problem Maya didn't know existed, caught by a judge she hadn't worried about.

Maya was stunned. She'd served that cake to hundreds of people through Dr. Patel's counter and nobody had noticed. But none of those customers were testing for allergens — they were eating. Rosa's tournament didn't just crown a winner; its systematic, multi-dimensional evaluation revealed blind spots that confidence alone could never catch. The evaluation results were logged as metrics on a special evaluation Run — Thomas would have recognized his red ink, the same metrics infrastructure he used to track Maya's training experiments, now measuring safety scores and allergen flags.

The results table told the full story: every cake, every judge's score, every dimension. Maya's chocolate cake scored highest on flavor in the entire competition. It also had the most serious safety flag. Both facts mattered. That's the difference between "I think it's good" and "here's exactly how good it is, on every axis that counts."

## The Lesson

**Evaluation** is the process of systematically testing an ML model (especially an LLM) against a dataset using multiple **Scorers**. A scorer is a function that takes model output and produces a score — it could be:
- A simple rule (does the output contain profanity? yes/no)
- A statistical metric (BLEU score, exact match)
- An LLM-as-judge (asking another LLM "rate this response's helpfulness 1-5")
- A human assessment

Evaluation results are stored as **metrics and artifacts on evaluation Runs** — they use the same Run infrastructure as regular training runs, just with specific tags to mark them as evaluation runs. This means results show up in the experiment's run table and can be compared like any other run.

::: tip Key Takeaway
- **Evaluation** = systematic testing of a model across a dataset
- **Scorer** = a function that judges one aspect of model output
- Scorers can be rules, statistics, other LLMs, or humans
- Results are stored as metrics and artifacts on evaluation Runs
:::

## For Frontend Developers

The **Evaluation Runs tab** within an experiment shows evaluation results. The **Judges (Scorers) tab** lets users manage and run scorers. Results appear as run metrics that can be compared in the standard run comparison views.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentEvaluationRunsPage` | Evaluation runs tab within an experiment |
| `ExperimentScorersPage` | Judges/Scorers tab — manage and run scorers |
| `ExperimentEvaluationDatasetsPage` | Datasets tab — manage evaluation datasets |
| Run comparison views | Compare evaluation metrics across runs |

### Data Shape

Evaluation uses the standard Run and Metric entities — no special "evaluation" type. An evaluation run is a regular Run tagged with evaluation metadata:

```typescript
// An evaluation Run looks like any other Run, but with specific tags:
{
  info: { runUuid: "eval-run-123", status: "FINISHED", ... },
  data: {
    tags: [
      { key: "mlflow.runSourceType", value: "EVALUATION" },
    ],
    metrics: [
      { key: "relevance/mean", value: 4.2 },
      { key: "safety/pass_rate", value: 0.95 },
    ],
    params: [...],
  },
}

// Scorer entity
{
  scorer_id: "sc-123",
  scorer_name: "relevance",
  scorer_version: 1,
  experiment_id: "123",
}
```

---

::: info See Also
- [The Test Kitchen](./datasets) — Scorers evaluate against standardized datasets
- [The Royal Library](./model-registry) — models are evaluated before promotion to Registry
- [The Detective's Thread](./tracing-and-spans) — Scorers can run directly on traces
:::
