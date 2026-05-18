# Credits & Acknowledgments

This book wouldn't exist without these open-source projects, tools, and communities.

## The Subject

| Project | Role | Link |
|---------|------|------|
| **MLflow** | The platform this entire book explains. Every concept, data shape, and component name comes from the MLflow codebase. | [github.com/mlflow/mlflow](https://github.com/mlflow/mlflow) |
| **MLflow RFCs** | The RFC repository provided the design documents for upcoming features (MCP Registry, Trace Archival, Span Links). | [github.com/mlflow/rfcs](https://github.com/mlflow/rfcs) |
| **MLflow Documentation** | The official docs were cross-referenced for accuracy throughout writing and review. | [mlflow.org/docs](https://mlflow.org/docs/latest/) |

## The Tools That Built This Site

| Tool | Role | Link |
|------|------|------|
| **VitePress** | The static site generator that powers this book — fast, Vue-powered, with built-in i18n, search, and dark mode. | [vitepress.dev](https://vitepress.dev/) |
| **Vue.js** | The framework underneath VitePress. The interactive Architecture Diagram, Data Flow Diagram, Reading Progress bar, and custom 404 page are all Vue components. | [vuejs.org](https://vuejs.org/) |
| **GitHub Pages** | Free hosting with automatic deployment via GitHub Actions. | [pages.github.com](https://pages.github.com/) |
| **GitHub Actions** | CI/CD pipeline that auto-builds and deploys on every push to `main`. | [github.com/features/actions](https://github.com/features/actions) |

## The AI That Helped Write It

| Tool | Role | Link |
|------|------|------|
| **Claude Code** | Anthropic's CLI tool. Wrote the fables, built the site, ran audits, managed the shared universe continuity, and handled the Chinese rewriting with the 信达雅 method. This entire project — from the first fable to the final deploy — was built in a single Claude Code session. | [claude.ai/code](https://claude.ai/code) |
| **Claude Auto-Memory** | Claude Code's persistent memory system. 15 memory files about the MLflow codebase (data model, frontend architecture, backend architecture, API surface, etc.) served as the ground truth for every fable's technical accuracy. | Built into Claude Code |

## The Knowledge Sources

| Tool | Role | Link |
|------|------|------|
| **Graphify** | Codebase knowledge graph tool that indexed the MLflow repo structure, helping understand code relationships and architecture. | [github.com/safishamsi/graphify](https://github.com/safishamsi/graphify) |
| **Claude Code Auto-Memory** | Persistent memory system that built 15 structured documentation files (data model, architecture, API surface, etc.) by analyzing the MLflow source code across sessions. These served as the ground truth for every fable's accuracy. | Built into Claude Code |

## The Techniques

| Technique | Where It Was Used |
|-----------|------------------|
| **信达雅 (Faithfulness, Expressiveness, Elegance)** | Three-layer Chinese rewriting method — understand the concept, write in natural Chinese from scratch, polish for readability. Inspired by [李继刚's Claude prompt](https://github.com/lijigang/write-prompt). |
| **Shared Universe Storytelling** | All 21 fables share one narrative world centered on Maya's chocolate cake, with characters referencing each other based on real MLflow entity relationships. |
| **Accuracy-First Fables** | Every cross-reference between fables maps to a real relationship in the MLflow data model. No connections were invented for narrative convenience. |

## Thank You

To the MLflow team for building a platform worth explaining. To the VitePress team for making documentation beautiful. And to everyone who reads these fables and understands MLflow a little better because of a chef named Maya and her chocolate cake.

---

*Built with love, fables, and a lot of cake metaphors.*
