# The Apprentice's Logbook

> **MLflow Concept:** Logged Models

## The Story

**Obi** was the record-keeper in Maya's kitchen. He sat at a small desk by the door, and every time Maya finished a cake — every time she called `log_model()` — Obi opened his logbook and wrote a new entry. Not a quick scribble. A birth certificate.

"Maya, working in the Chocolate Cake experiment, Run 52, produced a cake using Tomás's sklearn adapter, stored in Lena's vault on shelf 7. Thomas logged 3 parameters and 2 metrics on this run." Every entry connected the cake back to everything: the experiment, the run, the artifacts, the flavor. Nothing existed in isolation in Obi's book.

Most entries stayed in the logbook — valuable records of what Maya had tried across dozens of runs, even when the cakes weren't worth promoting. But the really good ones? Maya would call `register_model()` and the cake would get sent over to Ahmed's Royal Library, where it became a **Model Version** — an official catalog entry with its own version number and aliases like `@champion`. The Model Version linked back to Obi's logbook entry via `model_id`, so the full lineage was never lost.

"Here's the difference," Obi explained to Nina one morning. "My logbook entry is created automatically the moment Maya finishes a cake — every cake gets one, good or bad. Ahmed's library entry is a deliberate promotion — someone decides *this* cake deserves to be official. My logbook is where cakes are born. Ahmed's library is where they become official. But without a birth certificate, nothing gets in."

## The Lesson

A **LoggedModel** is a first-class entity in MLflow 3, created when you call `log_model()`. It persists throughout the model's lifecycle — across runs and environments — and links together artifacts, metrics, parameters, and the code that produced the model.

When you set an active model context, subsequent Traces automatically link to that LoggedModel, connecting production observability back to the model that generated the responses.

Not every LoggedModel gets promoted to the Model Registry. The Registry is for models going to production. LoggedModels are the broader record of everything that was ever trained.

::: tip Key Takeaway
- **LoggedModel** = created by `log_model()`, links artifacts, metrics, params, and code
- Persists across the model's lifecycle — Traces can auto-associate with it
- **model_type** = the ML framework used (PyTorch, sklearn, transformers, etc.)
- Only production-worthy models get promoted to the Model Registry
:::

## For Frontend Developers

LoggedModels appear in the **Models tab** within an experiment — all models across runs in that experiment. Each LoggedModel has a detail page with artifact browsing and can be promoted to the Registry.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentLoggedModelListPage` | Models tab — all LoggedModels in an experiment |
| `ExperimentLoggedModelDetailsPage` | LoggedModel detail with artifacts and metadata |
| "Register Model" action | Promote a LoggedModel to the Model Registry |

### Data Shape

```typescript
// LoggedModelProto (frontend) — nested info/data structure
{
  info: {
    model_id: "lm-789",
    name: "my-classifier",
    experiment_id: "123",
    source_run_id: "abc-def-456",    // which Run produced this
    artifact_uri: "s3://bucket/path/model",
    model_type: "sklearn",           // the ML framework
    status: "LOGGED_MODEL_READY",
    creation_timestamp_ms: 1700000000000,
  },
  data: {
    params: [{ key: "n_estimators", value: "100" }],
    metrics: [{ key: "accuracy", value: 0.95 }],
  },
}
```

::: info What is "model_type"?
In the fable, Tomás's adapter type (sklearn, pytorch) describes which oven was used to bake the cake. In MLflow, `model_type` describes *which ML framework* was used to create the model — PyTorch, TensorFlow, scikit-learn, transformers, etc. This matters because each framework saves and loads models differently. The model type tells MLflow how to handle the model files.
:::

---

::: details See Also
- [The Universal Adapter](./flavors-and-packaging) — model_type reflects which flavor was used
- [The Royal Library](./model-registry) — LoggedModels can be promoted to the Model Registry
- [The Chef's Kitchen](./experiments-and-runs) — LoggedModels are created within Runs
:::
