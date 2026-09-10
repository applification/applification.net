import { publicProfile, publicProducts, siteUrl } from "@/lib/public-catalog";

export const dynamic = "force-static";

export function GET() {
  const text = `# Applification

> ${publicProfile.description}

## Developers
- [Developer documentation](${siteUrl}/developers): Applification API, MCP server, SDKs and CLI. Authentication: none. Free tier: the entire API, no key, no sign-up. Sandbox: production endpoints are read-only and safe to call.
- [MCP server](${siteUrl}/api/mcp): Streamable HTTP Model Context Protocol endpoint with search_site, read_content and get_applification_info. Server card: ${siteUrl}/.well-known/mcp/server-card.json
- [OpenAPI](${siteUrl}/api/openapi.json): OpenAPI 3.1 specification.
- [TypeScript SDK](https://www.npmjs.com/package/@applification/sdk): npm install @applification/sdk
- [Python SDK](https://pypi.org/project/applification/): pip install applification
- [CLI](https://www.npmjs.com/package/@applification/cli): npx @applification/cli search "production AI"
- [ARD catalog](${siteUrl}/.well-known/ard.json): Agentic Resource Discovery entries for the MCP server, skill, API and docs.
- [Agent Skills index](${siteUrl}/.well-known/agent-skills/index.json): SKILL.md describing when and how to use these surfaces.

## Public information
- [Profile](${siteUrl}/about): Dave Hudson's engineering experience and contract fit.
- [Client work](${siteUrl}/client-work): Selected delivery evidence.
- [Commercial terms as JSON](${siteUrl}/api/v1/catalog?section=pricing): Contracts are quoted per engagement; no standard day rate is published. Product licence and availability information.
- [Agents](${siteUrl}/agents): Context, browser tools, a public catalog reader and API reference.
- [Public catalog](${siteUrl}/api/v1/catalog): JSON profile, products and pricing. Free read-only access without keys or cookies. Optional section: all, profile, products, pricing.
- [Search content](${siteUrl}/api/v1/search): Search or list published client work, writing and products. Optional query, type, topic, status, after, before, limit and offset. Follow nextOffset for more results.
- [Read content](${siteUrl}/api/v1/content?type=client-work&slug=logically): Read a result using type and slug, then follow nextSection to read the remaining Markdown sections.
- [Writing](${siteUrl}/writing): Published articles and weeknotes.

## Products
${publicProducts.map((product) => `- [${product.name}](${product.url}): ${product.description} Status: ${product.status}. ${product.pricing.label}.`).join("\n")}

## Contact
- [Contact options](${publicProfile.contactUrl}): Profile and available enquiry routes. The optional contact workflow requires review and consent before sending.
- [LinkedIn](${publicProfile.linkedInUrl}): Alternative contact route.

MCP hosts can connect to ${siteUrl}/api/mcp (Streamable HTTP, no authentication) for the same three tools. WebMCP-enabled browsers can call get_applification_info for the catalog, search_site to find content, and read_content for individual sections. All content reads exclude drafts and private routes. On the available contact page, fill_contact_draft fills empty fields in the visible enquiry form and reports missing details. It does not call AI, upload files, send enquiries or approve CV release; the visitor reviews and sends through the existing interface. No contact submissions are exposed through the public HTTP API.
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
