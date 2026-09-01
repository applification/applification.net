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
        request: vi.fn<typeof fetch>().mockResolvedValue(
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
