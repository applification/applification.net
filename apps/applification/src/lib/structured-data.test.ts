import { describe, expect, it } from "vitest";
import { breadcrumbStructuredData, homepageStructuredData } from "./public-catalog";

type Node = Record<string, unknown> & { "@type": string };
const graph = homepageStructuredData["@graph"] as Node[];
const byType = (type: string) => graph.filter((node) => node["@type"] === type);

describe("homepage structured data", () => {
  it("describes the organization with a contact point and a postal address", () => {
    const [organization] = byType("Organization");
    expect(organization.contactPoint).toEqual([
      expect.objectContaining({
        "@type": "ContactPoint",
        contactType: expect.any(String),
        url: "https://www.applification.net/about",
      }),
    ]);
    expect(organization.address).toEqual(
      expect.objectContaining({ "@type": "PostalAddress", addressCountry: "GB" }),
    );
    expect(JSON.stringify(homepageStructuredData)).not.toMatch(
      /mailto:|[\w.+-]+@applification\.net|"telephone"/i,
    );
  });

  it("extends beyond Organization and WebSite with service, product and FAQ types", () => {
    expect(byType("Service")).toHaveLength(1);
    expect(byType("SoftwareApplication").map((node) => node.name)).toEqual([
      "Contexture",
      "Voiced",
    ]);
    const [faq] = byType("FAQPage");
    const questions = faq.mainEntity as Node[];
    expect(questions.length).toBeGreaterThanOrEqual(4);
    for (const question of questions) {
      expect(question["@type"]).toBe("Question");
      expect((question.acceptedAnswer as Node).text).toEqual(expect.any(String));
    }
    expect(JSON.stringify(faq)).not.toMatch(/£\s?\d|day rate of/i);
  });

  it("builds an absolute breadcrumb trail from the home page", () => {
    const crumbs = breadcrumbStructuredData([
      { name: "Products", path: "/products" },
      { name: "Voiced", path: "/products/voiced" },
    ]);
    expect(crumbs.itemListElement.map((item) => [item.position, item.item])).toEqual([
      [1, "https://www.applification.net"],
      [2, "https://www.applification.net/products"],
      [3, "https://www.applification.net/products/voiced"],
    ]);
  });
});
