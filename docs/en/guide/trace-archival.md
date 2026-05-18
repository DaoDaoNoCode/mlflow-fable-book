---
outline: deep
---

# The Cold Storage

> **MLflow Concept:** Trace Archival *(coming soon)*

::: warning Coming Soon
Trace Archival is currently in the RFC stage ([RFC 0001](https://github.com/mlflow/rfcs/tree/main/rfcs/0001-trace-archival)). The concepts and data shapes described here are based on the approved design and may evolve during implementation.
:::

## The Story

After six months of operation, Detective Chen had a problem that success had created. Maya's cake business was thriving — hundreds of orders a day through Dr. Patel's counter, every one traced. The Ghent cocoa incident alone (Issue #23) had generated 47 detailed traces, each with nested spans full of megabyte-sized LLM inputs and outputs. Add Rosa's evaluation runs, Rodrigo's gateway routing logs, and the three AI agents' hourly monitoring — Chen's filing cabinets were overflowing. The database was expensive, and searches that used to take milliseconds now took seconds.

Chen proposed **cold storage**. Recent traces — anything from the last 30 days — stayed in the filing cabinet for fast access. These were the hot cases, the ones people queried daily. Older traces got boxed up and moved to a warehouse across town — object storage, cheap and vast, but a bit slower to retrieve. The key insight: the catalog card for each trace stayed in the cabinet. It recorded the trace ID, timestamps, status, tags, and key span-level details like type and duration. Only the bulky span content — the raw inputs and outputs — moved to the warehouse.

The system was transparent. When someone searched for traces, they searched the same catalog whether the data was hot or cold. Chen could still filter by span type, status, or duration on archived traces, because those columns never left the cabinet. The only thing that stopped working was searching inside the raw span content — that text was in the warehouse now, not the database.

Maya's experiment could set its own retention — keep traces for 90 days instead of the default 30, because her team referenced older runs more often. Priya's workspace could override the server default too. Every night, a quiet background job swept through the cabinet, checked the dates, and moved anything past its expiration to the warehouse. No human intervention needed.

"The cases don't disappear," Chen told Maya. "They just move to a cheaper shelf. And the index never forgets where they went."

## The Lesson

At scale, storing all Trace data in the tracking database becomes expensive. A single Trace contains a tree of Spans, and each Span carries potentially large JSON blobs — inputs, outputs, attributes, events. Multiply that by millions of traces and the database grows fast.

**Trace Archival** solves this by separating metadata from content:

- **Hot data** (recent traces): full Span content lives in the database. Queries are fast, all filters work, everything feels instant.
- **Cold data** (archived traces): lightweight metadata stays in the database (trace ID, timestamps, status, tags, span-level columns like type, duration, status), but the bulky Span content gets moved to cheaper **object storage** — S3, GCS, Azure Blob, or any configured store.

The archived Span data is stored in **OTLP protobuf format** (`TracesData`), the same format OpenTelemetry uses. This keeps it compact and standards-compliant.

**Retention policies** control when traces get archived:

- **Server level**: a global default (e.g., "archive traces older than 30 days")
- **Workspace level**: override for a specific Workspace
- **Experiment level**: override for a specific experiment (the science section keeping a 14-day policy)

Archival runs as a **periodic server-side job** — not triggered by user actions, just a background sweep.

**What still works on archived traces:**

- `search_traces` and `get_trace` return archived traces transparently — the API fetches from object storage instead of the database, but the caller doesn't need to know.
- Column-backed Span filters still work: you can filter by span type, status, and duration even on archived traces, because those columns remain in the database.

**What doesn't work:**

- JSON attribute search (searching inside the raw content of Span inputs/outputs) doesn't work on archived traces — that data is no longer in the database.

The `trace_archival_location` is configurable separately from artifact storage, so you can use a different bucket or storage tier for archived traces.

::: tip Key Takeaway
- **Hot traces** = recent, stored fully in the database, all queries work
- **Cold traces** = archived, metadata in DB, Span content in object storage
- **Retention policies** = configurable at server, Workspace, and experiment levels
- **Archival format** = OTLP protobuf (`TracesData`)
- **Transparent retrieval** = `search_traces` and `get_trace` work the same regardless
- **Filter limitation** = column-backed filters (type, status, duration) work; JSON attribute search does not
:::

## For Frontend Developers

The good news: trace archival is **largely transparent** to the UI. Archived traces appear in the same trace list and open in the same trace explorer. The API handles fetching from object storage behind the scenes.

The differences a user might notice:

- **Slightly slower load times** for very old traces — the API is fetching Span content from object storage rather than the database.
- **Experiment settings** may expose a retention configuration field where users can set how long traces stay "hot" for that experiment.
- **Search limitations** — if the UI supports free-text search inside Span inputs/outputs, that search won't match archived traces. The UI may need to communicate this boundary to users.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentTracesPage` | Traces tab — archived traces appear in the same list |
| `genai-traces-table` | No changes needed — data shape is the same |
| `model-trace-explorer` | Span detail loads from archive transparently (may be slightly slower) |
| Experiment settings (potential) | Trace retention policy configuration |

### Data Shape

No new frontend types are introduced. The existing `ModelTraceInfoV3` and `ModelTraceSpanV3` types remain unchanged — the archival layer is entirely server-side.

```typescript
// ModelTraceInfoV3 — unchanged
{
  trace_id: "tr-abc-123",
  request_time: "2024-11-15T10:00:00Z",
  execution_duration: "257ms",
  state: "OK",
  trace_metadata: { ... },
  tags: { ... },
  assessments: [...],
}

// ModelTraceSpanV3 — unchanged, regardless of hot or cold storage
{
  name: "call_llm",
  span_id: "span-456",
  parent_span_id: "span-123",
  start_time_unix_nano: "1700000000000000000",
  end_time_unix_nano: "1700000200000000000",
  status: { code: "STATUS_CODE_OK" },
  attributes: {
    "mlflow.spanInputs": { prompt: "What is MLflow?" },
    "mlflow.spanOutputs": { response: "MLflow is..." },
    "mlflow.spanType": "LLM",
  },
  events: [...],
}

// The only new configuration surface (server-side, possibly exposed in settings UI):
// Retention policy: { retention_days: 30, archival_location: "s3://my-bucket/traces/" }
```

::: info Why is this invisible to the frontend?
The archival system is designed to be a backend optimization, not a user-facing feature. The API contract doesn't change — `search_traces` returns the same shape whether traces are hot or cold. The only observable effect is latency. This is similar to how a CDN works: the user doesn't know if the content came from cache or origin, they just see the result.
:::

---

::: info See Also
- [The Detective's Thread](./tracing-and-spans) — archival manages the lifecycle of trace data
:::
