# The Detective's Thread

> **MLflow Concept:** Tracing & Spans

## The Story

The day Maya's chocolate cake went live on Dr. Patel's launchpad, orders started pouring in. Customers placed requests through the counter — "one dark chocolate, extra ganache for Mrs. Alvarado" — and cakes appeared on the other side. Most of the time, everything worked. But on the third morning, a customer named Mr. Tanaka received a vanilla cake when he'd ordered chocolate. And nobody could explain why.

That's when the town hired **Detective Chen**.

Chen's job was simple in theory and enormous in practice: trace every order from the moment it arrived at Dr. Patel's counter to the moment the finished cake was handed over. He called each full investigation a **Trace** — one red thread pinned across his corkboard, representing one customer's complete journey. Each step along that thread was a **Span**: receive the order, look up the recipe template (written by Yara, the town's template specialist), send the ingredient request through the supply line (managed by Rodrigo, the town's procurement handler), fire up the oven, plate the cake. Spans nested inside each other — "prepare cake" contained "mix batter" and "bake," and "mix batter" itself contained "measure flour" and "melt chocolate." The tree structure made the sequence crystal clear.

When Chen pulled Mr. Tanaka's trace, the answer was obvious. The span for "call the oven" — the actual baking step — had taken 4,200 milliseconds instead of the usual 200. During that delay, the system had timed out and served a cached response: yesterday's vanilla. The oven call, routed by Rodrigo through a new supplier, was the bottleneck. The recipe instructions Chen found in the trace came from Yara's `@chocolate-classic` template — nothing wrong there. The failure was in the supplier call.

Chen also let anyone attach **assessments** to a trace. Mr. Tanaka left a thumbs-down. An automated freshness checker flagged the stale response. Maya's quality team added an expectation: "chocolate order should never return vanilla." Each assessment — Feedback, Expectation, or IssueReference — became part of the permanent record, turning every order into a lesson.

"I don't solve problems," Chen told Maya. "I make problems visible. After that, they solve themselves."

## The Lesson

**Tracing** is MLflow's observability system for LLM applications, compatible with OpenTelemetry. When a user asks an AI chatbot a question, many things happen behind the scenes: the prompt is constructed, an LLM is called (maybe multiple times), tools are invoked, results are combined, and a response is generated.

A **Trace** captures the entire request-response journey. Each step is a **Span** — one operation with a name, timing, inputs, outputs, and status. Spans nest in a tree: a parent span "answer_question" might contain child spans "retrieve_documents", "call_llm", and "format_response."

**Assessments** are human or automated judgments attached to traces — like a thumbs-up/thumbs-down from a user, or an automated quality score. Assessment types include Feedback, Expectation, and IssueReference.

::: tip Key Takeaway
- **Trace** = the full journey of one request through an LLM application
- **Span** = one step in that journey (with timing, inputs, outputs)
- Spans nest in a **tree** — parent spans contain child spans
- **Assessments** = quality judgments (Feedback, Expectation, or IssueReference) attached to traces
:::

## For Frontend Developers

The **Traces tab** within an experiment is Chen's case board — a list of all investigations. Click into one, and you see the **trace explorer** (a waterfall/timeline view showing parent-child nesting and timing). Each span expands to show its inputs, outputs, and attributes. Assessment indicators appear alongside traces.

This is one of the most interactive parts of the UI — lots of tree rendering, expand/collapse, and formatted JSON display.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentTracesPage` | Traces tab within an experiment |
| `genai-traces-table` (shared module) | Traces list with filtering and cell renderers |
| `model-trace-explorer` (shared module) | Trace detail: span tree, timeline, inputs/outputs |
| Assessment indicators | Thumbs up/down, quality scores |

### Data Shape

```typescript
// ModelTraceInfoV3 (frontend)
{
  trace_id: "tr-abc-123",
  request_time: "2024-11-15T10:00:00Z",  // ISO timestamp string
  execution_duration: "257ms",             // formatted duration string
  state: "OK",                             // STATE_UNSPECIFIED | OK | ERROR | IN_PROGRESS
  trace_metadata: { "run_id": "abc-456" },
  tags: { "user": "alice" },
  assessments: [...],
}

// ModelTraceSpanV3 (frontend) — inputs/outputs are in attributes
{
  name: "call_llm",
  span_id: "span-456",
  parent_span_id: "span-123",          // null for root span
  start_time_unix_nano: "1700000000000000000",
  end_time_unix_nano: "1700000200000000000",
  status: { code: "STATUS_CODE_OK" },  // STATUS_CODE_UNSET | STATUS_CODE_OK | STATUS_CODE_ERROR
  attributes: {
    "mlflow.spanInputs": { prompt: "What is MLflow?" },
    "mlflow.spanOutputs": { response: "MLflow is..." },
    "mlflow.spanType": "LLM",          // LLM, CHAIN, TOOL, RETRIEVER, etc.
  },
  events: [...],
}

// Assessment
{
  assessment_id: "asmt-789",
  assessment_name: "user_feedback",
  trace_id: "tr-abc-123",
  source: { source_type: "HUMAN" },    // HUMAN, LLM_JUDGE, CODE
  // value is one of: Feedback, Expectation, or IssueReference
}
```

::: info Why is this the most complex UI?
A single trace can contain dozens of spans in a deeply nested tree. Each span has rich JSON inputs/outputs that need pretty-printing. The waterfall view needs to calculate relative timing and render proportional bars. Add assessments, filtering, and search on top — it's a lot of interactive state. If you've worked with browser DevTools' Network tab or a flame chart, the traces UI is conceptually similar.
:::

---

::: info See Also
- [The Poet's Drafts](./prompts) — prompts are the templates used in traced LLM calls
- [The Harbor Master](./ai-gateway) — the Gateway routes the LLM calls that traces capture
- [The Quality Inspector](./issues) — issues are patterns detected across traces
- [The Handshake](./span-links) — span links connect spans across different traces
:::
