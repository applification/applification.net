import { NextRequest, NextResponse } from "next/server";
import { contactSite, parseContactRoute } from "./lib/contact";
import {
  destinationSite,
  isLocalHostname,
  parseSiteIdentity,
  previewSiteCookie,
  resolveSiteIdentity,
  siteIdentityHeader,
  siteOrigin,
} from "./lib/site-identity";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  // Next's direct Node server can construct nextUrl using its internal origin.
  // The Host header identifies the public hostname; never use forwarded host.
  const host = request.headers.get("host");
  const publicHost = host?.match(/^([a-z0-9.-]+)(?::\d+)?$/i);
  const hostname = publicHost?.[1]?.toLowerCase() ?? url.hostname;
  const productionHost = [
    "applification.net",
    "www.applification.net",
    "dave.applification.net",
  ].includes(hostname);
  const preview =
    isLocalHostname(hostname) ||
    (!productionHost && process.env.VERCEL_ENV === "preview");
  const selection = parseSiteIdentity(url.searchParams.get("site"));
  const site = resolveSiteIdentity({
    hostname,
    preview,
    selection: selection ?? request.cookies.get(previewSiteCookie)?.value,
  });
  const contactRoute = url.pathname === "/contact" ? parseContactRoute(url.searchParams.get("route")) : null;
  const enquirySite = contactRoute ? contactSite(contactRoute) : site;
  const destination = enquirySite !== site ? enquirySite : destinationSite({ site, pathname: url.pathname });
  if (destination) {
    const target = new URL(
      `${url.pathname}${url.search}`,
      siteOrigin(destination),
    );
    if (preview) {
      // Same deployment previews preserve the selected identity through links.
      target.host = publicHost?.[0]?.toLowerCase() ?? url.host;
      target.protocol = url.protocol;
      if (
        ["applification.localhost", "dave.applification.localhost"].includes(
          hostname,
        ) &&
        destination
      ) {
        target.hostname =
          destination === "profile"
            ? "dave.applification.localhost"
            : "applification.localhost";
      }
      target.searchParams.set("site", destination);
    }
    return NextResponse.redirect(target, 308);
  }
  const requestHeaders = new Headers(request.headers);
  // Replace any caller-supplied identity before it reaches rendering/metadata.
  requestHeaders.set(siteIdentityHeader, site);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (preview) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (preview && selection)
    response.cookies.set(previewSiteCookie, selection, {
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
      path: "/",
    });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/|api/|\\.well-known/|brand/|images/|media/|vendor/|cv/|favicon.ico).*)",
  ],
};
