import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ bot: vi.fn(), limit: vi.fn() }));
vi.mock("botid/server", () => ({ checkBotId: mocks.bot }));
vi.mock("@vercel/firewall", () => ({ checkRateLimit: mocks.limit }));
import { guardContactRequest, readContactJson } from "./contact-request-guard";

function request(extra: Record<string, string> = {}) {
  return new Request("https://example.com/api/contact/prepare", { method: "POST", headers: { origin: "https://example.com", "x-contact-session": "ea7735e0-5e9c-4ea0-9486-183223a26700", ...extra } });
}

describe("contact protection", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    mocks.bot.mockResolvedValue({ isBot: false, isHuman: true });
    mocks.limit.mockResolvedValue({ rateLimited: false });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); });
  it("checks separate IP and session buckets before bot verification", async () => {
    expect(await guardContactRequest(request(), "prepare")).toBeNull();
    expect(mocks.limit).toHaveBeenCalledTimes(2);
    expect(mocks.limit.mock.calls[0][1].rateLimitKey).toBeUndefined();
    expect(mocks.limit.mock.calls[1][1].rateLimitKey).toMatch(/^session:/);
    expect(mocks.bot).toHaveBeenCalledOnce();
  });
  it("rejects cross-origin requests before checking services", async () => {
    expect((await guardContactRequest(request({ origin: "https://attacker.test" }), "prepare"))!.status).toBe(403);
    expect(mocks.limit).not.toHaveBeenCalled();
  });
  it("blocks bots on uploads and delivery as well as AI", async () => {
    mocks.bot.mockResolvedValue({ isBot: true, isHuman: false });
    for (const operation of ["prepare", "attachment", "deliver"] as const) {
      expect((await guardContactRequest(request(), operation))!.status).toBe(403);
    }
  });
  it("stops at the IP limit and supplies retry guidance", async () => {
    mocks.limit.mockResolvedValue({ rateLimited: true });
    const response = await guardContactRequest(request(), "prepare");
    expect(response!.status).toBe(429);
    expect(response!.headers.get("Retry-After")).toBe("900");
    expect(mocks.bot).not.toHaveBeenCalled();
  });
  it("fails closed when a required firewall rule is missing", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.limit.mockResolvedValue({ rateLimited: false, error: "not-found" });
    expect((await guardContactRequest(request(), "prepare"))!.status).toBe(503);
    expect(mocks.bot).not.toHaveBeenCalled();
    warn.mockRestore();
  });
  it("limits bytes even without a Content-Length header", async () => {
    expect(await readContactJson(new Request("https://example.com", { method: "POST", body: JSON.stringify({ message: "x".repeat(1000) }) }), 100)).toBeNull();
    expect(await readContactJson(new Request("https://example.com", { method: "POST", body: '{"message":"hello"}' }), 100)).toEqual({ message: "hello" });
  });
});
