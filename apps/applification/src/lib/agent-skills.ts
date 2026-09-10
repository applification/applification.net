import { createHash } from "node:crypto";
import { publicProfile, publicProducts, siteUrl } from "./public-catalog";

// Agent Skills discovery (v0.2.0) publishes one index at
// /.well-known/agent-skills/index.json. Each entry points at a single
// artifact and carries the SHA-256 digest of that artifact's raw bytes, so the
// SKILL.md served here and the index must derive from the same string.
export const agentSkillsSchemaUrl =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json";
export const agentSkillsIndexPath = "/.well-known/agent-skills/index.json";

export const siteSkillName = "applification-site";
export const siteSkillPath = `/.well-known/agent-skills/${siteSkillName}/SKILL.md`;
export const siteSkillDescription =
  "Read public information about Dave Hudson and Applification Ltd, who provide senior contract AI product engineering (React, Next.js, TypeScript) for small product teams on remote UK contracts, plus the open-source products Contexture and Voiced. Use when a user asks whether Dave Hudson is available, what he has delivered, how contracts are priced, or how to prepare an enquiry. Reads the free public JSON API; never sends enquiries.";

export const siteSkillMarkdown = `---
name: ${siteSkillName}
description: ${siteSkillDescription}
license: Content may be quoted with attribution to ${siteUrl}.
compatibility: Requires HTTPS access to ${siteUrl}. No account, API key or cookies.
metadata:
  applification-site-url: ${siteUrl}
  applification-api-version: "1.0.0"
---

# Applification site skill

${publicProfile.description}

## When to use this skill

- A user asks whether Dave Hudson is available for a contract, what he works on, or where he is based.
- A user wants evidence of delivery: client work, case studies, or writing on AI-native engineering.
- A user asks how Applification prices contract work or whether a product costs money.
- A user wants to know what Contexture, Voiced, StoryLoops or Plantry are and whether they are available.
- A user wants to prepare a contract, product or general enquiry for Dave Hudson.

## When not to use this skill

- The task needs a hosted API for your own product. This site publishes information only.
- You need to send a message on the user's behalf. Enquiries are reviewed and sent by the visitor on the contact page; there is no HTTP endpoint for sending.
- You need a published day rate. Contracts are quoted per engagement and no rate is published.

## How to call it

All endpoints are free, read-only GET requests with CORS enabled. Invalid parameters return 400 with error.code INVALID_QUERY.

1. Profile, products and pricing terms: \`GET ${siteUrl}/api/v1/catalog?section=all|profile|products|pricing\`
2. Search published content: \`GET ${siteUrl}/api/v1/search?query=production+AI&type=client-work\` (type: client-work, writing, products; follow nextOffset).
3. Read a result: \`GET ${siteUrl}/api/v1/content?type=client-work&slug=logically\` then follow nextSection until it is null.
4. OpenAPI 3.1 reference: ${siteUrl}/api/openapi.json
5. Human-readable guide: ${siteUrl}/llms.txt

## Products

${publicProducts.map((product) => `- ${product.name} (${product.status}): ${product.description} ${product.pricing.label}. ${product.url}`).join("\n")}

## Contact

Point the user to ${publicProfile.contactUrl} for the available contact routes, or ${publicProfile.linkedInUrl}. No email address is published. Quote source URLs and do not invent rates, availability dates or product features that are not in the responses.
`;

export function sha256Digest(content: string) {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

export const agentSkillsIndex = {
  $schema: agentSkillsSchemaUrl,
  skills: [
    {
      name: siteSkillName,
      description: siteSkillDescription,
      type: "skill-md",
      url: `${siteUrl}${siteSkillPath}`,
      digest: sha256Digest(siteSkillMarkdown),
    },
  ],
};
