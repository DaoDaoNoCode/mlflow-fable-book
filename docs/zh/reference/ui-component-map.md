# 概念 → UI 组件对照表

每个 MLflow 概念在前端代码里对应什么组件、什么数据结构，查这张表就行。

## 实验追踪

| 概念 | 一句话 | UI 组件 | 前端类型 |
|------|-------|--------|---------|
| 实验 | 一组 Run 的集合 | `ExperimentListView`, `ExperimentPageTabs` | `ExperimentEntity { experimentId, name, lifecycleStage, tags }` |
| Run | 一次代码执行 | `ExperimentRunsPage`（ag-grid 表格）, `RunPage` | `RunEntity { info: RunInfoEntity, data: { params, metrics, tags } }` |
| 参数 | 配置值 | Run 表格列, `RunPage` 详情 | `KeyValueEntity { key, value }`（都是字符串） |
| 指标 | 数值结果 | `RunViewMetricCharts` | `MetricEntity { key, value, step, timestamp }` |
| Tag | 额外元数据 | Tag 编辑器, 搜索过滤器 | `KeyValueEntity { key, value }` |
| Artifact | 产出文件 | `ArtifactPage`, Artifact 查看器组件 | `{ path, is_dir, file_size }` |
| Autologging | 自动追踪的 Run | 跟普通 Run 一样——出现在 `ExperimentRunsPage`，带 `mlflow.autologging` Tag | 标准 `RunEntity`，附加 autolog Tag |

## 模型管理

| 概念 | 一句话 | UI 组件 | 前端类型 |
|------|-------|--------|---------|
| Flavor / pyfunc | 模型打包格式 | `RunPage` Artifact 标签页（MLmodel 文件）, LoggedModel 卡片 | `LoggedModelProto.info` 上的 `model_type` 字段 |
| LoggedModel | `log_model()` 创建的模型记录 | `ExperimentLoggedModelListPage`, `ExperimentLoggedModelDetailsPage` | `LoggedModelProto { info: { model_id, model_type, source_run_id, artifact_uri } }` |
| Registered Model | 目录里的命名条目 | `ModelListPage`, `ModelPage` / `ModelView` | `ModelEntity { name, aliases, latest_versions, tags }` |
| Model Version | 某个模型的具体版本 | `ModelVersionPage` / `ModelVersionView` | `ModelVersionInfoEntity { version, run_id, aliases, source }` |
| Model Serving | 部署为 API 的模型 | 没有专门页面——走 CLI/SDK 部署 | `mlflow models serve` 提供 REST `/invocations` 端点 |

## LLM 与 GenAI

| 概念 | 一句话 | UI 组件 | 前端类型 |
|------|-------|--------|---------|
| Trace | 一次请求的完整旅程 | `ExperimentTracesPage`, `genai-traces-table`（共享模块） | `ModelTraceInfoV3 { trace_id, state, request_time, execution_duration }` |
| Span | 旅程里的一步 | `model-trace-explorer`（共享模块） | `ModelTraceSpanV3 { span_id, parent_span_id, name, attributes, status }` |
| Assessment | 质量判断 | Trace 探索器里的 Assessment 组件 | `Assessment { assessment_id, assessment_name, source, trace_id }` |
| Prompt | 版本化的大模型模板 | `PromptsPage`, `PromptsDetailsPage` | Prompt (name, description, tags) + PromptVersion (version, template, aliases) |
| AI Gateway Endpoint | 配好的 LLM 代理入口 | `GatewayPage`, `EndpointPage`, `CreateEndpointPage` | `Endpoint { endpoint_id, name, model_mappings, routing_strategy }` |
| Dataset（Run 级别） | 训练数据溯源 | `RunPage` 详情 | `Dataset { name, digest, source_type, source }` + `DatasetInput { tags, dataset }` |
| EvaluationDataset | 测试用例集合 | `ExperimentEvaluationDatasetsPage` | `EvaluationDataset { dataset_id, name, tags, schema, digest }`（tags/schema/profile 都是 JSON 字符串） |
| 评估 | 系统化地给模型打分 | `ExperimentEvaluationRunsPage` | 结果以指标形式存在评估 Run 上 |
| Scorer | 一个评委 | `ExperimentScorersPage` | `ScorerVersion { scorer_id, scorer_name }` |
| Issue | 质量问题模式 | `RunViewIssuesTab`, `IssueDetectionRunDetailsPage` | `Issue { issue_id, name, status, severity, categories, trace_count }` |

## 基础设施

| 概念 | 一句话 | UI 组件 | 机制 |
|------|-------|--------|------|
| Workspace | 多租户隔离边界 | `WorkspaceLandingPage`, 所有数据 hook | `X-MLFLOW-WORKSPACE` header + `?workspace=<name>` 查询参数 |
| RBAC | 访问控制 | `AccountPage`, `AdminPage`, `RoleDetailPage`, `UserDetailPage` | `ajax-api/2.0/mlflow/users/` + `ajax-api/3.0/mlflow/roles/` |
| Webhook | 事件自动化 | 设置 → Webhooks（`/settings/webhooks`） | `ajax-api/2.0/mlflow/webhooks` CRUD + 测试 |
| Project | 可复现的 ML 代码 | 没有专门页面——Project 跑出来的 Run 跟普通 Run 一样展示 | Run 上的 `mlflow.source.type` 等 Tag |

## 即将推出（RFC）

| 概念 | 一句话 | UI 组件（规划中） | 关键类型（来自 RFC） |
|------|-------|-----------------|-------------------|
| MCP Registry | 受管的 MCP Server 目录 | GenAI 侧边栏新增 MCP Servers 页面 + Trace 探索器新标签页 | `MCPServer { name, status, aliases, access_bindings }` |
| Trace Archival | 分层 Trace 存储 | 对用户透明——归档 Trace 从对象存储加载 | 服务器/Workspace 上配置 `trace_archival_location` |
| Span Links | 跨 Trace 的 Span 连接 | Span 详情视图新增连接区域 | `ModelTraceSpanLink { trace_id, span_id, attributes }` |
