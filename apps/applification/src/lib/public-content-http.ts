import { z } from "zod";
import { checkPublicApiRateLimit } from "./public-api-rate-limit";
export const publicReadHeaders = {
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
  "Access-Control-Expose-Headers":
    "RateLimit, RateLimit-Policy, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After",
};

export function withPublicReadLimit(request: Request, handler: () => Response) {
  const quota = checkPublicApiRateLimit(request);
  const response = quota.allowed
    ? handler()
    : Response.json(
        { error: { code: "RATE_LIMITED", message: "Too many public API requests. Wait for Retry-After before retrying." } },
        { status: 429, headers: { "Retry-After": String(quota.resetSeconds) } },
      );
  for (const [name, value] of Object.entries({ ...publicReadHeaders, ...quota.headers })) {
    response.headers.set(name, value);
  }
  return response;
}

export function publicReadOptions(request: Request) {
  return withPublicReadLimit(request, () => new Response(null, {
    status: 204,
    headers: {
      ...publicReadHeaders,
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  }));
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
    return Response.json(
      {
        error: {
          code: "INVALID_QUERY",
          message: repeated
            ? "Query parameters must not repeat."
            : parsed.error?.issues
                .map(
                  (issue) =>
                    `${issue.path.join(".") || "query"}: ${issue.message}`,
                )
                .join("; "),
        },
      },
      {
        status: 400,
        headers: { ...publicReadHeaders, "Cache-Control": "no-store" },
      },
    );
  }
  const result = handler(parsed.data);
  if (result === null)
    return Response.json(
      {
        error: {
          code: "NOT_FOUND",
          message:
            "Published content or section not found. Use search_site to find available content.",
        },
      },
      {
        status: 404,
        headers: { ...publicReadHeaders, "Cache-Control": "no-store" },
      },
    );
  return Response.json(result, { headers: publicReadHeaders });
}
