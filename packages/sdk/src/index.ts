/**
 * Official TypeScript client for the Applification public information API.
 *
 * Every call is a plain GET to https://www.applification.net. The API is free,
 * read-only and needs no API key, account or cookie. Nothing in this package
 * can send an enquiry or change data.
 *
 * Documentation: https://www.applification.net/developers
 * OpenAPI:       https://www.applification.net/api/openapi.json
 * MCP server:    https://www.applification.net/api/mcp
 */

export const SITE_URL = "https://www.applification.net";
export const API_VERSION = "v1";
export const OPENAPI_URL = `${SITE_URL}/api/openapi.json`;
export const MCP_ENDPOINT = `${SITE_URL}/api/mcp`;
export const DOCS_URL = `${SITE_URL}/developers`;

/** Configuration for MCP hosts that accept a Streamable HTTP server URL. */
export const MCP_CLIENT_CONFIG = {
  mcpServers: {
    applification: { type: "streamable-http", url: MCP_ENDPOINT },
  },
} as const;

export type ContentType = "client-work" | "writing" | "products";
export type ProductStatus = "live" | "in-development" | "research";
export type CatalogSection = "all" | "profile" | "products" | "pricing";

export interface SearchParams {
  /** Words to find in published content. Omit to list. */
  query?: string;
  /** Restrict results to one content type. */
  type?: ContentType;
  /** Exact topic from a writing result, ignoring case. */
  topic?: string;
  /** Product availability filter. */
  status?: ProductStatus;
  /** Writing published on or after YYYY-MM-DD. */
  after?: string;
  /** Writing published on or before YYYY-MM-DD. */
  before?: string;
  /** Results per page, 1–10. Default 5. */
  limit?: number;
  /** Pagination offset from nextOffset. Default 0. */
  offset?: number;
}

export interface ContentSummary {
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  url: string;
  topics: string[];
  date?: string;
  updated?: string;
  status?: ProductStatus;
}

export interface SearchResponse {
  results: ContentSummary[];
  total: number;
  nextOffset: number | null;
}

export interface ContentRef {
  type: ContentType;
  slug: string;
}

export interface ContentSection extends ContentSummary {
  sections: Array<{ index: number; title: string }>;
  section: number;
  content: string;
  format: "markdown";
  nextSection: number | null;
  links: Array<{ label: string; url: string }>;
}

export interface ProductTerms {
  model: "open_source" | "not_published";
  label: string;
  description: string;
  sourceUrl: string;
}

export interface Profile {
  name: string;
  company: string;
  url: string;
  description: string;
  availability: string;
  contractBasis: string;
  location: string;
  role: string;
  stack: string;
  teamFit: string;
  sameAs: string[];
  contactUrl: string;
  linkedInUrl: string;
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  status: string;
  url: string;
  pricing: ProductTerms;
}

export interface Pricing {
  url: string;
  contract: {
    model: "quote_on_request";
    label: string;
    description: string;
    /** Always null: no standard rate is published. Null does not mean free. */
    publishedRate: null;
    contactUrl: string;
    linkedInUrl: string;
  };
  api: { model: "free"; description: string; price: 0 };
  products: Array<ProductTerms & { slug: string; name: string }>;
}

export interface CatalogData {
  profile?: Profile;
  products?: Product[];
  pricing?: Pricing;
}

export interface CatalogResponse<S extends CatalogSection = CatalogSection> {
  apiVersion: string;
  url: string;
  section: S;
  data: S extends "all"
    ? Required<CatalogData>
    : S extends "profile"
      ? { profile: Profile }
      : S extends "products"
        ? { products: Product[] }
        : S extends "pricing"
          ? { pricing: Pricing }
          : CatalogData;
}

export type ApiErrorCode = "INVALID_QUERY" | "NOT_FOUND" | "UNAVAILABLE";

