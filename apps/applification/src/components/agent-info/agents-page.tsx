import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/external-link";
import { siteUrl } from "@/lib/public-catalog";
import { ContentTypeSelect } from "./content-type-select";
import {
  CodeSample,
  InfoLink,
  InfoSection,
  infoLinkClass,
} from "./info-layout";

export function AgentsPage() {
  return (
    <main className="flex-1">
      <PageHero
        density="compact"
        eyebrow="Agents"
        eyebrowDetail="Context and tools"
        headingId="agents-heading"
        title="A starting point for your agent."
        description="Using an agent to explore my work or products? It can find client work, read my writing, explore products and help prepare an enquiry."
        aside={
          <aside
            className="space-y-2 border-l-2 border-[var(--app-action)] pl-6"
            aria-label="Agent resources"
          >
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              Public site information
            </p>
            <p className="text-[var(--app-text-secondary)]">
              Read-only access. No account or key.
            </p>
            <div className="flex flex-col items-start">
              <InfoLink href="/llms.txt">Site guide for agents</InfoLink>
              <InfoLink href="/api/openapi.json">OpenAPI reference</InfoLink>
              <InfoLink href="/.well-known/ard.json">
                ARD catalog
              </InfoLink>
            </div>
          </aside>
        }
      />

      <InfoSection id="sandbox" title="See what your agent can read">
        <p className="max-w-[65ch]">
          Choose a part of the site to explore, or add a few search words.
          Results include a short summary and a source link. Your agent can then
          read the details it needs.
        </p>
        <form
          action="/api/v1/search"
          method="get"
          className="flex flex-col items-start gap-3 min-[720px]:flex-row min-[720px]:flex-wrap min-[720px]:items-end"
        >
          <div className="flex w-full min-w-0 flex-col gap-2 min-[520px]:w-auto min-[520px]:min-w-52">
            <label
              htmlFor="catalog-section"
              className="text-sm font-medium text-[var(--app-text-primary)]"
            >
              Where would you like to look?
            </label>
            <ContentTypeSelect />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 min-[720px]:w-auto min-[720px]:flex-1">
            <label
              htmlFor="content-query"
              className="text-sm font-medium text-[var(--app-text-primary)]"
            >
              Search words (optional)
            </label>
            <input
              id="content-query"
              name="query"
              maxLength={200}
              placeholder="For example, production AI"
              className="min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 text-base text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
            />
          </div>
          <Button
            type="submit"
            className="min-h-11 px-5 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Find content
          </Button>
        </form>
        <p className="max-w-[65ch] text-base">
          This reader works without JavaScript. It opens public information and
          makes no changes.
        </p>
      </InfoSection>

      <InfoSection id="browser-agents" title="Use it through your browser">
        <p className="max-w-[65ch]">
          A browser agent with WebMCP support can use{" "}
          <code className="font-data text-sm">search_site</code> to find
          relevant evidence, then{" "}
          <code className="font-data text-sm">read_content</code> to read a
          result. For example, it can find client work involving production AI
          interfaces.
        </p>
        <CodeSample label="search_site input">
          {'{ "query": "production AI", "type": "client-work" }'}
        </CodeSample>
        <p className="max-w-[65ch]">
          On the contact page, your agent can fill an editable enquiry using the
          details you provide. You review it and decide whether to send. The
          public information tools also work through the HTTP API.
        </p>
      </InfoSection>

      <InfoSection id="reference" title="Connecting an agent to the Applification API">
        <details className="group rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-medium text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] [&::-webkit-details-marker]:hidden">
            API and WebMCP reference
            <span
              aria-hidden="true"
              className="font-data text-xl group-open:hidden"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="font-data hidden text-xl group-open:inline"
            >
              −
            </span>
          </summary>
          <div className="space-y-5 border-t border-[var(--app-border)] p-5">
            <p>
              Search and read published content over HTTP. The OpenAPI
              specification describes every filter and response field.
            </p>
            <CodeSample label="cURL quickstart">{`curl --fail --show-error '${siteUrl}/api/v1/search?type=client-work'`}</CodeSample>
            <p>
              From this site’s browser console, a relative URL also works in
              local development:
            </p>
            <CodeSample label="JavaScript quickstart">{`const response = await fetch('/api/v1/search?type=products');\nif (!response.ok) throw new Error(\`Request failed: \${response.status}\`);\nconst { results } = await response.json();\nconsole.log(results);`}</CodeSample>
            <dl className="space-y-4 text-base">
              {[
                [
                  "Access",
                  "No authentication, API keys or cookies. Cross-origin reads are supported. GET, HEAD and OPTIONS are available; other methods return 405.",
                ],
                [
                  "Responses",
                  "Search returns results, total and nextOffset. Read a result through /api/v1/content using its type and slug. Content responses include a section index and nextSection; follow it until null for the full text. The profile catalog remains at /api/v1/catalog.",
                ],
                [
                  "Invalid input",
                  "400 with error.code INVALID_QUERY for invalid, unknown or repeated parameters. Content that is unpublished, missing or outside the section range returns 404.",
                ],
                [
                  "Caching and usage",
                  "Responses may be cached for five minutes. No application-level quota is imposed; hosting infrastructure may apply limits. Back off on 429 or 503 and honour Retry-After when present.",
                ],
                [
                  "Versioning",
                  "The endpoint is versioned at /api/v1. Clients should tolerate new fields.",
                ],
                [
                  "WebMCP",
                  "search_site and read_content use the public HTTP responses. get_applification_info provides the profile and catalog overview. On the contact page, fill_contact_draft fills empty fields and reports missing details; review and sending remain separate. Registration uses document.modelContext with navigator as a compatibility fallback.",
                ],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="font-medium text-[var(--app-text-primary)]">
                    {term}
                  </dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-x-6">
              <InfoLink href="/api/openapi.json">
                Read the full API specification
              </InfoLink>
              <ExternalLink
                className={infoLinkClass}
                href="https://developer.chrome.com/docs/ai/webmcp"
              >
                <span className="link-sweep-label">WebMCP browser setup</span>
              </ExternalLink>
            </div>
          </div>
        </details>
      </InfoSection>
    </main>
  );
}
