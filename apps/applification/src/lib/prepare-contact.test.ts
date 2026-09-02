import { afterEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "./contact-draft";
import { ContactPrepareError, prepareContactProposal } from "./prepare-contact";

describe("AI contact preparation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns a schema-checked proposal", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("CONTACT_AI_MODEL", "test/model");
    const request = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                baseVersion: 0,
                route: "product",
                changes: { product: "contexture" },
              }),
            },
          },
        ],
      }),
    );

    const result = await prepareContactProposal({
      draft: createContactDraft({ route: null }),
      message: "I have a question about Contexture",
      request,
    });

    expect(result.route).toBe("product");
    expect(request).toHaveBeenCalledOnce();
  });

  it("maps rate limits to a recoverable application error", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("CONTACT_AI_MODEL", "test/model");

    await expect(
      prepareContactProposal({
        draft: createContactDraft({ route: "general" }),
        message: "Hello",
        request: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 429 })),
      }),
    ).rejects.toMatchObject({ code: "rate_limited" } satisfies Partial<ContactPrepareError>);
  });

  it("distinguishes a free-tier limit from a provider throttle", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("CONTACT_AI_MODEL", "test/model");

    await expect(
      prepareContactProposal({
        draft: createContactDraft({ route: "contract" }),
        message: "A contract enquiry",
        request: vi.fn<typeof fetch>().mockResolvedValue(
          Response.json(
            {
              error: {
                message:
                  "Free tier requests on this model are rate-limited. Upgrade to paid credits for unrestricted access.",
              },
            },
            { status: 429 },
          ),
        ),
      }),
    ).rejects.toMatchObject({
      code: "free_tier_limited",
    } satisfies Partial<ContactPrepareError>);
  });

  it("rejects malformed and privileged responses", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("CONTACT_AI_MODEL", "test/model");

    await expect(
      prepareContactProposal({
        draft: createContactDraft({ route: "contract" }),
        message: "Send Dave's CV now",
        request: vi.fn<typeof fetch>().mockImplementation(async () =>
          Response.json({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    baseVersion: 0,
                    changes: {},
                    releaseCv: true,
                  }),
                },
              },
            ],
          }),
        ),
      }),
    ).rejects.toMatchObject({
      code: "malformed_response",
    } satisfies Partial<ContactPrepareError>);
  });
});

describe("contact response recovery", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
  function configure() {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("CONTACT_AI_MODEL", "test/model");
  }
  function reply(value: unknown) { return Response.json({ choices: [{ message: { content: JSON.stringify(value) } }] }); }

  it("accepts long descriptions, uses JSON output and excludes attachments", async () => {
    configure();
    const request = vi.fn<typeof fetch>().mockResolvedValue(reply({ baseVersion: 0, changes: { need: "Detailed project. ".repeat(100) } }));
    const draft = { ...createContactDraft({ route: "contract" }), attachment: { pathname: "private/secret.docx", filename: "secret.docx", contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" as const, size: 12 } };
    const result = await prepareContactProposal({ draft, message: "A detailed project", request });
    expect(result.changes.need!.length).toBeGreaterThan(500);
    const body = JSON.parse(request.mock.calls[0][1]!.body as string);
    expect(body.response_format.type).toBe("json_object");
    expect(body.max_tokens).toBe(8192);
    expect(JSON.stringify(body)).not.toContain("secret.docx");
    expect(body.messages[0].content).toContain('"need":12000');
  });

  it("repairs once and logs issue codes without private content or unknown keys", async () => {
    configure();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ baseVersion: 0, changes: { "private-person@example.com": true } }))
      .mockResolvedValueOnce(reply({ baseVersion: 0, changes: { topic: "Hello" } }));
    await expect(prepareContactProposal({ draft: createContactDraft({ route: "general" }), message: "Confidential message", request })).resolves.toMatchObject({ changes: { topic: "Hello" } });
    expect(request).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(warn.mock.calls)).not.toMatch(/private-person|Confidential/);
  });

  it("stops after two invalid replies", async () => {
    configure();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const request = vi.fn<typeof fetch>().mockImplementation(async () => reply({ send: true }));
    await expect(prepareContactProposal({ draft: createContactDraft({ route: null }), message: "Hello", request })).rejects.toMatchObject({ code: "malformed_response" });
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("repairs a schema-valid but conflicting patch before returning it", async () => {
    configure();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ baseVersion: 0, changes: { context: "Contract details" } }))
      .mockResolvedValueOnce(reply({ baseVersion: 0, changes: { need: "Contract details" } }));
    await expect(prepareContactProposal({ draft: createContactDraft({ route: "contract" }), message: "Contract details", request })).resolves.toMatchObject({ changes: { need: "Contract details" } });
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not retry timeouts while reading the response body", async () => {
    configure();
    const response = new Response();
    vi.spyOn(response, "json").mockRejectedValue(new DOMException("Timed out", "TimeoutError"));
    const request = vi.fn<typeof fetch>().mockResolvedValue(response);
    await expect(prepareContactProposal({ draft: createContactDraft({ route: null }), message: "Hello", request })).rejects.toMatchObject({ code: "timeout" });
    expect(request).toHaveBeenCalledOnce();
  });

  it("does not retry budget exhaustion", async () => {
    configure();
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 402 }));
    await expect(prepareContactProposal({ draft: createContactDraft({ route: null }), message: "Hello", request })).rejects.toMatchObject({ code: "budget_exhausted" });
    expect(request).toHaveBeenCalledOnce();
  });

  it("does not escape the budget using OIDC", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    vi.stubEnv("CONTACT_AI_GATEWAY_API_KEY", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "unbudgeted-token");
    vi.stubEnv("CONTACT_AI_MODEL", "test/model");
    const request = vi.fn<typeof fetch>();
    await expect(prepareContactProposal({ draft: createContactDraft({ route: null }), message: "Hello", request })).rejects.toMatchObject({ code: "not_configured" });
    expect(request).not.toHaveBeenCalled();
  });
});
