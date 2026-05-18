# The Autopilot

> **MLflow Concept:** Autologging

## The Story

Nina was the newest member of Maya's team at the Elm Street bakery. She was fast, creative, and terrible at paperwork. Maya had shown her the journal, Thomas's three-color system, Lena's vault — the whole workflow. Nina nodded along, then promptly forgot to use any of it.

One Friday, Maya's boss gathered the team. "Nina's Run 47 — the cake with the high cocoa butter ratio — had the best taste score we've ever recorded. A 9.8. We need to reproduce it for the investor lunch next week." He turned to Nina. "What was the cocoa butter percentage? The oven temperature? The bake time?"

Nina froze. She'd logged the taste score because Maya had reminded her to, but the inputs? She hadn't written them down. She checked her notebook. Nothing in blue ink. She'd been experimenting quickly that day, tweaking ratios on the fly, and never picked up Thomas's blue pen. The best cake the team had ever produced, and she couldn't tell anyone how she'd made it.

After that humiliation, Nina discovered the Autopilot — a system that automatically recorded every parameter, metric, and artifact the moment a Run started. No manual logging needed. The Autopilot wrote in Thomas's three colors on its own — blue for inputs, red for results, green for labels — without anyone picking up a pen. It even filed a pointer to Lena's vault for each finished cake. Nina still did the baking. She still chose the recipes and the ratios. The Autopilot just handled the paperwork, silently and completely, so that no Run 47 would ever be a mystery again.

"I used to think logging was overhead," Nina told Maya. "Now I think *not* logging is sabotage."

## The Lesson

**Autologging** is MLflow's one-line automatic experiment tracking. When you call `mlflow.autolog()`, MLflow patches the training functions of 30+ ML frameworks so that every time you call `.fit()`, `.train()`, or similar, MLflow automatically logs:

- **Parameters** — hyperparameters like learning rate, number of epochs, batch size
- **Metrics** — training/validation metrics at each step (loss, accuracy, etc.)
- **Models** — the trained model artifact, saved in the appropriate Flavor
- **Artifacts** — additional files like feature importance plots, confusion matrices

Supported frameworks include: scikit-learn, PyTorch, TensorFlow/Keras, XGBoost, LightGBM, Transformers, Spark MLlib, Statsmodels, and many more.

You can still call manual `log_param()` and `log_metric()` alongside autologging — they complement each other. Autologging captures the standard stuff; manual logging captures domain-specific details.

::: tip Key Takeaway
- `mlflow.autolog()` = one line to automatically track params, metrics, models, and artifacts
- Patches 30+ frameworks (sklearn, pytorch, transformers, xgboost, etc.)
- No manual `log_param()` or `log_metric()` calls needed for standard training info
- You can mix autologging with manual logging
:::

::: info How It Works Under the Hood
Autologging uses Python monkey-patching. When you call `mlflow.autolog()`, MLflow wraps functions like `sklearn.base.BaseEstimator.fit` with instrumented versions that call `mlflow.log_param()`, `mlflow.log_metric()`, and `mlflow.log_model()` behind the scenes. The `mlflow.autologging` tag is set on the Run so you can tell it apart from manually logged runs.
:::

## For Frontend Developers

Autologged runs look identical to manually logged runs in the UI. They appear in the same Run table, with the same params, metrics, and artifacts. The only difference is a tag.

There is no special UI for autologging — the standard experiment and run pages handle everything. If you need to distinguish autologged runs, filter on the `mlflow.autologging` tag.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentRunsPage` | All runs — autologged and manual — in the same ag-grid table |
| `RunPage` | Run detail — params, metrics, artifacts all populated automatically |
| Run comparison views | Compare autologged runs side by side like any other runs |

### Data Shape

An autologged Run is structurally identical to a manual Run. The distinguishing marker is the `mlflow.autologging` tag:

```typescript
// An autologged Run — same RunEntity structure as any other run
{
  info: {
    runUuid: "auto-run-789",
    experimentId: "42",
    runName: "sklearn-autolog-1",
    status: "FINISHED",
    startTime: 1700000000000,
    endTime: 1700003600000,
    artifactUri: "s3://bucket/auto-run-789/artifacts",
    lifecycleStage: "active",
  },
  data: {
    params: [
      { key: "n_estimators", value: "100" },
      { key: "max_depth", value: "5" },
      { key: "learning_rate", value: "0.1" },
      // ... autologging captures ALL constructor params
    ],
    metrics: [
      { key: "training_score", value: 0.97, step: 0, timestamp: 1700000000000 },
      { key: "training_accuracy_score", value: 0.95, step: 0, timestamp: 1700000000000 },
    ],
    tags: [
      { key: "mlflow.autologging", value: "sklearn" },  // <-- the marker
      { key: "mlflow.source.type", value: "LOCAL" },
    ],
  },
}
```

---

::: details See Also
- [The Chef's Kitchen](./experiments-and-runs) — autologging creates Runs automatically
- [The Baker's Notebook](./parameters-metrics-tags) — autologging captures params and metrics without manual calls
:::
