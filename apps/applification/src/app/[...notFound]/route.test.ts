import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const readFile = vi.fn();
vi.mock("node:fs/promises", () => ({ readFile }));

const origin = "https://www.applification.net";

beforeEach(() => {
  vi.resetModules();
  readFile.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function load() {
  return import("./route");
}

describe("GET unknown path", () => {
  it("serves Markdown with a 404 to agents and curl", async () => {
    const { GET } = await load();
    const response = await GET(new Request(`${origin}/missing`));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(await response.text()).toContain(`${origin}/llms.txt`);
    expect(readFile).not.toHaveBeenCalled();
  });

  it("serves the prerendered not-found page to browsers, read once", async () => {
    readFile.mockResolvedValue("<html>404 page</html>");
    const { GET, notFoundPageFile } = await load();
    const request = () =>
      new Request(`${origin}/missing`, {
        headers: { accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
      });
    const response = await GET(request());
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
    expect(await response.text()).toBe("<html>404 page</html>");
    expect(String(readFile.mock.calls[0][0])).toContain(notFoundPageFile);

    await GET(request());
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  it("falls back to Markdown when the page file is missing", async () => {
    readFile.mockRejectedValue(new Error("ENOENT"));
    const { GET, HEAD } = await load();
    const response = await GET(
      new Request(`${origin}/missing`, { headers: { accept: "text/html" } }),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );

    const head = await HEAD(
      new Request(`${origin}/missing`, { headers: { accept: "text/html" } }),
    );
    expect(head.status).toBe(404);
  });
});
