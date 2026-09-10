import { publicOpenApi } from "@/lib/public-api-schema";
import {
  publicReadOnlyMethodsAt,
  publicReadOptions,
  withPublicReadLimit,
} from "@/lib/public-content-http";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return withPublicReadLimit(request, () => Response.json(publicOpenApi));
}

export const OPTIONS = publicReadOptions;
export const { POST, PUT, PATCH, DELETE } =
  publicReadOnlyMethodsAt("/api/openapi.json");
