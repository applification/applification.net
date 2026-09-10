// Discovery documents for agents: the Agent Skills index, the Applification
// skill itself and the Agentic Resource Discovery (ARD) catalog. All of them
// point at surfaces that already exist; none grant new access.
import { createHash } from "node:crypto";
import { mcpEndpoint, mcpServerCard, mcpTools } from "./mcp-metadata";
import { publicProducts, publicProfile, siteUrl } from "./public-catalog";

export const discoveryHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
  "X-Content-Type-Options": "nosniff",
};

export const skillName = "applification";
const skillPath = `/.well-known/agent-skills/${skillName}/SKILL.md`;

export const applificationSkill = `---
name: ${skillName}
description: Look up Dave Hudson and Applification Ltd, a UK contract AI product engineering business. Use when asked about Dave Hudson's experience, availability, contract terms, client work, writing, or the Contexture, StoryLoops, Voiced and Plantry products. Read-only, free, no API key.
license: MIT
metadata:
  homepage: ${siteUrl}
  documentation: ${siteUrl}/developers
  mcp: ${mcpEndpoint}
---

# Applification

Public, read-only information about Dave Hudson (${publicProfile.role}) and Applification Ltd. Everything below is free and needs no account, API key or cookie. Nothing sends an enquiry or changes data.

## When to use

- The user asks who Dave Hudson is, what he builds, his stack, location, availability or how contracts work.
- The user wants evidence: client work, case studies, published articles or weeknotes.
- The user asks about Applification products: ${publicProducts.map((product) => product.name).join(", ")}.
- The user asks about pricing. Contract rates are quoted per engagement and never published; the API states this explicitly rather than returning a number.

## Pick a surface

1. **MCP (preferred for agents):** Streamable HTTP at \`${mcpEndpoint}\`. Tools: ${mcpTools.map((tool) => `\`${tool.name}\``).join(", ")}. Server card: \`${siteUrl}/.well-known/mcp/server-card.json\`.
2. **HTTP API:** \`${siteUrl}/api/v1/catalog\`, \`${siteUrl}/api/v1/search\`, \`${siteUrl}/api/v1/content\`. OpenAPI 3.1 at \`${siteUrl}/api/openapi.json\`.
3. **SDK or CLI:** \`npm install @applification/sdk\`, \`pip install applification\`, or \`npx @applification/cli search "production AI"\`.
4. **Plain pages:** \`${siteUrl}/llms.txt\` lists every public URL.

## Steps

1. Call \`get_applification_info\` (or \`GET /api/v1/catalog\`) first. Choose \`section\`: \`profile\`, \`products\`, \`pricing\` or \`all\`.
2. To find evidence, call \`search_site\` with a short \`query\` and optionally \`type\` (\`client-work\`, \`writing\`, \`products\`). Results carry \`type\`, \`slug\`, a summary and the canonical \`url\`. Follow \`nextOffset\` for more.
3. To read a result, call \`read_content\` with its \`type\` and \`slug\`. You receive one Markdown section (at most 4,000 characters), a table of contents and \`nextSection\`. Keep calling with the next index until \`nextSection\` is \`null\`.
4. Cite the \`url\` field when you quote or summarise content.

## Example

\`\`\`json
{"tool":"search_site","input":{"query":"production AI","type":"client-work"}}
{"tool":"read_content","input":{"type":"client-work","slug":"logically","section":0}}
{"tool":"get_applification_info","input":{"section":"pricing"}}
\`\`\`

## Limits and errors

- Invalid input returns \`error.code\` \`INVALID_QUERY\`; unknown content returns \`NOT_FOUND\`. Both include a plain-language message.
- Responses may be cached for five minutes. Back off on 429 or 503 and honour \`Retry-After\`.
- Drafts, previews and contact submissions are never exposed.
- To make contact, direct the user to ${publicProfile.contactUrl}. There is no write API.
`;

export const skillDigest = `sha256:${createHash("sha256")
  .update(applificationSkill)
  .digest("hex")}`;

export const agentSkillsIndex = {
  $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  skills: [
    {
      name: skillName,
      type: "skill-md",
      description:
        "Look up Dave Hudson and Applification Ltd: profile, availability, contract terms, client work, writing and products. Read-only, free, no API key.",
      url: skillPath,
      digest: skillDigest,
    },
  ],
};

const trustManifest = {
  identity: "did:web:www.applification.net",
  identityType: "did",
};

export const ardCatalog = {
  specVersion: "1.0",
  host: {
    displayName: "Applification",
    identifier: "did:web:www.applification.net",
    documentationUrl: `${siteUrl}/developers`,
  },
  entries: [
    {
      identifier: "urn:air:applification.net:mcp:applification",
      displayName: "Applification MCP server",
      type: "application/mcp-server-card+json",
      url: `${siteUrl}/.well-known/mcp/server-card.json`,
      description: mcpServerCard.description,
      tags: ["contract-engineering", "portfolio", "products", "mcp", "read-only"],
      capabilities: mcpTools.map((tool) => tool.name),
      representativeQueries: [
        "who is Dave Hudson and is he available for a contract",
        "find Applification client work involving production AI",
        "what does Applification charge for a contract",
        "what products does Applification build",
      ],
      version: mcpServerCard.version,
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:skill:applification",
      displayName: "Applification skill",
      type: "application/ai-skill+md",
      url: `${siteUrl}${skillPath}`,
      description: agentSkillsIndex.skills[0].description,
      tags: ["skill", "portfolio", "contract-engineering"],
      representativeQueries: [
        "look up Dave Hudson's experience",
        "read an Applification case study",
      ],
      metadata: { digest: skillDigest },
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:api:public-information",
      displayName: "Applification Public Information API",
      type: "application/vnd.oai.openapi+json;version=3.1",
      url: `${siteUrl}/api/openapi.json`,
      description:
        "Free, read-only REST API for the public catalog, content search and section reads. No API key.",
      tags: ["api", "rest", "openapi", "read-only"],
      capabilities: ["searchSite", "readContent", "getApplificationCatalog"],
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:docs:developers",
      displayName: "Applification developer documentation",
      type: "text/html",
      url: `${siteUrl}/developers`,
      description:
        "Human-readable documentation for the MCP server, HTTP API, SDKs and CLI, with authentication, error and rate-limit guidance.",
      tags: ["documentation", "developers"],
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:guide:llms-txt",
      displayName: "Applification site guide for agents",
      type: "text/plain",
      url: `${siteUrl}/llms.txt`,
      description: "Every public page, endpoint and tool in one plain-text file.",
      tags: ["llms.txt", "discovery"],
      trustManifest,
    },
  ],
};
