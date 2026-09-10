import { agentSkillsIndex, discoveryHeaders } from "@/lib/agent-discovery";

export const dynamic = "force-static";

export function GET() {
  return Response.json(agentSkillsIndex, { headers: discoveryHeaders });
}
