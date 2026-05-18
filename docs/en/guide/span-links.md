---
outline: deep
---

# The Handshake

> **MLflow Concept:** Span Links *(coming soon)*

::: warning Coming Soon
Span Links are currently in the RFC stage ([RFC 0003](https://github.com/mlflow/rfcs/tree/main/rfcs/0003-otel-spanlinks)). The concepts and data shapes described here are based on the approved design and may evolve during implementation.
:::

## The Story

Maya's kitchen now had three AI assistants working on the chocolate cake business, but they never worked at the same time.

**Agent A** — the trend monitor — ran every hour, scanning social media for cake trends and flavor preferences. Each hourly run was its own trace, its own investigation in Chen's filing system. On Tuesday morning, Agent A's trace #A-117 flagged a surge in demand for salted caramel.

**Agent B** — the summarizer — ran once a day, reading all of Agent A's hourly reports and condensing them into a single trend brief. Agent B wasn't Agent A's child — it didn't run inside Agent A's trace, and it couldn't be a nested span. It ran hours later in a completely separate trace. But its work depended on Agent A's output. So Agent B's summarization span included a **span link** — a handshake pointing back to Agent A's monitoring span in trace #A-117, with an attribute noting "specifically the market trends section."

**Agent C** — the newsletter publisher — ran weekly, picking up Agent B's summaries and composing Maya's customer newsletter. Agent C's publishing span linked back to Agent B's summary span, recording "I used this brief as my source material."

Each link was **one-directional**. Agent B pointed back to Agent A, but Agent A's span said nothing about Agent B — it didn't even know who would consume its output. The links could carry context: which section mattered, what relationship existed, why the connection was made.

Before span links existed, a customer complained that the newsletter featured a "salted caramel trend" that was already two weeks old. Chen investigated but hit a dead end — Agent C's trace showed it used a summary, but there was no way to trace *which* Agent B summary, or *which* Agent A scan it ultimately came from. The trail went cold at every trace boundary. With span links, Chen could now follow the chain across all three traces — A's monitoring, B's summary, C's newsletter — even though they ran hours or days apart. He found the bug in seconds: Agent B had used a stale cached summary instead of the latest scan.

"Parent-child spans are for things that happen inside each other," Chen explained. "Span links are for things that happen *because of* each other."

## The Lesson

In OpenTelemetry, a **Span Link** connects two spans that are related but aren't parent-child. Parent-child relationships model synchronous, nested operations — "this function called that function." But many real-world relationships don't fit that mold:

- An async multi-agent system where Agent A produces output in one Trace, and Agent B consumes it hours later in a completely different Trace.
- A batch processor that reads from a queue — each processed message links back to the span that enqueued it.
- A retry mechanism where the retry span links back to the original failed span.

MLflow now supports Span Links as a first-class concept. Each link contains:

- **`trace_id`** — the linked span's trace (Agent A's trace)
- **`span_id`** — the specific span being linked to (Agent A's "compile dossier" span)
- **`attributes`** — optional key-value pairs describing the relationship ("relationship": "input_source", "section": "market_trends")

Links are **unidirectional**. When Agent B links to Agent A's span, Agent A's span doesn't automatically link back. You know who consumed what, but the producer doesn't necessarily know its consumers.

Links are stored inside the span's existing `content` JSON blob — no new database column is needed.

**How to create links:**

- At span creation: pass a `links=` parameter to `start_span()` or `@mlflow.trace`
- After creation: call `span.add_link()` to append links to an existing span
- Works with all span creation methods — the decorator, the context manager, and the fluent API

::: tip Key Takeaway
- **Span Link** = a connection between two spans that aren't parent-child
- Contains `trace_id`, `span_id`, and optional `attributes`
- **Unidirectional** — A links to B, but B doesn't automatically link to A
- Essential for **async multi-agent** workflows, batch processing, retries
- Stored in the span's `content` blob — no schema migration needed
- Created via `links=` parameter or `span.add_link()`
:::

## For Frontend Developers

Span Links introduce a new piece of UI in the **span detail view** within `model-trace-explorer`. When a span has links, they're displayed alongside the existing inputs, outputs, and attributes.

Each link shows:

- **Trace ID** — with a navigation link when the linked trace is accessible (clicking it opens that trace)
- **Span ID** — identifying the specific span within the linked trace
- **Attributes** — key-value pairs rendered like other attribute displays

Links are read from the span's content, so no new API endpoint is needed — they come back as part of the existing span data.

| Component | What It Shows |
|-----------|--------------|
| `model-trace-explorer` | Span detail view now includes a "Links" section |
| Span detail panel | Each link shows trace ID (clickable), span ID, and attributes |
| Trace navigation | Clicking a link's trace ID navigates to that trace's detail view |

### Data Shape

```typescript
// Link — the core data structure (Python SDK)
// Link { trace_id: string, span_id: string, attributes?: Record<string, any> }

// ModelTraceSpanLink (frontend TypeScript type)
{
  trace_id: "tr-research-001",       // the linked span's trace
  span_id: "span-compile-dossier",   // the specific span being linked to
  attributes: {                       // optional metadata about the relationship
    "relationship": "input_source",
    "section": "market_trends",
  },
}

// Links appear inside the existing ModelTraceSpanV3 content:
// ModelTraceSpanV3.content.links: ModelTraceSpanLink[]

// Example: a span with two links
{
  name: "summarize_article",
  span_id: "span-editor-42",
  parent_span_id: null,
  // ... other span fields ...
  attributes: {
    "mlflow.spanType": "CHAIN",
    "mlflow.spanInputs": { ... },
    "mlflow.spanOutputs": { ... },
  },
  // Links are in the span content
  links: [
    {
      trace_id: "tr-research-001",
      span_id: "span-compile-dossier",
      attributes: { "relationship": "input_source" },
    },
    {
      trace_id: "tr-review-055",
      span_id: "span-fact-check",
      attributes: { "relationship": "validation" },
    },
  ],
}
```

### How it relates to existing concepts

| Concept | Relationship |
|---------|-------------|
| **Tracing / Spans** | Links extend the span data model — a new field alongside inputs, outputs, attributes, and events |
| **Parent-child spans** | Parent-child = synchronous nesting within one trace. Links = cross-trace or non-hierarchical connections |
| **Assessments** | Assessments judge quality; links describe data flow and dependencies between spans |
| **Multi-agent workflows** | Links are the primary mechanism for connecting agent handoffs across traces |

::: info When would a user see links?
Links appear most often in multi-agent or async pipeline scenarios. If your application is a simple single-trace request-response flow, you probably won't see any links. They become valuable when you have multiple traces that form a larger workflow — one agent's output feeding another agent's input, retry chains, or fan-out/fan-in patterns. The UI should render them as navigable connections: "This span used output from [Trace tr-research-001 > Span compile-dossier]."
:::

---

::: info See Also
- [The Detective's Thread](./tracing-and-spans) — span links extend the tracing model for async multi-agent systems
:::
