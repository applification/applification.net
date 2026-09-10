import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, HEAD } from "./route";

const origin = "https://www.applification.net";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET unknown path", () => {
  it("serves Markdown with a 404 to agents and curl", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(new Request(`${origin}/missing`));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(await response.text()).toContain(`${origin}/llms.txt`);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("serves the prerendered not-found page to browsers", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("<html>404 page</html>", { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(
      new Request(`${origin}/missing`, {
        headers: { accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
      }),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );
    expect(await response.text()).toBe("<html>404 page</html>");
    expect(String(fetchMock.mock.calls[0][0])).toBe(`${origin}/_not-found`);
  });

  it("falls back to Markdown when the page cannot be fetched", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const response = await GET(
      new Request(`${origin}/missing`, { headers: { accept: "text/html" } }),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
  });

  it("never fetches itself for the internal not-found path", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await HEAD(
      new Request(`${origin}/_not-found`, { headers: { accept: "text/html" } }),
    );
    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
