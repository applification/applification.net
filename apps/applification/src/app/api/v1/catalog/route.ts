import { catalogInputSchema, getPublicCatalog } from "@/lib/public-catalog";
import {
  publicApiError,
  publicReadOnlyMethods,
  publicReadOptions,
  publicReadResponse,
} from "@/lib/public-content-http";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const parsed = catalogInputSchema.safeParse(Object.fromEntries(params));
  const repeatedSection = params.getAll("section").length > 1;

  if (!parsed.success || repeatedSection) {
    return publicApiError(
      400,
      "INVALID_QUERY",
      "Invalid, repeated or unknown query parameter.",
      "Use an optional section parameter with one of: all, profile, products or pricing. Send it at most once and no other parameters.",
    );
  }

  return publicReadResponse(getPublicCatalog(parsed.data));
}

export const OPTIONS = publicReadOptions;
export const { POST, PUT, PATCH, DELETE } = publicReadOnlyMethods;
