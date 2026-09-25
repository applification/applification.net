import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, enforcedContentSecurityPolicy, securityHeaders } from "./security-headers";

function directive(policy: string, name: string) {
  return policy.split("; ").find((entry) => entry.startsWith(`${name} `));
}

describe("security headers", () => {
  it("always enforces framing, plugin, base and form restrictions", () => {
    const policy = enforcedContentSecurityPolicy();
    expect(policy).toBe(
      "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    );
    expect(enforcedContentSecurityPolicy({ development: true })).not.toContain("upgrade-insecure-requests");
  });

  it("reports framing, plugins and foreign form targets in the full policy", () => {
    const policy = contentSecurityPolicy();
    expect(directive(policy, "frame-ancestors")).toBe("frame-ancestors 'self'");
    expect(directive(policy, "object-src")).toBe("object-src 'none'");
    expect(directive(policy, "base-uri")).toBe("base-uri 'self'");
    expect(directive(policy, "form-action")).toBe("form-action 'self'");
    expect(policy).toContain("upgrade-insecure-requests");
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).not.toContain("vercel.live");
  });

  it("allows only the embeds the site renders", () => {
    const policy = contentSecurityPolicy();
    expect(directive(policy, "script-src")).toContain("https://platform.twitter.com");
    expect(directive(policy, "frame-src")).toBe(
      "frame-src 'self' https://www.youtube-nocookie.com https://platform.twitter.com https://syndication.twitter.com",
    );
  });

  it("relaxes only what next dev and Vercel previews need", () => {
    expect(directive(contentSecurityPolicy({ development: true }), "script-src")).toContain("'unsafe-eval'");
    expect(directive(contentSecurityPolicy({ development: true }), "connect-src")).toContain("ws:");
    expect(directive(contentSecurityPolicy({ preview: true }), "frame-src")).toContain("https://vercel.live");
  });

  it("sends the baseline hardening headers", () => {
    const headers = Object.fromEntries(securityHeaders().map(({ key, value }) => [key, value]));
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(headers["Content-Security-Policy"]).toBe(enforcedContentSecurityPolicy());
    expect(headers["Content-Security-Policy-Report-Only"]).toBe(contentSecurityPolicy());
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Strict-Transport-Security"]).toContain("max-age=");
    expect(Object.keys(Object.fromEntries(securityHeaders({ development: true }).map(({ key }) => [key, 1])))).not.toContain(
      "Strict-Transport-Security",
    );
  });
});
