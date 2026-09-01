import { describe, expect, it } from "vitest";
import { buildContactHref, parseContactProduct, parseContactRoute } from "./contact";

describe("contact links", () => {
  it("routes contract enquiries to the single contact workspace", () => {
    expect(buildContactHref()).toBe("/contact?route=contract");
  });

  it("keeps an explicit product selection in the workspace URL", () => {
    expect(buildContactHref({ route: "product", product: "storyloops" })).toBe(
      "/contact?route=product&product=storyloops",
    );
  });

  it("accepts only maintained enquiry routes", () => {
    expect(parseContactRoute("general")).toBe("general");
    expect(parseContactRoute("recruiter-approved")).toBeNull();
    expect(parseContactRoute(["contract"])).toBeNull();
  });

  it("accepts only maintained products", () => {
    expect(parseContactProduct("contexture")).toBe("contexture");
    expect(parseContactProduct("custom-consulting")).toBeNull();
  });
});
