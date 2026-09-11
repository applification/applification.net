import { getPageMarkdown } from "@/lib/page-markdown.server";
import { siteUrl } from "@/lib/public-catalog";

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const page = getPageMarkdown(`/${path.join("/")}`);
  return new Response(page?.markdown ?? "# Page not found\n\nRead the site guide at https://www.applification.net/llms.txt.\n", {
    status: page ? 200 : 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": page ? "public, max-age=3600" : "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      ...(page ? { Link: `<${siteUrl}${page.path}>; rel="canonical"` } : {}),
    },
  });
}
