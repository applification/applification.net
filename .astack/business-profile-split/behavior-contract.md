# Business and contractor site split

Applification's buyers need an outcome they can commission; recruiters need to see Dave's frontend contract fit. One Next.js/Vercel deployment serves `applification.net` and `dave.applification.net`, with shared components and explicitly owned content.

## Acceptance

- A1: Business home explains MCP integrations, MCP Apps, access, approvals, scoped delivery and agency involvement. Its primary action prepares a project enquiry.
- A2: Profile home names Dave, foregrounds React/TypeScript/Next.js, shows remote UK availability and North East hybrid preferences, client outcomes, CV and LinkedIn. Its primary action prepares a contract enquiry.
- A3: Hostname determines home, shell, metadata, canonical URLs, social image and sitemap. Preview selection cannot override production identity or caller headers.
- A4: Existing About, all career case studies (including Logically) and writing move to Dave with path/query preserving redirects; products, agent guide and privacy belong to Applification. Business evidence links to Dave’s case externally. Agent/Markdown views follow the same ownership. Public contact links redirect to Dave for contracts and Applification for product/general enquiries; each page offers only its own enquiry types. APIs and private contact review remain same-origin.
- A5: Both homepages reflow at 320, 390, 900 and 1440px, in light/dark themes. Navigation and examples work by keyboard, retain focus, and support reduced motion.
- A6: Proof distinguishes Logically (commercial work during employment), Contexture (released open source), Loami (in development), StoryLoops (archived). Illustrative workflow examples are labelled; no unverified client or deployment claims.

- A7: Dave’s navigation is Client work, Writing, About, CV and contract Contact, with a separate external Applification.net callout. His name remains visible at every width, his footer is personal, and the homepage business connection is a short external link. Products belong to the business. Both sites keep the shared logo mark, bot shortcut and Human / Agent control; Dave’s reader keeps his content and his bot shortcut links explicitly to the external business agent guide.

## Design and verification decisions

Current design authority: `apps/applification/design.md`, runtime tokens and existing components. Keep Newsreader headings, Geist body, mono capability labels, slate-blue surfaces and sky-blue actions. Business composition: outcome + integration example; capabilities; scoped delivery; production proof + product evidence; agency involvement; founder and enquiry. Profile composition: Dave + contract fit; client names/outcomes; frontend/full-stack/AI fit; business connection.

Pen was selected to inspect existing composition references; both app-state and skill calls failed because the app is disconnected. No `.pen` text was read/edited. Current rendered components supply the usable design reference. This is a design-history comparison gap, covered for delivery by rendered Storybook/browser review; no Pen approval is claimed.

Storybook selected for both full pages, shared hostname shell and the selectable integration example; fixture checks cover hierarchy, working links, keyboard interaction and overflow, with axe violations treated as errors. Running browser checks cover real routes, metadata, desktop/mobile navigation and the downloadable PDF. Routing tests exercise the real NextRequest/NextResponse proxy.

## Migration choices

Use request-time hostname selection, accepting dynamic rendering of the shared layout to avoid duplicating applications and content. Local/Vercel preview choices use `?site=business|profile` and an HTTP-only preview cookie; public hostnames take precedence. Preserve the contact workflow, private CV review and origin guard. A separate downloadable public CV is compiled only from already-published professional facts; it links to Dave's new homepage.

No new Parallax endorsement, commercial MCP App client claim, current security clearance, precise availability date or published day rate is inferred. Production domain attachment and deployment remain explicit hosting steps after review.

## Observed proof

Baseline at `299fc2e`: 320 unit assertions passed; one Rive runtime suite could not load its dependency because installed packages lagged the lockfile. Restore frozen dependencies before delivery checks.

Initial delivery checks at `08f4b18` on 8 October 2026, macOS arm64, Bun 1.4.0, Next.js 16.3.6, local production server on port 3333:

