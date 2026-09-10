import { z } from "zod";
import { siteUrl } from "./public-catalog";
import { checkPublicApiRateLimit } from "./public-api-rate-limit";

export const publicApiDocsUrl = `${siteUrl}/agents`;
export const publicApiSpecUrl = `${siteUrl}/api/openapi.json`;
export const publicApiPolicyUrl = `${publicApiDocsUrl}#versioning`;

/**
 * Lifecycle of the current public API version. When a version is deprecated,
 * set `deprecation` and every response carries Deprecation (RFC 9745) and
 * Sunset (RFC 8594) headers plus a Link rel="deprecation" to the policy.
 */
export const publicApiLifecycle = {
  version: "v1",
  deprecation: null as null | { deprecatedAt: Date; sunsetAt: Date },
};

export function publicApiLinkHeader() {
  const links = [
    `<${publicApiSpecUrl}>; rel="service-desc"; type="application/openapi+json"`,
    `<${publicApiDocsUrl}>; rel="service-doc"`,
  ];
  if (publicApiLifecycle.deprecation) {
    links.push(`<${publicApiPolicyUrl}>; rel="deprecation"`);
  }
  return links.join(", ");
}

export function publicApiLifecycleHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Link: publicApiLinkHeader() };
  const { deprecation } = publicApiLifecycle;
  if (deprecation) {
    headers.Deprecation = `@${Math.floor(deprecation.deprecatedAt.getTime() / 1000)}`;
    headers.Sunset = deprecation.sunsetAt.toUTCString();
  }
  return headers;
}

export const publicReadHeaders = {
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
  "Access-Control-Expose-Headers":
    "RateLimit, RateLimit-Policy, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After",
};

function withLifecycle(headers: Record<string, string>) {
  return { ...publicApiLifecycleHeaders(), ...headers };
}

export function publicReadResponse(body: unknown, init: ResponseInit = {}) {
  return Response.json(body, {
    ...init,
    headers: withLifecycle({
      ...publicReadHeaders,
      ...(init.headers as Record<string, string> | undefined),
    }),
  });
}

export type PublicApiErrorCode =
  | "INVALID_QUERY"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "RATE_LIMITED";

/** Structured JSON error: code, message and a resolution hint agents can act on. */
export function publicApiError(
  status: number,
  code: PublicApiErrorCode,
  message: string,
  hint: string,
  headers: Record<string, string> = {},
) {
  return Response.json(
    { error: { code, message, hint, docs: publicApiDocsUrl } },
    {
      status,
      headers: withLifecycle({
        ...publicReadHeaders,
        "Cache-Control": "no-store",
        ...headers,
      }),
    },
  );
}

export function withPublicReadLimit(request: Request, handler: () => Response) {
  const quota = checkPublicApiRateLimit(request);
  const response = quota.allowed
    ? handler()
    : publicApiError(
        429,
        "RATE_LIMITED",
        "Too many public API requests.",
        "Wait at least Retry-After seconds before retrying; rejected requests do not extend the window.",
        { "Retry-After": String(quota.resetSeconds) },
      );
  for (const [name, value] of Object.entries({
    ...publicApiLifecycleHeaders(),
    ...publicReadHeaders,
    ...quota.headers,
  })) {
    response.headers.set(name, value);
  }
  return response;
}

export function publicReadOptions(request: Request) {
  return withPublicReadLimit(
    request,
    () =>
      new Response(null, {
        status: 204,
        headers: withLifecycle({
          ...publicReadHeaders,
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Max-Age": "86400",
        }),
      }),
  );
}

const readOnlyAllow = "GET, HEAD, OPTIONS";

function methodNotAllowed(method: string, pathname: string) {
  return publicApiError(
    405,
    "METHOD_NOT_ALLOWED",
    `${method} is not supported on ${pathname}. This API is read-only.`,
    `Use one of ${readOnlyAllow}. Write operations are not part of the public information API; see the OpenAPI document for the full surface.`,
    { Allow: readOnlyAllow },
  );
}

export function publicReadMethodNotAllowed(request: Request) {
  return methodNotAllowed(request.method, new URL(request.url).pathname);
}

/** Spread into a read-only route module so writes return JSON 405 rather than an empty body. */
export const publicReadOnlyMethods = {
  POST: publicReadMethodNotAllowed,
  PUT: publicReadMethodNotAllowed,
  PATCH: publicReadMethodNotAllowed,
  DELETE: publicReadMethodNotAllowed,
};

/**
 * Same as publicReadOnlyMethods for statically prerendered routes, whose
 * handlers must not read the request object.
 */
export function publicReadOnlyMethodsAt(pathname: string) {
  return {
    POST: () => methodNotAllowed("POST", pathname),
    PUT: () => methodNotAllowed("PUT", pathname),
    PATCH: () => methodNotAllowed("PATCH", pathname),
    DELETE: () => methodNotAllowed("DELETE", pathname),
  };
}

export function publicRead<T>(
  request: Request,
  schema: z.ZodType<T>,
  handler: (input: T) => unknown,
) {
  return withPublicReadLimit(request, () => readQuery(request, schema, handler));
}

function readQuery<T>(request: Request, schema: z.ZodType<T>, handler: (input: T) => unknown) {
  const params = new URL(request.url).searchParams;
  const query: Record<string, unknown> = Object.fromEntries(params);
  const repeated = [...params.keys()].some(
    (key) => params.getAll(key).length > 1,
  );
  for (const key of ["limit", "offset", "section"]) {
    if (typeof query[key] === "string" && /^\d+$/.test(query[key]))
      query[key] = Number(query[key]);
  }
  const parsed = schema.safeParse(query);
  if (repeated || !parsed.success) {
    return publicApiError(
      400,
      "INVALID_QUERY",
      repeated
        ? "Query parameters must not repeat."
        : (parsed.error?.issues
            .map(
              (issue) => `${issue.path.join(".") || "query"}: ${issue.message}`,
            )
            .join("; ") ?? "Invalid query."),
      "Send each parameter once and only the parameters documented for this operation in the OpenAPI document.",
    );
  }
  const result = handler(parsed.data);
  if (result === null)
    return publicApiError(
      404,
      "NOT_FOUND",
      "Published content or section not found.",
      "Use /api/v1/search to find a published type and slug, then request a section within the returned section index.",
    );
  return publicReadResponse(result);
}
