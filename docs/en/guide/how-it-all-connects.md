# How It All Connects

> **The Grand Story: All 21 Characters in One Town**

## The Story

Imagine all our characters living in the same town, working together. Here's how their stories interweave:

### Act 1: Building the Model

**Chef Maya** sets up her kitchen (Experiment) and starts trying recipes. But she learned the hard way — she lost her best recipe once because she didn't write it down. Now every attempt is a Run, carefully recorded. Her **Autopilot** (Autologging) handles the note-taking automatically — every parameter, every metric, logged without her lifting a pen.

**Baker Thomas** organizes Maya's notes in three colors: blue for inputs (Parameters), red for results (Metrics), green for labels (Tags). **Lena** stores the actual cakes and files (Artifacts) in her temperature-controlled vault — the heavy things that don't fit in a notebook. **Nina**, the newest team member, discovers the Autopilot that records everything automatically.

Every cake Maya makes gets an entry in **Obi's logbook** (LoggedModel) — a record linking the cake to the kitchen, the attempt, and the vault shelf. The cake was saved using **Tomás's universal adapter** (Flavor/pyfunc) — a standard wrapping that makes it work anywhere, regardless of what oven (framework) baked it.

### Act 2: Publishing and Deploying

When Maya's best cake is ready for the world, she promotes it from Obi's logbook to **Ahmed's Royal Library** (Model Registry), registered as "Chocolate Cake" with the alias `@champion`. But first — **Rosa's tournament judges** (Evaluation + Scorers) test it against **Mika's standardized ingredient sets** (Datasets). Rosa's allergen detector catches a problem Maya missed. Only after fixing it does the cake earn its `@champion` badge.

**Dr. Patel** then takes the `@champion` cake and deploys it via her **Launchpad** (Model Serving) — now it's a REST API that anyone can call. The cake is live.

### Act 3: Serving and Observing

A customer sends a request. It arrives at **Rodrigo's Harbor Master** (AI Gateway), who routes it to the right provider. The request uses **Yara's carefully crafted template** (Prompt) — the `@production` version, immutable, trusted. **Detective Chen** (Tracing) records every step as Spans — the prompt construction, the LLM call, the response formatting. If the customer complains, Chen's trace shows exactly where things went wrong.

**The Quality Inspector** (Issues) watches Chen's traces over time. A single unhappy customer is an Assessment. But when 47 customers complain about the same thing? That's an Issue — a systematic pattern that needs fixing. The inspector links it back to the model version and the scorer that should have caught it.

### Act 4: Governance and Infrastructure

All of this happens on **Priya's floor** (Workspace) — isolated from other teams' data. **Danny's gatekeepers** (RBAC) make sure the intern can look but not touch production. **Signal flares** (Webhooks) fire when key events happen — a model promoted, an evaluation completed, an issue detected. And the whole workflow was set up using **Team London's blueprint** (Project) — a reproducible package that anyone can run to get the same results.

### Coming Soon

**Old Fang's Tool Shed** (MCP Registry) will govern which external tools AI agents can use — versioned, aliased, with approved access bindings. **Cold storage** (Trace Archival) will move old traces to cheaper storage while keeping them searchable. And **handshakes** (Span Links) will connect spans across different traces when async agents work together across time.

## The Architecture Diagram

Click any card to jump to its fable. Hover for a quick description.

<ArchitectureDiagram lang="en" />

## The Data Flow

<DataFlowDiagram lang="en" />

## Concept Relationship Map

### The Core Chain: Build → Register → Serve → Observe

```
Experiment → Runs → LoggedModel → Model Registry → Model Serving → Tracing
               ↑                        ↑                ↑           ↓
          Autologging              Evaluation          Gateway    Issues
               ↑                     ↑                   ↑
          Params/Metrics/Tags    Datasets             Prompts
               ↑
           Artifacts (stored separately)
```

### All Relationships

| Concept | Produces / Contains | Connects To |
|---------|-------------------|-------------|
| **Experiment** | Runs, Traces, Issues | Groups related attempts; scoped by Workspace |
| **Run** | Params, Metrics, Tags, Artifacts, LoggedModels | Created by Projects; auto-populated by Autologging |
| **Autologging** | (auto-creates Run data) | Patches 30+ frameworks to log to Runs automatically |
| **Artifacts** | Files (models, data, charts) | Stored in artifact store; pointed to by Runs and LoggedModels |
| **Flavor / pyfunc** | Model packaging format | Determines how LoggedModels are saved/loaded; enables universal serving |
| **LoggedModel** | Model metadata, links to Artifacts | Created during Runs; promoted to Model Registry; linked to Traces |
| **Model Registry** | Registered Models → Versions + Aliases | Versions link back to Runs; evaluated before promotion; deployed via Model Serving |
| **Model Serving** | REST API endpoints | Deploys models from Registry; uses pyfunc interface; proxied by Gateway |
| **Trace** | Spans, Assessments | Records LLM request journeys; linked to LoggedModels, Prompts, MCP Servers |
| **Prompt** | Versions, Aliases | Templates used in traced LLM calls; immutable versions; sent through Gateway |
| **AI Gateway** | Endpoints | Routes LLM calls captured by Tracing; can proxy to served models |
| **Dataset** | Records, Inputs | Training provenance (Run-level); test cases for Evaluation |
| **Evaluation** | Scorer results on evaluation Runs | Tests models against Datasets; informs Registry promotion |
| **Issue** | Quality problem patterns | Detected from Trace patterns; linked to Assessments |
| **Workspace** | All of the above | Data isolation boundary; affects every API call |
| **RBAC** | Roles, Permissions | Controls who can do what within Workspaces |
| **Webhook** | Event subscriptions | Fires on Registry, Evaluation, and other events |
| **Project** | MLproject definition | Produces Runs with reproducible environments |
| **MCP Registry** *(RFC)* | MCP Servers, Versions, Access Bindings | Governed tool catalog; traces link to MCP versions |
| **Trace Archival** *(RFC)* | Archived span data | Moves old Trace data to cheaper storage |
| **Span Links** *(RFC)* | Cross-trace connections | Links Spans across different Traces for async agents |
