import { catalogInputSchema, getPublicCatalog } from "@/lib/public-catalog";
import { publicReadOptions, withPublicReadLimit } from "@/lib/public-content-http";

export function GET(request: Request) {
  return withPublicReadLimit(request, () => readCatalog(request));
}

function readCatalog(request: Request) {
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
      },
    );
  }

  return Response.json(getPublicCatalog(parsed.data));
}

export const OPTIONS = publicReadOptions;
