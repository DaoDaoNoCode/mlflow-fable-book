# The Royal Library

> **MLflow Concept:** Model Registry

## The Story

**Ahmed** ran the Royal Library on the town's main street — the official catalog where Maya's best cakes became permanent, versioned entries. When Obi's logbook flagged a cake as exceptional, it got promoted here. Ahmed registered Maya's chocolate cake as "Chocolate Cake" and started assigning versions. Version 1 was good. Version 3, wrapped by Tomás, was better. The hospital cafeteria, the corner bakery, and the school lunch program all ordered version 3.

Then the school reported a problem. Version 3 had a proportioning error — too much baking soda for small servings. The corner bakery noticed the same issue. Ahmed fixed the recipe and produced version 5. But now the town had a terrifying problem: three customers, each with their own copy of version 3. How do you tell them all to stop using it? Ahmed sent messages. The hospital switched. The bakery wasn't sure which version they had. The school never got the memo.

That's when Ahmed introduced **aliases**. Instead of telling every customer "use version 5," he created the `@champion` alias. From now on, every customer would simply order `@champion`. When version 7 was ready — after being tested by Rosa's judges in the evaluation tournament — Ahmed moved the alias. Every customer automatically received the new version. No announcements, no confusion. "The bad recipe was my fault," Ahmed said. "But not knowing who was using it? That was the real disaster. Now I just move one alias, and the whole town updates."

Before any cake earned `@champion`, it had to pass Rosa's evaluation. And once it did, Dr. Patel was the one who put it on the counter where customers could actually order it.

## The Lesson

The **Model Registry** is a central catalog providing lineage, versioning, aliasing, and tagging for production-ready models. A **Registered Model** is a named entry (like "fraud-detector"). Each has multiple **Model Versions**, and each version links back to the Run that created it.

**Aliases** like `@champion` are the modern way to manage deployment. They decouple model versions from the code that uses them — your production code references `@champion`, and you can update which version that points to without changing any code.

::: tip Key Takeaway
- **Registered Model** = a named entry in the catalog (e.g., "fraud-detector")
- **Model Version** = one edition, linked back to the Run that created it
- **Aliases** = mutable named references (e.g., `@champion`) that decouple versions from code
- **Lineage** = the connection back to the experiment and run
:::

## For Frontend Developers

The **Model Registry** is a separate section in the sidebar. The model list is searchable. Click into a model to see all versions with aliases and tags. Each version links back to the source Run.

| Component | What It Shows |
|-----------|--------------|
| `ModelListPage` | Searchable list of all registered models |
| `ModelPage` / `ModelView` | One model with all its versions, aliases, tags |
| `ModelVersionPage` / `ModelVersionView` | Details of one version (alias, source run, lineage) |
| `CompareModelVersionsPage` | Side-by-side version comparison |

### Data Shape

```typescript
// ModelEntity (frontend)
{
  name: "fraud-detector",
  description: "Detects fraudulent transactions",
  creation_timestamp: 1700000000000,
  last_updated_timestamp: 1700003600000,
  tags: [{ key: "team", value: "ml" }],
  latest_versions: [...],
  aliases: { "champion": "7", "challenger": "8" },
}

// ModelVersionInfoEntity (frontend)
{
  name: "fraud-detector",
  version: "7",
  creation_timestamp: 1700000000000,
  current_stage: "None",    // legacy field, aliases are preferred
  source: "runs:/abc-def-456/model",
  run_id: "abc-def-456",    // lineage to source run
  status: "READY",
  aliases: ["champion"],
  tags: [...],
}
```

---

::: info See Also
- [The Apprentice's Logbook](./logged-models) — registered model versions link back to LoggedModels
- [The Launchpad](./model-serving) — registered models are deployed to production
- [The Judge's Tournament](./evaluation-and-scorers) — models are evaluated before promotion
:::
