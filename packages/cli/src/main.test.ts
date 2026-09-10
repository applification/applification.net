import { describe, expect, test } from "bun:test";
import { HELP, run } from "./main";

function harness(handler: (url: URL) => { status?: number; body: unknown }) {
  const out: string[] = [];
  const err: string[] = [];
  const calls: URL[] = [];
  const fetchImpl = (async (input: URL | RequestInfo) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    calls.push(url);
    const { status = 200, body } = handler(url);
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
  const exec = (argv: string[]) =>
    run(argv, { stdout: (t) => out.push(t), stderr: (t) => err.push(t) }, { fetch: fetchImpl });
  return { exec, out, err, calls };
}

describe("applification CLI", () => {
  test("prints help and version without touching the network", async () => {
    const h = harness(() => ({ body: {} }));
    expect(await h.exec(["--help"])).toBe(0);
    expect(h.out.join("")).toBe(HELP);
    expect(await h.exec(["--version"])).toBe(0);
    expect(h.out.at(-1)).toMatch(/^\d+\.\d+\.\d+\n$/);
    expect(await h.exec([])).toBe(2);
    expect(h.calls).toHaveLength(0);
  });

  test("search passes filters through and prints JSON", async () => {
    const h = harness(() => ({ body: { results: [], total: 0, nextOffset: null } }));
    expect(await h.exec(["search", "production", "AI", "--type", "client-work", "--limit", "2"])).toBe(0);
    expect(Object.fromEntries(h.calls[0].searchParams)).toEqual({
      query: "production AI",
      type: "client-work",
      limit: "2",
    });
    expect(JSON.parse(h.out[0])).toEqual({ results: [], total: 0, nextOffset: null });
  });

  test("read --all joins sections as Markdown and --json wraps it", async () => {
    const h = harness((url) => {
      const section = Number(url.searchParams.get("section") ?? 0);
      return {
        body: {
          type: "writing", slug: "post", title: "Post", summary: "", url: "https://www.applification.net/writing/post", topics: [],
          sections: [{ index: 0, title: "Post" }, { index: 1, title: "Post (continued 2)" }],
          section, content: `part ${section}`, format: "markdown", nextSection: section === 0 ? 1 : null, links: [],
        },
      };
    });
    expect(await h.exec(["read", "writing", "post", "--all"])).toBe(0);
    expect(h.out[0]).toBe("part 0\n\npart 1\n");
    expect(await h.exec(["read", "writing", "post"])).toBe(0);
    expect(h.out[1]).toBe("part 0\n");
    expect(h.err[0]).toMatch(/--section 1/);
    expect(await h.exec(["read", "writing", "post", "--json", "--section", "1"])).toBe(0);
    expect(JSON.parse(h.out[2]).section).toBe(1);
  });

  test("usage errors exit 2 and API errors map to distinct codes", async () => {
    const h = harness(() => ({ status: 404, body: { error: { code: "NOT_FOUND", message: "Not found." } } }));
    expect(await h.exec(["read", "writing"])).toBe(2);
    expect(await h.exec(["search", "--type", "podcasts"])).toBe(2);
    expect(await h.exec(["bogus"])).toBe(2);
    expect(h.calls).toHaveLength(0);
    expect(await h.exec(["read", "writing", "missing"])).toBe(3);
    expect(JSON.parse(h.err.at(-1)!).error.code).toBe("NOT_FOUND");
  });

  test("mcp prints a Streamable HTTP configuration", async () => {
    const h = harness(() => ({ body: {} }));
    expect(await h.exec(["mcp"])).toBe(0);
    const config = JSON.parse(h.out[0]);
    expect(config.mcpServers.applification).toEqual({
      type: "streamable-http",
      url: "https://www.applification.net/api/mcp",
    });
    expect(h.calls).toHaveLength(0);
  });
});
