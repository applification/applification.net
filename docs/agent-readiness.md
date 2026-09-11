# Agent readiness

The ora scan supplied for applification.net scored 35/100 (D). This branch adds useful public information and browser tools for a personal portfolio and contract engineering business.

## Human and Agent views

Public content pages expose a Human / Agent header switch. `/agent` shows the homepage as Markdown inside the site shell; `/agent/<page-path>` shows the selected page. `/markdown` and `/markdown/<page-path>` return the same complete document as `text/markdown`, with CORS, a canonical Link header and a one-hour cache. The header advertises a Markdown alternate and `llms.txt` documents the URL pattern. The Agent HTML view has a canonical URL pointing back to the human page and is marked noindex to avoid duplicate search entries.

Supported pages are home, about, client work (index and case studies), products (index and detail), published writing (index and articles), agents and privacy. Contact forms and review capabilities, previews, unpublished writing, arbitrary paths and API routes have no Markdown view. The reader uses explicit route matching and published-content loaders, never a request-controlled file read or self-fetch. API continuation chunks are rejoined without breaking long paragraphs or code fences. Commercial terms remain in the existing public API.

Authored introductions, about-page evidence and privacy copy live in `src/lib/content/` and are shared with the visual pages. Case studies, products and writing use the existing published-content reader. The Agent view renders plain text, so embedded HTML is never executed. Header navigation preserves Agent mode for supported destinations; returning to Human restores the corresponding page path. Query filters and fragments are not copied into the public reader. The selected writing index is the complete published archive.

The Agents guide introduces using ChatGPT or Claude with web access, then offers a visible starter prompt and direct web links (`https://chatgpt.com/?q=...` and `https://claude.ai/new?q=...`). Both URLs encode the same text shown and copied on the page; they are also included in the Markdown view. These are ordinary external links with no script or app installation required. The assistant controls sign-in and whether it prefills or submits the prompt, so the page does not promise a review step or automatic web access. Visitors can copy the prompt if it does not survive the handoff, or paste Markdown if web fetching fails. Copy controls report both success and a manual-copy fallback. No native ChatGPT/Claude connector is claimed or installed. Browser-safe skill descriptions are separated from the server-side discovery digest so Storybook can render the guide.

## Implemented surfaces

