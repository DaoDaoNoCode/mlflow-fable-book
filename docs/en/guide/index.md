---
outline: deep
---

# The MLflow Fable Book

> *Twenty-one stories that explain every core concept in MLflow. For developers, teams, and anyone new to the platform.*

## Who This Is For

You're new to MLflow — maybe you're a developer joining the team, a PM trying to understand the platform, or an engineer who wants to go beyond "it just works" and truly get what each concept means.

These fables map every ML concept to an everyday story so the ideas click before you ever touch the code.

::: info For Frontend Developers
Each fable has a bonus section at the bottom mapping the concept to specific React components and data shapes. If you're a UI developer, that section is your bridge from "I understand the concept" to "I know what to render." Everyone else can skip it.
:::

## How To Read

Each fable has three sections:

| Section | What It Tells You |
|---------|-------------------|
| **The Story** | An everyday analogy that makes the concept click |
| **The Lesson** | What the concept actually means in ML terms |
| **For Frontend Devs** | *(Optional)* Which React components and data shapes this maps to |

## The Fables

### Experiment Tracking

| Fable | Concept |
|-------|---------|
| [The Chef's Kitchen](./experiments-and-runs) | Experiments & Runs |
| [The Baker's Notebook](./parameters-metrics-tags) | Parameters, Metrics & Tags |
| [The Museum Vault](./artifacts) | Artifacts |
| [The Autopilot](./autologging) | Autologging |

### Model Management

| Fable | Concept |
|-------|---------|
| [The Universal Adapter](./flavors-and-packaging) | Model Flavors & Packaging |
| [The Apprentice's Logbook](./logged-models) | LoggedModel |
| [The Royal Library](./model-registry) | Model Registry |
| [The Launchpad](./model-serving) | Model Serving & Deployments |

### LLM & GenAI

| Fable | Concept |
|-------|---------|
| [The Detective's Thread](./tracing-and-spans) | Tracing & Spans |
| [The Poet's Drafts](./prompts) | Prompt Registry |
| [The Harbor Master](./ai-gateway) | AI Gateway |
| [The Test Kitchen](./datasets) | Datasets & Data Management |
| [The Judge's Tournament](./evaluation-and-scorers) | Evaluation & Scorers |
| [The Quality Inspector](./issues) | Issues & Quality Monitoring |

### Infrastructure

| Fable | Concept |
|-------|---------|
| [The Apartment Building](./workspaces) | Workspaces |
| [The Gatekeepers](./rbac) | RBAC & Permissions |
| [The Signal Flares](./webhooks) | Webhooks & Automation |
| [The Blueprint](./projects) | Projects |

### Coming Soon (RFCs)

| Fable | Concept | RFC |
|-------|---------|-----|
| [The Tool Shed Registry](./mcp-registry) | MCP Registry | [RFC 0004](https://github.com/mlflow/rfcs/tree/main/rfcs/0004-mcp-registry) |
| [The Cold Storage](./trace-archival) | Trace Archival | [RFC 0001](https://github.com/mlflow/rfcs/tree/main/rfcs/0001-trace-archival) |
| [The Handshake](./span-links) | Span Links | [RFC 0003](https://github.com/mlflow/rfcs/tree/main/rfcs/0003-otel-spanlinks) |

After reading the fables, see [How It All Connects](./how-it-all-connects) for the big picture.

## Suggested Reading Order

New to MLflow? Start with the **core chain** — this is Maya's cake journey from kitchen to production:

1. [The Chef's Kitchen](./experiments-and-runs) — where it all begins
2. [The Baker's Notebook](./parameters-metrics-tags) — how to record what you did
3. [The Museum Vault](./artifacts) — storing the actual files
4. [The Apprentice's Logbook](./logged-models) — the model's birth certificate
5. [The Royal Library](./model-registry) — publishing to the catalog

Then branch into whichever area interests you:
- **Want to understand LLM apps?** → [The Detective's Thread](./tracing-and-spans) → [The Poet's Drafts](./prompts) → [The Harbor Master](./ai-gateway)
- **Want to understand quality?** → [The Test Kitchen](./datasets) → [The Judge's Tournament](./evaluation-and-scorers) → [The Quality Inspector](./issues)
- **Want to understand infrastructure?** → [The Apartment Building](./workspaces) → [The Gatekeepers](./rbac)

## Quick Reference

- [Glossary](/en/reference/glossary) — every term in one table
- [Concept → UI Component Map](/en/reference/ui-component-map) — which React component renders which concept
