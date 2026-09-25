import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "@/lib/contact-draft";
import { ContactPrepareError, type ContactPrepareErrorCode } from "@/lib/prepare-contact";

const mocks = vi.hoisted(() => ({ prepareContactProposal: vi.fn() }));
vi.mock("@/lib/prepare-contact", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/prepare-contact")>()),
  prepareContactProposal: mocks.prepareContactProposal,
}));

import { POST } from "./route";

const draft = createContactDraft({ route: "general" });

function prepare(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request("https://example.com/api/contact/prepare", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        "x-contact-session": "ea7735e0-5e9c-4ea0-9486-183223a26700",
        ...headers,
      },
      body: JSON.stringify(body),
    }),
  );
}

describe("contact brief preparation", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CONTACT_WORKFLOW_ENABLED", undefined);
    vi.stubEnv("CONTACT_PUBLIC_BASE_URL", undefined);
    vi.stubEnv("PORTLESS_TAILSCALE_URL", undefined);
    vi.stubEnv("PORTLESS_URL", undefined);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("returns the assistant's proposal for a valid message", async () => {
    const proposal = { baseVersion: draft.version, route: "general", changes: { topic: "Speaking" } };
    mocks.prepareContactProposal.mockResolvedValue(proposal);

    const response = await prepare({ draft, message: "  I'd like to invite Dave to speak  " });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ proposal });
    expect(mocks.prepareContactProposal).toHaveBeenCalledWith({
      draft,
      message: "I'd like to invite Dave to speak",
    });
  });

  it.each([
    ["an empty message", { draft, message: "   " }],
    ["a missing draft", { message: "Hello" }],
    ["unknown fields", { draft, message: "Hello", model: "expensive" }],
    ["a malformed draft", { draft: { ...draft, route: "sales" }, message: "Hello" }],
  ])("rejects %s without calling the assistant", async (_label, body) => {
    const response = await prepare(body);

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_request");
    expect(mocks.prepareContactProposal).not.toHaveBeenCalled();
  });

  it("rejects a body that isn't JSON", async () => {
    const response = await POST(
      new Request("https://example.com/api/contact/prepare", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "x-contact-session": "ea7735e0-5e9c-4ea0-9486-183223a26700",
        },
        body: "not json",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("asks the visitor to retry after a minute when the provider is busy", async () => {
    mocks.prepareContactProposal.mockRejectedValue(new ContactPrepareError("rate_limited", "The assistant is busy."));
    const response = await prepare({ draft, message: "Hello" });

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ code: "rate_limited", message: "The assistant is busy." });
  });

  it("maps a malformed model response to a bad gateway", async () => {
    mocks.prepareContactProposal.mockRejectedValue(
      new ContactPrepareError("malformed_response", "The assistant returned an unusable answer."),
    );
    const response = await prepare({ draft, message: "Hello" });

    expect(response.status).toBe(502);
    expect(response.headers.get("retry-after")).toBeNull();
    expect((await response.json()).code).toBe("malformed_response");
  });

  it.each<ContactPrepareErrorCode>([
    "budget_exhausted",
    "timeout",
    "free_tier_limited",
    "not_configured",
    "provider_error",
  ])("maps %s to service unavailable with its own code", async (code) => {
    mocks.prepareContactProposal.mockRejectedValue(new ContactPrepareError(code, `Message for ${code}`));
    const response = await prepare({ draft, message: "Hello" });

    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBeNull();
    expect(await response.json()).toEqual({ code, message: `Message for ${code}` });
  });

  it("hides unexpected failures behind a generic provider error", async () => {
    mocks.prepareContactProposal.mockRejectedValue(new Error("secret internal detail"));
    const response = await prepare({ draft, message: "Hello" });

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.code).toBe("provider_error");
    expect(JSON.stringify(body)).not.toContain("secret internal detail");
  });

  it("doesn't call the assistant for a cross-origin request or while switched off", async () => {
    expect((await prepare({ draft, message: "Hello" }, { origin: "https://attacker.test" })).status).toBe(403);

    vi.stubEnv("CONTACT_WORKFLOW_ENABLED", "false");
    const off = await prepare({ draft, message: "Hello" });
    expect(off.status).toBe(503);
    expect((await off.json()).code).toBe("contact_unavailable");
    expect(mocks.prepareContactProposal).not.toHaveBeenCalled();
  });
});
