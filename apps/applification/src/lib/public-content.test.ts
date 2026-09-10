import { describe, expect, it, vi, afterEach } from "vitest";
import * as writing from "./writing";
import {
  getPublishedContent,
  searchSite,
  readContent,
  splitContent,
} from "./public-content.server";
import {
  readContentResponseSchema,
  searchSiteResponseSchema,
} from "./content-schema";
import { GET as searchGet, OPTIONS } from "@/app/api/v1/search/route";
import { GET as contentGet } from "@/app/api/v1/content/route";
import { publicOpenApi } from "./public-api-schema";

const content = getPublishedContent();
afterEach(() => vi.restoreAllMocks());

describe("published content reads", () => {
  it("answers the production AI question with published evidence", () => {
    const result = searchSite(
      {
        query: "Has Dave shipped production AI interfaces?",
        type: "client-work",
      },
      content,
    );
    expect(result.results[0].slug).toBe("logically");
    expect(searchSiteResponseSchema.safeParse(result).success).toBe(true);
    const detail = readContent(
      { type: "client-work", slug: "logically", section: 2 },
      content,
    )!;
    expect(detail.content).toContain("production Agentic Chat");
    expect(detail.content).toContain("Vercel AI SDK");
    expect(detail.url).toBe(
      "https://www.applification.net/client-work/logically",
    );
    expect(readContentResponseSchema.safeParse(detail).success).toBe(true);
  });

  it("lists all types with stable, non-overlapping pagination", () => {
    const first = searchSite({ limit: 2 }, content);
    const second = searchSite({ limit: 2, offset: first.nextOffset! }, content);
    expect(
      new Set([...first.results, ...second.results].map((x) => x.type + x.slug))
        .size,
    ).toBe(4);
    for (const type of ["client-work", "products", "writing"] as const) {
      const result = searchSite({ type, limit: 10 }, content);
      expect(result.total).toBeGreaterThan(0);
      expect(result.results.every((item) => item.type === type)).toBe(true);
    }
    expect(searchSite({ offset: 10000 }, content)).toMatchObject({
      results: [],
      nextOffset: null,
    });
    expect(searchSite({ query: "unfindablexyzword" }, content).results).toEqual(
      [],
    );
  });

  it("filters writing by topic/date and products by availability", () => {
    const post = content.find((item) => item.type === "writing")!;
    const results = searchSite(
      {
        type: "writing",
        topic: post.topics[0].toUpperCase(),
        after: post.date,
        before: post.date,
      },
      content,
    ).results;
    expect(results.some((item) => item.slug === post.slug)).toBe(true);
    expect(results.every((item) => item.date === post.date)).toBe(true);
    expect(
      searchSite({ type: "products", status: "live" }, content)
        .results.map((item) => item.slug)
        .sort(),
    ).toEqual(["contexture", "voiced"]);
    expect(
      searchSite({ type: "products", status: "research" }, content).results[0]
        .slug,
    ).toBe("plantry");
  });

  it("always asks for published writing, including development", () => {
    const spy = vi.spyOn(writing, "getWriting");
    getPublishedContent();
    expect(spy).toHaveBeenCalledWith({ includeDrafts: false });
    const drafts = writing
      .getWriting({ includeDrafts: true })
      .filter((entry) => entry.draft);
    expect(drafts.length).toBeGreaterThan(0);
    for (const entry of drafts) {
      expect(
        readContent({ type: "writing", slug: entry.slug }, content),
      ).toBeNull();
      expect(
        content.some(
          (item) => item.type === "writing" && item.slug === entry.slug,
        ),
      ).toBe(false);
    }
  });

  it("returns every section in bounded chunks and keeps reference metadata", () => {
    for (const item of content) {
      const result = readContent(
        { type: item.type, slug: item.slug },
        content,
      )!;
      expect(readContentResponseSchema.safeParse(result).success).toBe(true);
      expect(result.sections.length).toBe(item.sections.length);
      expect(item.sections.every((s) => s.content.length <= 4000)).toBe(true);
      expect(
        readContent(
          { type: item.type, slug: item.slug, section: item.sections.length },
          content,
        ),
      ).toBeNull();
    }
    const original =
      "Beginning\n\n" + "long paragraph 😀 ".repeat(900) + "\n\nEnd";
    expect(
      splitContent("Long article", original)
        .map((s) => s.content)
        .join(""),
    ).toBe(original);
    const voiced = readContent({ type: "products", slug: "voiced" }, content)!;
    expect(
      voiced.links.some(
        (link) => link.url === "https://voiced.applification.net/",
      ),
    ).toBe(true);
  });
});

describe("public HTTP content contract", () => {
  it("returns the same search/detail data and advertises read-only CORS", async () => {
    const response = searchGet(
      new Request("https://test.local/api/v1/search?type=products&limit=2"),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      searchSite({ type: "products", limit: 2 }, content),
    );
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(OPTIONS().headers.get("access-control-allow-methods")).toBe(
      "GET, HEAD, OPTIONS",
    );
    const details = contentGet(
      new Request(
        "https://test.local/api/v1/content?type=products&slug=voiced",
      ),
    );
    expect(await details.json()).toEqual(
      readContent({ type: "products", slug: "voiced" }, content),
    );
  });

  it.each([
    "limit=0",
    "limit=11",
    "limit=1.2",
    "offset=-1",
    "offset=NaN",
    "limit=",
    "type=private",
    "query=a&query=b",
    "consent=true",
    "after=2026-02-30",
    "after=2026-09-10&before=2026-01-01",
  ])("rejects malformed search %s", (query) => {
    const response = searchGet(
      new Request(`https://test.local/api/v1/search?${query}`),
    );
    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each([
    "type=writing&slug=../private",
    "type=writing&slug=constructor",
    "type=writing&slug=missing",
    "type=products&slug=voiced&section=999",
  ])("does not resolve unpublished or arbitrary paths: %s", (query) => {
    expect([400, 404]).toContain(
      contentGet(new Request(`https://test.local/api/v1/content?${query}`))
        .status,
    );
  });

  it("documents both content routes", () => {
    expect(publicOpenApi.paths).toHaveProperty("/api/v1/search");
    expect(publicOpenApi.paths).toHaveProperty("/api/v1/content");
  });
});