/** Raised for any non-2xx response. The API always answers errors as JSON. */
export class ApplificationError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly url: string;
  readonly retryAfter?: number;

  constructor(options: {
    status: number;
    code: ApiErrorCode;
    message: string;
    url: string;
    retryAfter?: number;
  }) {
    super(options.message);
    this.name = "ApplificationError";
    this.status = options.status;
    this.code = options.code;
    this.url = options.url;
    this.retryAfter = options.retryAfter;
  }
}

export interface ApplificationOptions {
  /** Override the origin, for example a local development server. */
  baseUrl?: string;
  /** Custom fetch implementation. Defaults to the global fetch. */
  fetch?: typeof globalThis.fetch;
  /** Per-request timeout in milliseconds. Default 15000. */
  timeoutMs?: number;
  /** Extra headers, for example a descriptive User-Agent. */
  headers?: Record<string, string>;
}

type Query = Record<string, string | number | undefined>;

export class Applification {
  readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly timeoutMs: number;
  private readonly headers: Record<string, string>;

  constructor(options: ApplificationOptions = {}) {
    this.baseUrl = (options.baseUrl ?? SITE_URL).replace(/\/+$/, "");
    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (typeof fetchImpl !== "function")
      throw new Error(
        "No fetch implementation available. Pass one in options.fetch.",
      );
    this.fetchImpl = fetchImpl;
    this.timeoutMs = options.timeoutMs ?? 15000;
    this.headers = { Accept: "application/json", ...options.headers };
  }

  /** Read the public catalog: profile, products and pricing. */
  catalog<S extends CatalogSection = "all">(
    section?: S,
  ): Promise<CatalogResponse<S>> {
    return this.get(`/api/${API_VERSION}/catalog`, { section });
  }

  /** Search or list published client work, writing and products. */
  search(params: SearchParams = {}): Promise<SearchResponse> {
    return this.get(`/api/${API_VERSION}/search`, params as Query);
  }

  /** Iterate through every page of a search. */
  async *searchAll(params: SearchParams = {}): AsyncGenerator<ContentSummary> {
    let offset = params.offset ?? 0;
    for (;;) {
      const page = await this.search({ ...params, offset });
      for (const result of page.results) yield result;
      if (page.nextOffset === null) return;
      offset = page.nextOffset;
    }
  }

  /** Read one Markdown section of a piece of content. */
  read(ref: ContentRef & { section?: number }): Promise<ContentSection> {
    return this.get(`/api/${API_VERSION}/content`, {
      type: ref.type,
      slug: ref.slug,
      section: ref.section,
    });
  }

  /** Read every section and return the joined Markdown. */
  async readAll(ref: ContentRef): Promise<string> {
    const parts: string[] = [];
    let section: number | null = 0;
    while (section !== null) {
      const page: ContentSection = await this.read({ ...ref, section });
      parts.push(page.content);
      section = page.nextSection;
    }
    return parts.join("\n\n");
  }

  private async get<T>(path: string, query: Query): Promise<T> {
    const url = new URL(path, `${this.baseUrl}/`);
    for (const [key, value] of Object.entries(query))
      if (value !== undefined && value !== "")
        url.searchParams.set(key, String(value));

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: "GET",
        headers: this.headers,
        signal: controller.signal,
      });
    } catch (cause) {
      throw new ApplificationError({
        status: 0,
        code: "UNAVAILABLE",
        message: `Request to ${url} failed: ${(cause as Error).message}`,
        url: url.toString(),
      });
    } finally {
      clearTimeout(timer);
    }

    if (response.ok) return (await response.json()) as T;

    const retryAfterHeader = response.headers.get("retry-after");
    const retryAfter =
      retryAfterHeader && /^\d+$/.test(retryAfterHeader)
        ? Number(retryAfterHeader)
        : undefined;
    let code: ApiErrorCode = "UNAVAILABLE";
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      if (body.error?.code === "INVALID_QUERY" || body.error?.code === "NOT_FOUND")
        code = body.error.code;
      if (body.error?.message) message = body.error.message;
    } catch {
      /* Non-JSON error bodies come from infrastructure, not the API. */
    }
    throw new ApplificationError({
      status: response.status,
      code,
      message,
      url: url.toString(),
      retryAfter,
    });
  }
}

export default Applification;
