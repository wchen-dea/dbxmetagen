# Apps

The `apps/` directory contains the user-facing applications for dbxmetagen. Together they
provide a governed workflow for enriching Databricks Unity Catalog metadata, reviewing
AI-generated results, exploring relationships, and exposing the resulting knowledge to
analytics and natural-language tools. The supported product is `dbxmetagen-app`; the
secondary application is retained only as historical reference.

## Design and architecture

### dbxmetagen-app

`dbxmetagen-app` is designed as a Databricks App with a clear separation between the
presentation layer, application/API layer, and asynchronous Databricks jobs:

- **React frontend:** `app/src/` provides the browser experience and is built with Vite.
  The generated `app/src/dist/` directory is committed and synchronized with the app, so
  Node.js is needed only when developing or changing the frontend—not for deployment.
- **FastAPI backend:** `app/api_server.py` exposes the app API and serves the built frontend.
  It coordinates metadata workflows, job execution, profiling, graph and ontology views,
  semantic-layer operations, and agent interactions.
- **Agent and tool layer:** `app/agent/` contains specialized agents and tools for metadata,
  governance, impact analysis, graph exploration, analyst workflows, and metric views.
  These components use the same catalog and generated knowledge assets as the dashboard.
- **Databricks job layer:** long-running or compute-intensive work is delegated to jobs
  declared under `resources/`. The app receives job identifiers through bundle-managed
  environment variables and can start the appropriate pipeline without embedding compute
  configuration in the UI.
- **Unity Catalog outputs:** generated comments, tags, classifications, ontology mappings,
  profiling results, graph data, metric views, and vector indexes are persisted as standard
  Databricks assets. This keeps the results reusable from notebooks, dashboards, Genie
  spaces, agents, and other applications.

The app is configured in two complementary places: `app/app.yaml` contains only the
Uvicorn launch command, while `resources/apps/dbxmetagen_app.yml` supplies the source path,
runtime environment, job bindings, OAuth scopes, and permissions. Keeping deployment
configuration in the bundle avoids drift between local files and the deployed app.

### Legacy application

`uc-metadata-assistant` is a self-contained Flask prototype. It has a separate runtime,
configuration, and deployment model; it does not import the `dbxmetagen` library and is not
included in the Databricks Asset Bundle. It remains useful for historical comparison only
and should not be used as the implementation pattern for new work.

## Implementation

The primary app follows a workflow-oriented implementation model:

1. The frontend collects catalog, schema, table, and workflow options from the user.
2. The FastAPI layer validates requests and dispatches synchronous API operations or a
   Databricks job for larger workloads.
3. The `dbxmetagen` library performs sampling, LLM-assisted enrichment, domain and ontology
   classification, PII detection, relationship analysis, and persistence.
4. Review-oriented endpoints expose generated SQL, comments, tags, and recommendations so
   users can edit or approve them before applying changes.
5. Downstream jobs build knowledge-base, vector-search, graph, metric-view, or Genie assets
   from approved or generated metadata.
6. Agent tools query those governed assets to answer questions and provide explainable
   catalog exploration rather than operating directly on unreviewed application state.

The frontend is developed with `npm run dev` and rebuilt with `npm run build`. The backend
starts with Uvicorn using the command in `app/app.yaml`. For a normal bundle deployment,
the application source and its Python wheel are assembled by the repository build process;
the app is then started separately with `databricks bundle run` unless an explicitly
configured app lifecycle starts it during deployment.

## Features

The supported dashboard provides the following capabilities:

- **Metadata generation:** generate table and column descriptions and DDL suitable for
  Unity Catalog review workflows.
- **Governance enrichment:** detect and classify sensitive data, including PII-oriented
  metadata, and attach domain-specific governance information.
- **Domain and ontology mapping:** classify data into configured business domains and map
  entities and properties to bundles such as FHIR R4, OMOP CDM, Schema.org, Dublin Core,
  and FIBO Foundations.
- **Data profiling and quality:** inspect column distributions and quality signals and
  produce quality-oriented scores for prioritizing remediation.
- **Relationship discovery:** rank foreign-key candidates and visualize entity relationships
  through knowledge-graph and ERD-oriented views.
- **Knowledge graph and retrieval:** build graph and vector-search assets that support
  semantic, lexical, similarity, and relationship-aware retrieval.
- **Semantic layer:** generate and validate metric views, measures, dimensions, joins,
  filtered measures, and window calculations, including SQL autofix where supported.
- **Genie enablement:** create Genie space context and reuse curated SQL from existing
  Genie spaces when seeding new metric-view definitions.
- **Natural-language agents:** use analyst, governance, impact, graph, metadata, and
  metric-view agents to explore the catalog and its relationships conversationally.
- **Human review:** keep generated changes reviewable and separate from production metadata;
  applying DDL is opt-in and should follow the repository's review process.

## Usage

### Deploy the supported app

From the repository root, configure the target variables for the workspace and run:

```bash
databricks bundle deploy -t <target> -p <profile>
databricks bundle run -t <target> -p <profile> dbxmetagen_app
scripts/grant_app_permissions.sh -t <target> -p <profile>
```

`bundle deploy` creates or updates the app and its related resources; it does not
necessarily start the app. The permissions script applies the Unity Catalog and Vector
Search grants required by the deployed service principal. After the app is running, open
the Databricks App URL and use the dashboard to select a catalog and schema, start a
generation or analytics workflow, inspect its results, and review changes before applying
them.

### Develop the frontend locally

```bash
cd /Users/pchen/dbx-lab/dbxmetagen-dt/apps/dbxmetagen-app/app/src
npm install
npm run dev
```

When frontend code changes, rebuild the committed distribution:

```bash
npm run build
```

### Run the legacy prototype

Only use `uc-metadata-assistant` when reproducing its historical behavior. Follow its own
setup instructions in that directory and deploy it independently; do not expect
`databricks bundle deploy` to install, configure, or start it.

## dbxmetagen-app (primary)

The main application for this repository. Provides a full-featured UI for metadata generation, domain/ontology classification, PII detection, knowledge graph analytics, semantic layer management, Genie space building, and agent-based metadata exploration. Deployed and managed via Databricks Asset Bundles (`databricks bundle deploy` + `scripts/grant_app_permissions.sh`) -- see the root `databricks.yml` and `resources/` for configuration.

See [dbxmetagen-app/](dbxmetagen-app/) for details.

## uc-metadata-assistant (legacy — unmaintained, kept for reference)

> **NOTE:** This is a legacy standalone prototype. It is **not part of the dbxmetagen product**, is
> **not maintained** (last updated early 2026), does **not** use the `dbxmetagen` library, and is
> **not** wired into the DAB deployment pipeline — `databricks bundle deploy` never touches it. It is
> **intentionally retained for reference only**; do not treat it as a live or supported deployment
> path. For all real use, deploy **dbxmetagen-app** above.

A self-contained Flask app for simpler metadata generation and governance use cases. If used, it must
be configured and deployed entirely independently.

See [uc-metadata-assistant/](uc-metadata-assistant/) for its (unmaintained) setup instructions.
