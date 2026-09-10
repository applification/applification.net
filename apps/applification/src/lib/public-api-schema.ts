import { z } from "zod";
import {
  catalogSections,
  publicOnboarding,
  sandboxUrl,
  siteUrl,
} from "./public-catalog";
import { publicApiUsageDescription } from "./public-api-policy";
import {
  searchSiteInputSchema,
  readContentInputSchema,
  searchSiteResponseSchema,
  readContentResponseSchema,
  publicContentErrorSchema,
} from "./content-schema";

const url = z.url();
const profile = z.object({
  name: z.string(),
  company: z.string(),
  url,
  description: z.string(),
  availability: z.string(),
  contractBasis: z.string(),
  location: z.string(),
  role: z.string(),
  stack: z.string(),
  teamFit: z.string(),
  sameAs: z.array(url),
  contactUrl: url,
  linkedInUrl: url,
});
const productTerms = z.object({
  model: z.enum(["open_source", "not_published"]),
  label: z.string(),
  description: z.string(),
  sourceUrl: url,
});
const products = z.array(
  z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.string(),
    url,
    pricing: productTerms,
  }),
);
const pricing = z.object({
  url,
  contract: z.object({
    model: z.literal("quote_on_request"),
    label: z.string(),
    description: z.string(),
    publishedRate: z
      .null()
      .describe(
        "No standard contract rate is published. Null does not mean free.",
      ),
    contactUrl: url,
    linkedInUrl: url,
  }),
  api: z.object({
    model: z.literal("free"),
    description: z.string(),
    price: z.literal(0),
    freeTier: z.literal(true),
    apiKeyRequired: z.literal(false),
    sandboxUrl: url.describe("Live sandbox and first-call endpoint."),
  }),
  products: z.array(
    productTerms.extend({ slug: z.string(), name: z.string() }),
  ),
});
const envelope = { apiVersion: z.string(), url };

export const catalogResponseSchema = z.discriminatedUnion("section", [
  z.object({
    ...envelope,
    section: z.literal("all"),
    data: z.object({ profile, products, pricing }),
  }),
  z.object({
    ...envelope,
    section: z.literal("profile"),
    data: z.object({ profile }),
  }),
  z.object({
    ...envelope,
    section: z.literal("products"),
    data: z.object({ products }),
  }),
  z.object({
    ...envelope,
    section: z.literal("pricing"),
    data: z.object({ pricing }),
  }),
]);

export const onboardingSchema = z.object({
  humanInTheLoop: z.literal(false),
  freeTier: z.object({
    available: z.literal(true),
    price: z.literal(0),
    scope: z.string(),
    accountRequired: z.literal(false),
    signupUrl: z.null().describe("No sign-up exists; none is needed."),
    quota: z.string(),
    verifyUrl: url,
  }),
  apiKeys: z.object({
    required: z.literal(false),
    selfServe: z.literal("not_applicable"),
    description: z.string(),
  }),
  sandbox: z.object({
    available: z.literal(true),
    url,
    environment: z.literal("shared"),
    description: z.string(),
  }),
  firstCall: z.object({
    method: z.literal("GET"),
    url,
    expectedStatus: z.literal(200),
    curl: z.string(),
  }),
  documentation: z.object({ guide: url, openapi: url, llms: url }),
});

export const sandboxResponseSchema = z.object({
  ...envelope,
  environment: z.literal("sandbox"),
  status: z.literal("ok"),
  message: z.string(),
  onboarding: onboardingSchema,
  tryNext: z.array(z.object({ url, description: z.string() })),
});

export const catalogErrorSchema = z.object({
  error: z.object({ code: z.literal("INVALID_QUERY"), message: z.string() }),
});

const quotaHeaders = Object.fromEntries(
  ["RateLimit", "RateLimit-Policy", "RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"].map(
    (name) => [name, { $ref: `#/components/headers/${name}` }],
  ),
);
const rateLimitedResponse = {
  description: "Public read allowance exhausted. Wait at least Retry-After seconds before retrying. Rejected requests do not extend the window.",
  headers: { ...quotaHeaders, "Retry-After": { $ref: "#/components/headers/Retry-After" } },
  content: { "application/json": { schema: { $ref: "#/components/schemas/RateLimitError" } } },
};

function contentOperation(
  operationId: string,
  summary: string,
  description: string,
  input: z.ZodType,
  response: string,
) {
  const json = z.toJSONSchema(input, { target: "draft-2020-12", io: "input" });
  return {
    operationId,
    summary,
    description,
    parameters: Object.entries(json.properties ?? {}).map(([name, schema]) => ({
      name,
      in: "query",
      required: json.required?.includes(name) ?? false,
      schema,
    })),
    responses: {
      "200": {
        description:
          "Published content. Read-only, with canonical source URLs. Not cached, so quota headers stay current.",
        headers: quotaHeaders,
        content: {
          "application/json": {
            schema: { $ref: `#/components/schemas/${response}` },
          },
        },
      },
      "400": {
        description: "Invalid, repeated or unknown query parameter",
        headers: quotaHeaders,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PublicContentError" },
          },
        },
      },
      "404": {
        description: "Published content or section not found",
        headers: quotaHeaders,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PublicContentError" },
          },
        },
      },
      "429": rateLimitedResponse,
    },
  };
}

