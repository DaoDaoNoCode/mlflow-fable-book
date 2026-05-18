# Concept → UI Component Map

This table connects each MLflow concept to the actual UI components in the frontend codebase.

## Experiment Tracking

| Concept | What It Is | UI Component | Key Frontend Type |
|---------|-----------|--------------|-------------------|
| Experiment | A named project | `ExperimentListView`, `ExperimentPageTabs` | `ExperimentEntity { experimentId, name, lifecycleStage, tags }` |
| Run | One code execution | `ExperimentRunsPage` (ag-grid table), `RunPage` | `RunEntity { info: RunInfoEntity, data: { params, metrics, tags } }` |
| Parameter | An input config | Run table columns, RunPage details | `KeyValueEntity { key, value }` (both strings) |
| Metric | A numeric result | `RunViewMetricCharts` | `MetricEntity { key, value, step, timestamp }` |
| Tag | Metadata label | Tag editor, search filters | `KeyValueEntity { key, value }` |
| Artifact | A stored file | `ArtifactPage`, artifact viewer components | `{ path, is_dir, file_size }` |
| Autologging | Auto-tracked Run | Same as Run — appears in `ExperimentRunsPage` with `mlflow.autologging` tag | Standard `RunEntity` with autolog tags |

## Model Management

| Concept | What It Is | UI Component | Key Frontend Type |
|---------|-----------|--------------|-------------------|
| Flavor / pyfunc | Model packaging format | `RunPage` artifact tab (MLmodel file), LoggedModel cards | `model_type` field on `LoggedModelProto.info` |
| LoggedModel | Model record from log_model() | `ExperimentLoggedModelListPage`, `ExperimentLoggedModelDetailsPage` | `LoggedModelProto { info: { model_id, model_type, source_run_id, artifact_uri } }` |
| Registered Model | A named model in the catalog | `ModelListPage`, `ModelPage` / `ModelView` | `ModelEntity { name, aliases, latest_versions, tags }` |
| Model Version | One version of a model | `ModelVersionPage` / `ModelVersionView` | `ModelVersionInfoEntity { version, run_id, aliases, source }` |
| Model Serving | Deployed model API | No dedicated UI page — models deploy via CLI/SDK | Served via `mlflow models serve` → REST `/invocations` endpoint |

## LLM & GenAI

| Concept | What It Is | UI Component | Key Frontend Type |
|---------|-----------|--------------|-------------------|
| Trace | A recorded request journey | `ExperimentTracesPage`, `genai-traces-table` (shared) | `ModelTraceInfoV3 { trace_id, state, request_time, execution_duration }` |
| Span | One step in a trace | `model-trace-explorer` (shared module) | `ModelTraceSpanV3 { span_id, parent_span_id, name, attributes, status }` |
| Assessment | A judgment on a trace | Assessment components within trace explorer | `Assessment { assessment_id, assessment_name, source, trace_id }` |
| Prompt | A versioned LLM template | `PromptsPage`, `PromptsDetailsPage` | Prompt (name, description, tags) + PromptVersion (version, template, aliases) |
| AI Gateway Endpoint | A configured LLM proxy | `GatewayPage`, `EndpointPage`, `CreateEndpointPage` | `Endpoint { endpoint_id, name, model_mappings, routing_strategy }` |
| Dataset (Run-level) | Training data provenance | `RunPage` details | `Dataset { name, digest, source_type, source }` + `DatasetInput { tags, dataset }` |
| EvaluationDataset | Test case collection | `ExperimentEvaluationDatasetsPage` | `EvaluationDataset { dataset_id, name, tags, schema, digest }` (tags/schema/profile are JSON strings) |
| Evaluation | Systematic model testing | `ExperimentEvaluationRunsPage` | Results stored as metrics on evaluation Runs |
| Scorer | One evaluation judge | `ExperimentScorersPage` | `ScorerVersion { scorer_id, scorer_name }` |
| Issue | Quality problem pattern | `RunViewIssuesTab`, `IssueDetectionRunDetailsPage` | `Issue { issue_id, name, status, severity, categories, trace_count }` |

## Infrastructure

| Concept | What It Is | UI Component | Mechanism |
|---------|-----------|--------------|-----------|
| Workspace | Multi-tenant boundary | `WorkspaceLandingPage`, all data hooks | `X-MLFLOW-WORKSPACE` header + `?workspace=<name>` query param |
| RBAC | Access control | `AccountPage`, `AdminPage`, `RoleDetailPage`, `UserDetailPage` | `ajax-api/2.0/mlflow/users/` + `ajax-api/3.0/mlflow/roles/` |
| Webhook | Event automation | Settings → Webhooks (`/settings/webhooks`) | `ajax-api/2.0/mlflow/webhooks` CRUD + test |
| Project | Reproducible ML code | No dedicated UI — project runs appear as regular Runs | `mlflow.source.type` and related tags on Run |

## Coming Soon (RFCs)

| Concept | What It Is | UI Component (planned) | Key Type (from RFC) |
|---------|-----------|----------------------|---------------------|
| MCP Registry | Governed MCP server catalog | New MCP Servers page in GenAI sidebar + trace explorer tab | `MCPServer { name, status, aliases, access_bindings }` |
| Trace Archival | Tiered trace storage | Transparent — archived traces load from object storage | Configured via `trace_archival_location` on server/workspace |
| Span Links | Cross-trace span connections | New links section in span detail view | `ModelTraceSpanLink { trace_id, span_id, attributes }` |
