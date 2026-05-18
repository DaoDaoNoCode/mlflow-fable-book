# Glossary

Quick reference for every MLflow term, with the fable character that represents it.

## Experiment Tracking

| Term | Fable Character | One-Sentence Explanation |
|------|----------------|--------------------------|
| Experiment | Chef Maya's project | A named project grouping related Runs |
| Run | One of Maya's cake attempts | One code execution, recording params, metrics, and artifacts |
| Parameter | Thomas's blue ink | A configuration value set before a run (always a string) |
| Metric | Thomas's red ink | A numeric result from a run, can have step history |
| Tag | Thomas's green sticky note | Metadata label for filtering and organization |
| Artifact | Lena's vault objects | An actual file (model, data, chart) stored alongside a run |
| Autologging | Lena's autopilot | One-line automatic tracking — patches 30+ frameworks to log params, metrics, and models without manual calls |

## Model Management

| Term | Fable Character | One-Sentence Explanation |
|------|----------------|--------------------------|
| Flavor | Tomás's universal adapter | A convention for saving/loading models from a specific framework (sklearn, pytorch, etc.) |
| pyfunc | The universal plug | MLflow's framework-agnostic model interface — any model loads as pyfunc with `.predict()` |
| MLmodel file | The adapter's spec sheet | YAML manifest declaring which flavors a model supports |
| Model Signature | The input/output contract | Schema defining what data a model expects and returns |
| LoggedModel | An entry in Obi's logbook | A first-class entity created by `log_model()`, linking artifacts, metrics, and traces |
| model_type | The woodworking technique | The ML framework used (PyTorch, sklearn, etc.) — field on LoggedModel |
| Registered Model | A book in Ahmed's library | A named entry in the model catalog |
| Model Version | An edition of that book | One version of a registered model, linked to a Run |
| Alias | A label like `@champion` | A mutable named reference that points to a specific model version |
| Lineage | Tracing a book back to the scholar's notes | The connection from a model version back to its Run |
| Model Serving | Dr. Patel's launchpad | Deploying a model as a REST API endpoint via `mlflow models serve` |
| Deployment Plugin | Different launchpads | Plugin system (`mlflow.deployments`) for deploying to SageMaker, Azure, Databricks, etc. |

## LLM & GenAI

| Term | Fable Character | One-Sentence Explanation |
|------|----------------|--------------------------|
| Trace | Detective Chen's red thread | The full recorded journey of one LLM request (V3 format) |
| Span | One event on Chen's corkboard | One step within a trace, with timing and attributes |
| Assessment | Chen's case notes | A judgment on a trace — Feedback, Expectation, or IssueReference |
| Prompt | Yara's letter template | A versioned, immutable template for instructing an LLM |
| Prompt Registry | Yara's template archive | System for versioning and deploying prompts with aliases |
| AI Gateway | The Harbor Master | A unified proxy for multiple LLM providers |
| Endpoint | A configured entry in the Gateway | An endpoint with model mappings, routing strategy, and guardrails |
| Dataset (Run-level) | Mika's ingredient record | Records which data was used to train a Run (provenance) |
| EvaluationDataset | Mika's standardized test ingredients | Organized collection of test cases for evaluation |
| DatasetRecord | One test ingredient set | A single test case with inputs, expected outputs, and tags |
| Evaluation | Rosa's cooking tournament | Systematic testing of a model across a dataset via evaluation Runs |
| Scorer | A tournament judge | A function that judges model output quality |
| Issue | The quality inspector's report | A systematic quality problem detected across traces — name, severity, categories, root causes |

## Infrastructure

| Term | Fable Character | One-Sentence Explanation |
|------|----------------|--------------------------|
| Workspace | A floor in Priya's apartment building | A tenant boundary for data isolation, identified by name |
| RBAC | Danny's gatekeepers | Role-based access control with READ/USE/EDIT/MANAGE permission levels |
| Role | A keycard template | A named collection of permissions that can be assigned to users |
| Webhook | A harbor signal flare | HTTP callback triggered when events occur in MLflow (entity + action) |
| WebhookEvent | What triggers the flare | Defines which entity and action fire the webhook |
| Project (MLproject) | Team London's blueprint | Standard format for packaging reproducible ML code with environment specs |

## Coming Soon (RFCs)

| Term | Fable Character | One-Sentence Explanation |
|------|----------------|--------------------------|
| MCP Server | A registered tool in Old Fang's shed | A governed entry in the MCP Registry, identified by reverse-DNS name |
| MCP Server Version | An immutable version of the tool | A snapshot of the server definition (`server_json`) with status lifecycle |
| MCP Access Binding | The approved endpoint address | An approved direct endpoint where a governed MCP server can be reached |
| Trace Archival | The library's cold warehouse | Moving old span data from database to cheaper object storage, keeping metadata searchable |
| Span Link | A handshake between agents | An OTel primitive connecting spans across different traces (not parent-child) |
