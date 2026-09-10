import { siteSkillMarkdown } from "@/lib/agent-skills";

export const dynamic = "force-static";

export function GET() {
  return new Response(siteSkillMarkdown, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
