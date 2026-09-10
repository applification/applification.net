// Some clients probe /.well-known/mcp directly; serve the same card there.
import { mcpServerCard } from "@/lib/mcp-server";

export const dynamic = "force-static";

export function GET() {
  return Response.json(mcpServerCard, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
