import { describe, expect, it } from "vitest";
import { applyContactProposal, contactPrepareRequestSchema, createContactDraft } from "./contact-draft";
import {
  checkContactAbuse,
  contactDeliveryRequestSchema,
  validateDeliveryDraft,
} from "./contact-delivery";

describe("contact delivery boundary", () => {
  const completeGeneralDraft = {
    ...createContactDraft({ route: "general" }),
    topic: "Speaking",
    message: "Conference invitation",
    replyName: "Alex",
    replyEmail: "alex@example.com",
  };

  it("accepts only explicit consent and a complete structured brief", () => {
    const result = validateDeliveryDraft({
      ...completeGeneralDraft,
      replyEmail: " ALEX@EXAMPLE.COM ",
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.draft.replyEmail).toBe("alex@example.com");
    }
    expect(
      contactDeliveryRequestSchema.safeParse({
        consent: false,
        draft: completeGeneralDraft,
        idempotencyKey: crypto.randomUUID(),
        startedAt: Date.now() - 10_000,
        website: "",
      }).success,
    ).toBe(false);
  });

  it("rejects incomplete fields and non-HTTPS brief links", () => {
    expect(validateDeliveryDraft(createContactDraft({ route: "general" })).valid).toBe(false);
    expect(
      validateDeliveryDraft({
        ...createContactDraft({ route: "contract" }),
        company: "Acme",
        need: "React build",
        timing: "October",
        workingArrangement: "Remote UK",
        replyName: "Alex",
        replyEmail: "alex@example.com",
        briefLink: "http://example.com/brief",
      }).valid,
    ).toBe(false);
  });

  it("preserves detailed messages through preparation, acceptance and delivery validation", () => {
    const message = "Detailed project requirements. ".repeat(200).trim();
    const draft = createContactDraft({ route: "general" });
    expect(contactPrepareRequestSchema.safeParse({ draft, message }).success).toBe(true);
    const applied = applyContactProposal(draft, {
      baseVersion: 0,
      changes: { topic: "Project enquiry", message, replyName: "Alex", replyEmail: "alex@example.com" },
    });
    expect(applied.accepted).toBe(true);
    if (!applied.accepted) throw new Error("Expected accepted brief");
    const delivery = validateDeliveryDraft(applied.draft);
    expect(delivery.valid).toBe(true);
    if (delivery.valid) expect(delivery.draft.message).toBe(message);
    expect(contactPrepareRequestSchema.safeParse({ draft, message: "x".repeat(12001) }).success).toBe(false);
  });

  it("applies honeypot, timing and bounded per-client checks", () => {
    const now = Date.now();
    expect(
      checkContactAbuse({ clientAddress: "bot", now, startedAt: now - 10_000, website: "filled" }),
    ).toMatchObject({ allowed: false, reason: "bot" });
    expect(
      checkContactAbuse({ clientAddress: "fast", now, startedAt: now - 100, website: "" }),
    ).toMatchObject({ allowed: false, reason: "timing" });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(
        checkContactAbuse({
          clientAddress: "bounded-client",
          now: now + attempt,
          startedAt: now - 10_000,
          website: "",
        }).allowed,
      ).toBe(true);
    }
    expect(
      checkContactAbuse({
        clientAddress: "bounded-client",
        now: now + 10,
        startedAt: now - 10_000,
        website: "",
      }),
    ).toMatchObject({ allowed: false, reason: "rate_limit" });
  });
});