- `/`: server-rendered JSON-LD linking Dave Hudson (`Person`), Applification (`Organization`) and the site (`WebSite`), with existing public profile links. JSON is escaped before embedding in HTML.
- `/agents`: a concise guide for people using agents, with a published-content search form, WebMCP explanation and expandable API reference. The shared footer links to Agents. No API key is required or issued for public information.
- Pricing and commercial terms remain in the catalog JSON and WebMCP responses, without a visible pricing page or commercial section. `/developers` permanently redirects to `/agents`; `/pricing` permanently redirects to `/api/v1/catalog?section=pricing` for clients using that discovery URL. No day rate or unpublished product price is invented.
- `/api/v1/catalog`: versioned, anonymous, CORS-enabled reads. Optional `section=all|profile|products|pricing`; invalid, repeated and unknown parameters return 400. Responses contain no contact submissions or private delivery configuration.
- `/api/v1/search`: search or list published client work, writing and products. Filters: query, type, topic, status, after, before, limit (1–10, default 5) and offset. Writing dates are inclusive; product status is live, in-development or research. Results return canonical source URLs, summaries and nextOffset.
- `/api/v1/content`: read by type and slug from search results. Each response includes one Markdown section (up to 4,000 characters), a table of contents, nextSection and source links. Follow nextSection to read the whole document. Embedded references remain available without fetching external media or inventing transcripts. Invalid input returns 400, absent content/sections 404.
- `/api/v1/sandbox`: a live, anonymous first call for the ora "Agent onboarding friction" check, which reported free tier and sandbox signals as described but not verified live. The response returns `status: ok`, the machine-readable onboarding facts from `publicOnboarding` in `public-catalog.ts` (free tier, no API keys, sandbox, first call, documentation URLs, each with a URL that verifies the claim) and suggested next requests. Credentials are ignored; query parameters return 400. The sandbox is the production API because every read is side-effect free, so no separate test environment is invented. The catalog's `pricing.api` now carries `freeTier`, `apiKeyRequired` and `sandboxUrl`, the OpenAPI document carries the same facts as `info.x-onboarding` plus an Onboarding tag and the sandbox path, `/llms.txt` has an Onboarding section, and `/agents` has a "Start without an account" section linking the sandbox.
- `/api/openapi.json`: OpenAPI 3.1 reference with response schemas, including both content routes and the sandbox route.
- `/llms.txt`, `/sitemap.xml`, `/robots.txt`: discovery links, published pages only in the sitemap, and explicit public crawling access. Robots exclusions are not access controls; existing private-route checks remain responsible for protection.
- Shared footer links and `service-desc` / `service-doc` links make the documentation discoverable.
- `/.well-known/agent-skills/index.json` and `/.well-known/agent-skills/applification-site/SKILL.md`: an Agent Skills discovery index (v0.2.0) pointing at one `skill-md` artifact with its SHA-256 digest. Both derive from `apps/applification/src/lib/agent-skills.ts`, so the digest always matches the served bytes; a unit test checks this.
- `/.well-known/ard.json`: an Agentic Resource Discovery (ARD) manifest with an `entries` array of domain-anchored URNs (`urn:air:applification.net:...`) for the OpenAPI document, the site skill and `llms.txt`, each with a media type, URL and 2–5 representative queries. It derives from `apps/applification/src/lib/ard.ts`; a unit test checks required fields, identifier format and that the skill entry matches the Agent Skills index.
- skills.sh listing: `skills/applification-site/SKILL.md` at the repository root is the copy that skills.sh indexes from GitHub (`npx skills add applification/applification.net --skill applification-site`). It is generated from `agent-skills.ts` by `bun run skills:sync` and a unit test fails when it drifts from the served SKILL.md. `publishedSkills` in the same module also describes the StoryLoop skill from `applification/storyloop-skill`; `/llms.txt` has an "Agent skills on skills.sh" section, `/.well-known/ard.json` carries a StoryLoop entry plus `skillsShUrl`, `repositoryUrl` and `installCommand` metadata on each skill entry, and `/agents` has an "Install a skill" section, so the site and the directory reference each other.
- `skills-lock.json` also records the third-party `workflow` skill synced into `.agents/skills/` from Vercel's `workflow` package. The skills CLI skips skills named in the lock when it lists a repository, so `npx skills add applification/applification.net` offers only `applification-site` and skills.sh does not present Vercel's skill as an Applification skill. Registration needs one install from the pushed default branch with CLI telemetry enabled (the default); listings are cached, so allow time before rescanning.
- `/llms.txt` now opens with "When to use this site" and "How to call it" sections that name the jobs the site is right for, the jobs it is not for, and the three read-only endpoints in order.
- `/`: the JSON-LD graph adds `contactPoint` and `address` to the `Organization` (contact URL and `addressCountry` only, because no email, phone or street address is published), a `Service` for contract engineering, `SoftwareApplication` entries for the MIT-licensed products, and an `FAQPage`. Product, client-work, about, agents and privacy pages emit a `BreadcrumbList`.
- `/privacy`: a plain-language privacy page covering anonymous reading, analytics, the contact workflow, third-party services and UK GDPR rights. Linked from the footer, `llms.txt` and the sitemap.

The HTTP endpoint and WebMCP tool derive profile, product and pricing data from `apps/applification/src/lib/public-catalog.ts`, using the existing positioning and product catalog. Update that source when commercial terms change. The visible reader searches client work, writing and products. The complete catalog and imperative overview tool also expose pricing. The API's `pricing` section and response fields remain available.

## Rate-limit response conventions

