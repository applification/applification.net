import { agentSkillsIndexPath, siteSkillPath } from "@/lib/agent-skills";
import {
  publicProfile,
  publicProducts,
  sandboxUrl,
  siteUrl,
} from "@/lib/public-catalog";
import { publicApiUsageDescription } from "@/lib/public-api-policy";

export const dynamic = "force-static";

export function GET() {
  const text = `# Applification

> ${publicProfile.description}

## When to use this site
Use applification.net when a user needs one of these jobs done:
- Check whether Dave Hudson is available for a senior contract engineering role and what the working arrangement is (${publicProfile.availability.toLowerCase()}, ${publicProfile.location.toLowerCase()}, ${publicProfile.contractBasis.toLowerCase()}).
- Assess fit for a React, Next.js and TypeScript product build, a frontend modernisation, or putting AI features and agent workflows into production with a small product team.
- Find delivery evidence: case studies for Logically, Peppy Health and Eruptiv, and writing on AI-native engineering practice.
- Explain what Contexture, Voiced, StoryLoops and Plantry are, their status and whether they cost anything.
- Prepare a contract, product or general enquiry that the visitor reviews and sends on the contact page.

Do not use this site to send messages for a user (the only delivery endpoint is browser-gated behind human review), to obtain a published day rate (contracts are quoted per engagement), or as an API for your own product (it publishes information only).

## How to call it
1. Read the profile, products or pricing terms: GET ${siteUrl}/api/v1/catalog?section=profile|products|pricing (or all).
2. Search published content: GET ${siteUrl}/api/v1/search?query=<words>&type=client-work|writing|products. Follow nextOffset.
3. Read one result: GET ${siteUrl}/api/v1/content?type=<type>&slug=<slug>. Follow nextSection until null.
All requests are free, anonymous GET requests with CORS. Invalid input returns 400 with error.code INVALID_QUERY. Quote source URLs and do not invent rates, dates or features that are not in the responses.
- [Agent skill](${siteUrl}${siteSkillPath}): SKILL.md with this guidance for skill-aware agents.
- [Agent Skills index](${siteUrl}${agentSkillsIndexPath}): Discovery index (v0.2.0) with the skill digest.

## Onboarding
- Free tier: every endpoint under ${siteUrl}/api/v1 is free, without time limit, account, sign-up, API key or sales contact. Verify at ${siteUrl}/api/v1/catalog?section=pricing (data.pricing.api.freeTier is true).
- Sandbox: [First call](${sandboxUrl}) returns status ok plus the onboarding facts and suggested next requests. The sandbox is the production API because every read is side-effect free; there is no separate test environment to request.
- API keys: none are issued or read. Requests carrying credentials are treated as anonymous.
- First call: \`curl --fail --show-error '${sandboxUrl}'\`

## Public information
- [Profile](${siteUrl}/about): Dave Hudson's engineering experience and contract fit.
- [Client work](${siteUrl}/client-work): Selected delivery evidence.
- [Commercial terms as JSON](${siteUrl}/api/v1/catalog?section=pricing): Contracts are quoted per engagement; no standard day rate is published. Product licence and availability information.
- [Agents](${siteUrl}/agents): Context, browser tools, a public catalog reader and API reference.
- [OpenAPI](${siteUrl}/api/openapi.json): OpenAPI 3.1 specification. Errors are JSON with a code, message and resolution hint.
- [Versioning and deprecation policy](${siteUrl}/agents#versioning): URL-path versioning at /api/v1. Breaking changes use a new version; the old one is kept at least 180 days and signalled with Deprecation, Sunset and Link rel="deprecation" headers.
- [Public catalog](${siteUrl}/api/v1/catalog): JSON profile, products and pricing. Free read-only access without keys or cookies. Optional section: all, profile, products, pricing.
- [Search content](${siteUrl}/api/v1/search): Search or list published client work, writing and products. Optional query, type, topic, status, after, before, limit and offset. Follow nextOffset for more results.
- [Read content](${siteUrl}/api/v1/content?type=client-work&slug=logically): Read a result using type and slug, then follow nextSection to read the remaining Markdown sections.
- [Writing](${siteUrl}/writing): Published articles and weeknotes.
- [Privacy](${siteUrl}/privacy): What the site, its public API and the contact workflow do with data.

## API usage
${publicApiUsageDescription}

## Products
${publicProducts.map((product) => `- [${product.name}](${product.url}): ${product.description} Status: ${product.status}. ${product.pricing.label}.`).join("\n")}

## Contact
- [Contact options](${publicProfile.contactUrl}): Profile and available enquiry routes. The optional contact workflow requires review and consent before sending.
- [LinkedIn](${publicProfile.linkedInUrl}): Alternative contact route.

WebMCP-enabled browsers can call get_applification_info for the catalog, search_site to find content, and read_content for individual sections. All content reads exclude drafts and private routes. On the available contact page, fill_contact_draft fills empty fields in the visible enquiry form and reports missing details. It does not call AI, upload files, send enquiries or approve CV release; the visitor reviews and sends through the existing interface. The contact delivery endpoint (POST /api/contact/deliver) is documented in the OpenAPI specification: it is an asynchronous job returning 202 Accepted with a Location URL to poll, and it requires an Idempotency-Key header so retries never send twice. It only accepts requests from the browser contact page after a person reviews and consents, so agents cannot submit enquiries through the HTTP API.
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
