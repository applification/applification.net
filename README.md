# applification.net

[![CI](https://github.com/applification/applification.net/actions/workflows/ci.yml/badge.svg)](https://github.com/applification/applification.net/actions/workflows/ci.yml)
[![skills.sh](https://skills.sh/b/applification/applification.net)](https://skills.sh/applification/applification.net)

The source of [www.applification.net](https://www.applification.net): Dave Hudson's portfolio and contract engineering site. It covers:
- product pages for Contexture, Plantry, StoryLoops and Voiced
- client case studies
- articles and weeknotes
- a public read-only API with agent tooling
- an AI-assisted contact workflow with private CV review

It is a Bun workspace with a single Next.js 16 app, deployed on **Vercel**.

## Structure

```text
apps/applification/   Next.js website (App Router, React 19, Tailwind 4, shadcn/Radix)
  content/writing/    Articles and weeknotes as Markdown
  src/app/            Routes, route handlers and metadata
  src/components/     UI components, with Storybook stories alongside
  src/lib/            Domain logic, content loaders and zod schemas
  src/workflows/      Durable Vercel Workflows for the contact service
docs/                 Architecture, runbooks, agent readiness and audits
skills/               Agent skill published on skills.sh (generated; see below)
applification.pen     Design file used for visual intent and design-token checks
```

For how the parts fit together, see **[docs/architecture.md](docs/architecture.md)**.

## Getting started

Requirements:
- **Bun:** the version pinned in `package.json` under `packageManager`.
- **Node.js 22:** Next and Vitest run on Node.

```bash
bun install
bun run dev
```

`bun run dev` uses Portless to serve the site at `https://applification.localhost` with a trusted local certificate. The first run creates and trusts Portless's local certificate authority. The `.localhost` name resolves only on the machine running the server.

Two other ways to run it:
- **`bun run dev:tailscale`** also exposes the site over Tailscale HTTPS and prints the assigned `https://<machine>.<tailnet>.ts.net[:port]` URL. Use that URL from another device on your tailnet.
- **`bun run dev:direct`** skips the proxy and serves `http://localhost:3333`.

Most of the site needs no configuration. The contact workflow needs the variables in `apps/applification/.env.example`. It is enabled automatically in development, and it only calls the AI Gateway when a key is set.

## Commands

Run these from the repository root.

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the dev server (Portless HTTPS) |
| `bun run build` / `bun run start` | Production build and server |
| `bun run lint` | ESLint |
| `bun run typecheck` | Generate Next route types, then `tsc --noEmit` |
| `bun run test` | Unit tests: domain logic, route handlers, content, media and drift checks |
| `bun run test:workflow` | Durable workflow tests (`@workflow/vitest`) |
| `bun run test:storybook` | Storybook interaction and axe accessibility tests in headless Chromium (run `bunx playwright install chromium` once) |
| `bun run check` | Lint, typecheck, unit and workflow tests together |
| `bun run skills:sync` | Regenerate `skills/applification-site/SKILL.md` |

Inside `apps/applification` you can also run:
- `bun run storybook`: Storybook on port 6006.
- `bun run content:import`: the one-off importer for legacy writing.

**Always use `bun run test`, not `bun test`.** The latter starts Bun's own test runner instead of Vitest.

## Quality gates

CI (`.github/workflows/ci.yml`) runs on every pull request and every push to `main`, in three jobs:
- **Check:** lint, typecheck, unit tests and workflow tests.
- **Storybook:** interaction and accessibility tests.
- **Build:** a production build.

Dependabot proposes grouped dependency updates weekly.

Several unit tests guard generated or derived files:
- The skills.sh copy of the site skill must match the served skill.
- Design tokens must match `applification.pen`.
- Every article image must have alt text, and every local media file and poster must exist.

For UI changes, read `apps/applification/design.md` and update the nearest Storybook story, as described in `apps/applification/AGENTS.md`.

## Deployment

The site deploys to the `applification` project on Vercel. Pages are prerendered where possible.

The contact service depends on these Vercel products:
- **BotID** and a **Firewall** rule named `contact-write`, for abuse protection.
- **Blob**, a private store, for uploaded briefs and the CV.
- **Workflow**, for durable delivery and the 14-day CV review.
- **AI Gateway**, with a budgeted key, for brief preparation.

Email is sent through Resend.

The [contact workflow runbook](docs/runbooks/contact-workflow.md) covers:
- configuration
- pre-release verification on a preview
- the kill switch (`CONTACT_WORKFLOW_ENABLED=false`)
- troubleshooting
- secret rotation
- promoting the report-only Content Security Policy

## Public API and agent access

`/agents` introduces the site's agent tools. They offer published-content search and an expandable API reference.

| Endpoint | What it returns |
| --- | --- |
| `/api/v1/catalog` | Profile, product and commercial information |
| `/api/v1/search` | Search across published client work, writing and products |
| `/api/v1/content` | Published content, read section by section |
| `/api/v1/sandbox` | An anonymous first call, showing that no key is needed |
| `/api/openapi.json` | The OpenAPI 3.1 document |

Reads are anonymous and CORS-enabled. Each client IP gets an independent allowance of 120 requests per minute, counted separately on each server instance, and quota headers are returned. Every public page also has an Agent view (`/agent/<path>`) and a Markdown export (`/markdown/<path>`).

On browsers that support WebMCP, tools can search and read published content, and fill an editable enquiry on the contact page for the visitor to review.

For WebMCP setup, rate-limit conventions and verification, see [agent readiness](docs/agent-readiness.md).

## Agent skills on skills.sh

skills.sh indexes the copy of the site skill at `skills/applification-site/SKILL.md`. It is generated from `apps/applification/src/lib/agent-skills.ts`, the same source as `/.well-known/agent-skills/applification-site/SKILL.md`, and a unit test fails when the two differ. After changing the skill, run:

```bash
bun run skills:sync
```

Install it with `npx skills add applification/applification.net --skill applification-site`. The StoryLoop skill lives in [applification/storyloop-skill](https://github.com/applification/storyloop-skill). `/llms.txt`, `/.well-known/ard.json` and `/agents` link to both listings.

## Documentation

- [Architecture](docs/architecture.md): the layers, content pipeline, Human/Agent views, API and contact workflow.
- [Contact workflow runbook](docs/runbooks/contact-workflow.md): operating the contact service.
- [Agent readiness](docs/agent-readiness.md): the agent-facing surfaces and how to verify them.
- [Codebase audit, September 2026](docs/audit-2026-09.md): findings and the improvement backlog.
- `apps/applification/design.md`: the design system and UI rules.
- `apps/applification/docs/`: asset sources for case studies and integrations.
