import {
  agentSkillsIndexPath,
  siteSkillDescription,
  siteSkillName,
  siteSkillPath,
} from "./agent-skills";
import { publicApiSpecUrl } from "./public-content-http";
import { publicProfile, sandboxUrl, siteUrl } from "./public-catalog";

// Agentic Resource Discovery (ARD) publishes one manifest at
// /.well-known/ard.json: a JSON document whose `entries` array lists the
// agentic resources this domain offers. Each entry is a domain-anchored URN
// (urn:air:<publisher>:<namespace>:<name>), a human name, the artifact's
// IANA media type and exactly one of `url` or `data`. The spec recommends
// 2-5 representativeQueries per entry. See https://agenticresourcediscovery.org/spec/
export const ardPath = "/.well-known/ard.json";
export const ardContext = "https://agenticresourcediscovery.org/context/v1";
export const ardIdentifierPattern = /^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/;

const publisher = "applification.net";
const llmsTxtUrl = `${siteUrl}/llms.txt`;

export type ArdEntry = {
  identifier: string;
  displayName: string;
  type: string;
  url: string;
  description: string;
  representativeQueries: string[];
  capabilities?: string[];
  tags?: string[];
  version?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export const ardEntries: ArdEntry[] = [
  {
    identifier: `urn:air:${publisher}:api:public-content`,
    displayName: "Applification public content API",
    type: "application/openapi+json",
    url: publicApiSpecUrl,
    description: `Free, anonymous, read-only JSON API (OpenAPI 3.1) for ${publicProfile.name}'s profile, contract availability, pricing terms, products, client work and writing. No account, API key or cookies. Sandbox first call: ${sandboxUrl}`,
    representativeQueries: [
      "Is Dave Hudson available for a senior contract React or Next.js role?",
      "What has Applification delivered for clients like Logically or Peppy Health?",
      "How does Applification price contract engineering work?",
      "What are Contexture and Voiced and do they cost anything?",
    ],
    capabilities: ["catalog", "search", "content", "sandbox"],
    tags: ["openapi", "read-only", "free", "contract-engineering", "portfolio"],
    version: "1.0.0",
    metadata: {
      docsUrl: `${siteUrl}/agents`,
      sandboxUrl,
      authentication: "none",
    },
  },
  {
    identifier: `urn:air:${publisher}:skill:${siteSkillName}`,
    displayName: "Applification site skill",
    type: "text/markdown",
    url: `${siteUrl}${siteSkillPath}`,
    description: siteSkillDescription,
    representativeQueries: [
      "Check whether Dave Hudson is available and what his working arrangement is",
      "Find evidence of Dave Hudson's AI product engineering delivery",
      "Prepare a contract enquiry for Applification",
    ],
    capabilities: ["skill-md"],
    tags: ["agent-skills", "skill-md"],
    metadata: {
      indexUrl: `${siteUrl}${agentSkillsIndexPath}`,
      format: "agent-skills/0.2.0",
    },
  },
  {
    identifier: `urn:air:${publisher}:docs:llms-txt`,
    displayName: "Applification llms.txt",
    type: "text/plain",
    url: llmsTxtUrl,
    description:
      "Human-readable guide for language models: when to use applification.net, the three read-only endpoints in order, onboarding facts, products and contact routes.",
    representativeQueries: [
      "How should an AI agent read information about Applification?",
      "Which applification.net endpoints are free and need no API key?",
    ],
    tags: ["llms-txt", "documentation"],
  },
];

export const ardManifest = {
  "@context": ardContext,
  entries: ardEntries,
};