export const publicOpenApi = {
  openapi: "3.1.0",
  info: {
    title: "Applification Public Information API",
    version: "1.2.0",
    description:
      `Read the public profile and commercial catalog, search published client work, writing and products, and read their content in bounded sections. Free tier: every endpoint is free, read-only and needs no API key, account, sign-up or sales contact. Sandbox: GET /api/v1/sandbox is a live first call that confirms this; the sandbox is the production API because every read is side-effect free. ${publicApiUsageDescription} The contact workflow and individual product APIs are outside this API.`,
    contact: { name: "Applification", url: `${siteUrl}/agents` },
    "x-onboarding": publicOnboarding,
  },
  servers: [
    {
      url: siteUrl,
      description:
        "Production and sandbox. Free tier, anonymous, read-only; no API key.",
    },
  ],
  security: [],
  tags: [
    {
      name: "Onboarding",
      description: `Free tier and sandbox verification. Start with GET ${sandboxUrl}.`,
    },
  ],
  externalDocs: {
    description: "Agent guide, tools and API reference",
    url: `${siteUrl}/agents`,
  },
  paths: {
    "/api/v1/sandbox": {
      get: {
        operationId: "getSandbox",
        tags: ["Onboarding"],
        summary: "Make a free first call and read the onboarding facts",
        description:
          "Anonymous sandbox call with no side effects. Returns status ok, the free tier, API key and sandbox facts with URLs that verify each claim, and suggested next requests. Credentials are ignored. Query parameters return 400.",
        parameters: [],
        responses: {
          "200": {
            description:
              "First call succeeded. Free tier and sandbox confirmed. Not cached, so quota headers stay current.",
            headers: {
              ...quotaHeaders,
              "Access-Control-Allow-Origin": {
                schema: { type: "string" },
                description: "* — public reads without credentials",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SandboxResponse" },
              },
            },
          },
          "400": {
            description: "Unknown query parameter",
            headers: quotaHeaders,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublicContentError" },
              },
            },
          },
          "429": rateLimitedResponse,
        },
      },
    },
    "/api/v1/search": {
      get: contentOperation(
        "searchSite",
        "Find published client work, writing and products",
        "Omit query to list. Filter by type, writing topic/date or product availability. Dates are inclusive. Results include summaries and source URLs. Default limit 5, maximum 10; follow nextOffset with the same filters. No matches returns 200 with an empty list. Drafts are excluded even during local development.",
        searchSiteInputSchema,
        "SearchSiteResponse",
      ),
    },
    "/api/v1/content": {
      get: contentOperation(
        "readContent",
        "Read a published content section",
        "Use type and slug from search results. Returns Markdown, source links and a section index. Default section 0; follow nextSection until null to read the full content. Each section contains at most 4000 characters. Embedded media is represented by references, without fetching external transcripts. No preview or private routes are exposed.",
        readContentInputSchema,
        "ReadContentResponse",
      ),
    },
    "/api/v1/catalog": {
      get: {
        operationId: "getApplificationCatalog",
        summary: "Read public Applification information",
        description:
          "Select one section, or omit section for all data. Unknown and repeated query parameters return 400. Each section is nested under data using its name. Breaking changes use a new URL version; clients should accept additional fields.",
        parameters: [
          {
            name: "section",
            in: "query",
            required: false,
            description: "The section to read.",
            schema: { type: "string", enum: catalogSections, default: "all" },
          },
        ],
        responses: {
          "200": {
            description: "Public catalog information",
            headers: {
              ...quotaHeaders,
              "Cache-Control": {
                schema: { type: "string" },
                description: "no-store",
              },
              "Access-Control-Allow-Origin": {
                schema: { type: "string" },
                description: "* — public reads without credentials",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CatalogResponse" },
              },
            },
          },
          "400": {
            description: "Invalid, repeated or unknown query parameter",
            headers: quotaHeaders,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CatalogError" },
              },
            },
          },
          "429": rateLimitedResponse,
        },
      },
    },
  },
  components: {
    headers: {
      "RateLimit-Policy": {
        description: "HTTPAPI structured quota policy: q is the request allowance and w is the window in seconds.",
        schema: { type: "string", example: '\"public-read\";q=120;w=60' },
      },
      RateLimit: {
        description: "HTTPAPI structured quota status: r is remaining requests after this request, t is seconds until reset. Instance-local, per client IP.",
        schema: { type: "string", example: '\"public-read\";r=119;t=42' },
      },
      "RateLimit-Limit": {
        description: "Compatibility field: requests allowed in the current fixed window.",
        schema: { type: "integer", minimum: 1, example: 120 },
      },
      "RateLimit-Remaining": {
        description: "Compatibility field: requests remaining after this request. Zero on quota exhaustion.",
        schema: { type: "integer", minimum: 0, example: 119 },
      },
      "RateLimit-Reset": {
        description: "Compatibility field: seconds until the current window resets, rounded up; NOT a Unix timestamp.",
        schema: { type: "integer", minimum: 1, example: 42 },
      },
      "Retry-After": {
        description: "Minimum seconds to wait before retrying. On public API 429s this equals RateLimit-Reset. Takes precedence over quota hints.",
        schema: { type: "integer", minimum: 1, example: 42 },
      },
    },
    schemas: {
      RateLimitError: z.toJSONSchema(z.object({
        error: z.object({ code: z.literal("RATE_LIMITED"), message: z.string() }),
      }), { target: "draft-2020-12" }),
      SearchSiteResponse: z.toJSONSchema(searchSiteResponseSchema, {
        target: "draft-2020-12",
      }),
      ReadContentResponse: z.toJSONSchema(readContentResponseSchema, {
        target: "draft-2020-12",
      }),
      PublicContentError: z.toJSONSchema(publicContentErrorSchema, {
        target: "draft-2020-12",
      }),
      SandboxResponse: z.toJSONSchema(sandboxResponseSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
      CatalogResponse: z.toJSONSchema(catalogResponseSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
      CatalogError: z.toJSONSchema(catalogErrorSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
    },
  },
};
