# Fables Sync Status

Last synced against the MLflow source code and official documentation.

| Field | Value |
|-------|-------|
| **MLflow Version** | v3.12.0 |
| **MLflow Commit** | `2a178a046` (HEAD as of 2026-05-17) |
| **Review Date** | 2026-05-17 |
| **Reviewer** | Claude Code + Juntao |

## What Was Covered

- All 10 fables created and reviewed against official MLflow docs
- Terminology updated to three-tier system (EN direct / CN natural / first-mention)
- Chinese rewritten as native prose (not translation)
- Corrections applied from official docs:
  - LoggedModel: updated to MLflow 3 first-class entity (links traces, evals, artifacts)
  - Model Registry: alias-based workflow (`@champion`) emphasized over old lifecycle stages
  - Prompt Registry: immutability added (versions can't be modified once created)
  - AI Gateway: guardrails, passthrough endpoints, traffic splitting, dynamic config, centralized API key management
  - Tracing: OpenTelemetry compatibility, framework integrations, LLM judges from UI

## Sources Consulted

- MLflow CHANGELOG.md (v3.12.0)
- https://mlflow.org/docs/latest/genai/tracing/
- https://mlflow.org/docs/latest/genai/prompt-registry/
- https://mlflow.org/docs/latest/ml/model-registry/
- https://mlflow.org/docs/latest/genai/governance/ai-gateway/
- https://mlflow.org/releases/3
