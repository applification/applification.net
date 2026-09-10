import { siteUrl } from "@/lib/public-catalog";

export const dynamic = "force-static";

// Robots exclusions are not access controls; private routes keep their own checks.
const privatePaths = ["/contact/review/", "/writing/preview/", "/api/contact/"];
// Crawlers that feed answer engines and live agent fetches. Allowed.
const answerEngineCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
];
// Training-only corpus crawlers with no search or answer surface. Blocked.
const trainingOnlyCrawlers = ["CCBot", "Bytespider"];

const disallowPrivate = privatePaths
  .map((path) => `Disallow: ${path}`)
  .join("\n");
const agents = (names: string[]) =>
  names.map((name) => `User-agent: ${name}`).join("\n");

export function GET() {
  const text = `User-agent: *
Allow: /
${disallowPrivate}
Content-Signal: search=yes, ai-input=yes

${agents(answerEngineCrawlers)}
Allow: /
${disallowPrivate}

${agents(trainingOnlyCrawlers)}
Disallow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
