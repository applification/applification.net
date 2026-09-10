import { publicOpenApi } from "@/lib/public-api-schema";

export const dynamic = "force-static";

export function GET() {
  return Response.json(publicOpenApi, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
