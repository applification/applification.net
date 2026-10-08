export type SiteIdentity = "business" | "profile";

export const businessUrl = "https://applification.net";
export const profileUrl = "https://dave.applification.net";
export const siteIdentityHeader = "x-applification-site";
export const previewSiteCookie = "applification-preview-site";

export function parseSiteIdentity(
  value: string | null | undefined,
): SiteIdentity | null {
  return value === "business" || value === "profile" ? value : null;
}

export function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

export function resolveSiteIdentity({
  hostname,
  preview,
  selection,
}: {
  hostname: string;
  preview: boolean;
  selection?: string | null;
}): SiteIdentity {
  if (
    hostname === "dave.applification.net" ||
    hostname === "dave.applification.localhost"
  )
    return "profile";
  // A preview choice never overrides either production hostname.
  if (
    hostname === "applification.net" ||
    hostname === "www.applification.net" ||
    hostname === "applification.localhost"
  )
    return "business";
  return preview ? (parseSiteIdentity(selection) ?? "business") : "business";
}

export function siteOrigin(site: SiteIdentity) {
  return site === "profile" ? profileUrl : businessUrl;
}

export function contentOrigin(pathname: string) {
  const path = pathname.replace(/^\/(agent|markdown)(?=\/|$)/, "") || "/";
  return path === "/about" ||
    path === "/client-work" ||
    /^\/client-work\/(eruptiv|peppy-health)$/.test(path) ||
    /^\/(writing|posts)(\/|$)/.test(path)
    ? profileUrl
    : businessUrl;
}

// Keep path and query intact when moving a section, including its Agent and
// Markdown views. Logically remains readable in both portfolios; its canonical
// source is the business site. Contact/private review/API routes stay same-origin.
export function destinationSite({
  site,
  pathname,
}: {
  site: SiteIdentity;
  pathname: string;
}): SiteIdentity | null {
  const path = pathname.replace(/^\/(agent|markdown)(?=\/|$)/, "") || "/";
  if (site === "profile" && /^\/products(\/|$)/.test(path)) return "business";
  if (
    site === "business" &&
    (path === "/about" ||
      path === "/client-work" ||
      /^\/client-work\/(eruptiv|peppy-health)$/.test(path) ||
      /^\/(writing|posts)(\/|$)/.test(path))
  )
    return "profile";
  return null;
}

export const businessDescription =
  "Applification builds MCP integrations and interactive apps that make existing business systems and data usable through AI assistants, with controlled access to data and workflows.";
export const profileDescription =
  "Dave Hudson is a contract frontend and product engineer working with React, TypeScript and Next.js. More than twenty years of delivery experience, with full-stack and production AI integration depth. Remote UK contracts through Applification Ltd.";
