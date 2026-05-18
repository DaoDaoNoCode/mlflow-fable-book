# 致谢

这本书离不开这些开源项目、工具和社区。

## 写的是谁

| 项目 | 在这本书里的角色 | 链接 |
|------|--------------|------|
| **MLflow** | 这本书的主角。每一个概念、数据结构、组件名称都来自 MLflow 代码库。 | [github.com/mlflow/mlflow](https://github.com/mlflow/mlflow) |
| **MLflow RFCs** | RFC 仓库提供了即将推出功能的设计文档（MCP Registry、Trace Archival、Span Links）。 | [github.com/mlflow/rfcs](https://github.com/mlflow/rfcs) |
| **MLflow 官方文档** | 写作和审核过程中反复交叉验证的权威参考。 | [mlflow.org/docs](https://mlflow.org/docs/latest/) |

## 建站工具

| 工具 | 干了什么 | 链接 |
|------|---------|------|
| **VitePress** | 驱动这本书的静态站点生成器——快、基于 Vue、自带多语言切换、搜索和暗色模式。 | [vitepress.dev](https://vitepress.dev/) |
| **Vue.js** | VitePress 底下的框架。架构图、数据流图、阅读进度条、自定义 404 页面都是 Vue 组件。 | [vuejs.org](https://vuejs.org/) |
| **GitHub Pages** | 免费托管，通过 GitHub Actions 自动部署。 | [pages.github.com](https://pages.github.com/) |
| **GitHub Actions** | CI/CD 流水线，每次推送到 `main` 自动构建和部署。 | [github.com/features/actions](https://github.com/features/actions) |

## 帮忙写的 AI

| 工具 | 干了什么 | 链接 |
|------|---------|------|
| **Claude Code** | Anthropic 的命令行工具。写寓言、搭网站、跑审核、管理共享宇宙的连续性、用信达雅方法重写中文版。整个项目——从第一个寓言到最终部署——在一个 Claude Code 会话里完成。 | [claude.ai/code](https://claude.ai/code) |
| **Claude 自动记忆** | Claude Code 的持久化记忆系统。15 个关于 MLflow 代码库的记忆文件（数据模型、前端架构、后端架构、API 接口等）为每个寓言的技术准确性提供了事实基础。 | Claude Code 内置功能 |

## 知识来源

保证准确性的记忆文件，由 Claude Code 在多次会话中分析 MLflow 源代码生成：

| 记忆文件 | 提供了什么 |
|---------|-----------|
| `data-model.md` | MLflow 全部实体，5 层表示（protobuf → SQLAlchemy → Python → REST → TypeScript）的字段和关系 |
| `frontend-architecture.md` | React/TypeScript SPA 结构、路由、状态管理、API 层 |
| `frontend-page-inventory.md` | 前端每一条路由、组件、页面 ID 和 API 端点 |
| `backend-architecture.md` | 9 个子系统、Store 接口、插件系统、服务器架构 |
| `backend-subsystem-relationships.md` | 子系统之间怎么连——共享 Store、数据流、集成点 |
| `end-to-end-flows.md` | 在实际源代码中追踪的完整数据流 |
| `rest-api-surface.md` | 约 198 个 REST API 端点的方法、路径和操作 |
| `frontend-patterns.md` | i18n、特性开关、表单、错误处理、RBAC、暗色模式等模式 |
| `testing-architecture.md` | 测试组织、fixture、CI/CD 工作流 |
| `infrastructure-patterns.md` | 配置系统、数据库迁移、插件、CLI、错误处理 |

## 用到的方法

| 方法 | 用在哪里 |
|------|---------|
| **信达雅** | 中文重写的三层方法——先理解概念，再用地道中文从头写，最后打磨可读性。灵感来自[李继刚的 Claude prompt](https://github.com/lijigang/write-prompt)。 |
| **共享宇宙叙事** | 21 个寓言共享一个围绕小梅巧克力蛋糕展开的叙事世界，角色之间的引用全部基于 MLflow 真实的实体关系。 |
| **准确性优先** | 寓言之间的每一个交叉引用都对应 MLflow 数据模型中的真实关系。没有为了叙事效果而编造联系。 |

## 感谢

感谢 MLflow 团队构建了一个值得被讲述的平台。感谢 VitePress 团队让文档变得好看。感谢每一个读了这些寓言、因为一个叫小梅的厨师和她的巧克力蛋糕而更好地理解了 MLflow 的人。

---

*用爱、寓言和大量蛋糕比喻构建。*