Public `GET` and `HEAD` requests share **120 requests per 60-second fixed window per client IP, per server instance** across `/api/v1/catalog`, `/api/v1/search`, `/api/v1/content` and `/api/openapi.json`. Successful reads and invalid/missing-content requests consume one unit. Exhausted requests return `429` with `error.code: RATE_LIMITED`; they do not extend the window. `OPTIONS` is unmetered, succeeds even at zero remaining, and reports the current allowance.

Every response from these GET/HEAD/OPTIONS handlers carries the following fields. Example after the first request, with 42 seconds left:

```http
RateLimit-Policy: "public-read";q=120;w=60
RateLimit: "public-read";r=119;t=42
RateLimit-Limit: 120
RateLimit-Remaining: 119
RateLimit-Reset: 42
Cache-Control: no-store
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: RateLimit, RateLimit-Policy, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After
```

`RateLimit-Policy` and `RateLimit` follow the [IETF HTTPAPI RateLimit draft](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers), which has not yet been published as an RFC. The individual `RateLimit-*` fields support clients using earlier conventions. `q`/Limit is the window allowance, `w` the window length, `r`/Remaining the allowance after this request, and `t`/Reset whole seconds until reset, rounded up. Reset is **not** a Unix timestamp. On `429`, remaining is zero and `Retry-After` equals Reset. Wait at least that many seconds, then retry with backoff and jitter if still throttled. Infrastructure can impose additional limits; also back off on `503`.

Responses use `no-store` and the OpenAPI route runs dynamically so browsers/CDNs cannot reuse another request's counters. No shared quota store or new external service is required. The in-memory counters reset on server restarts and are shared only among route handlers in the same runtime, not across regions or serverless instances. This is a courtesy limit for free reads, not a global abuse or spending cap. At most 10,000 hashed client addresses are retained per window; additional addresses share one overflow allowance until reset. Missing/invalid addresses share a fallback allowance.

Vercel uses its overwritten `x-vercel-forwarded-for` header. On other hosts, the trusted ingress must **overwrite** `x-forwarded-for` with the client address and prevent direct origin access; never trust caller-supplied forwarding values. Test headers can be supplied directly only on a local test server. Contact endpoints keep their existing Vercel Firewall protection: a blocked `contact-write` bucket reports its 30-per-900-second policy with zero remaining and a conservative 900-second reset/Retry-After because the SDK exposes no exact counter or reset. AI-provider throttles recommend a 60-second retry delay; delivery throttles recommend 900 seconds. Successful contact requests do not invent remaining quota values unavailable from the SDK.

Use `curl -i` for a success, an invalid query and a HEAD request against a local production build. Automated tests exhaust a small quota, check independent clients and cross-route sharing, allow preflight while exhausted, and advance the clock to verify reset. Do not flood production to test `429`.

Verified locally on 10 September 2026: lint, typecheck, production build, 166 unit tests and nine Agents page Storybook tests passed. The production server returned shared, decreasing counters across all four public routes, including `400` and `404`; request 121 returned `429` with matching Retry-After/Reset. Exhausted HEAD returned no body, OPTIONS still returned `204`, and a browser on another origin could read the quota fields through CORS. The updated usage copy was checked at desktop and mobile widths in both themes.

A forced ora rescan completed at `2026-09-10T17:34:49.156Z`: **61/100 (C)**; `rate-limit-headers` still failed (0/2). That result describes the deployed site, which does not include these local changes. Deploy this change and repeat the scan below to verify the live fix.

## WebMCP

`get_applification_info`, `search_site` and `read_content` are registered in the shared site layout when `document.modelContext.registerTool` is available, with `navigator.modelContext` as a trailing compatibility fallback. All three validate input and are annotated read-only. The content tools fetch the same-origin public HTTP endpoints; the overview returns catalog data directly. The registration uses an AbortSignal for cleanup; the old navigator unregistration method is used only where available on that fallback.

