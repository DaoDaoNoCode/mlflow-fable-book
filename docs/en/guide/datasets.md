# The Test Kitchen's Ingredient List

> **MLflow Concept:** Datasets

## The Story

**Mika** ran the test kitchen next door to Maya's bakery. Before any cake could be fairly judged in Rosa's tournament — the one that decided who earned `@champion` — it had to be tested against Mika's standardized ingredient kits. No shortcuts, not even for Maya.

The rule existed because of what happened on a Monday. Mika tested Maya's new dark chocolate recipe with high-grade Belgian cocoa from Rodrigo's preferred supplier. Rich, balanced, perfect. She declared it ready for Ahmed's library. On Tuesday, her sous chef Kai tested the same recipe with the budget cocoa from the backup supplier in Ghent. Thin, bitter, terrible. Kai walked into the kitchen and said, "Maya's recipe doesn't work."

They argued for an hour — Mika insisting it was perfect, Kai insisting it was awful — before realizing they hadn't been testing the recipe at all. They'd been testing different ingredients. The recipe was identical; the inputs were not. Neither of them was wrong. Neither of them was right. They simply had no basis for comparison.

That argument taught Mika two things. First: if you want to know which recipe is better, you need to use the *same* ingredients every time. She built twelve standardized test kits — pre-measured ingredient sets that were exactly the same, down to the gram. Any cake tested against those kits could be fairly compared to any other. Second: she needed to record *which* ingredients Maya used during development. When Maya developed a recipe with Belgian cocoa, Mika logged that provenance — not the cocoa itself, but a record of where it came from, so anyone could trace back and understand what produced the result.

"You can't judge a recipe," Mika told Kai, "if you don't control the ingredients." Rosa's judges — the ones who ran Maya's tournament evaluations — used Mika's standardized kits to score every contestant. No kit, no score. That was the rule.

## The Lesson

MLflow has two distinct dataset concepts:

### 1. Run-level DatasetInput (Provenance)

When you train a model, you can log which dataset was used as input. This creates a `DatasetInput` record on the Run — a provenance trail showing "this Run was trained on *this* data." The dataset itself isn't stored in MLflow; just its metadata (name, digest/checksum, source location, schema). This lets you answer: "What data produced this model?"

### 2. EvaluationDataset (Testing)

For evaluation, MLflow provides organized collections of test cases. An `EvaluationDataset` contains `DatasetRecord` entries — each record has inputs (the test prompt or features), expected outputs (ground truth), and tags. Think of it as a structured test suite for your model.

When you run evaluation, Scorers process every record in the dataset and produce scores. The dataset's digest ensures you're always comparing models against the same test cases.

::: tip Key Takeaway
- **DatasetInput** (Run-level) = provenance — records which data trained a model
- **EvaluationDataset** = organized test cases with inputs, expected outputs, and tags
- **DatasetRecord** = one test case in an EvaluationDataset
- Datasets have digests (checksums) for reproducibility
:::

## For Frontend Developers

Run-level datasets appear in the Run detail page. EvaluationDatasets have their own tab within experiments, with full CRUD operations for managing datasets and individual records.

| Component | What It Shows |
|-----------|--------------|
| `RunPage` | Run detail — shows which datasets were used as inputs |
| `ExperimentEvaluationDatasetsPage` | Datasets tab within an experiment — CRUD for evaluation datasets |
| Dataset record management | Add, edit, delete individual test cases within a dataset |
| `ExperimentEvaluationRunsPage` | Evaluation results computed against datasets |

### Data Shape

```typescript
// Run-level Dataset (provenance)
// Dataset metadata logged with a run
{
  name: "training-data-v2",
  digest: "abc123def456",           // checksum for reproducibility
  source_type: "s3",
  source: "s3://bucket/training-data.parquet",
  schema: '{"columns": [...]}',
  profile: '{"num_rows": 50000}',
}

// DatasetInput — links a dataset to a run
{
  tags: [{ key: "context", value: "training" }],
  dataset: { /* Dataset object above */ },
}

// EvaluationDataset (testing) — tags/schema/profile are JSON strings
{
  dataset_id: "ds-456",
  name: "chatbot-test-suite-v3",
  tags: '{"domain": "customer-support"}',       // JSON string
  schema: '{"columns": ["question", "answer"]}', // JSON string
  profile: '{"num_rows": 200}',                  // JSON string
  digest: "xyz789",
}

// DatasetRecord — one test case. inputs/expectations/tags are JSON strings.
{
  dataset_record_id: "rec-001",
  dataset_id: "ds-456",
  inputs: '{"question": "How do I reset my password?"}',
  expectations: '{"answer": "Go to Settings > Security > Reset Password"}',
  tags: '{"difficulty": "easy", "category": "account"}',
  source: "manual",
  source_id: "human-annotator-1",
}
```

---

::: info See Also
- [The Judge's Tournament](./evaluation-and-scorers) — EvaluationDatasets are used by Scorers
- [The Chef's Kitchen](./experiments-and-runs) — DatasetInputs record which data trained a Run
:::
