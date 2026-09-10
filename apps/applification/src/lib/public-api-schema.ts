import { z } from "zod";
import { catalogSections, siteUrl } from "./public-catalog";
import { contactRoutes } from "./contact";
import {
  publicApiDocsUrl,
  publicApiLifecycle,
  publicApiPolicyUrl,
} from "./public-content-http";
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

export const catalogErrorSchema = z.object({
  error: z.object({
    code: z
      .enum(["INVALID_QUERY", "METHOD_NOT_ALLOWED"])
      .describe("Stable machine-readable error code."),
    message: z.string().describe("What went wrong."),
    hint: z.string().describe("How to resolve or recover from the error."),
    docs: url.describe("Where the API is documented."),
  }),
});

const contactRoute = z.enum(contactRoutes).nullable();
export const contactDeliveryAcceptedSchema = z.object({
  status: z.literal("accepted"),
  runId: z
    .string()
    .describe("Durable job identifier. Poll GET /api/contact/deliver?runId= for the outcome."),
  statusUrl: url.describe("Absolute status URL, also sent as the Location header."),
  route: contactRoute,
  replayed: z
    .boolean()
    .describe("True when this Idempotency-Key was already accepted and no second enquiry was started."),
});
export const contactDeliveryStatusSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("pending") }),
  z.object({ status: z.literal("running") }),
  z.object({
    status: z.literal("completed"),
    result: z.unknown().describe("Delivery receipt for the reviewed brief."),
  }),
  z.object({ status: z.literal("failed"), message: z.string() }),
]);
export const contactErrorSchema = z.object({
  code: z
    .enum([
      "invalid_request",
      "invalid_brief",
      "invalid_attachment",
      "invalid_origin",
      "invalid_session",
      "invalid_run",
      "idempotency_required",
      "idempotency_invalid",
      "idempotency_mismatch",
      "idempotency_conflict",
      "rate_limited",
      "bot_blocked",
      "protection_unavailable",
      "workflow_unavailable",
    ])
    .describe("Stable machine-readable error code."),
  message: z.string().describe("What went wrong and what to do next."),
});

const lifecycleHeaders = {
  Link: { $ref: "#/components/headers/Link" },
  Deprecation: { $ref: "#/components/headers/Deprecation" },
  Sunset: { $ref: "#/components/headers/Sunset" },
};

const versioningPolicy = {
  url: publicApiPolicyUrl,
  scheme: "url-path",
  currentVersion: publicApiLifecycle.version,
  additiveChanges:
    "New optional fields, enum values, parameters and endpoints may be added without a version change. Clients must ignore unknown fields.",
  breakingChanges:
    "Removing or renaming fields, changing types or semantics, or tightening validation ships under a new path version (for example /api/v2). The previous version keeps working during the deprecation window.",
  deprecationSignals: [
    "Deprecation response header (RFC 9745) with the date the version was deprecated.",
    "Sunset response header (RFC 8594) with the date the version stops responding, at least 180 days after deprecation.",
    'Link response header with rel="deprecation" pointing at this policy.',
    "deprecated: true on affected operations in this OpenAPI document, with the replacement named in the description.",
  ],
  minimumDeprecationWindowDays: 180,
} as const;

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
    tags: ["public"],
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
          "Published content. Read-only, with canonical source URLs. Cached for five minutes.",
        headers: lifecycleHeaders,
        content: {
          "application/json": {
            schema: { $ref: `#/components/schemas/${response}` },
          },
        },
      },
      "400": {
        description: "Invalid, repeated or unknown query parameter",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PublicContentError" },
          },
        },
      },
      "404": {
        description: "Published content or section not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PublicContentError" },
          },
        },
      },
    },
  };
}

