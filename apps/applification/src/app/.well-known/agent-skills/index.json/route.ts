import { agentSkillsIndex } from "@/lib/agent-skills";

export const dynamic = "force-static";

export function GET() {
  return Response.json(agentSkillsIndex, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
