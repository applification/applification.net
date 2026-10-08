import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import {
  businessUrl,
  profileUrl,
  resolveSiteIdentity,
  siteIdentityHeader,
} from "./site-identity";

describe("hostname split", () => {
  it("keeps production identity independent of preview choices", () => {
    expect(
      resolveSiteIdentity({
        hostname: "dave.applification.net",
        preview: true,
        selection: "business",
      }),
    ).toBe("profile");
    expect(
      resolveSiteIdentity({
        hostname: "applification.net",
        preview: true,
        selection: "profile",
      }),
    ).toBe("business");
    expect(
      resolveSiteIdentity({
        hostname: "preview.vercel.app",
        preview: false,
        selection: "profile",
      }),
    ).toBe("business");
  });

  it("uses the public Host when Next's internal URL has a local origin", () => {
    const response = proxy(
      new NextRequest("http://localhost:3333/", {
        headers: {
          host: "dave.applification.net",
          "x-forwarded-host": "applification.net",
        },
      }),
    );
    expect(
      response.headers.get(`x-middleware-request-${siteIdentityHeader}`),
    ).toBe("profile");
  });

  it.each([
    [
      "applification.net",
      "/about?route=contract",
      profileUrl + "/about?route=contract",
    ],
    [
      "applification.net",
      "/client-work/eruptiv",
      profileUrl + "/client-work/eruptiv",
    ],
    ["applification.net", "/agent/writing", profileUrl + "/agent/writing"],
    ["applification.net", "/markdown/about", profileUrl + "/markdown/about"],
    [
      "dave.applification.net",
      "/products/loami?ref=cv",
      businessUrl + "/products/loami?ref=cv",
    ],
    [
      "dave.applification.net",
      "/markdown/products/contexture",
      businessUrl + "/markdown/products/contexture",
    ],
  ])("preserves migrated links from %s%s", (host, path, destination) => {
    const response = proxy(new NextRequest(`https://${host}${path}`));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(destination);
  });

  it("overwrites spoofed identity and leaves contact and Logically on the current host", () => {
    for (const path of [
      "/",
      "/contact?route=contract",
      "/contact/review/token",
      "/client-work/logically",
    ]) {
      const response = proxy(
        new NextRequest(profileUrl + path, {
          headers: { [siteIdentityHeader]: "business" },
        }),
      );
      expect(response.headers.get("location")).toBeNull();
      expect(
        response.headers.get(`x-middleware-request-${siteIdentityHeader}`),
      ).toBe("profile");
    }
  });

  it("leaves the www alias redirect to Vercel, avoiding a loop with its current apex-to-www setting", () => {
    const response = proxy(new NextRequest("https://www.applification.net/"));
    expect(response.headers.get("location")).toBeNull();
    expect(
      response.headers.get(`x-middleware-request-${siteIdentityHeader}`),
    ).toBe("business");
  });

  it("changes named local hostnames when moving a section", () => {
    const response = proxy(
      new NextRequest("http://dave.applification.localhost:3333/products"),
    );
    expect(response.headers.get("location")).toBe(
      "http://applification.localhost:3333/products?site=business",
    );
    expect(
      resolveSiteIdentity({
        hostname: "applification.localhost",
        preview: true,
        selection: "profile",
      }),
    ).toBe("business");
    const internalOrigin = proxy(
      new NextRequest("http://localhost:3333/products", {
        headers: { host: "dave.applification.localhost:3333" },
      }),
    );
    expect(internalOrigin.headers.get("location")).toBe(
      "http://applification.localhost:3333/products?site=business",
    );
  });

  it("supports local previews and preserves identity when a section changes site", () => {
    const response = proxy(
      new NextRequest("http://localhost:3333/?site=profile"),
    );
    expect(response.cookies.get("applification-preview-site")?.value).toBe(
      "profile",
    );
    const migrated = proxy(
      new NextRequest("http://localhost:3333/products?site=profile&ref=cv"),
    );
    expect(migrated.headers.get("location")).toBe(
      "http://localhost:3333/products?site=business&ref=cv",
    );
  });
});