export const publicOpenApi = {
  openapi: "3.1.0",
  info: {
    title: "Applification Public Information API",
    version: "1.2.0",
    description:
      "Read the public profile and commercial catalog, search published client work, writing and products, and read their content in bounded sections. Free, read-only access without API keys, accounts or cookies. Responses may be cached for five minutes. No application-level quota; infrastructure may impose limits. Back off on 429 or 503 and honour Retry-After when present.\n\nErrors are always JSON with a stable code, a message and a resolution hint; unknown /api paths return a JSON 404 and unsupported methods a JSON 405 with an Allow header.\n\nVersioning: the API is versioned in the URL path (/api/v1). Additive changes never bump the version; breaking changes ship under a new path and the old version is kept for at least 180 days, signalled by Deprecation and Sunset response headers, a Link rel=\"deprecation\" header and deprecated: true in this document. Policy: " +
      publicApiPolicyUrl +
      "\n\nThe contact delivery endpoint is documented for transparency. It is an asynchronous job (202 Accepted plus a Location URL to poll) protected by an Idempotency-Key header, but it is reachable only from the browser contact page after a human reviews and consents to the brief; it is not an agent write surface. Individual product APIs are outside this document.",
    contact: { name: "Applification", url: publicApiDocsUrl },
  },
  servers: [{ url: siteUrl }],
  security: [],
  externalDocs: {
    description: "Agent guide, versioning policy and API reference",
    url: publicApiDocsUrl,
  },
  tags: [
    {
      name: "public",
      description: "Free read-only information. No authentication.",
    },
    {
      name: "contact",
      description:
        "Human-reviewed enquiry delivery. Browser-session gated; documented so agents understand the flow, not so they can call it.",
    },
  ],
  "x-versioning-policy": versioningPolicy,
  paths: {
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
        tags: ["public"],
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
              "Cache-Control": {
                schema: { type: "string" },
                description: "public, max-age=300",
              },
              "Access-Control-Allow-Origin": {
                schema: { type: "string" },
                description: "* — public reads without credentials",
              },
              ...lifecycleHeaders,
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CatalogResponse" },
              },
            },
          },
          "400": {
            description: "Invalid, repeated or unknown query parameter",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CatalogError" },
              },
            },
          },
        },
      },
    },
    "/api/contact/deliver": {
      post: {
        operationId: "deliverContactEnquiry",
        tags: ["contact"],
        summary: "Start durable delivery of a reviewed enquiry (async job)",
        description:
          "Starts a durable workflow that delivers a human-reviewed enquiry and returns 202 Accepted immediately. The Location header and statusUrl point at GET /api/contact/deliver?runId= to poll for the outcome. Retries are safe: send the same Idempotency-Key and the same brief to receive the original runId with replayed: true; a different brief under a used key returns 409. Only the browser contact page can call this: the request must carry the page session header, a same-site Origin and pass bot verification, so agents receive 403 rather than a delivery.",
        security: [{ contactSession: [] }],
        parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactDeliveryRequest" },
            },
          },
        },
        responses: {
          "202": {
            description:
              "Delivery accepted and running durably. Poll the Location URL until status is completed or failed.",
            headers: {
              Location: {
                required: true,
                schema: { type: "string", format: "uri" },
                description: "Status URL for this job: GET /api/contact/deliver?runId=...",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactDeliveryAccepted" },
              },
            },
          },
          "400": {
            description:
              "Invalid body, invalid brief, or a missing, malformed or mismatched Idempotency-Key",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactError" },
              },
            },
          },
          "403": {
            description: "Not from the contact page, or bot verification failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactError" },
              },
            },
          },
          "409": {
            description: "Idempotency-Key already used for a different brief",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactError" },
              },
            },
          },
          "429": {
            description: "Rate limited; honour Retry-After",
            headers: {
              "Retry-After": {
                schema: { type: "integer" },
                description: "Seconds to wait before retrying.",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactError" },
              },
            },
          },
          "503": {
            description: "Protection or the durable workflow is unavailable; retry later",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactError" },
              },
            },
          },
        },
      },
      get: {
        operationId: "getContactDeliveryStatus",
        tags: ["contact"],
        summary: "Poll the status of an accepted enquiry delivery",
        description:
          "Returns the current state of the job identified by runId from the 202 response. Poll every few seconds until status is completed (with a receipt in result) or failed. A failed job never reports a false success; the reviewed brief can be resent with a new Idempotency-Key.",
        parameters: [
          {
            name: "runId",
            in: "query",
            required: true,
            description: "The runId returned by the 202 response.",
            schema: { type: "string", pattern: "^wrun_[A-Za-z0-9_-]+$" },
          },
        ],
        responses: {
          "200": {
            description: "Job state",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactDeliveryStatus" },
              },
            },
          },
          "400": {
            description: "Missing or malformed runId",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactError" },
              },
            },
          },
          "503": {
            description: "The job failed or its status is temporarily unavailable",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactDeliveryStatus" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      contactSession: {
        type: "apiKey",
        in: "header",
        name: "x-contact-session",
        description:
          "Per-page-load session issued by the browser contact page. Together with a same-site Origin and bot verification it limits delivery to human-reviewed enquiries. Not available to agents.",
      },
    },
    parameters: {
      IdempotencyKey: {
        name: "Idempotency-Key",
        in: "header",
        required: true,
        description:
          "Client-generated UUID that makes the request safe to retry. The same key with the same brief returns the original job; the same key with a different brief returns 409. Generate a new key for each new brief.",
        schema: { type: "string", format: "uuid" },
      },
    },
    headers: {
      Link: {
        schema: { type: "string" },
        description:
          'RFC 8288 web links: rel="service-desc" (this OpenAPI document), rel="service-doc" (the agent guide) and, once a version is deprecated, rel="deprecation" (the versioning policy).',
      },
      Deprecation: {
        schema: { type: "string" },
        description:
          "RFC 9745. Present only after this API version is deprecated; carries the deprecation date. Migrate to the version named in the operation description before the Sunset date.",
      },
      Sunset: {
        schema: { type: "string", format: "date-time" },
        description:
          "RFC 8594. Present only after this API version is deprecated; the HTTP date after which it stops responding, at least 180 days after Deprecation.",
      },
    },
    schemas: {
      SearchSiteResponse: z.toJSONSchema(searchSiteResponseSchema, {
        target: "draft-2020-12",
      }),
      ReadContentResponse: z.toJSONSchema(readContentResponseSchema, {
        target: "draft-2020-12",
      }),
      PublicContentError: z.toJSONSchema(publicContentErrorSchema, {
        target: "draft-2020-12",
      }),
      CatalogResponse: z.toJSONSchema(catalogResponseSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
      CatalogError: z.toJSONSchema(catalogErrorSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
      ContactDeliveryRequest: {
        type: "object",
        additionalProperties: false,
        required: ["consent", "draft", "startedAt", "website"],
        properties: {
          consent: {
            const: true,
            description: "The human reviewed the brief and consented to sending it.",
          },
          draft: {
            type: "object",
            description:
              "The reviewed enquiry as edited on the contact page. Its exact shape is owned by the contact page and may change without notice.",
          },
          idempotencyKey: {
            type: "string",
            format: "uuid",
            description:
              "Deprecated: legacy body copy of the Idempotency-Key header. If both are sent they must match.",
            deprecated: true,
          },
          startedAt: {
            type: "integer",
            description: "Unix milliseconds when the page was opened; used for timing checks.",
          },
          website: {
            type: "string",
            maxLength: 0,
            description: "Honeypot; must be empty.",
          },
        },
      },
      ContactDeliveryAccepted: z.toJSONSchema(contactDeliveryAcceptedSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
      ContactDeliveryStatus: z.toJSONSchema(contactDeliveryStatusSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
      ContactError: z.toJSONSchema(contactErrorSchema, {
        target: "draft-2020-12",
        io: "input",
      }),
    },
  },
};
