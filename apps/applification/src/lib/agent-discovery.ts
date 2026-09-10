import { publicProfile, publicProducts, siteUrl } from "./public-catalog";

const publisher = "applification.net";
export const sdkPackageName = "@applification/sdk";
export const sdkSourceUrl =
  "https://github.com/applification/applification.net/tree/main/packages/applification-sdk";
export const storyLoopMcp = {
  endpoint: "https://mcp.storyloop.applification.net/mcp",
  protectedResourceMetadata:
    "https://mcp.storyloop.applification.net/.well-known/oauth-protected-resource",
};

const storyLoops = publicProducts.find(({ slug }) => slug === "storyloops");

// Agentic Resource Discovery manifest, per https://agenticresourcediscovery.org/spec/
// (v0.91). Entries require identifier, displayName, type and exactly one of
// url or data. Other members are descriptive.
export const ardManifest = {
  publisher: { name: publicProfile.company, url: siteUrl },
  entries: [
    {
      identifier: `urn:air:${publisher}:api:public-information`,
      displayName: "Applification Public Information API",
      type: "application/vnd.oai.openapi+json",
      url: `${siteUrl}/api/openapi.json`,
      description:
        "OpenAPI 3.1 reference for the free, read-only JSON API: public profile and commercial catalog, search over published client work, writing and products, and bounded Markdown content reads. No API key, account or cookie.",
      capabilities: ["getPublicCatalog", "searchSite", "readContent"],
      representativeQueries: [
        "what does Dave Hudson at Applification do and is he available for contracts",
        "find Applification client work about production AI",
        "read the Applification case study for Logically",
        "what products does Applification publish and how are they licensed",
      ],
      tags: ["api", "openapi", "portfolio", "contract-engineering"],
      version: "1.1.0",
      metadata: {
        baseUrl: `${siteUrl}/api/v1`,
        authentication: "none",
        sdk: { npm: sdkPackageName, source: sdkSourceUrl },
        cors: "*",
      },
    },
    {
      identifier: `urn:air:${publisher}:docs:llms-txt`,
      displayName: "Applification site guide for agents",
      type: "text/markdown",
      url: `${siteUrl}/llms.txt`,
      description:
        "llms.txt guide to the public pages, API routes and WebMCP browser tools on applification.net.",
      representativeQueries: [
        "give me an overview of applification.net for an AI agent",
        "which Applification pages and endpoints can an agent read",
      ],
      tags: ["documentation", "llms-txt"],
      metadata: { humanGuide: `${siteUrl}/agents` },
    },
    {
      identifier: `urn:air:${publisher}:sdk:applification-sdk`,
      displayName: "Applification SDK for JavaScript and TypeScript",
      type: "text/markdown",
      url: `${sdkSourceUrl}#readme`,
      description:
        "Typed client for the Applification Public Information API. Zero dependencies; uses fetch.",
      representativeQueries: [
        "install the official Applification npm SDK",
        "call the Applification catalog API from TypeScript",
      ],
      tags: ["sdk", "npm", "typescript"],
      metadata: {
        npm: sdkPackageName,
        repository: "https://github.com/applification/applification.net",
        homepage: siteUrl,
      },
    },
    {
      identifier: `urn:air:${publisher}:mcp:storyloop`,
      displayName: "StoryLoop MCP server",
      type: "application/mcp-server-card+json",
      data: {
        name: "StoryLoop",
        description:
          "Model Context Protocol server for StoryLoops: inspect story maps, select and resume work, keep lifecycle state current and draft owner-reviewed map changes. Requires an authenticated StoryLoops account.",
        url: storyLoopMcp.endpoint,
        transport: "streamable-http",
        authentication: {
          type: "oauth2",
          bearerMethods: ["header"],
          protectedResourceMetadata: storyLoopMcp.protectedResourceMetadata,
        },
        publisher: { name: publicProfile.company, url: siteUrl },
        productUrl: storyLoops?.url ?? `${siteUrl}/products/storyloops`,
        status: "in-development",
      },
      description:
        "Authenticated MCP server for the StoryLoops product. Not part of the free public information API.",
      representativeQueries: [
        "connect my coding agent to my StoryLoops story map",
        "resume work on a Ready StoryLoops story",
      ],
      tags: ["mcp", "storyloops", "authenticated"],
      metadata: { status: storyLoops?.status ?? "IN DEVELOPMENT" },
    },
  ],
};
