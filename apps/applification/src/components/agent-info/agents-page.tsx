import { PageHero } from "@/components/page-hero";
import { Button, buttonVariants } from "@/components/ui/button";
import { ExternalLink } from "@/components/external-link";
import { publishedSkills, siteRepositorySkillsShUrl } from "@/lib/agent-skills-public";
import { sandboxUrl, siteUrl } from "@/lib/public-catalog";
import { ContentTypeSelect } from "./content-type-select";
import { RevealHashTarget } from "./reveal-hash-target";
import { CopyTextButton } from "@/components/copy-text-button";
import { agentsCopy, assistantPromptLinks } from "@/lib/content/site-pages";
import {
  CodeSample,
  InfoLink,
  InfoSection,
  infoLinkClass,
} from "./info-layout";

export function AgentsPage() {
  return (
    <main className="flex-1">
      <RevealHashTarget />
      <PageHero
        density="compact"
        eyebrow="Agents & API docs"
        eyebrowDetail="Context and tools"
        headingId="agents-heading"
        title={agentsCopy.title}
        description={agentsCopy.description}
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
              <InfoLink href="/api/v1/sandbox">Sandbox first call</InfoLink>
              <InfoLink href="/llms.txt">Site guide for agents</InfoLink>
              <InfoLink href="/api/openapi.json">OpenAPI reference</InfoLink>
            </div>
          </aside>
        }
      />

      <InfoSection id="conversation" title="A starting point for your conversation">
        <p className="max-w-[65ch]">{agentsCopy.handoff}</p>
        <blockquote className="max-w-[65ch] border-l-2 border-[var(--app-action)] pl-5 text-[var(--app-text-primary)]">
          {agentsCopy.prompt}
        </blockquote>
        <div className="flex flex-wrap items-start gap-3">
          {assistantPromptLinks.map(({ label, href }) => (
            <ExternalLink
              key={label}
              href={href}
              aria-label={label}
              className={buttonVariants({ className: "min-h-11 px-4 motion-reduce:transform-none motion-reduce:transition-none" })}
            >
              {label}
            </ExternalLink>
          ))}
          <CopyTextButton text={agentsCopy.prompt} label="Copy a starter prompt" variant="outline" fallback="Select and copy the prompt above, then paste it into your chat." />
        </div>
        <p className="max-w-[65ch]">{agentsCopy.guidance}</p>
        <p className="max-w-[65ch] text-base">
          You can also ask which products are available, find examples of production AI,
          or explore how I work with a team. Your assistant reads the public pages;
          the API docs below are for agents that can call tools directly.
        </p>
      </InfoSection>

      <InfoSection id="onboarding" title="Start without an account">
        <p className="max-w-[65ch]">
          Everything here is a free tier. There is no sign-up, API key, trial
          period or sales contact, so an agent can go from finding this page to
          a successful call on its own.
        </p>
        <p className="max-w-[65ch]">
          The sandbox is the live API. Every request is read-only with no side
          effects, so there is no separate test environment to request. One
          request confirms that end to end and lists what to try next.
        </p>
        <CodeSample label="Sandbox first call">{`curl --fail --show-error '${sandboxUrl}'`}</CodeSample>
        <dl className="space-y-4 text-base">
          {[
            [
              "Free tier",
              "Every endpoint under /api/v1, without time limit. The catalog records this as freeTier true and price 0.",
            ],
            [
              "API keys",
              "None are issued or read. Requests carrying credentials are treated as anonymous.",
            ],
            [
              "Sandbox",
              "GET /api/v1/sandbox returns status ok, the onboarding facts with a URL that verifies each one, and suggested next requests.",
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
        <InfoLink href="/api/v1/sandbox">Make the first call</InfoLink>
      </InfoSection>

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

      <InfoSection id="skills" title="Install a skill">
        <p className="max-w-[65ch]">
          Skills give a coding agent ready-made instructions for a task.
          Applification publishes its skills on skills.sh from public GitHub
          repositories, so one command installs them into Claude Code, Cursor,
          Codex and other agents.
        </p>
        <ul className="space-y-6">
          {publishedSkills.map((skill) => (
            <li key={skill.name} className="space-y-3">
              <p className="max-w-[65ch]">
                <code className="font-data text-sm text-[var(--app-text-primary)]">
                  {skill.name}
                </code>
                {": "}
                {skill.description}
              </p>
              <CodeSample label={`Install ${skill.name}`}>
                {skill.installCommand}
              </CodeSample>
              <div className="flex flex-wrap gap-x-6">
                <ExternalLink className={infoLinkClass} href={skill.skillsShUrl}>
                  <span className="link-sweep-label">View on skills.sh</span>
                </ExternalLink>
                <ExternalLink
                  className={infoLinkClass}
                  href={skill.repositoryUrl}
                >
                  <span className="link-sweep-label">Source on GitHub</span>
                </ExternalLink>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-6">
          <ExternalLink className={infoLinkClass} href={siteRepositorySkillsShUrl}>
            <span className="link-sweep-label">All Applification skills</span>
          </ExternalLink>
          <InfoLink href="/.well-known/agent-skills/index.json">
            Agent Skills discovery index
          </InfoLink>
        </div>
      </InfoSection>

      <InfoSection id="reference" title="Connecting an agent">
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
                  "Errors",
                  "Every error is JSON with error.code, error.message, a resolution hint and a docs link. 400 INVALID_QUERY covers invalid, unknown or repeated parameters; 404 NOT_FOUND covers unpublished or missing content and unknown /api paths; 405 METHOD_NOT_ALLOWED carries an Allow header.",
                ],
                [
                  "Caching and usage",
                  "Public API reads share 120 requests per minute per client IP on each server instance. Responses are not cached. RateLimit-Policy gives the quota; RateLimit gives remaining requests and seconds until reset. RateLimit-Limit, RateLimit-Remaining and RateLimit-Reset support older clients. On 429, wait at least Retry-After seconds before retrying. OPTIONS is free; hosting limits may also apply.",
                ],
                [
                  "Versioning and deprecation",
                  "The API is versioned in the URL path; the current version is /api/v1. Additive changes such as new optional fields, enum values, parameters or endpoints ship without a version change, so clients should ignore unknown fields. Breaking changes ship under a new path version. The previous version keeps responding for at least 180 days and signals retirement with a Deprecation response header (RFC 9745), a Sunset response header (RFC 8594) giving the date it stops responding, a Link header with rel=\"deprecation\" pointing at this policy, and deprecated: true on affected operations in the OpenAPI document naming the replacement. Every response already carries a Link header with rel=\"service-desc\" for the OpenAPI document and rel=\"service-doc\" for this page. The same policy is machine-readable as x-versioning-policy in the OpenAPI document.",
                  "versioning",
                ],
                [
                  "Contact delivery",
                  "POST /api/contact/deliver is an asynchronous job: it returns 202 Accepted with a Location URL to poll and requires an Idempotency-Key header so retries never send twice. It only accepts requests from the contact page after a person reviews and consents, so agents cannot submit enquiries through it.",
                ],
                [
                  "WebMCP",
                  "search_site and read_content use the public HTTP responses. get_applification_info provides the profile and catalog overview. On the contact page, fill_contact_draft fills empty fields and reports missing details; review and sending remain separate. Registration uses document.modelContext with navigator as a compatibility fallback.",
                ],
              ].map(([term, detail, anchor]) => (
                <div key={term} id={anchor}>
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
