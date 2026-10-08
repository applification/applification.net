# Business and contractor site split

Applification's buyers need an outcome they can commission; recruiters need to see Dave's frontend contract fit. One Next.js/Vercel deployment serves `applification.net` and `dave.applification.net`, with shared components and explicitly owned content.

## Acceptance

- A1: Business home explains MCP integrations, MCP Apps, access, approvals, scoped delivery and agency involvement. Its primary action prepares a project enquiry.
- A2: Profile home names Dave, foregrounds React/TypeScript/Next.js, shows remote UK availability and North East hybrid preferences, client outcomes, CV and LinkedIn. Its primary action prepares a contract enquiry.
- A3: Hostname determines home, shell, metadata, canonical URLs, social image and sitemap. Preview selection cannot override production identity or caller headers.
- A4: Existing About, frontend case studies and writing move to Dave with path/query preserving redirects; products belong to Applification. Logically is readable on both, canonically on Applification. Agent/Markdown views follow the same ownership. APIs and private contact review remain same-origin.
- A5: Both homepages reflow at 320, 390, 900 and 1440px, in light/dark themes. Navigation and examples work by keyboard, retain focus, and support reduced motion.
- A6: Proof distinguishes Logically (commercial work during employment), Contexture (released open source), Loami (in development), StoryLoops (archived). Illustrative workflow examples are labelled; no unverified client or deployment claims.

## Design and verification decisions

Current design authority: `apps/applification/design.md`, runtime tokens and existing components. Keep Newsreader headings, Geist body, mono capability labels, slate-blue surfaces and sky-blue actions. Business composition: outcome + integration example; capabilities; scoped delivery; production proof + product evidence; agency involvement; founder and enquiry. Profile composition: Dave + contract fit; client names/outcomes; frontend/full-stack/AI fit; business connection.

Pen was selected to inspect existing composition references; both app-state and skill calls failed because the app is disconnected. No `.pen` text was read/edited. Current rendered components supply the usable design reference. This is a design-history comparison gap, covered for delivery by rendered Storybook/browser review; no Pen approval is claimed.

Storybook selected for both full pages, shared hostname shell and the selectable integration example; fixture checks cover hierarchy, working links, keyboard interaction and overflow, with axe violations treated as errors. Running browser checks cover real routes, metadata, desktop/mobile navigation and the downloadable PDF. Routing tests exercise the real NextRequest/NextResponse proxy.

## Migration choices

Use request-time hostname selection, accepting dynamic rendering of the shared layout to avoid duplicating applications and content. Local/Vercel preview choices use `?site=business|profile` and an HTTP-only preview cookie; public hostnames take precedence. Preserve the contact workflow, private CV review and origin guard. A separate downloadable public CV is compiled only from already-published professional facts; it links to Dave's new homepage.

No new Parallax endorsement, commercial MCP App client claim, current security clearance, precise availability date or published day rate is inferred. Production domain attachment and deployment remain explicit hosting steps after review.

## Observed proof

Baseline at `299fc2e`: 320 unit assertions passed; one Rive runtime suite could not load its dependency because installed packages lagged the lockfile. Restore frozen dependencies before delivery checks.

Delivery checks on 8 October 2026, macOS arm64, Bun 1.4.0, Next.js 16.3.6, local production server on port 3333:

- A1/A2/A6: both complete pages reviewed against the supplied commercial/contractor brief and existing published case/product material. Illustrative examples disclose their status and distinguish read-only, scoped operational access and a user-approved write.
- A3/A4: 65 assertions against the production build passed. These cover both hostnames, titles/canonicals/OpenGraph, distinct generated social images, per-host sitemaps/robots, path/query preserving 308 redirects, API/catalog URLs, Agent/Markdown content, contact entry points and public PDF bytes. A real Host-header defect was found and fixed; regression coverage includes Next's internal localhost URL and overwritten caller identity.
- A5: browser review at actual measured 320, 390, 900 and 1440px; no horizontal overflow on either homepage. Light/dark desktop and mobile captures are retained in `evidence/`. Keyboard activation of examples, focus on opening navigation, Escape focus return and mobile contact navigation worked. Reduced-motion emulation was enabled for both mobile contact journeys. The profile's CV link downloaded the expected PDF; both PDF pages and published links were reviewed.
- `bun run check`: lint/typecheck passed, 333 unit tests and 10 workflow tests passed. `bun run test:storybook`: 307 interaction/accessibility tests passed, including both homepages at light/dark desktop/mobile/tablet/320px, keyboard example and contact-disabled fallback. Full-page story IDs are `homepage-mcp-business` and `homepage-contractor-profile`.
- `CONTACT_WORKFLOW_ENABLED=true bun run build`: passed. The running-server assertions and final browser review used this production build. No dependency or lockfile changes.

Self-review: intent matches A1–A6. APIs and private review capabilities keep their existing same-origin behavior; catalog URL fields are additive and existing consumers/schema tests pass. One shared application accepts request-time rendering for distinct host identities. Hostname classification is centralized, source content remains shared, and public CV input is separate from private workflow storage.

Retained images: desktop and mobile full pages for each identity; desktop/mobile dark hero views; focused desktop preview images for the chat. `responsive-observations.json` records measured narrow/intermediate widths and reduced-motion state. Raw runner logs and redundant breakpoint captures are not committed.

Limits: Pen is disconnected (no design-history comparison), and `agentlog` is unavailable (no Observatory capture/evaluation claimed). Local checks prove contact entry, validation and workflow behavior; a real provider-delivery smoke test on both live hostnames remains part of launch. No actual enquiry was sent, and no production domain/deployment was changed. The Vercel attachment, DNS/TLS and apex/www change are documented in `docs/runbooks/site-hostnames.md`.
