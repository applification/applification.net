import { afterEach, describe, expect, it, vi } from "vitest";
import {
  catalogTool,
  registerCatalogTool,
  registerWebMcpTool,
  searchSiteTool,
  readContentTool,
  type WebMcpTool,
} from "./webmcp";
import { getPublicCatalog } from "./public-catalog";

describe("WebMCP catalog tool", () => {
  it("cleans up synchronous legacy registration before an immediate remount", () => {
    const tools = new Set<string>();
    const context = {
      registerTool: vi.fn((tool: WebMcpTool) => {
        if (tools.has(tool.name)) throw new Error("Already registered");
        tools.add(tool.name);
      }),
      unregisterTool: vi.fn((name: string) => {
        tools.delete(name);
      }),
    };
    registerCatalogTool(undefined, context)();
    const cleanup = registerCatalogTool(undefined, context);
    expect(tools.has(catalogTool.name)).toBe(true);
    expect(context.unregisterTool).toHaveBeenCalledTimes(1);
    cleanup();
    expect(tools.size).toBe(0);
  });

  it("prefers document, registers a read-only tool, and aborts on cleanup", () => {
    const registerTool = vi.fn();
    const legacy = { registerTool: vi.fn(), unregisterTool: vi.fn() };
    const cleanup = registerCatalogTool({ registerTool }, legacy);
    expect(registerTool.mock.calls[0][0].annotations.readOnlyHint).toBe(true);
    expect(legacy.registerTool).not.toHaveBeenCalled();
    const signal = registerTool.mock.calls[0][1].signal;
    expect(signal.aborted).toBe(false);
    cleanup();
    expect(signal.aborted).toBe(true);
  });

  it("supports navigator fallback and cleans up when registration resolves after unmount", async () => {
    let resolve!: () => void;
    const context = {
      registerTool: vi.fn(
        () =>
          new Promise<void>((done) => {
            resolve = done;
          }),
      ),
      unregisterTool: vi.fn(),
    };
    const cleanup = registerCatalogTool(undefined, context);
    cleanup();
    resolve();
    await Promise.resolve();
    expect(context.unregisterTool).toHaveBeenCalledWith(catalogTool.name);
  });

  it("is harmless without support and with throwing or rejecting preview implementations", async () => {
    expect(() => registerCatalogTool()()).not.toThrow();
    expect(() =>
      registerCatalogTool({
        registerTool: () => {
          throw new Error("Unavailable");
        },
      })(),
    ).not.toThrow();
    registerCatalogTool({
      registerTool: () => Promise.reject(new Error("Unavailable")),
    })();
    await Promise.resolve();
  });

  it("returns the same public data as HTTP and validates tool input at runtime", async () => {
    expect(await catalogTool.execute({ section: "products" })).toEqual(
      getPublicCatalog({ section: "products" }),
    );
    await expect(
      catalogTool.execute({ section: "contact", message: "send" }),
    ).rejects.toThrow();
    await expect(
      catalogTool.execute({ section: "constructor" }),
    ).rejects.toThrow();
  });
});

describe("WebMCP content tools", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps registrations independent when a page tool is removed", () => {
    const tools = new Set<string>();
    const context = {
      registerTool: (tool: WebMcpTool, options?: { signal: AbortSignal }) => {
        tools.add(tool.name);
        options?.signal.addEventListener("abort", () =>
          tools.delete(tool.name),
        );
      },
    };
    const cleanups = [catalogTool, searchSiteTool, readContentTool].map(
      (tool) => registerWebMcpTool(tool, context),
    );
    cleanups[1]();
    expect([...tools]).toEqual(["get_applification_info", "read_content"]);
    cleanups.forEach((cleanup) => cleanup());
    expect(tools.size).toBe(0);
  });

  it("encodes searches against the public same-origin endpoint without credentials", async () => {
    const body = { results: [], total: 0, nextOffset: null };
    const fetchMock = vi.fn().mockResolvedValue(Response.json(body));
    vi.stubGlobal("fetch", fetchMock);
    expect(
      await searchSiteTool.execute({ query: "AI & React", type: "writing" }),
    ).toEqual(body);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "/api/v1/search?query=AI+%26+React&type=writing",
    );
    expect(options.credentials).toBe("omit");
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it("rejects invalid input before fetching and preserves content-not-found errors", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(
      await readContentTool.execute({ type: "writing", slug: "../draft" }),
    ).toMatchObject({ error: { code: "INVALID_QUERY" } });
    expect(fetchMock).not.toHaveBeenCalled();
    const body = {
      error: { code: "NOT_FOUND", message: "Published content was not found." },
    };
    fetchMock.mockResolvedValue(Response.json(body, { status: 404 }));
    expect(
      await readContentTool.execute({ type: "writing", slug: "missing" }),
    ).toEqual(body);
  });

  it("returns actionable errors for server failures, invalid JSON and connection failures", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({}, { status: 503 }))
      .mockResolvedValueOnce(new Response("Unavailable", { status: 502 }))
      .mockRejectedValueOnce(new Error("Connection lost"));
    vi.stubGlobal("fetch", fetchMock);
    for (let i = 0; i < 3; i++) {
      expect(await searchSiteTool.execute({})).toMatchObject({
        error: { code: "UNAVAILABLE" },
      });
    }
  });
});
