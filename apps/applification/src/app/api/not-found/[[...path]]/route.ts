import { notFoundResponse } from "@/lib/not-found";

// Target of the fallback rewrite in next.config.ts: any path that no page,
// route or static file claims is rewritten here unless the client asked for
// text/html (browsers keep Next's not-found page). Agents, curl and fetch get
// a short Markdown 404 with links to the sitemap, llms.txt and the API.

const prefix = "/api/not-found";

export function originalPath(url: string) {
  const { pathname } = new URL(url);
  const rest = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : pathname;
  return rest || "/";
}

export function GET(request: Request) {
  return notFoundResponse(originalPath(request.url));
}

export const HEAD = GET;
