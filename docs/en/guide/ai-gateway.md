# The Harbor Master

> **MLflow Concept:** AI Gateway

## The Story

Maya's chocolate cake needed ingredients from multiple suppliers. The chocolate came from one place — call it the Belmont Cacao Company. The vanilla extract from another — Marchand & Fils. The specialty toppings — edible gold leaf, high-grade cocoa nibs — from a third. Each supplier had a different order form, different pricing tiers, different delivery protocols. For a while, Maya's kitchen dealt with each one individually. **Rodrigo** handled the supply chain.

Then Belmont changed its order format overnight. No warning. New forms, new minimum quantities, a completely restructured delivery process. Rodrigo's chocolate order sat in limbo for three days. Two hundred customers hit Dr. Patel's counter and got nothing — the oven had no ingredients. By the time Rodrigo scrambled to learn the new protocol, Maya had lost a week of revenue and the trust of half the neighborhood.

That's when Rodrigo became the **Harbor Master**. He built a single standard order form for Maya's kitchen. One form, one format, every time. Rodrigo translated it into whatever each supplier required — Belmont's new protocol, Marchand's old-fashioned invoices, the specialty shop's API. When Belmont changed its rules again three months later, Rodrigo absorbed the change. Maya's kitchen never noticed.

Rodrigo also enforced rate limits — "no more than ten chocolate orders per hour, or Belmont charges surge pricing" — and set up fallback routes. If Belmont was down, Rodrigo automatically switched to the backup supplier in Ghent. He tracked every cost in one ledger so Maya always knew exactly what each cake was costing her. Every ingredient order Rodrigo routed showed up in Detective Chen's trace as a span — a clear record of which supplier was called, how long it took, and what came back.

"I used to think knowing every supplier's protocol made me indispensable," Rodrigo told Maya. "It just made your kitchen fragile. Now I'm indispensable because nothing breaks."

## The Lesson

The **AI Gateway** is a unified API proxy that sits between your application and multiple LLM providers (OpenAI, Anthropic, Google, etc.). Instead of your code integrating directly with each provider's different API format, you talk to the Gateway in one standard format. The Gateway translates your request, handles authentication, enforces rate limits, provides fallback routing, and tracks usage.

**Endpoints** are the Gateway's configuration units. Each endpoint specifies model mappings (which provider models to use, with weights for traffic splitting), a routing strategy, fallback config, and optional guardrails. An endpoint can map to multiple model definitions for A/B testing or failover.

::: tip Key Takeaway
- **AI Gateway** = a unified proxy between your app and LLM providers
- **Endpoint** = a configured entry point (model mappings + routing strategy + fallbacks + guardrails)
- Handles: centralized API key management, rate limiting, traffic splitting, cost tracking
- Supports guardrails for content filtering and safety policies
:::

## For Frontend Developers

The **Gateway section** shows the Harbor Master's roster. Each endpoint card shows the provider, model, and status. The **endpoint creation page** lets users configure new endpoints with model definitions, routing, and guardrails. The **usage page** shows traffic, latency, token counts, and costs.

| Component | What It Shows |
|-----------|--------------|
| `GatewayPage` | Gateway root layout with nested child routes |
| `CreateEndpointPage` | Create a new endpoint with model mappings |
| `EndpointPage` | Endpoint details, model config, guardrails |
| `GatewayUsagePage` | Traffic, latency, tokens, costs |

### Data Shape

```typescript
// Gateway Endpoint (frontend)
{
  endpoint_id: "ep-abc-123",
  name: "chat-completion",
  model_mappings: [
    {
      model_definition_id: "md-456",
      weight: 100,          // traffic weight for splitting
    }
  ],
  routing_strategy: "round_robin",
  fallback_config: { ... },
  experiment_id: "123",     // linked experiment for tracing
  usage_tracking: { ... },
}

// ModelDefinition (referenced by endpoint)
{
  model_definition_id: "md-456",
  name: "gpt-4-prod",
  provider: "openai",
  model_name: "gpt-4",
  secret_id: "sec-789",    // references a GatewaySecretInfo
}
```

---

::: info See Also
- [The Detective's Thread](./tracing-and-spans) — Gateway calls are captured in traces
- [The Poet's Drafts](./prompts) — prompts are sent through Gateway endpoints
- [The Launchpad](./model-serving) — the Gateway can proxy to served MLflow models
:::
