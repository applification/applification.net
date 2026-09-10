import { PageHero } from "@/components/page-hero";
import { ExternalLink } from "@/components/external-link";
import { mcpEndpoint, mcpTools } from "@/lib/mcp-metadata";
import { siteUrl } from "@/lib/public-catalog";
import {
  CodeSample,
  InfoLink,
  InfoSection,
  infoLinkClass,
} from "./info-layout";

export const developerPackages = {
  npmSdk: "@applification/sdk",
  npmCli: "@applification/cli",
  pypi: "applification",
  repository: "https://github.com/applification/applification.net",
} as const;

const mcpConfig = JSON.stringify(
  {
    mcpServers: {
      applification: { type: "streamable-http", url: mcpEndpoint },
    },
  },
  null,
  2,
);

function Definition({ term, children }: { term: string; children: string }) {
  return (
    <div>
      <dt className="font-medium text-[var(--app-text-primary)]">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function DevelopersPage() {
  return (
    <main className="flex-1">
      <PageHero
        density="compact"
        eyebrow="Developers"
        eyebrowDetail="Applification API, MCP server, SDKs and CLI"
        headingId="developers-heading"
        title="Applification developer documentation."
        description="Everything public on this site is readable by code: the profile and commercial terms, client work, writing and products. Free, read-only, no account or API key. Pick the MCP server, the HTTP API, an SDK or the CLI."
        aside={
          <aside
            className="space-y-2 border-l-2 border-[var(--app-action)] pl-6"
            aria-label="Developer resources"
          >
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              Machine-readable references
            </p>
            <p className="text-[var(--app-text-secondary)]">
              Stable URLs, no authentication.
            </p>
            <div className="flex flex-col items-start">
              <InfoLink href="/api/openapi.json">OpenAPI 3.1 specification</InfoLink>
              <InfoLink href="/.well-known/mcp/server-card.json">
                MCP server card
              </InfoLink>
              <InfoLink href="/.well-known/ard.json">ARD catalog</InfoLink>
              <InfoLink href="/.well-known/agent-skills/index.json">
                Agent Skills index
              </InfoLink>
              <InfoLink href="/llms.txt">llms.txt</InfoLink>
              <InfoLink href="/agents">Guide for people using agents</InfoLink>
            </div>
          </aside>
        }
      />

      <InfoSection id="access" title="Access, free tier and sandbox">
        <dl className="space-y-4 text-base">
          <Definition term="Authentication">
            None. No API keys, OAuth, accounts, cookies or sign-up. Every
            endpoint and tool on this page is public and read-only.
          </Definition>
          <Definition term="Free tier">
            The whole API is the free tier. There is no paid plan, quota to
            purchase or usage meter. Price is 0 and the pricing section of the
            catalog says so in JSON.
          </Definition>
          <Definition term="Sandbox">
            Production is safe to use as a sandbox because nothing can be
            written. Send any request from the examples below and inspect the
            response; the interactive reader on the Agents page does the same
            from a plain HTML form.
          </Definition>
          <Definition term="Rate limits">
            No application-level quota. Hosting infrastructure may apply
            limits; back off on 429 or 503 and honour Retry-After when present.
            Responses may be cached for five minutes.
          </Definition>
          <Definition term="Cross-origin">
            Access-Control-Allow-Origin is * on every read. GET, HEAD and
            OPTIONS are supported on the REST routes; other methods return 405.
          </Definition>
        </dl>
      </InfoSection>

      <InfoSection id="mcp" title="MCP server">
        <p className="max-w-[65ch]">
          A remote Model Context Protocol server using the Streamable HTTP
          transport, stateless, with JSON responses. Add it to Claude, Cursor,
          ChatGPT or any MCP host that accepts a URL.
        </p>
        <CodeSample label="MCP endpoint">{mcpEndpoint}</CodeSample>
        <CodeSample label="MCP client configuration">{mcpConfig}</CodeSample>
        <dl className="space-y-4 text-base">
          {mcpTools.map((tool) => (
            <Definition key={tool.name} term={tool.name}>
              {tool.description}
            </Definition>
          ))}
        </dl>
        <p className="max-w-[65ch]">
          All tools are annotated read-only and idempotent. The server card at{" "}
          <code className="font-data text-sm">
            /.well-known/mcp/server-card.json
          </code>{" "}
          lists the same tools without opening a session.
        </p>
        <CodeSample label="Initialise over HTTP with cURL">{`curl --fail --show-error '${mcpEndpoint}' \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'`}</CodeSample>
      </InfoSection>

      <InfoSection id="http-api" title="HTTP API">
        <p className="max-w-[65ch]">
          Three versioned JSON endpoints under{" "}
          <code className="font-data text-sm">/api/v1</code>. The OpenAPI
          specification documents every parameter and response schema.
        </p>
        <dl className="space-y-4 text-base">
          <Definition term="GET /api/v1/catalog">
            Profile, products and pricing. Optional section: all, profile,
            products or pricing.
          </Definition>
          <Definition term="GET /api/v1/search">
            Search or list published client work, writing and products.
            Optional query, type, topic, status, after, before, limit (1–10)
            and offset. Follow nextOffset.
          </Definition>
          <Definition term="GET /api/v1/content">
            Read one Markdown section by type and slug. Follow nextSection until
            null. Sections are at most 4,000 characters.
          </Definition>
        </dl>
        <CodeSample label="cURL example">{`curl --fail --show-error '${siteUrl}/api/v1/search?query=production+AI&type=client-work'`}</CodeSample>
        <CodeSample label="Fetch example">{`const response = await fetch("${siteUrl}/api/v1/content?type=client-work&slug=logically");
if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
const section = await response.json();
console.log(section.content, section.nextSection);`}</CodeSample>
        <dl className="space-y-4 text-base">
          <Definition term="Errors">
            Always JSON. 400 returns error.code INVALID_QUERY for invalid,
            unknown or repeated parameters. 404 returns NOT_FOUND for
            unpublished or missing content. Messages are plain language.
          </Definition>
          <Definition term="Versioning">
            Breaking changes use a new URL version. Clients should tolerate new
            fields.
          </Definition>
        </dl>
      </InfoSection>

      <InfoSection id="sdks" title="SDKs">
        <p className="max-w-[65ch]">
          Thin, dependency-free clients over the HTTP API, generated from the
          same schemas and published from this site&apos;s repository.
        </p>
        <CodeSample label="TypeScript and JavaScript">{`npm install ${developerPackages.npmSdk}

import { Applification } from "${developerPackages.npmSdk}";

const client = new Applification();
const { results } = await client.search({ query: "production AI", type: "client-work" });
const markdown = await client.readAll(results[0]);`}</CodeSample>
        <CodeSample label="Python">{`pip install ${developerPackages.pypi}

from applification import Applification

client = Applification()
results = client.search(query="production AI", type="client-work")["results"]
markdown = client.read_all(results[0]["type"], results[0]["slug"])`}</CodeSample>
        <p className="max-w-[65ch]">
          Both packages set their homepage to this domain and their repository
          to the site&apos;s GitHub project so you can confirm they are official.
        </p>
      </InfoSection>

      <InfoSection id="cli" title="CLI">
        <p className="max-w-[65ch]">
          The same operations from a terminal, with JSON output for scripts and
          agents.
        </p>
        <CodeSample label="CLI usage">{`npx ${developerPackages.npmCli} catalog --section pricing
npx ${developerPackages.npmCli} search "production AI" --type client-work
npx ${developerPackages.npmCli} read client-work logically --all
npx ${developerPackages.npmCli} mcp   # print the MCP server configuration`}</CodeSample>
      </InfoSection>

      <InfoSection id="discovery" title="Discovery and browser tools">
        <dl className="space-y-4 text-base">
          <Definition term="llms.txt">
            Every public page, endpoint and tool in one plain-text file at
            /llms.txt.
          </Definition>
          <Definition term="ARD catalog">
            /.well-known/ard.json lists the MCP server, skill, API and
            documentation as Agentic Resource Discovery entries.
          </Definition>
          <Definition term="Agent Skills">
            /.well-known/agent-skills/index.json links a SKILL.md that explains
            when and how to use these surfaces.
          </Definition>
          <Definition term="WebMCP">
            In a WebMCP-enabled browser the same tools register on every page,
            and the contact page adds fill_contact_draft for a reviewed enquiry.
          </Definition>
        </dl>
        <div className="flex flex-wrap gap-x-6">
          <ExternalLink
            className={infoLinkClass}
            href={developerPackages.repository}
          >
            <span className="link-sweep-label">Source on GitHub</span>
          </ExternalLink>
          <ExternalLink
            className={infoLinkClass}
            href="https://modelcontextprotocol.io/"
          >
            <span className="link-sweep-label">About MCP</span>
          </ExternalLink>
        </div>
      </InfoSection>
    </main>
  );
}
