import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFoundResponse, prefersHtml } from "@/lib/not-found";

// Catches every path no page or route handler claims (including unknown
// slugs under pages with dynamicParams = false). Browsers get the prerendered
// app/not-found.tsx page; agents, curl and fetch get a short Markdown body.
//
// notFound() inside a route handler produces an empty body, and fetching the
// page over HTTP breaks behind Vercel deployment protection, so the prerendered
// HTML is read from the build output (see outputFileTracingIncludes).

export const notFoundPageFile = path.join(
  ".next",
  "server",
  "app",
  "_not-found.html",
);

let notFoundHtml: Promise<string | null> | undefined;

function loadNotFoundHtml() {
  notFoundHtml ??= readFile(
    path.join(process.cwd(), notFoundPageFile),
    "utf8",
  ).catch(() => {
    notFoundHtml = undefined;
    return null;
  });
  return notFoundHtml;
}

export async function GET(request: Request) {
  if (prefersHtml(request.headers.get("accept"))) {
    const html = await loadNotFoundHtml();
    if (html) {
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
    }
  }
  return notFoundResponse(request);
}

export const HEAD = GET;
