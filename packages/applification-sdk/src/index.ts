/**
 * Official client for the Applification Public Information API.
 * https://www.applification.net/agents · OpenAPI: https://www.applification.net/api/openapi.json
 *
 * Free, read-only, no API key. Responses may be cached for a few minutes.
 */

export const DEFAULT_BASE_URL = "https://www.applification.net";

export type CatalogSection = "all" | "profile" | "products" | "pricing";
export type ContentType = "client-work" | "writing" | "products";
export type ContentStatus = "live" | "in-development" | "research";

export interface PublicProfile {
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

export interface ProductTerms {
  model: "open_source" | "not_published";
  label: string;
  description: string;
  sourceUrl: string;
}

export interface PublicProduct {
  slug: string;
  name: string;
  description: string;
  status: string;
  url: string;
  pricing: ProductTerms;
}

export interface PublicPricing {
  url: string;
  contract: {
    model: "quote_on_request";
    label: string;
    description: string;
    /** No standard contract rate is published. Null does not mean free. */
    publishedRate: null;
    contactUrl: string;
    linkedInUrl: string;
  };
  api: { model: "free"; description: string; price: 0 };
  products: Array<ProductTerms & { slug: string; name: string }>;
}

export interface CatalogData {
  profile?: PublicProfile;
  products?: PublicProduct[];
  pricing?: PublicPricing;
}

export interface CatalogResponse<S extends CatalogSection = CatalogSection> {
  apiVersion: string;
  url: string;
  section: S;
  data: S extends "all"
    ? Required<CatalogData>
    : S extends "profile"
      ? { profile: PublicProfile }
      : S extends "products"
        ? { products: PublicProduct[] }
        : S extends "pricing"
          ? { pricing: PublicPricing }
          : CatalogData;
}

export interface SearchParams {
  /** Words to find in published content. Omit to list. */
  query?: string;
  /** Restrict results to one content type. */
  type?: ContentType;
  /** Exact topic from a writing result, ignoring case. */
  topic?: string;
  /** Product availability filter. */
  status?: ContentStatus;
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
  status?: ContentStatus;
}

export interface SearchResponse {
  results: ContentSummary[];
  total: number;
  nextOffset: number | null;
}

export interface ReadContentParams {
  type: ContentType;
  slug: string;
  /** Section index from the table of contents or nextSection. Default 0. */
  section?: number;
}

export interface ContentResponse extends ContentSummary {
  sections: Array<{ index: number; title: string }>;
  section: number;
  content: string;
  format: "markdown";
  nextSection: number | null;
  links: Array<{ label: string; url: string }>;
}

export type ApiErrorCode = "INVALID_QUERY" | "NOT_FOUND";

export class ApplificationApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode | string;
  readonly retryAfter: number | null;

  constructor(
    status: number,
    code: string,
    message: string,
    retryAfter: number | null = null,
  ) {
    super(message);
    this.name = "ApplificationApiError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export interface ClientOptions {
  /** Override the API origin. Defaults to https://www.applification.net. */
  baseUrl?: string;
  /** Custom fetch, for example with retries or a proxy. */
  fetch?: typeof fetch;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
}

type Query = Record<string, string | number | undefined>;

export class ApplificationClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly headers: Record<string, string>;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    this.headers = { Accept: "application/json", ...options.headers };
    if (typeof this.fetchImpl !== "function") {
      throw new Error("No fetch implementation available; pass options.fetch");
    }
  }

  /** Public profile, products and pricing. */
  getCatalog<S extends CatalogSection = "all">(
    section?: S,
  ): Promise<CatalogResponse<S>> {
    return this.get("/api/v1/catalog", { section });
  }

  /** Search or list published client work, writing and products. */
  search(params: SearchParams = {}): Promise<SearchResponse> {
    return this.get("/api/v1/search", { ...params });
  }

  /** Read one Markdown section of a published item. Follow nextSection for more. */
  readContent(params: ReadContentParams): Promise<ContentResponse> {
    return this.get("/api/v1/content", { ...params });
  }

  /** Iterate every section of a published item in order. */
  async *readAllSections(
    params: Omit<ReadContentParams, "section">,
  ): AsyncGenerator<ContentResponse> {
    let section: number | null = 0;
    while (section !== null) {
      const page: ContentResponse = await this.readContent({
        ...params,
        section,
      });
      yield page;
      section = page.nextSection;
    }
  }

  /** The OpenAPI 3.1 document describing this API. */
  getOpenApi(): Promise<Record<string, unknown>> {
    return this.get("/api/openapi.json", {});
  }

  private async get<T>(path: string, query: Query): Promise<T> {
    const url = new URL(path, `${this.baseUrl}/`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const response = await this.fetchImpl(url, { headers: this.headers });
    if (response.ok) return (await response.json()) as T;

    const retryAfterHeader = response.headers.get("retry-after");
    const retryAfter =
      retryAfterHeader && /^\d+$/.test(retryAfterHeader)
        ? Number(retryAfterHeader)
        : null;
    let code = `HTTP_${response.status}`;
    let message = response.statusText || `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      if (body.error?.code) code = body.error.code;
      if (body.error?.message) message = body.error.message;
    } catch {
      // Non-JSON error body; keep the HTTP status message.
    }
    throw new ApplificationApiError(response.status, code, message, retryAfter);
  }
}

/** Convenience factory. */
export function createClient(options?: ClientOptions): ApplificationClient {
  return new ApplificationClient(options);
}
