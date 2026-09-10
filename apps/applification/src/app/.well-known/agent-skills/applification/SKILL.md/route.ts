import { applificationSkill, discoveryHeaders } from "@/lib/agent-discovery";

export const dynamic = "force-static";

export function GET() {
  return new Response(applificationSkill, {
    headers: {
      ...discoveryHeaders,
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
