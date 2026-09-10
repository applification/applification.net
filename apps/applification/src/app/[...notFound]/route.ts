import { notFoundResponse, prefersHtml } from "@/lib/not-found";

// Catches every path no page or route handler claims (including unknown
// slugs under pages with dynamicParams = false). Browsers get the prerendered
// app/not-found.tsx page; agents, curl and fetch get a short Markdown body.

const notFoundPagePath = "/_not-found";

async function htmlNotFound(request: Request) {
  const url = new URL(request.url);
  if (url.pathname === notFoundPagePath) return null;
  try {
    const page = await fetch(new URL(notFoundPagePath, url), {
      headers: { accept: "text/html" },
      cache: "no-store",
    });
    const html = await page.text();
    if (!html) return null;
    return new Response(html, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        Vary: "Accept",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  if (prefersHtml(request.headers.get("accept"))) {
    const html = await htmlNotFound(request);
    if (html) return html;
  }
  return notFoundResponse(request);
}

export const HEAD = GET;