The reader submits a standard GET form. Its dropdown uses the shared Select from the contact form after hydration, with a styled native select fallback that keeps the reader usable without JavaScript. Both versions submit exactly one type parameter. Browser agents use the imperative search_site tool; the form does not register a duplicate search tool.

The dropdown was verified in Chromium and WebKit in both themes, including 44px sizing, selection, form submission and the JavaScript-free fallback. Storybook covers selection, keyboard focus and Escape dismissal. An additional open-popup axe check reported `aria-hidden-focus` on the background page hidden by the shared Radix Select; that open-state finding remains for accessibility follow-up. No axe rules were disabled.

Authored case-study and product copy lives in `src/lib/content/` and is imported by both the pages and the content readers. Writing uses the existing Markdown loader with `includeDrafts: false` explicitly, including local development. Private contact data and preview routes never enter search or read responses.

On the contact page only, `fill_contact_draft` accepts an enquiry route and fields for that route, with optional expectedVersion. It fills empty fields in the current browser draft, preserves entered values and attachments, rejects conflicting routes/values and stale versions, and returns missing fields and validation issues. Equivalent retries retain the draft version. It updates the existing manual form before returning. The tool is removed while preparation, upload, delivery or field editing prevents safe draft changes; stale callbacks refuse to act. Unsent composer text is preserved and must be resolved first.

Drafting makes no network request and cannot set consent, upload a document, send email or approve CV release. The visitor can edit the populated fields, choose Review enquiry, and then explicitly send through the existing protected workflow. No public HTTP contact-write endpoint is added. The compact manual form grows with its content instead of using a fixed-height workspace or internal scrolling panel, keeping the review action in normal flow inside the card.

WebMCP is still a browser preview. For an eligible production origin, obtain a token from Chrome's [WebMCP origin trial](https://developer.chrome.com/docs/ai/webmcp/imperative-api) and set `WEBMCP_ORIGIN_TRIAL_TOKEN` at build/deploy time. The root metadata emits it as an `origin-trial` meta tag. Tokens must cover the actual serving origin, including `www` where applicable. No token is checked into the repository. Flag-enabled development browsers can exercise the tool without a production token. Unsupported browsers continue to use normal pages and the HTTP API.

Unit tests cover input validation, the document preference, navigator compatibility, cleanup and preview failures. Browser checks can inject a modelContext stub to verify registration and execution; that is not evidence of native WebMCP support in an unmodified browser.

Native verification on 10 September 2026 exercised the overview's four catalog sections and client-side navigation in a WebMCP-enabled Chromium browser. The expanded tool set was then verified against `https://applification.localhost` with `@ora-ai/webmcp-verify@0.1.0`: `search_site` found Logically for “production AI”, `read_content` returned the selected case-study section and nextSection, and `fill_contact_draft` populated a synthetic enquiry with reviewRequired true and sent false. All three verifier runs completed with no lint findings. This verifies native tool execution locally, not origin-trial activation on production.

## Wikipedia and Wikidata: external follow-up

No Wikipedia article or Wikidata item was created. Search found existing profiles and directory listings, but did not establish substantial independent coverage for a Wikipedia article. This gap cannot be resolved by a code change or by adding a fictional `sameAs` URL.

