import { getPageMarkdown } from "@/lib/page-markdown.server";
import { contentOrigin, parseSiteIdentity, siteIdentityHeader, siteOrigin } from "@/lib/site-identity";

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const site = parseSiteIdentity(_request.headers.get(siteIdentityHeader)) ?? "business";
  const page = getPageMarkdown(`/${path.join("/")}`, site);
  return new Response(page?.markdown ?? "# Page not found\n\nRead the site guide at https://applification.net/llms.txt.\n", {
    status: page ? 200 : 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": page ? "public, max-age=3600" : "no-store",
      Vary: "Host, Cookie",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      ...(page ? { Link: `<${page.path === "/" ? siteOrigin(site) : contentOrigin(page.path)}${page.path}>; rel="canonical"` } : {}),
    },
  });
}
