---
outline: deep
---

# The Tool Shed Registry

> **MLflow Concept:** MCP Registry *(coming soon)*

::: warning Coming Soon
The MCP Registry is currently in the RFC stage ([RFC 0004](https://github.com/mlflow/rfcs/tree/main/rfcs/0004-mcp-registry)). The concepts and data shapes described here are based on the approved design and may evolve during implementation.
:::

## The Story

Old Fang ran the tool shed at the edge of town — the same town where Maya baked her cakes and Chen investigated traces. Fang provided specialized tools to Maya's AI assistants: web scrapers, database connectors, search APIs. When he upgraded his web-search tool from v1 to v2, half the town's AI agents adopted it immediately. Fang's tools were trusted.

But v2 had a flaw nobody caught in testing: it mangled Unicode characters in search results, corrupting any query involving non-English text. Within a week, three of Maya's assistants returned garbled ingredient recommendations. Rodrigo's gateway routed requests to the broken tool without knowing it. Nobody could tell which agents were using v1 and which had switched to v2. Some teams had modified their own copies — were those safe or dangerous?

After the crisis, the town council established the **Tool Shed Registry**. Every tool was registered with a name, a version, and a status. Each version was **immutable** — once submitted, it couldn't be modified, only replaced by a new version. Versions followed a lifecycle: Draft, Active, Deprecated, and Deleted. Fang's v2 was marked Deprecated. His v3 was Active. The registry introduced **aliases**: `@production` pointed to v3, so every agent referencing `@production` automatically got the right version. Access bindings controlled where each tool could be reached — approved endpoints, verified and governed.

When Chen traced a request that used one of Fang's tools, the trace linked back to the exact registered version — no ambiguity about which copy was involved. "I could have built a better v2," Fang admitted. "But I couldn't have built a better distribution system. That's what the registry is for."

## The Concept

**MCP (Model Context Protocol)** is an open standard that lets AI agents use external tools — search the web, query databases, call APIs, read files. An MCP server is a program that provides one or more tools that agents can call.

The **MCP Registry** in MLflow is a governed, versioned catalog for these MCP server definitions. It's the system of record for:

- **What MCP servers exist** and what state they're in (draft, active, deprecated)
- **Version history** as server definitions evolve
- **Aliases** like `@production` or `@staging` for stable resolution
- **Access bindings** — approved direct endpoints where governed servers can be reached
- **Tool discovery** — what tools each server provides, searchable by name
- **Trace linking** — connecting traces back to the governed MCP server version that handled them

The registry is the **control plane** — it stores metadata and governance. It's distinct from a future MCP Gateway (the **data plane**) that would handle live traffic, authentication, and routing.

::: tip Key Takeaway
- **MCP Server** = a registered tool provider (e.g., "brave-search"), identified by reverse-DNS name
- **MCP Server Version** = an immutable snapshot of the server definition (`server_json`), with status lifecycle
- **Alias** = mutable pointer (e.g., `@production`) to a specific version — same pattern as Model Registry and Prompt Registry
- **Access Binding** = an approved direct endpoint where a governed server can be reached
- **Status lifecycle** = Draft → Active → Deprecated → Deleted (soft)
:::

## For Frontend Developers

The MCP Registry introduces a **new top-level page** in the GenAI workflow sidebar (alongside Experiments, Prompts, and AI Gateway). It also adds an **MCP Servers tab** in the trace explorer.

The page has two views over the same governed data:
1. **Registry listing** — all governed MCP servers with status, versions, tags
2. **Access binding listing** — approved direct endpoints currently available in the workspace

| Component | What It Shows |
|-----------|--------------|
| MCP Servers page (new) | Card/table listing of all registered MCP servers |
| MCP Server detail page (new) | Versions, aliases, access bindings, tags, tools |
| MCP Server version detail (new) | `server_json` payload, status, aliases, tools list |
| MCP Servers tab in trace explorer (new) | Linked MCP servers for a trace, with navigation to detail |

### Data Shape

Based on the RFC design:

```typescript
// MCPServer — the governed catalog entry
{
  name: "io.github.anthropic/brave-search",  // reverse-DNS, immutable
  display_name: "Brave Search",               // mutable; falls back to server_json["title"], then name
  description: "MCP server for ...",           // mutable; falls back to server_json["description"]
  icons: [{ src: "https://...", sizes: "64x64" }],  // sized icon variants (upstream schema)
  status: "active",                            // read-only; derived from latest version's status
  tags: { "team": "platform" },
  aliases: { "production": "1.0.0" },          // alias → version mappings
  access_bindings: [...],                      // approved direct endpoints
  latest_version: "1.0.0",
}

// MCPServerVersion — immutable server definition
{
  name: "io.github.anthropic/brave-search",
  version: "1.0.0",                           // from server_json, immutable
  server_json: { ... },                        // full upstream MCP payload, immutable
  status: "active",                            // DRAFT | ACTIVE | DEPRECATED | DELETED
  tools: [                                     // declared tools, searchable by name
    {
      name: "web_search",
      description: "Search the web using Brave",
      inputSchema: { ... },
    }
  ],
  transport_types: ["stdio", "streamable-http"],  // read-only; extracted from server_json
  aliases: ["production"],                     // aliases pointing at this version
  tags: { ... },
}

// MCPAccessBinding — approved direct endpoint
{
  binding_id: 1,
  server_name: "io.github.anthropic/brave-search",
  server_alias: "production",                  // targets alias (or server_version)
  endpoint_url: "https://mcp.acme.internal/brave-search",
  transport_type: "streamable-http",           // or "sse"
}
```

### How it relates to existing concepts

| Concept | Relationship |
|---------|-------------|
| **AI Gateway** | Registry is the catalog (control plane); a future MCP Gateway would be the traffic layer (data plane) resolving against registry identities |
| **Tracing** | Traces can be linked to governed MCP server versions via `link_mcp_server_versions_to_trace()` |
| **Prompt Registry** | Same alias pattern (`@production`), same immutability model — but for tool definitions instead of prompt templates |
| **Model Registry** | Same alias-based resolution pattern — governed identities with version history |
| **Workspace** | MCP servers are scoped to workspaces, same as everything else |

---

::: details See Also
- [The Harbor Master](./ai-gateway) — a future MCP Gateway builds on the same Gateway infrastructure
- [The Detective's Thread](./tracing-and-spans) — MCP server versions can be linked to traces
:::
