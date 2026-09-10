import { publicApiError } from "@/lib/public-content-http";

/**
 * JSON 404 for every unknown path under /api so agents never receive the HTML
 * not-found page from a programmatic call. Static routes take precedence.
 */
function notFound(request: Request) {
  const pathname = new URL(request.url).pathname;
  return publicApiError(
    404,
    "NOT_FOUND",
    `No API endpoint exists at ${pathname}.`,
    "Public endpoints are GET /api/v1/catalog, /api/v1/search and /api/v1/content. The OpenAPI document at /api/openapi.json lists every operation.",
  );
}

export const GET = notFound;
export const HEAD = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
export const OPTIONS = notFound;
