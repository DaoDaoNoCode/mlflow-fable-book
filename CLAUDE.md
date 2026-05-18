# MLflow Fables — Project Guide for Claude Code

## What This Is

A VitePress documentation site that explains MLflow core concepts through fables (stories with everyday analogies). Written for UI/frontend developers who build the MLflow interface but need to understand what they're building.

- **Live at:** `npm run dev` → http://localhost:5173/
- **Source MLflow repo:** `/Users/juntaowang/Desktop/ODH/mlflow`
- **Languages:** English (`docs/en/`) and Chinese (`docs/zh/`)
- **Framework:** VitePress with built-in i18n locale switcher

## Terminology Rules (Three-Tier System)

### Use English directly (nobody translates these in Chinese tech conversation)
> Run, Trace, Span, Artifact, Prompt, Scorer, Flavor, Tag, LoggedModel, Alias, Workspace

### Use Chinese (these have natural, widely-used equivalents)
> 实验 (Experiment), 参数 (Parameter), 指标 (Metric), 模型 (Model), 版本 (Version), 评估 (Evaluation), 网关 (Gateway), 路由 (Route)

### First-mention pattern
Introduce naturally on first use: "每次尝试叫做一个 Run". After that, just use the English term — no parentheses, no forced translation.

## Chinese Writing Style

- Write as if originally conceived in Chinese — NOT translated from English
- Use short clauses, natural sentence flow, no English-style long attributive chains
- Conversational but clear — like explaining to a colleague over coffee
- Introduce English terms once, then use them directly
- Section headers should be natural: 「概念解读」「对应到 UI」「数据长什么样」
- NEVER use translationese (翻译腔)

## Fable Structure

Every fable page has exactly three sections:

1. **故事 / The Story** — everyday analogy (chef, detective, poet, etc.)
2. **概念解读 / The Lesson** — what the concept actually is in ML terms
3. **对应到 UI / What You See in the UI** — which React components and data shapes this maps to

## Current Fables Inventory

| # | EN File | ZH File | Concept | Key MLflow Entities |
|---|---------|---------|---------|-------------------|
| 1 | `experiments-and-runs.md` | same | Experiments & Runs | Experiment, Run |
| 2 | `parameters-metrics-tags.md` | same | Params, Metrics, Tags | Parameter, Metric, Tag |
| 3 | `artifacts.md` | same | Artifacts | Artifact, artifact_uri, backend/artifact store |
| 4 | `model-registry.md` | same | Model Registry | RegisteredModel, ModelVersion, Alias (`@champion`) |
| 5 | `tracing-and-spans.md` | same | Tracing | Trace, Span, Assessment, span_type |
| 6 | `prompts.md` | same | Prompt Registry | Prompt, version, Alias, immutability |
| 7 | `ai-gateway.md` | same | AI Gateway | Route/Endpoint, rate limits, guardrails, passthrough |
| 8 | `evaluation-and-scorers.md` | same | Evaluation | Evaluation, Scorer, LLM-as-judge |
| 9 | `logged-models.md` | same | LoggedModel | LoggedModel, Flavor, log_model() |
| 10 | `workspaces.md` | same | Workspaces | Workspace, workspace_id |

Plus: `how-it-all-connects.md` (grand story + architecture diagram + data flow)

Reference pages: `reference/glossary.md`, `reference/ui-component-map.md`

## Update Workflow

When the user says **"update the fables"**, follow these steps:

### Step 1: Check sync status
Read `SYNC_STATUS.md` in this repo to find the last reviewed MLflow version and commit.

### Step 2: Find what changed
Read the MLflow `CHANGELOG.md` at `/Users/juntaowang/Desktop/ODH/mlflow/CHANGELOG.md`.
Find all entries between the last synced version and the current version.
Also check the MLflow releases page: https://mlflow.org/releases/

### Step 3: Categorize changes

| Change Type | Action |
|-------------|--------|
| New major concept/entity | Consider a new fable or expand existing one |
| Existing concept fundamentally changed | Update affected fable(s) |
| New UI page or major component restructure | Update UI component map |
| New API endpoint or data shape change | Update data shapes in affected fables |
| Bug fixes, minor improvements | Usually no update needed |

### Step 4: Update affected pages
- Update **both** EN and ZH versions
- Follow the terminology rules above
- Follow the Chinese writing style rules above
- Keep the three-section structure (Story / Lesson / UI)
- Update the glossary and UI component map if needed

### Step 5: Verify
```bash
npm run build   # must pass clean
npm run dev     # spot-check in browser
```

### Step 6: Bump sync status
Update `SYNC_STATUS.md` with:
- New MLflow version
- New commit hash
- Today's date
- Brief summary of what changed

## VitePress Notes

- `{{` in markdown conflicts with Vue templates — wrap in `<div v-pre>` or use `<code v-pre>`
- Config is at `docs/.vitepress/config.mts`
- Sidebar labels must be updated when fable titles change
- Build: `npm run build`, Dev: `npm run dev`, Preview: `npm run preview`
