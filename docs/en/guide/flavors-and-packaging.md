# The Universal Adapter

> **MLflow Concept:** Model Flavors & Packaging

## The Story

Maya had finally done it. After dozens of runs in her kitchen — Thomas's colored notebooks filled with parameters, Lena's vault packed with artifact files, Nina's autopilot recording every detail — she'd perfected her chocolate cake. The best one yet. The cake was extraordinary.

Then the order came from across town: the hospital cafeteria wanted to serve Maya's cake, but their kitchen ran a completely different oven. Maya had baked with her PyTorch oven. The hospital used a Java oven. Her recipe was flawless, but it literally could not fit into their equipment. It was like shipping a European plug to an American outlet — the device works, but it can't connect.

That's when **Tomás**, the town's packaging engineer, stepped in. "You don't need to rebake the cake," he said. "You need an adapter." Tomás showed Maya the **Universal Adapter** — a standard wrapper called **pyfunc** that made any cake work in any oven. The cake underneath didn't change. It was still the same chocolate cake. But the adapter gave it a universal plug. The hospital's Java oven loaded it without a single modification.

Maya watched the hospital serve her cake that afternoon. "I almost spent a week converting recipes," she said. Tomás shrugged: "That's what the adapter is for. And when Obi logs your cake in his book, the `model_type` field will record which adapter I used — so anyone who reads the entry will know exactly how to load it."

## The Lesson

A **Flavor** is a convention for saving and loading models from a specific framework. When you call `mlflow.sklearn.log_model()`, MLflow saves the model in the sklearn flavor. When you call `mlflow.pytorch.log_model()`, it saves in the pytorch flavor. Each flavor knows the framework's serialization format.

Every saved model gets an **MLmodel** file — a YAML manifest that declares which flavors the model supports. A typical model supports at least two flavors: its native framework flavor and `python_function` (pyfunc).

**pyfunc** (`mlflow.pyfunc`) is the universal interface. Any model can be loaded as:

```python
model = mlflow.pyfunc.load_model("runs:/abc/model")
predictions = model.predict(data)
```

This works for sklearn, pytorch, transformers, xgboost — anything. That's the power of the universal adapter.

**Model signatures** define the expected input and output schemas — column names, types, shapes. They enable input validation at serving time and help the UI display what the model expects.

Built-in flavors include: `sklearn`, `pytorch`, `tensorflow`, `keras`, `transformers`, `xgboost`, `lightgbm`, `onnx`, `spark`, `langchain`, `openai`, `sentence_transformers`, and more. You can also create **custom flavors** by subclassing `mlflow.pyfunc.PythonModel`.

::: tip Key Takeaway
- **Flavor** = a convention for saving/loading models from a specific framework
- **pyfunc** = the universal interface — load any model, get `.predict()`
- **MLmodel file** = YAML manifest listing which flavors a model supports
- **Model signature** = input/output schema for validation and documentation
:::

::: info The MLmodel File
The MLmodel YAML file is stored alongside the model artifact. It looks like:
```yaml
flavors:
  python_function:
    loader_module: mlflow.sklearn
    python_version: 3.10.0
  sklearn:
    sklearn_version: 1.3.0
    serialization_format: cloudpickle
signature:
  inputs: '[{"name": "feature_1", "type": "double"}]'
  outputs: '[{"name": "prediction", "type": "long"}]'
```
:::

## For Frontend Developers

Flavors appear in the UI primarily through the **model type** field on LoggedModel and in the **Artifact browser** where you can inspect the MLmodel file.

| Component | What It Shows |
|-----------|--------------|
| `RunPage` artifacts tab | MLmodel YAML file viewable in the artifact browser |
| LoggedModel cards | `model_type` field shows the flavor (e.g., "sklearn", "pytorch") |
| Model version detail | Signature displayed — input/output column names and types |

### Data Shape

```typescript
// LoggedModelProto — nested info/data structure
{
  info: {
    model_id: "lm-abc-123",
    experiment_id: "42",
    source_run_id: "run-456",
    model_type: "sklearn",             // <-- the flavor
    artifact_uri: "runs:/run-456/model",
    creation_timestamp_ms: 1700000000000,
    status: "LOGGED_MODEL_READY",
  },
  data: {
    params: [...],
    metrics: [...],
  },
}

// Model signature — displayed on model detail pages
{
  inputs: [
    { name: "feature_1", type: "double" },
    { name: "feature_2", type: "string" },
  ],
  outputs: [
    { name: "prediction", type: "long" },
  ],
}
```

---

::: info See Also
- [The Apprentice's Logbook](./logged-models) — flavors determine the model_type on LoggedModels
- [The Launchpad](./model-serving) — pyfunc is the universal interface for serving any flavor
:::
