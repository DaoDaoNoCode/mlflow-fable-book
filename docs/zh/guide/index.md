---
outline: deep
---

# MLflow 寓言书

> *二十一个小故事，把 MLflow 的核心概念讲明白。写给开发者、团队新人、以及所有想搞懂这个平台的人。*

## 写给谁看的

刚接触 MLflow？可能你是新来的开发者，可能你是想搞清楚平台在干嘛的产品经理，也可能你就是不满足于「能跑就行」、想真正吃透每个概念的工程师。

这本寓言书用日常小故事把 ML 概念讲清楚——碰代码之前先把思路理顺。

::: info 前端开发者专属
每篇寓言最后有一节「前端开发者参考」，把概念落到具体的 React 组件和数据结构上。做前端的同学重点看这节，其他人跳过也完全不影响。
:::

## 怎么读

每篇寓言分三段：

| 部分 | 讲什么 |
|------|--------|
| **故事** | 一个生活场景的比喻，帮你把概念「感觉」对 |
| **概念解读** | 用大白话说清楚这个概念在 ML 里到底是什么 |
| **前端开发者参考** | *（可选）* 对应哪个 React 组件、什么数据结构 |

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

寓言全部读完之后，去看 [全景：串起来的故事](./how-it-all-connects)，把所有概念之间的关系串一遍。

## 推荐阅读顺序

刚接触 MLflow？先走**核心链路**——跟着小梅的蛋糕，从厨房走到上线：

1. [大厨的厨房](./experiments-and-runs) — 一切从这里开始
2. [面包师的三色笔记](./parameters-metrics-tags) — 怎么记录做了什么
3. [博物馆的仓库](./artifacts) — 存放实际产出的文件
4. [匠人的出厂记录](./logged-models) — 模型的出生证明
5. [皇家图书馆](./model-registry) — 发布到正式目录

走完核心链路，按兴趣选方向：
- **想了解 LLM 应用？** → [侦探的红线](./tracing-and-spans) → [写信人的模板](./prompts) → [港口调度员](./ai-gateway)
- **想了解质量保障？** → [试菜间的食材单](./datasets) → [美食大赛的评委](./evaluation-and-scorers) → [质检员](./issues)
- **想了解基础设施？** → [公寓楼的楼层](./workspaces) → [门卫和钥匙](./rbac)

最后看收尾篇——把所有角色和概念串成完整的故事：

- [全景：串起来的故事](./how-it-all-connects) — 全镇叙事、架构图、完整的关系表

## 速查

- [术语表](/zh/reference/glossary) — 所有术语一览
- [概念 → UI 组件对照表](/zh/reference/ui-component-map) — 哪个概念对应代码里的哪个组件
