import { z } from "zod";
export const publicReadHeaders = {
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "public, max-age=300",
};
export function publicReadOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      ...publicReadHeaders,
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
}
export function publicRead<T>(
  request: Request,
  schema: z.ZodType<T>,
  handler: (input: T) => unknown,
) {
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
