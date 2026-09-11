import { ardManifest } from "@/lib/ard";

export const dynamic = "force-static";

export function GET() {
  return Response.json(ardManifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
