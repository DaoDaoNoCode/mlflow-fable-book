# The Apartment Building

> **MLflow Concept:** Workspaces

## The Story

Priya managed the building where Maya's team worked. It was a good building — one MLflow server, plenty of room — and for a while, one floor was enough. Maya's Team Alpha ran an experiment called "Best Chocolate Cake" for dark chocolate recipes. Team Beta, down the hall, also had an experiment called "Best Chocolate Cake" — theirs was for white chocolate. Different ingredients, different models, completely different products. Same name. Same floor. No walls between them.

One Monday morning, Priya opened Maya's experiment and saw twelve runs she didn't recognize. White chocolate parameters. Vanilla metrics nobody on Alpha had ever tracked. Thomas's color-coded notes were buried under Beta's entries, and the metrics charts looked like two different languages overlaid on one page. Someone on Beta had logged to the wrong experiment — the names were identical, and nothing had stopped it. Three days of contamination. One of Maya's weekly retraining jobs had already consumed two of Beta's runs. The model was compromised.

After the incident, Priya split the building into **workspaces** — separate floors in the same address. Team Alpha got their own floor. Team Beta got theirs. Both could still have an experiment called "Best Chocolate Cake," but the data would never cross. Every API request — from Thomas's parameter logs to Chen's traces — now carried a workspace header, `X-MLFLOW-WORKSPACE`, so the server knew which floor the data belonged to.

"The experiment names weren't the problem," Priya wrote in the postmortem. "The problem was that there was nothing stopping someone else's work from landing in Maya's kitchen. Workspaces aren't about organization. They're about boundaries."

## The Lesson

**Workspaces** provide multi-tenant isolation in MLflow. Each workspace is a logical boundary that separates experiments, runs, models, and other resources. This is essential in enterprise deployments where multiple teams share the same MLflow server but need data isolation.

::: tip Key Takeaway
- **Workspace** = a tenant boundary for data isolation, identified by **name** (not ID)
- Each workspace has its own experiments, runs, models, traces
- Same experiment name in different workspaces = completely different data
- Critical for enterprise deployments with multiple teams
:::

## For Frontend Developers

Workspace awareness is woven throughout the UI via two mechanisms:

1. **HTTP header**: `X-MLFLOW-WORKSPACE` is added to every API request by `FetchUtils.ts` (via `getActiveWorkspace()`)
2. **URL query parameter**: `?workspace=<name>` is added to navigation links by the `useNavigate()` wrapper

When workspaces are enabled (detected via `server-info` API), the root page shows a `WorkspaceLandingPage` (workspace selector). A `WorkspaceRouterSync` component manages the workspace context throughout the app.

| UI Pattern | How Workspaces Affect It |
|-----------|-------------------------|
| API requests | `X-MLFLOW-WORKSPACE` header set automatically by `FetchUtils.ts` |
| URL navigation | `?workspace=<name>` query param added by `useNavigate()` wrapper |
| Root page (`/`) | Shows workspace selector when workspaces are enabled |
| Sidebar | May show workspace context |

### Data Shape

```typescript
// Every API request includes the workspace as an HTTP header
// (set automatically by FetchUtils.ts via getActiveWorkspace())

GET /ajax-api/2.0/mlflow/experiments/search
Headers:
  X-MLFLOW-WORKSPACE: my-workspace-name

// URL routing uses query parameter
/#/experiments?workspace=my-workspace-name
```

::: warning For Frontend Developers
If you create a new API call that doesn't go through `FetchUtils`, it won't get the `X-MLFLOW-WORKSPACE` header, and the request will hit the wrong workspace (or fail). Always use the standard fetch utilities.
:::

---

::: details See Also
- [The Gatekeepers](./rbac) — RBAC controls access within and across workspaces
- [The Chef's Kitchen](./experiments-and-runs) — experiments are scoped to workspaces
:::
