import { sdkPackageName, sdkSourceUrl, storyLoopMcp } from "@/lib/agent-discovery";
import { publicProfile, publicProducts, siteUrl } from "@/lib/public-catalog";

export const dynamic = "force-static";

export function GET() {
  const text = `# Applification

> ${publicProfile.description}

## Public information
- [Profile](${siteUrl}/about): Dave Hudson's engineering experience and contract fit.
- [Client work](${siteUrl}/client-work): Selected delivery evidence.
- [Commercial terms as JSON](${siteUrl}/api/v1/catalog?section=pricing): Contracts are quoted per engagement; no standard day rate is published. Product licence and availability information.
- [Agents](${siteUrl}/agents): Context, browser tools, a public catalog reader and API reference.
- [OpenAPI](${siteUrl}/api/openapi.json): OpenAPI 3.1 specification.
- [Public catalog](${siteUrl}/api/v1/catalog): JSON profile, products and pricing. Free read-only access without keys or cookies. Optional section: all, profile, products, pricing.
- [Search content](${siteUrl}/api/v1/search): Search or list published client work, writing and products. Optional query, type, topic, status, after, before, limit and offset. Follow nextOffset for more results.
- [Read content](${siteUrl}/api/v1/content?type=client-work&slug=logically): Read a result using type and slug, then follow nextSection to read the remaining Markdown sections.
- [Writing](${siteUrl}/writing): Published articles and weeknotes.

## Developer resources
- [Agentic Resource Discovery catalog](${siteUrl}/.well-known/ard.json): ARD manifest listing the Applification API, this guide, the SDK and MCP server.
- [Applification Public Information API reference](${siteUrl}/agents#reference): Endpoint documentation with examples. Base URL ${siteUrl}/api/v1. No authentication.
- [Applification OpenAPI specification](${siteUrl}/api/openapi.json): Machine-readable OpenAPI 3.1 document.
- [Applification SDK](${sdkSourceUrl}): ${sdkPackageName}, a typed JavaScript/TypeScript client for the API. Source in the applification/applification.net GitHub repository.
- [StoryLoop MCP server](${storyLoopMcp.endpoint}): Authenticated Model Context Protocol server for the StoryLoops product. OAuth metadata at ${storyLoopMcp.protectedResourceMetadata}. Not part of the free public API.

## Products
${publicProducts.map((product) => `- [${product.name}](${product.url}): ${product.description} Status: ${product.status}. ${product.pricing.label}.`).join("\n")}

## Contact
- [Contact options](${publicProfile.contactUrl}): Profile and available enquiry routes. The optional contact workflow requires review and consent before sending.
- [LinkedIn](${publicProfile.linkedInUrl}): Alternative contact route.

WebMCP-enabled browsers can call get_applification_info for the catalog, search_site to find content, and read_content for individual sections. All content reads exclude drafts and private routes. On the available contact page, fill_contact_draft fills empty fields in the visible enquiry form and reports missing details. It does not call AI, upload files, send enquiries or approve CV release; the visitor reviews and sends through the existing interface. No contact submissions are exposed through the public HTTP API.
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
