# The Launchpad

> **MLflow Concept:** Model Serving & Deployments

## The Story

Maya's `@champion` chocolate cake sat in Ahmed's Royal Library — perfected, tested by Rosa's judges, registered as version 7. But a cake in a library can't feed anyone. Customers couldn't walk into the library and order a slice. That's where **Dr. Patel** came in.

Dr. Patel was the town's deployment engineer, and she ran the **Launchpad** — a service counter where registered cakes became available for ordering. She took Maya's `@champion` cake from Ahmed's library and put it behind a counter with a REST API. The hospital cafeteria could now send an order to `/invocations` and get a cake back in seconds. No one needed to know which oven Maya had used, because Tomás's universal adapter — pyfunc — handled the translation. PyTorch oven, sklearn oven, it didn't matter. Same interface at the counter.

Then the demand grew. The hospital wanted the cake served locally. A bakery chain across the river needed it on AWS. The school district ran on Azure. Dr. Patel didn't build three separate counters. The Launchpad's plugin system let her deploy the same cake to different destinations — one command for the local counter, one for AWS, one for Azure. Same cake, same adapter, different launchpads.

"Maya baked one cake," Dr. Patel said. "Tomás wrapped it. Obi logged it. Ahmed registered it. Rosa tested it. My job is the last mile — making sure someone can actually order it." And once the cake was live on the counter, every order would be traced by Detective Chen, so Maya could see exactly how her creation performed in the real world.

## The Lesson

**Model serving** turns a trained model into a live API endpoint. The simplest way is:

```bash
mlflow models serve -m "models:/my-model/1" --port 5001
```

This starts a Gunicorn REST server that exposes a `/invocations` endpoint. Send it JSON or CSV data, it validates the input against the model's signature, runs prediction through the pyfunc interface, and returns results.

For batch prediction without a server:

```bash
mlflow models predict -m "models:/my-model/1" -i data.csv
```

For production deployments beyond local serving, MLflow provides a **plugin system** via `mlflow.deployments`. Each deployment target (SageMaker, Azure ML, Databricks, etc.) implements a `BaseDeploymentClient` that knows how to push models to that platform. You interact with all targets through the same API:

```python
from mlflow.deployments import get_deploy_client
client = get_deploy_client("sagemaker")
client.create_deployment(name="prod-model", model_uri="models:/my-model/1")
```

All serving paths use the **pyfunc interface** underneath — the universal adapter from the Flavors story. That's why any model works on any launchpad.

::: tip Key Takeaway
- `mlflow models serve` = local REST server with `/invocations` endpoint
- `mlflow models predict` = batch prediction without a server
- `mlflow.deployments` plugin system = deploy to SageMaker, Azure ML, Databricks, etc.
- All serving uses the pyfunc interface — same model, any destination
:::

::: warning Serving vs. Gateway
Don't confuse model serving with the AI Gateway. Model serving deploys *your* models as endpoints. The AI Gateway proxies requests to *external* LLM providers (OpenAI, Anthropic, etc.) with rate limiting and guardrails. They can work together — the Gateway can route to a served model.
:::

## For Frontend Developers

Model serving is primarily a CLI and SDK concept — there is no dedicated "serving" page in the MLflow UI. However, models in the Model Registry show deployment-related information, and the AI Gateway can proxy to served models.

| Component | What It Shows |
|-----------|--------------|
| Model Registry pages | Models that can be served — version info, aliases, stages |
| AI Gateway configuration | Gateway routes can point to served model endpoints |
| `RunPage` artifacts tab | The model artifact that gets served |

### Data Shape

Serving doesn't introduce new frontend entities. The relevant data is the model's artifact URI and signature, which already exist on the Run and Model Registry entities:

```typescript
// The model version that gets served
{
  name: "fraud-detector",
  version: "3",
  source: "runs:/abc-def/model",
  status: "READY",
  aliases: ["champion"],
  // The pyfunc interface loads this model for serving
}

// What the /invocations endpoint expects (defined by model signature)
// POST http://localhost:5001/invocations
// Content-Type: application/json
{
  "inputs": [
    { "feature_1": 0.5, "feature_2": "category_a" }
  ]
}

// Response
{
  "predictions": [0, 1, 0]
}
```

---

::: details See Also
- [The Royal Library](./model-registry) — models are deployed from the Registry
- [The Universal Adapter](./flavors-and-packaging) — pyfunc provides the standard predict() interface
- [The Harbor Master](./ai-gateway) — the Gateway can proxy to served models
:::
