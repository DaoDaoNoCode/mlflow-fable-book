# The Blueprint

> **MLflow Concept:** Projects

## The Story

Maya's chocolate cake recommendation model was so successful that the company wanted to replicate it in their London office. Maya zipped up the training scripts, wrote a README — "use Python 3.10, run train.py with default settings" — and sent it over.

London's team spent Monday fighting a Python version mismatch: the code required 3.10 features, and their servers ran 3.8. Tuesday was dependency conflicts: a specific PyTorch version clashed with their CUDA installation. By Wednesday, they'd resolved the environment but discovered the default hyperparameters in Maya's README were out of date — Thomas had tuned them locally weeks ago and never updated the docs. London's model scored 84.2% against Maya's 91.4%. Four days of work, and the results didn't even match.

After the fiasco, both teams agreed: every project ships with a **Blueprint** — an MLproject file declaring exactly what to run, what parameters to accept (with types and defaults), and what environment to build. The conda.yaml pinned every dependency. The entry points specified every command. No READMEs that drift out of sync. No "it works on my machine."

The Blueprint created Runs in Maya's kitchen, just like her manual experiments — Thomas's parameter notes, Lena's artifact vault, all of it worked the same. The only difference was the run's source tag said `PROJECT` instead of `LOCAL`. Now anyone, anywhere, could clone the repository, run one command, and reproduce Maya's exact result.

"The code was never the problem," London's lead told management. "The problem was everything *around* the code. The Blueprint is the everything-around-the-code."

## The Lesson

An **MLflow Project** is a standard format for packaging reproducible ML code. At its heart is an **MLproject file** — a YAML manifest that defines:

- **Entry points** — commands to run. Each entry point has a name, parameters (with types and defaults), and a command template
- **Environment** — how to set up dependencies. Options: conda environment, Docker image, virtualenv, or system environment

Here's what an MLproject file looks like:

```yaml
name: my-training-project

conda_env: conda.yaml    # or docker_env, python_env

entry_points:
  main:
    parameters:
      learning_rate: {type: float, default: 0.01}
      epochs: {type: int, default: 10}
    command: "python train.py --lr {learning_rate} --epochs {epochs}"
  validate:
    parameters:
      model_uri: {type: string}
    command: "python validate.py --model {model_uri}"
```

You run a project with:

```bash
mlflow run . -P learning_rate=0.001 -P epochs=50
```

Or from a Git repository:

```bash
mlflow run git@github.com:org/ml-project.git -P learning_rate=0.001
```

MLflow handles cloning the repo, setting up the environment, and executing the command. Each project run creates a tracking **Run** for logging parameters, metrics, and artifacts.

**Backends** determine *where* the project runs:
- **Local** (default) — runs on your machine
- **Databricks** — submits to a Databricks cluster
- **Kubernetes** — runs in a K8s pod

::: tip Key Takeaway
- **MLflow Project** = standard format for reproducible ML code
- **MLproject file** = YAML manifest with entry points, parameters, and environment
- Run from local directories or Git repos
- Each project run creates a tracking Run
- Backends: local, Databricks, Kubernetes
:::

::: info Projects + Experiments
Every project run automatically creates a Run in an experiment, so all the tracking features (params, metrics, artifacts, comparison) work out of the box. The run's `source_type` and `source_name` tags indicate that it came from a project execution.
:::

## For Frontend Developers

Projects is primarily a CLI and SDK concept — there is no dedicated UI page for managing or browsing projects. However, project runs appear as regular Runs in the experiment tracking UI, so all existing Run components handle them.

| Component | What It Shows |
|-----------|--------------|
| `ExperimentRunsPage` | Project runs appear alongside other runs |
| `RunPage` | Full detail of a project run — params, metrics, artifacts |

The way to identify a project-originated run is through its tags:

### Data Shape

```typescript
// A Run created by a project execution
{
  info: {
    runUuid: "proj-run-123",
    experimentId: "42",
    runName: "my-training-project",
    status: "FINISHED",
    startTime: 1700000000000,
    endTime: 1700003600000,
    artifactUri: "s3://bucket/proj-run-123/artifacts",
    lifecycleStage: "active",
  },
  data: {
    params: [
      { key: "learning_rate", value: "0.001" },
      { key: "epochs", value: "50" },
    ],
    metrics: [
      { key: "rmse", value: 0.042, step: 50, timestamp: 1700003600000 },
    ],
    tags: [
      { key: "mlflow.source.type", value: "PROJECT" },       // <-- project marker
      { key: "mlflow.source.name", value: "git@github.com:org/ml-project.git" },
      { key: "mlflow.project.entryPoint", value: "main" },
      { key: "mlflow.project.backend", value: "local" },
    ],
  },
}
```

---

::: details See Also
- [The Chef's Kitchen](./experiments-and-runs) — project runs create tracking Runs
:::
