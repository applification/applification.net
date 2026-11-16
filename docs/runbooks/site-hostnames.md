# Business and contractor hostnames

One Next.js app and Vercel project serve two identities:

| Host | Job | Main action |
| --- | --- | --- |
| `applification.net` | MCP integration and MCP Apps delivery for businesses and agencies | Discuss a project |
| `dave.applification.net` | Dave Hudson’s frontend/product contract profile and public CV | Discuss a contract |
| `www.applification.net` | Business alias; canonical content points to the apex | Discuss a project |

`src/proxy.ts` derives identity from the public Host header, overwrites the internal identity header and preserves query parameters on section redirects. The shared layout renders at request time, accepting the cost of dynamic page rendering rather than maintaining duplicate applications. The contact APIs, private review links, data access and delivery workflow retain their existing ownership and same-origin behaviour. Public `/contact?route=contract` links belong to Dave; product and general enquiry links belong to the business, with query-preserving redirects from the other host. Each contact page offers only its own enquiry types.

## Existing links

- Business `/about`, `/client-work` and all `/client-work/*` cases, `/writing/*` and `/posts/*` redirect permanently to the same path on Dave’s site.
- Dave’s `/products/*`, `/agents`, `/privacy` and `/llms.txt` redirect permanently to Applification.
- Agent and Markdown variants follow the same section ownership.
- Logically lives only on Dave’s site, with `https://dave.applification.net/client-work/logically` as its canonical source. Applification’s production evidence links to it externally.
- Each host has its own root metadata, social image, robots sitemap reference and sitemap. Dave’s shell has profile-only navigation, a direct CV download and an external Applification.net callout. Product/API/skill discovery remains on Applification. Both sites retain Human / Agent views with their own content; Dave’s header omits the bot shortcut, while the business header retains its agent-guide link. Public catalog facts link to Dave’s profile, public CV and contract contact routes.
- Contact APIs and private review routes remain on the current hostname. Existing emailed review capabilities are still valid on `www`; no private workflow route is migrated.

## Hosting audit and launch steps

Read-only Vercel inspection on **8 October 2026** confirmed project `applification` (`prj_8QYoc5zHy72mdCaqkLZENs0LFqMK`), root `apps/applification`, and Node 24.x. The project has verified `applification.net` and `www.applification.net`; the apex currently redirects to `www` with 308. `dave.applification.net` is not attached. No live domain settings were changed during implementation.

For the reviewed release:

1. Attach `dave.applification.net` to the **same** Vercel project’s Production environment. Add the DNS record Vercel requests at the domain’s DNS provider and wait for verification and HTTPS. Use the project’s recommended record rather than assuming a universal CNAME value.
2. Set `applification.net` to serve the Production deployment directly (remove its existing redirect to `www`). Then set `www.applification.net` to redirect to `applification.net` with 308, preserving the path. The application deliberately does not force this alias redirect, so the existing hosting configuration cannot create an apex/www loop.
3. Keep `CONTACT_WORKFLOW_ENABLED=true` and the existing contact-service variables, Blob, Workflow, BotID and Firewall configuration. Set `CONTACT_PUBLIC_BASE_URL=https://applification.net` for new operational links after the canonical switch. Both contact pages call their own same-origin APIs; the existing origin guard also allows its configured base URL.
4. Check BotID/Firewall and any WebMCP origin-trial registration for the new hostname. The contact workflow needs a real preview/production smoke test on both domains before release; local entry-point and workflow tests do not prove provider delivery. For an actual smoke test, use an explicitly approved test enquiry and recipient under the existing contact runbook.
5. Merge/promote the reviewed implementation, then open both domains and rerun navigation, CV, canonical, sitemap and contact checks. Keep application deployment and domain rollout coordinated so moved sections have a reachable destination. Submit both sitemaps to any configured search-console properties.

No new hosting project, database, email address or production secret is required by the split. The public PDF is separate from the private CV stored in Blob. Contract applications should use `https://dave.applification.net`.

## Local and branch previews

`bun run dev:direct` serves:

- `http://applification.localhost:3333`
- `http://dave.applification.localhost:3333`

These names allow both previews to stay open with independent hostname identity. A generic localhost or Vercel **Preview** URL can also select `?site=business` or `?site=profile`. This sets an HTTP-only, same-site preview cookie so subsequent navigation uses that identity. A preview cookie is shared between tabs on the same preview hostname; the named local hosts avoid that limitation. Production domains ignore the selector. Preview responses include `X-Robots-Tag: noindex, nofollow`.

## Verification and public CV

Run the repository’s lint, typecheck, unit, workflow, Storybook and build checks. With the Next server running, exercise the production identities through explicit Host headers:

```sh
node apps/applification/scripts/verify-site-split.mjs http://localhost:3333
```

This checks rendered metadata, the real proxy redirects, per-host robots/sitemaps, Agent/Markdown content, the public catalog, CV bytes and contact entry points. It does not change DNS or send an enquiry.

The public CV is edited in `apps/applification/content/cv.json` and generated with `python3 apps/applification/scripts/build-public-cv.py` (requires ReportLab). Check its two-page layout and links after changing it. It contains only facts from the published career history; availability should always be confirmed against the current profile.
