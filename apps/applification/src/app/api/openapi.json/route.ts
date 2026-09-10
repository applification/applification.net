import { publicOpenApi } from "@/lib/public-api-schema";
import { publicReadOptions, withPublicReadLimit } from "@/lib/public-content-http";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return withPublicReadLimit(request, () => Response.json(publicOpenApi));
}

export const OPTIONS = publicReadOptions;
