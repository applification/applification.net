# applification.net

Bun workspace for the Applification website and future services.

## Structure

```text
apps/
  applification/   Next.js website
packages/
  sdk/             @applification/sdk (npm): TypeScript client for the public API
  cli/             @applification/cli (npm): `applification` command-line tool
  sdk-python/      applification (PyPI): Python client for the public API
```

## Commands

```bash
bun install
bun run dev
bun run dev:tailscale
bun run build
bun run lint
bun run typecheck
```

`bun run dev` uses Portless and serves the site at `https://applification.localhost` with a trusted local certificate. The first run creates and trusts Portless's local certificate authority. The `.localhost` name only works on the Mac running the server because every device resolves it to its own loopback address.

`bun run dev:tailscale` also exposes the site through Tailscale HTTPS and prints the assigned `https://rufus.tail12a0a0.ts.net[:port]` URL. Use that URL from another Mac, another tailnet device or T3 Code's shared preview. Portless chooses a free Tailscale HTTPS port, so existing Serve routes are preserved. Use `bun run dev:direct` only when the proxy is unsuitable; it retains the old `http://localhost:3333` server.

## Railway

Connect Railway to the repository root. The root `build` and `start` scripts run the website workspace. Railway supplies `PORT` to `next start`.

The site shell is intentionally small. Product sections and page content will be planned and delivered through StoryLoops.

## Public API and agent access

`/developers` is the developer documentation (API, MCP server, SDKs, CLI) and is linked from the site footer; `/docs` and `/api` redirect to it. `/api/mcp` is a stateless Streamable HTTP MCP server exposing the same read-only tools as the WebMCP bundle. Discovery files: `/.well-known/mcp/server-card.json`, `/.well-known/ard.json`, `/.well-known/agent-skills/index.json` and `/llms.txt`. `/agents` introduces the site's agent tools, with public content search and an expandable API reference. WebMCP tools can search and read published client work, writing and products, and fill an editable enquiry on the contact page for the visitor to review. The read-only `/api/v1/catalog` endpoint includes profile, product and commercial information. Pricing stays in JSON and tool responses rather than visible site pages. See [agent readiness](docs/agent-readiness.md) for WebMCP setup, verification commands and the remaining Wikipedia/Wikidata work.

## Publishing the SDK and CLI packages

```bash
bun run packages:build
bun run packages:test
```

`.github/workflows/publish-packages.yml` publishes `@applification/sdk`, `@applification/cli` and the `applification` PyPI package with provenance when a `packages-v*` tag is pushed, or on manual dispatch. It relies on npm trusted publishing and PyPI trusted publishing (OIDC), so configure both registries to trust this repository's workflow before the first run; no long-lived tokens are stored. Bump the version in each package before tagging. Each package sets `homepage` to applification.net and `repository` to this project, which is how agents verify an official package.

Public API reads use an independent, instance-local 120-request/minute allowance per client IP and return quota headers on success, query errors and throttling. See [rate-limit conventions](docs/agent-readiness.md#rate-limit-response-conventions) for header examples, scope, caching and deployment requirements.

## Contact service protection

The contact workflow uses Vercel BotID Basic and the Vercel Firewall SDK before AI preparation, attachment writes/deletes and delivery. A shared SDK rule named `contact-write` allows 30 requests per 15-minute fixed window, checked separately by IP address and a browser-session UUID. The session key is an extra fairness limit, not authentication. Vercel counters are regional; an AI Gateway key budget provides the separate spend limit. Redis is not required.

The rule is configured on the `applification` Vercel project. Deploy the client instrumentation and API guards together. If the firewall rule or bot verification is unavailable, writes fail closed with a recoverable error. Local development bypasses these Vercel checks, but still validates origin, session headers and request bodies. Do not run production using `NODE_ENV=development`.

Set `CONTACT_AI_GATEWAY_API_KEY` to a budgeted Gateway key, or use the existing `AI_GATEWAY_API_KEY`. Preparation never falls back to OIDC, which could bypass that key's budget. The project's existing key has a $5 budget without automatic refill; review its balance and refill deliberately in Vercel. In-flight requests may cause small budget overages. `CONTACT_AI_MODEL` selects the model. No response caching is used.

Messages and detailed brief fields accept up to 12,000 characters; summaries accept 4,000. Short identity and logistics fields have their own limits in `contact-draft.ts`. The composer preserves oversized pasted text, shows an inline error and blocks submission until it fits. JSON requests are capped at 384 KiB and uploads at 4 MiB plus bounded multipart overhead. Attachment contents and metadata are excluded from AI requests.

Preparation uses JSON mode and strict application validation. Live checks found Gemini 2.5 Flash Lite repeating text to the token cap with the schema-constrained response mode. Each request allows at most two model attempts, with a 25-second timeout per attempt and 8,192 output tokens. Only malformed or conflicting proposals are retried; timeouts, provider throttles and exhausted budgets are not retried automatically. Validation logs contain issue codes and known field paths, never messages, email addresses, documents or raw model replies.

Visitors can complete a brief manually, preserving accepted details and their pending message. Both paths lead to the same review and consent step. Manual editing needs no AI call; sending and attachments still require abuse protection. LinkedIn remains available if the contact service cannot verify the browser.

Before production rollout, verify BotID from a real browser on a Vercel preview, check that `contact-write` exists, and confirm the budgeted key is configured. Local tests cannot exercise Vercel's production bot classification. Railway can still host the site shell, but these contact write endpoints now require Vercel's protection services.
