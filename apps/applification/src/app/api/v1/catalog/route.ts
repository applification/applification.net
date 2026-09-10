import { catalogInputSchema, getPublicCatalog } from "@/lib/public-catalog";

const publicHeaders = {
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
};

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const parsed = catalogInputSchema.safeParse(Object.fromEntries(params));
  const repeatedSection = params.getAll("section").length > 1;

  if (!parsed.success || repeatedSection) {
    return Response.json(
      {
        error: {
          code: "INVALID_QUERY",
          message:
            "Use an optional section parameter: all, profile, products or pricing. Repeated and unknown parameters are not supported.",
        },
      },
      {
        status: 400,
        headers: { ...publicHeaders, "Cache-Control": "no-store" },
      },
    );
  }

  return Response.json(getPublicCatalog(parsed.data), {
    headers: { ...publicHeaders, "Cache-Control": "public, max-age=300" },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...publicHeaders,
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
}
