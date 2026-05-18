# The Museum Vault

> **MLflow Concept:** Artifacts

## The Story

Lena ran a temperature-controlled vault next door to Maya's bakery on Elm Street. When Maya lost her famous Wednesday cake, the disaster was worse than just a missing recipe. The recipe was now safe in her journal — Thomas had helped organize that. But the *cake itself* was gone. The photos of the cross-section, the flavor profile chart she'd sketched, the sample she'd meant to save for the client dinner — all of it, thrown out with the evening trash.

That's when Lena stepped in. "Your journal records what you did and how it turned out," she told Maya. "But a recipe is not a cake. I'll store the real things." From then on, every Run in Maya's journal included a shelf number — a pointer to Lena's vault where the actual objects lived: the cake sample, the photos, the charts, the ingredient packaging labels.

Lena's vault held all kinds of things across its shelves — not just Maya's cakes, but files from everyone on Elm Street who needed to keep the real thing, not just a description of it. Each item was labeled with which experiment and which Run it belonged to. When Obi, the newest baker on Maya's team, later started logging every cake's details automatically, he always made sure to include a pointer to Lena's vault. Because a photo of a cake is not the cake itself.

## The Lesson

**Artifacts** are the actual files produced by or used in an ML run. Not numbers or labels — *files*. A trained model file, a dataset, a visualization chart, a configuration file, preprocessing code. They're stored separately from the metadata (parameters, metrics, tags) because they can be large — sometimes gigabytes.

Each Run has an **artifact URI** pointing to where its artifacts live (local filesystem, S3, Azure Blob Storage, etc.). The metadata database stores the *pointer*, not the file itself.

::: tip Key Takeaway
- **Artifacts** = actual files (models, data, charts, configs)
- Stored separately from metadata because they can be very large
- Each run has an **artifact URI** — a pointer to the storage location
- The database stores pointers, not the files
:::

## For Frontend Developers

The **Artifact Browser** in the Run detail page is Lena's vault. You're showing a file tree — folders and files the user can click into, preview (images, text, HTML), or download. When you render the artifact browser, you're fetching a directory listing from the artifact store and displaying it as an interactive tree.

| UI Component | What It Shows |
|-------------|--------------|
| `ArtifactPage` / `ArtifactView` | File tree browser for a run's artifacts |
| File preview panel | Renders images, text, HTML, or tables inline |
| Download button | Downloads the actual artifact file |

### Data Shape

```typescript
// Artifact listing — it's a file tree
{
  path: "model/weights.pkl",
  is_dir: false,
  file_size: 52428800  // 50 MB
}

// Run's artifact pointer
{
  run_id: "abc-def-456",
  artifact_uri: "s3://my-bucket/experiments/123/abc-def-456/artifacts"
}
```

::: info Why a separate store?
Imagine storing a 2GB model file in a SQL database alongside tiny strings like `learning_rate: "0.001"`. The database would collapse. That's why artifacts live in object storage (S3, Azure Blob, GCS, local filesystem) and the database only stores the URI pointer. Your UI fetches the directory listing via a separate API endpoint, not the same one that returns params/metrics.
:::

---

::: details See Also
- [The Chef's Kitchen](./experiments-and-runs) — artifacts are stored per Run
- [The Apprentice's Logbook](./logged-models) — model artifacts create LoggedModel records
:::
