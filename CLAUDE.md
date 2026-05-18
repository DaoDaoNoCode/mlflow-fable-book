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

## Chinese Writing: 信达雅 Three-Layer Rewriting Method

**CRITICAL: Never translate from English. Always rewrite from concept outlines.**

### Process (for each story)
1. **信 (faithful):** Extract ONLY the concept, characters, key story beats, and cross-references from the EN version. Do NOT read the English prose.
2. **达 (expressive):** Write the Chinese story from scratch using natural Chinese narrative patterns. Think in Chinese. Use Chinese storytelling rhythm.
3. **雅 (elegant):** Self-review and polish. Read it aloud in your head — does it sound like someone talking, or like a document?

### Mandatory Rules
- **短句为主** — keep clauses under 15 characters where possible. Break long sentences.
- **中文语序** — time/place comes first. 「周三下午，小梅在厨房里...」not「小梅在厨房里，在周三下午...」
- **口语化连接** — use 先说/接着/说到底/其实/结果/后来, NOT 首先/其次/然而/此外/因此/值得注意的是
- **动词驱动** — Chinese prefers verbs over nominalization.「她记下了配方」not「她对配方进行了记录」
- **省略主语** — Chinese naturally drops subjects when clear from context.「试了三次都失败了」not「她试了三次但她都失败了」
- **拟声/口头禅** — sprinkle in natural spoken markers:「嘿」「得了」「行吧」「这下好了」

### Banned Patterns (翻译腔 red flags)
- ❌ 然而 / 此外 / 不仅...而且 / 值得注意的是 / 通过...来 / 基于...的
- ❌ 它是一个... / 这是一种... (topic-comment, not 「是」sentences)
- ❌ Long attributive chains before nouns (English-style modifiers)
- ❌ 被 (passive) when active voice is natural
- ❌ Overuse of 的 in chains:「小梅的厨房里的桌子上的笔记本」→「小梅厨房桌上那本笔记」

### Quality Check
After writing, scan for these — if you find more than 2, rewrite:
- 然而 / 此外 / 因此 appearing as sentence openers
- Sentences longer than 30 characters without a comma
- 是...的 structure used more than twice in one paragraph
- 被 used where 把/让/给 or active voice works better

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
