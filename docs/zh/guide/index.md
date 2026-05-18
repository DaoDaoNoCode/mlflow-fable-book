---
outline: deep
---

# MLflow 寓言书

> *二十一个故事，帮你彻底搞懂 MLflow 的每一个核心概念。给开发者、团队、和所有刚接触这个平台的人。*

## 写给谁看的

你刚接触 MLflow——也许你是新加入团队的开发者，也许是想搞懂平台在干嘛的产品经理，也许是想深入理解而不只是「能用就行」的工程师。

这些寓言用日常故事解释每一个 ML 概念，让你在碰代码之前就把思路理清楚。

::: info 前端开发者专属
每个寓言最后有一节「前端开发者参考」，把概念对应到具体的 React 组件和数据结构。做前端的同学可以重点看，其他人跳过也不影响理解。
:::

## 怎么读

每个寓言分三个部分：

| 部分 | 讲什么 |
|------|--------|
| **故事** | 用生活中的场景打比方，让概念变得直觉化 |
| **概念解读** | 用简单的话解释这个概念在机器学习中到底是什么 |
| **前端开发者参考** | *（可选）* 这个概念对应哪个 React 组件、什么数据结构 |

## 寓言目录

### 实验追踪

| 寓言 | 对应概念 |
|------|---------|
| [大厨的厨房](./experiments-and-runs) | 实验与 Run |
| [面包师的三色笔记](./parameters-metrics-tags) | 参数、指标、Tag |
| [博物馆的仓库](./artifacts) | Artifact |
| [自动驾驶仪](./autologging) | Autologging |

### 模型管理

| 寓言 | 对应概念 |
|------|---------|
| [万能转换头](./flavors-and-packaging) | Model Flavor 与打包 |
| [匠人的出厂记录](./logged-models) | LoggedModel |
| [皇家图书馆](./model-registry) | Model Registry |
| [发射台](./model-serving) | 模型服务与部署 |

### LLM 与 GenAI

| 寓言 | 对应概念 |
|------|---------|
| [侦探的红线](./tracing-and-spans) | Trace 与 Span |
| [写信人的模板](./prompts) | Prompt Registry |
| [港口调度员](./ai-gateway) | AI Gateway |
| [试菜间的食材单](./datasets) | 数据集管理 |
| [美食大赛的评委](./evaluation-and-scorers) | 评估与 Scorer |
| [质检员](./issues) | Issue 与质量监控 |

### 基础设施

| 寓言 | 对应概念 |
|------|---------|
| [公寓楼的楼层](./workspaces) | Workspace |
| [门卫和钥匙](./rbac) | RBAC 与权限 |
| [信号弹](./webhooks) | Webhook 与自动化 |
| [施工蓝图](./projects) | Projects |

### 即将推出（RFC）

| 寓言 | 对应概念 | RFC |
|------|---------|-----|
| [工具棚的登记处](./mcp-registry) | MCP Registry | [RFC 0004](https://github.com/mlflow/rfcs/tree/main/rfcs/0004-mcp-registry) |
| [冷库](./trace-archival) | Trace Archival | [RFC 0001](https://github.com/mlflow/rfcs/tree/main/rfcs/0001-trace-archival) |
| [握手](./span-links) | Span Links | [RFC 0003](https://github.com/mlflow/rfcs/tree/main/rfcs/0003-otel-spanlinks) |

全部寓言读完后，去看[全景：串起来的故事](./how-it-all-connects)了解概念之间的关系。

## 推荐阅读顺序

刚接触 MLflow？从**核心链路**开始——跟着小梅的蛋糕从厨房走到生产：

1. [大厨的厨房](./experiments-and-runs) — 一切的起点
2. [面包师的三色笔记](./parameters-metrics-tags) — 怎么记录做了什么
3. [博物馆的仓库](./artifacts) — 存放实际文件
4. [匠人的出厂记录](./logged-models) — 模型的出生证明
5. [皇家图书馆](./model-registry) — 发布到正式目录

然后按兴趣分支阅读：
- **想了解 LLM 应用？** → [侦探的红线](./tracing-and-spans) → [写信人的模板](./prompts) → [港口调度员](./ai-gateway)
- **想了解质量保障？** → [试菜间的食材单](./datasets) → [美食大赛的评委](./evaluation-and-scorers) → [质检员](./issues)
- **想了解基础设施？** → [公寓楼的楼层](./workspaces) → [门卫和钥匙](./rbac)

## 速查

- [术语表](/zh/reference/glossary) — 所有术语一览
- [概念 → UI 组件对照表](/zh/reference/ui-component-map) — 哪个概念对应你代码里的哪个组件