- A1/A2/A6: both complete pages reviewed against the supplied commercial/contractor brief and existing published case/product material. Illustrative examples disclose their status and distinguish read-only, scoped operational access and a user-approved write.
- A3/A4: 65 assertions against the production build passed. These cover both hostnames, titles/canonicals/OpenGraph, distinct generated social images, per-host sitemaps/robots, path/query preserving 308 redirects, API/catalog URLs, Agent/Markdown content, contact entry points and public PDF bytes. A real Host-header defect was found and fixed; regression coverage includes Next's internal localhost URL and overwritten caller identity.
- A5: browser review at actual measured 320, 390, 900 and 1440px; no horizontal overflow on either homepage. Light/dark desktop and mobile captures are retained in `evidence/`. Keyboard activation of examples, focus on opening navigation, Escape focus return and mobile contact navigation worked. Reduced-motion emulation was enabled for both mobile contact journeys. The profile's CV link downloaded the expected PDF; both PDF pages and published links were reviewed.
- `bun run check`: lint/typecheck passed, 333 unit tests and 10 workflow tests passed. `bun run test:storybook`: 307 interaction/accessibility tests passed, including both homepages at light/dark desktop/mobile/tablet/320px, keyboard example and contact-disabled fallback. Full-page story IDs are `homepage-mcp-business` and `homepage-contractor-profile`.
- `CONTACT_WORKFLOW_ENABLED=true bun run build`: passed. The running-server assertions and final browser review used this production build. No dependency or lockfile changes.

Initial self-review: intent matched A1–A6. APIs and private review capabilities keep their existing same-origin behavior; catalog URL fields are additive and existing consumers/schema tests pass. One shared application accepts request-time rendering for distinct host identities. Hostname classification is centralized, source content remains shared, and public CV input is separate from private workflow storage.

Retained images: desktop and mobile full pages for each identity; desktop/mobile dark hero views; focused desktop preview images for the chat. `responsive-observations.json` records measured narrow/intermediate widths and reduced-motion state. Raw runner logs and redundant breakpoint captures are not committed.

Limits: Pen is disconnected (no design-history comparison), and `agentlog` is unavailable (no Observatory capture/evaluation claimed). Local checks prove contact entry, validation and workflow behavior; a real provider-delivery smoke test on both live hostnames remains part of launch. No actual enquiry was sent, and no production domain/deployment was changed. The Vercel attachment, DNS/TLS and apex/www change are documented in `docs/runbooks/site-hostnames.md`.


## Navigation and content separation follow-up

The profile shell no longer contains business Products or company GitHub. Both shells retain the logo mark, bot shortcut and floating Human / Agent control. Dave’s reader keeps his content and navigation; his bot shortcut links explicitly to the external business agent guide. Dave’s name stays visible at every width; his menu is Client work, Writing, About, CV and contract Contact, with a separate external Applification.net callout. The homepage’s founder section is now a short external link. All case studies, including Logically, have one home on Dave’s site; the business links externally to his evidence. Agent/Markdown navigation follows the same ownership. Public contract contact links redirect to Dave, and product/general links redirect to the business. The visible AI and manual contact forms offer only their site’s enquiry types. Private review links and API delivery controls remain same-origin.

Follow-up verification on 8 October 2026, with the same environment as initial delivery:

- Lint/typecheck passed, with 345 unit tests and 10 workflow tests passing. All 316 Storybook interaction/accessibility tests passed. New fixtures cover the personal menu and footer, both contact forms, external links and the intermediate header breakpoint. The business dropdown checks wait for its exit animation before accessibility scanning.
- The production build passed. All 95 assertions against the real server passed, including contact-route redirects and distinct enquiry choices, case ownership, sitemaps, canonicals, API source URLs and the PDF.
- Both homepages were measured at actual 320, 390, 900, 1024 and 1440px, without horizontal overflow. Dave’s menu takes focus on Client work and Escape returns it to the menu button. Reduced-motion mobile contact navigation reached the contract workspace; its manual form contained only contract fields. Business route selection offered only product and general enquiries.
- The header CV link downloaded the current two-page PDF. Its five published links were checked; Logically now points directly to Dave’s case study.
- Screenshots in `evidence/` were refreshed for both homepages, their themes and viewports. `profile-mobile-menu.jpg` shows the shared mark, bot shortcut and separate business callout. `profile-agent-preview.jpg` records Dave’s own reader, reached through the restored Agent switch; Human returned to his homepage. The restored controls were measured again at 320/390/900/1024/1440px without overflow. Browser zoom was retained; viewport emulation was compensated for measurements and reset afterwards.

Self-review: A1–A7 are satisfied. Visual tokens and deployment remain shared, with separate navigation, owned pages and contact purposes. No enquiry was sent or production hostname configuration changed.
