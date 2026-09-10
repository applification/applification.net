import { siteUrl } from "@/lib/public-catalog";

export const notFoundLinks = [
  {
    href: "/sitemap.xml",
    label: "Sitemap",
    detail: "Every public page as XML.",
  },
  {
    href: "/llms.txt",
    label: "llms.txt",
    detail: "Site guide for agents with the main entry points.",
  },
  {
    href: "/api/v1/search",
    label: "Search content",
    detail: "Search or list published client work, writing and products as JSON.",
  },
  {
    href: "/agents",
    label: "Agents",
    detail: "Context, browser tools and the API reference.",
  },
  {
    href: "/api/openapi.json",
    label: "OpenAPI",
    detail: "OpenAPI 3.1 specification for the public API.",
  },
  {
    href: "/",
    label: "Home",
    detail: "Dave Hudson's profile, client work, writing and products.",
  },
] as const;

const requestPathPattern = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:@%/?]*$/;

function displayPath(pathname: string) {
  return requestPathPattern.test(pathname) && pathname.length <= 200
    ? pathname
    : "the requested path";
}

export function notFoundMarkdown(pathname: string) {
  return `# 404: Not found

Nothing is published at ${displayPath(pathname)} on ${siteUrl}.

## Where to look next
${notFoundLinks.map(({ href, label, detail }) => `- [${label}](${siteUrl}${href}): ${detail}`).join("\n")}

Tip: use ${siteUrl}/api/v1/search?query=<words> to find published content by keyword, then read it with ${siteUrl}/api/v1/content?type=<type>&slug=<slug>.
`;
}

/**
 * Browsers always list text/html in Accept. Agents, curl and fetch typically
 * send a wildcard or a markdown/plain preference, so they get the Markdown body.
 */
export function prefersHtml(accept: string | null) {
  if (!accept) return false;
  return accept
    .split(",")
    .some((entry) => {
      const [type, ...params] = entry.trim().split(";");
      const q = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      const mediaType = type.trim().toLowerCase();
      return (
        (mediaType === "text/html" || mediaType === "application/xhtml+xml") &&
        weight > 0
      );
    });
}

export function notFoundResponse(request: Request) {
  const { pathname } = new URL(request.url);
  return new Response(notFoundMarkdown(pathname), {
    status: 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      Vary: "Accept",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
