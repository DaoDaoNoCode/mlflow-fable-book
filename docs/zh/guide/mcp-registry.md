---
outline: deep
---

# 工具棚的登记处

> **对应概念：** MCP Registry *(即将推出)*

::: warning 即将推出
MCP Registry 目前处于 RFC 阶段（[RFC 0004](https://github.com/mlflow/rfcs/tree/main/rfcs/0004-mcp-registry)）。这里描述的概念和数据结构基于已批准的设计，实际实现时可能会有调整。
:::

## 故事

老方在镇子边上开了一间工具棚——就是小梅烤蛋糕、老陈查 Trace 的那个镇子。老方给小梅的 AI 助手们提供专用工具：网页爬虫、数据库连接器、搜索 API。他把网页搜索工具从 v1 升级到 v2 之后，镇上一半的 AI Agent 立刻跟着换了。老方的工具是公认的好。

但 v2 有个缺陷在测试中没被发现：它会把搜索结果里的 Unicode 字符搞乱，只要查询涉及非英文文本就会出错。一周之内，小梅的三个助手返回了乱码的原料推荐。罗德里戈的网关把请求路由到了这个坏掉的工具，自己都不知道。没人分得清哪些 Agent 还在用 v1，哪些已经切到了 v2。有些团队改过自己的副本——那些安全吗还是危险的？

危机过后，镇议会建立了**工具棚登记处**。每个工具都注册了名称、版本和状态。每个版本**不可修改**——提交之后只能用新版本替代，不能改。版本有生命周期：Draft、Active、Deprecated、Deleted。老方的 v2 被标为 Deprecated，v3 标为 Active。登记处还引入了 **Alias**：`@production` 指向 v3，所有引用 `@production` 的 Agent 自动拿到正确版本。Access Binding 控制着每个工具能从哪些端点访问——经过审批、验证和管控。

当老陈追踪一个用了老方工具的请求时，Trace 会关联到登记处里确切的版本——绝不会搞混到底用的是哪个副本。「我本来可以做出一个更好的 v2，」老方承认。「但我做不出一个更好的分发系统。登记处就是干这个的。」

## 概念解读

**MCP（Model Context Protocol）** 是一个开放标准，让 AI Agent 可以使用外部工具——搜索网页、查数据库、调 API、读文件。一个 MCP Server 就是一个提供工具的程序。

MLflow 的 **MCP Registry** 是一个统一管理的、带版本控制的 MCP Server 目录。它是以下这些事情的权威来源：

- **有哪些 MCP Server**，它们是什么状态（draft、active、deprecated）
- **版本历史**——随着定义的演进
- **Alias**——像 `@production`、`@staging` 这样的稳定引用
- **Access Binding**——已批准的直连端点
- **工具发现**——每个 Server 提供什么工具，支持按工具名搜索
- **Trace 关联**——把 Trace 连接回处理请求的那个 MCP Server 版本

Registry 是**控制面**——存储元数据和治理信息。将来会有 MCP Gateway（**数据面**）负责实际的流量路由和认证。

::: tip 一句话总结
- **MCP Server** = 注册的工具提供者（如"brave-search"），用反向域名格式命名
- **MCP Server Version** = Server 定义的不可变快照（`server_json`），有状态生命周期
- **Alias** = 可移动的命名引用（如 `@production`）——跟 Model Registry 和 Prompt Registry 同一个模式
- **Access Binding** = 一条已批准的直连端点记录
- **状态生命周期** = Draft → Active → Deprecated → Deleted（软删除）
:::

## 前端开发者参考

MCP Registry 会在 GenAI 工作流的侧边栏新增一个**顶级页面**（跟实验、Prompt、AI Gateway 并列）。还会在 Trace 探索器里新增一个 **MCP Servers 标签页**。

页面有两个视图，展示同一套受管数据：
1. **Registry 列表** — 所有受管的 MCP Server，带状态、版本、Tag
2. **Access Binding 列表** — 当前 Workspace 里已批准的直连端点

| 组件 | 对应什么 |
|------|---------|
| MCP Servers 页面（新增） | 所有注册 MCP Server 的卡片/表格列表 |
| MCP Server 详情页（新增） | 版本列表、Alias、Access Binding、Tag、工具 |
| MCP Server Version 详情（新增） | `server_json` 内容、状态、Alias、工具列表 |
| Trace 探索器中的 MCP Servers 标签页（新增） | 某条 Trace 关联的 MCP Server，可跳转到详情 |

### 数据长什么样

基于 RFC 设计：

```typescript
// MCPServer — 受管的目录条目
{
  name: "io.github.anthropic/brave-search",  // 反向域名格式，不可变
  display_name: "Brave Search",               // 可修改；依次回退到 server_json["title"]、name
  description: "MCP server for ...",           // 可修改；回退到 server_json["description"]
  icons: [{ src: "https://...", sizes: "64x64" }],  // 多尺寸图标（上游 schema 格式）
  status: "active",                            // 只读；从最新版本的状态派生
  tags: { "team": "platform" },
  aliases: { "production": "1.0.0" },          // Alias → 版本映射
  access_bindings: [...],                      // 已批准的直连端点
  latest_version: "1.0.0",
}

// MCPServerVersion — 不可变的 Server 定义
{
  name: "io.github.anthropic/brave-search",
  version: "1.0.0",                           // 来自 server_json，不可变
  server_json: { ... },                        // 完整的上游 MCP 定义，不可变
  status: "active",                            // DRAFT | ACTIVE | DEPRECATED | DELETED
  tools: [                                     // 声明的工具列表，可按 name 搜索
    {
      name: "web_search",
      description: "Search the web using Brave",
      inputSchema: { ... },
    }
  ],
  transport_types: ["stdio", "streamable-http"],  // 只读；从 server_json 提取
  aliases: ["production"],                     // 指向这个版本的 Alias
  tags: { ... },
}

// MCPAccessBinding — 已批准的直连端点
{
  binding_id: 1,
  server_name: "io.github.anthropic/brave-search",
  server_alias: "production",                  // 指向 Alias（或 server_version）
  endpoint_url: "https://mcp.acme.internal/brave-search",
  transport_type: "streamable-http",           // 或 "sse"
}
```

### 跟现有概念的关系

| 概念 | 关系 |
|------|------|
| **AI Gateway** | Registry 是目录（控制面），未来的 MCP Gateway 是流量层（数据面），基于 Registry 的身份做路由 |
| **Tracing** | Trace 可以通过 `link_mcp_server_versions_to_trace()` 关联到受管的 MCP Server 版本 |
| **Prompt Registry** | 同样的 Alias 模式（`@production`），同样的不可变设计——只是管的是工具定义而不是 Prompt 模板 |
| **Model Registry** | 同样的 Alias 解析模式——带版本历史的受管身份 |
| **Workspace** | MCP Server 跟其他所有东西一样，按 Workspace 隔离 |

---

::: details 相关寓言
- [港口调度员](./ai-gateway) — 未来的 MCP Gateway 基于 AI Gateway 基础设施构建
- [侦探的红线](./tracing-and-spans) — MCP Server 版本可以关联到 Trace
:::
