# The Signal Flares

> **MLflow Concept:** Webhooks

## The Story

After Danny's incident — two hours of downtime because nobody knew he'd deleted the `@champion` alias — Maya's team decided they were done learning about disasters after the fact. They needed to know the moment something important happened, not the morning after.

The solution was **signal flares**. Each flare was a small contract: a name, a URL to call, a secret for verification, and a rule defining what triggers it — an entity and an action, like `model_version.created` or `model_version.alias_changed`. When the event fired, MLflow sent an HTTP POST to the URL. No questions asked, no history stored on the flare itself. The flare was the agreement to notify, not a log of notifications.

They set up three flares immediately. The first watched Ahmed's library: whenever a new model version was registered, a flare fired to the team's Slack channel. The second watched Rosa's evaluation pipeline: when an evaluation completed, a flare triggered the CI/CD system to run deployment checks. The third was Danny's manager's idea — whenever a model earned the `@champion` alias, a flare notified the on-call engineer. "If someone moves the crown," he said, "I want to know within seconds, not hours."

Each flare carried a secret token so the receiving service could verify the signal was genuine. The flares didn't care what Slack or the CI/CD pipeline did with the information — they just sent it. The watchers decided what action to take.

"We can't prevent every mistake," Maya told the team. "But we can make sure nobody is ever the last to know."

## The Lesson

A **webhook** is an HTTP callback triggered by an event. You register a URL with MLflow, and when the specified event happens, MLflow sends an HTTP POST request to that URL with event details in the payload.

Each webhook has:
- A **name** — human-readable label
- A **URL** — where to send the callback
- A **status** — active or disabled
- A **secret** — for signature verification (so the receiver can confirm the request really came from MLflow)
- A **description** — what this webhook is for

**Webhook events** define what triggers the webhook — which entity (e.g., model version) and what action (e.g., created). When the specified event occurs, MLflow sends an HTTP POST to the webhook's URL.

Common use cases:
- Notify a Slack channel when a new model version is registered
- Trigger a CI/CD pipeline when a model is promoted to production
- Alert an on-call system when evaluation scores drop below a threshold
- Sync model metadata to an external catalog

::: tip Key Takeaway
- **Webhook** = HTTP callback triggered by an event in MLflow
- Each webhook has a name, URL, status, and secret for signature verification
- **Webhook events** define what triggers it — an entity + action pair
- Use cases: Slack notifications, CI/CD triggers, monitoring alerts
:::

::: warning Security Note
Always use the webhook secret for signature verification. Without it, anyone who discovers the URL could send fake events to your downstream services.
:::

## For Frontend Developers

Webhooks are managed in the Settings area. The webhooks API supports full CRUD operations plus a test endpoint to verify connectivity.

| Component | What It Shows |
|-----------|--------------|
| Settings — Webhooks section (`/settings/webhooks`) | List, create, edit, delete, and test webhooks |

### API Layer

The webhooks API is located in the settings API module. Operations include:
- List all webhooks
- Create a new webhook
- Update an existing webhook
- Delete a webhook
- Test a webhook (sends a test event to verify the URL works)

### Data Shape

```typescript
// Webhook
{
  webhook_id: "wh-001",
  name: "Model Registration Notifier",
  description: "Notifies Slack when a new model version is registered",
  url: "https://hooks.slack.com/services/T00/B00/xxx",
  status: "ACTIVE",                    // ACTIVE or DISABLED
  secret: "••••••••",                  // masked in UI, used for signature verification
  creation_timestamp: 1700000000000,
  last_updated_timestamp: 1700003600000,
}

// WebhookEvent — defines what triggers this webhook (entity + action)
{
  entity: "model_version",             // which resource type
  action: "created",                   // what happened to it
}
```

---

::: details See Also
- [The Royal Library](./model-registry) — webhooks can fire on model registration events
- [The Judge's Tournament](./evaluation-and-scorers) — webhooks can alert when evaluation scores change
:::
