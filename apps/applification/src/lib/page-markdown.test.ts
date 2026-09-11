import { afterEach, describe, expect, it, vi } from "vitest";
import { getPageMarkdown } from "./page-markdown.server";
import { getPublishedContent } from "./public-content.server";
import { agentPath, hasAgentView, humanPath, markdownPath } from "./page-view";
import { sitePageCopy, agentsCopy } from "./content/site-pages";
import { careerTimeline } from "./content/about";
import * as writing from "./writing";
import { GET } from "@/app/markdown/[[...path]]/route";

afterEach(() => vi.restoreAllMocks());

describe("public Markdown pages", () => {
  it("serves the same text in the Agent view and raw HTTP response", async () => {
    for (const path of ["/", "/about", "/agents", "/client-work", "/products", "/writing", "/privacy", "/products/contexture", "/client-work/logically"]) {
      const page = getPageMarkdown(path)!;
      const response = await GET(new Request(`https://example.test${markdownPath(path)}`), {
        params: Promise.resolve({ path: path.split("/").filter(Boolean) }),
      });
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Link")).toContain(`https://www.applification.net${path}`);
      expect(await response.text()).toBe(page.markdown);
    }
  });

  it("uses the authored introductions, career evidence and conversation prompt", () => {
    expect(getPageMarkdown("/")!.markdown).toContain(sitePageCopy.home.description);
    const about = getPageMarkdown("/about")!.markdown;
    expect(about).toContain(sitePageCopy.about.description);
    for (const entry of careerTimeline) expect(about).toContain(entry.description);
    expect(getPageMarkdown("/agents")!.markdown).toContain(agentsCopy.prompt);
  });

  it("covers published detail URLs without truncating API continuation chunks", () => {
    const published = getPublishedContent();
    for (const item of published.filter(item => new URL(item.url).pathname !== "/client-work")) {
      const path = new URL(item.url).pathname;
      const page = getPageMarkdown(path);
      expect(page, path).not.toBeNull();
      for (const section of item.sections.filter(section => !section.title.startsWith("Commercial terms"))) {
        expect(page!.markdown, `${path}: ${section.title}`).toContain(section.content);
      }
    }
  });

  it("rejoins long writing inside a code fence without injecting headings or whitespace", () => {
    const entry = writing.getWriting({ includeDrafts: false })[0];
    const body = "```text\n" + "long-code-line".repeat(900) + "\n```";
    vi.spyOn(writing, "getWriting").mockReturnValue([{ ...entry, body }]);
    expect(getPageMarkdown(`/writing/${entry.slug}`)!.markdown).toContain(body);
  });

  it("never exposes previews, private workflows, API paths or unknown pages", async () => {
    for (const path of ["/contact", "/contact/review/private-capability", "/writing/preview/draft", "/api/v1/catalog", "/agent/about", "/missing", "/products/missing", "/writing/not-a-published-entry"]) {
      expect(getPageMarkdown(path), path).toBeNull();
      const response = await GET(new Request(`https://example.test${markdownPath(path)}`), {
        params: Promise.resolve({ path: path.split("/").filter(Boolean) }),
      });
      expect(response.status).toBe(404);
      expect(response.headers.get("Cache-Control")).toBe("no-store");
    }
    const spy = vi.spyOn(writing, "getWriting");
    getPageMarkdown("/writing");
    expect(spy).toHaveBeenCalledWith({ includeDrafts: false });
  });
});

describe("page view navigation", () => {
  it("round trips a detail page and the homepage without losing their paths", () => {
    for (const path of ["/", "/about", "/writing/ai-native-software-needs-rigour", "/products/contexture"]) {
      expect(humanPath(agentPath(path))).toBe(path);
      expect(agentPath(agentPath(path))).toBe(agentPath(path));
      expect(markdownPath(agentPath(path))).toBe(markdownPath(path));
      expect(hasAgentView(agentPath(path))).toBe(true);
    }
    expect(agentPath("/")).toBe("/agent");
    expect(markdownPath("/")).toBe("/markdown");
    expect(hasAgentView("/contact/review/capability")).toBe(false);
    expect(hasAgentView("/writing/preview/draft")).toBe(false);
  });
});
