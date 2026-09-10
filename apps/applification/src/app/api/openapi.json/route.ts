import { publicOpenApi } from "@/lib/public-api-schema";
import {
  publicApiLifecycleHeaders,
  publicReadOnlyMethodsAt,
} from "@/lib/public-content-http";

export const dynamic = "force-static";

export function GET() {
  return Response.json(publicOpenApi, {
    headers: {
      ...publicApiLifecycleHeaders(),
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const { POST, PUT, PATCH, DELETE } =
  publicReadOnlyMethodsAt("/api/openapi.json");
