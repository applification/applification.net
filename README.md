# applification.net

Bun workspace for the Applification website and future services.

## Structure

```text
apps/
  applification/   Next.js website
packages/          Shared packages when the project needs them
```

## Commands

```bash
bun install
bun run dev
bun run build
bun run lint
bun run typecheck
```

## Railway

Connect Railway to the repository root. The root `build` and `start` scripts run the website workspace. Railway supplies `PORT` to `next start`.

The site shell is intentionally small. Product sections and page content will be planned and delivered through StoryLoops.

## Contact service protection

The contact workflow uses Vercel BotID Basic and the Vercel Firewall SDK before AI preparation, attachment writes/deletes and delivery. A shared SDK rule named `contact-write` allows 30 requests per 15-minute fixed window, checked separately by IP address and a browser-session UUID. The session key is an extra fairness limit, not authentication. Vercel counters are regional; an AI Gateway key budget provides the separate spend limit. Redis is not required.

The rule is configured on the `applification` Vercel project. Deploy the client instrumentation and API guards together. If the firewall rule or bot verification is unavailable, writes fail closed with a recoverable error. Local development bypasses these Vercel checks, but still validates origin, session headers and request bodies. Do not run production using `NODE_ENV=development`.

Set `CONTACT_AI_GATEWAY_API_KEY` to a budgeted Gateway key, or use the existing `AI_GATEWAY_API_KEY`. Preparation never falls back to OIDC, which could bypass that key's budget. The project's existing key has a $5 budget without automatic refill; review its balance and refill deliberately in Vercel. In-flight requests may cause small budget overages. `CONTACT_AI_MODEL` selects the model. No response caching is used.

Messages and detailed brief fields accept up to 12,000 characters; summaries accept 4,000. Short identity and logistics fields have their own limits in `contact-draft.ts`. The composer preserves oversized pasted text, shows an inline error and blocks submission until it fits. JSON requests are capped at 384 KiB and uploads at 4 MiB plus bounded multipart overhead. Attachment contents and metadata are excluded from AI requests.

Preparation uses JSON mode and strict application validation. Live checks found Gemini 2.5 Flash Lite repeating text to the token cap with the schema-constrained response mode. Each request allows at most two model attempts, with a 25-second timeout per attempt and 8,192 output tokens. Only malformed or conflicting proposals are retried; timeouts, provider throttles and exhausted budgets are not retried automatically. Validation logs contain issue codes and known field paths, never messages, email addresses, documents or raw model replies.

Visitors can complete a brief manually, preserving accepted details and their pending message. Both paths lead to the same review and consent step. Manual editing needs no AI call; sending and attachments still require abuse protection. LinkedIn remains available if the contact service cannot verify the browser.

Before production rollout, verify BotID from a real browser on a Vercel preview, check that `contact-write` exists, and confirm the budgeted key is configured. Local tests cannot exercise Vercel's production bot classification. Railway can still host the site shell, but these contact write endpoints now require Vercel's protection services.