1. Collect substantial independent published sources about the company, not just its founder's own profiles or routine directory entries. Assess them against [Wikipedia's organisation notability criteria](https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)).
2. If those sources establish notability, prepare a neutral, attributed article draft and disclose the relationship to the company under [Wikipedia's conflict-of-interest guidance](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest). Use independent review before mainspace publication.
3. Assess a Wikidata item separately under [Wikidata's notability policy](https://www.wikidata.org/wiki/Wikidata:Notability); it does not require a Wikipedia article in every case. Check for duplicates and source the identity before creating an item. Set official website (P856) to the verified domain. Do not assume company dates or registry identity from similar names.
4. Once real entities exist, add their verified URLs to the appropriate JSON-LD identity. Keep person and company identities distinct.

## Verification and rollout

Run from the repository root:

```sh
bun run lint
bun run build
bun run typecheck
bun --cwd apps/applification test
bun --cwd apps/applification test-storybook --run src/components/agent-info src/components/site-footer.stories.tsx
bun --cwd apps/applification test-storybook --run src/components/contact/contact-workspace.stories.tsx src/components/contact/contact-webmcp.stories.tsx src/components/client-work src/components/products
```

Check `/`, `/agents`, `/contact`, the API and discovery routes against a local production build, plus redirects from `/developers` and `/pricing`. Verify readable HTML with JavaScript disabled, both themes and mobile layouts, the reader GET response, pricing data in JSON but absent from visible pages, disclosure keyboard access, API errors and 405 responses, and tool registration/execution with and without a modelContext implementation.

For a local production contact check, set the existing `CONTACT_WORKFLOW_ENABLED=true` environment variable for both build and start. Without an explicit setting, the contact workflow intentionally defaults to unavailable in production and `/contact` returns 404. Development enables it by default.

The branch is not a production deployment. A scan of applification.net cannot measure these changes until they are deployed.

The cached API was checked on 10 September 2026: 35/100, grade D, analysis complete. Its scan timestamp was `2026-09-10T15:16:25.035+00:00`; the canonical serving URL was `https://www.applification.net/`. This is the pre-deployment baseline, not a result for this branch.

Fetch the current cached result with:

```sh
curl --fail --show-error 'https://ora.ai/api/score/applification.net'
```

After deployment, request a new scan (force bypasses ora's freshness cache and consumes its scan quota):

```sh
curl --fail --show-error 'https://ora.ai/api/scan?format=audit' \
  -H 'Content-Type: application/json' \
  --data '{"url":"applification.net","force":true}'
```

If the response is 202, follow its Location header until `analysisStatus` is complete. Inspect the selected check results, not just the total score: ora's methodology may change. References: [API contract](https://ora.ai/api/openapi.json), [methodology](https://ora.ai/methodology), [score page](https://ora.ai/score/applification.net).

## Local tool examples

```json
{"tool":"search_site","input":{"query":"production AI","type":"client-work"}}
{"tool":"read_content","input":{"type":"client-work","slug":"logically","section":2}}
{"tool":"search_site","input":{"type":"writing","after":"2026-01-01","limit":5}}
{"tool":"search_site","input":{"type":"products","status":"live"}}
{"tool":"fill_contact_draft","input":{"route":"general","fields":{"topic":"Engineering enquiry","message":"A React project to discuss","replyName":"Alex Visitor","replyEmail":"alex@example.com"}}}
```

The final example applies only on `/contact` and prepares a visible draft; it does not send it. Test with synthetic details. Storybook's Agent drafting stories exercise the handoff, validation, retries, visitor edits and keyboard review without calling contact endpoints.

To execute an individual tool in a separate local test browser:

```sh
bunx --bun @ora-ai/webmcp-verify@0.1.0 https://applification.localhost/agents \
  --exec search_site --input '{"query":"production AI","type":"client-work"}' \
  --json --headless
```

The manual-form regression was reproduced before the layout fix at desktop, tablet, 390px and 320px widths. The updated regression checks keep the review action inside the form with bottom clearance and check for internal overflow, including after a long paste and across all enquiry types. The empty general form fits within 590px on desktop. The card grows naturally for longer content and single-column phone layouts. Earlier agent-tool validation passed 159 unit tests, the contact and content-page accessibility stories, lint, typecheck and production build. Production API checks covered successful reads, HEAD, OPTIONS, CORS, invalid input, draft rejection and unsupported methods.

The Agents GET form also returned results in a separate Chrome context with JavaScript disabled. A navigation attempt in the existing Chrome profile returned ERR_BLOCKED_BY_CLIENT; the same URL returned 200 over HTTP and worked in the separate browser context.
