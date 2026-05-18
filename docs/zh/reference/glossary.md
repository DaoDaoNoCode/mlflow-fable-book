# 术语表

所有 MLflow 核心术语速查，标注了对应的寓言角色和一句话解释。

## 实验追踪

| 术语 | 寓言角色 | 一句话解释 |
|------|---------|-----------|
| 实验 (Experiment) | 大厨小梅的项目 | 一组相关 Run 的集合，围绕同一个目标 |
| Run | 小梅的一次尝试 | 一次代码执行，记录参数、指标和 Artifact |
| 参数 (Parameter) | 老王的蓝色笔 | Run 开始前设好的配置值（始终是字符串） |
| 指标 (Metric) | 老王的红色笔 | 数值型的运行结果，可以按 step 记录历史 |
| Tag | 老王的绿色便利贴 | 额外的元数据标签，用来搜索和过滤 |
| Artifact | 小丽仓库里的实物 | Run 产出的文件（模型、数据、图表等），存在 Run 旁边 |
| Autologging | 小丽的自动驾驶仪 | 一行代码搞定自动追踪——自动 patch 30 多个框架，记录参数、指标和模型，不用手动写一行日志代码 |

## 模型管理

| 术语 | 寓言角色 | 一句话解释 |
|------|---------|-----------|
| Flavor | 老陶的万能转接头 | 一套保存和加载特定框架模型的约定（sklearn、pytorch 等） |
| pyfunc | 万能插头 | MLflow 的框架无关模型接口——任何模型都能以 pyfunc 形式加载，调用 `.predict()` |
| MLmodel 文件 | 转接头的规格说明 | YAML 清单，声明模型支持哪些 Flavor |
| Model Signature | 输入输出契约 | 定义模型接收什么数据、返回什么数据的 Schema |
| LoggedModel | 老毕写的出厂记录 | 调用 `log_model()` 时创建的一等公民实体，关联 Artifact、指标和 Trace |
| model_type | 木工使用的工艺 | 创建模型的 ML 框架（PyTorch、sklearn 等）——LoggedModel 上的字段 |
| Registered Model | 图书馆里的一本书 | Model Registry 中的一条命名记录 |
| Model Version | 那本书的某一版 | Registered Model 的一个具体版本，关联着产出它的 Run |
| Alias | `@champion` 标签 | 指向特定版本的可移动命名引用 |
| Lineage | 书追溯到学者的手稿 | 从模型版本追溯到产出它的 Run |
| Model Serving | 帕特尔博士的发射台 | 通过 `mlflow models serve` 把模型部署为 REST API |
| Deployment Plugin | 各种发射台 | 插件系统（`mlflow.deployments`），可部署到 SageMaker、Azure、Databricks 等 |

## LLM 与 GenAI

| 术语 | 寓言角色 | 一句话解释 |
|------|---------|-----------|
| Trace | 侦探老陈的红线 | 一个 LLM 请求的完整旅程记录（V3 格式） |
| Span | 红线上串的一个事件 | Trace 中的一个步骤，带有耗时和属性 |
| Assessment | 老陈贴的评语 | 对 Trace 质量的判断——Feedback、Expectation 或 IssueReference |
| Prompt | 小雅的信件模板 | 给大模型的版本化、不可变的模板指令 |
| Prompt Registry | 小雅的模板档案柜 | 管理 Prompt 版本和 Alias 的系统 |
| AI Gateway | 港口调度员 | 应用和多个 LLM 供应商之间的统一代理 |
| Endpoint | Gateway 上的一个配置入口 | 包含模型映射、路由策略和安全策略的 Endpoint |
| Dataset（Run 级别） | 小美的食材记录 | 记录哪个数据集用于训练一个 Run（数据溯源） |
| EvaluationDataset | 小美的标准化测试食材 | 组织好的测试用例集合，用于评估 |
| DatasetRecord | 一组测试食材 | 一条测试用例，包含输入、期望输出和 Tag |
| 评估 (Evaluation) | 美食大赛 | 通过评估 Run 在数据集上系统化地给模型打分 |
| Scorer | 大赛评委 | 从某个维度给模型输出质量打分的函数 |
| Issue | 质检员的报告 | 从 Trace 中检测到的系统性质量问题——包含名称、严重程度、分类和根因 |

## 基础设施

| 术语 | 寓言角色 | 一句话解释 |
|------|---------|-----------|
| Workspace | 公寓楼的一层 | 数据隔离的租户边界，通过名称标识 |
| RBAC | 小丹的守门人 | 基于角色的访问控制，权限分 READ/USE/EDIT/MANAGE 四级 |
| Role | 门禁卡模板 | 一组命名的权限集合，可以分配给用户 |
| Webhook | 港口的信号弹 | MLflow 中事件发生时触发的 HTTP 回调（实体 + 动作） |
| WebhookEvent | 触发信号弹的条件 | 定义哪个实体的哪个动作会触发 Webhook |
| Project (MLproject) | 伦敦团队的蓝图 | 打包可复现 ML 代码的标准格式，包含环境定义 |

## 即将推出（RFC）

| 术语 | 寓言角色 | 一句话解释 |
|------|---------|-----------|
| MCP Server | 老方工具棚里的一把注册工具 | MCP Registry 中的一条受管记录，用反向域名标识 |
| MCP Server Version | 工具的不可变版本 | 服务器定义（`server_json`）的快照，带状态生命周期 |
| MCP Access Binding | 审批通过的接入地址 | 一个经过批准的直连端点地址，受管 MCP Server 可以在此被访问 |
| Trace Archival | 图书馆的冷藏仓库 | 把旧的 Span 数据从数据库搬到更便宜的对象存储，元数据仍然可搜索 |
| Span Link | Agent 之间的握手 | OTel 原语，连接不同 Trace 中的 Span（非父子关系） |
