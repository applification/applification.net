import { describe, expect, it } from "vitest";
import { fillContactDraft } from "./contact-webmcp";
import { createContactDraft } from "./contact-draft";
const empty = () => createContactDraft({ route: null });
const fields = {
  topic: "Product engineering",
  message: "A useful enquiry",
  replyName: "Alex Visitor",
  replyEmail: "alex@example.com",
};

describe("contact drafting for browser agents", () => {
  it("prepares a validated draft with review still required", () => {
    const result = fillContactDraft(empty(), { route: "general", fields });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result).toMatchObject({
      status: "ready_for_review",
      reviewRequired: true,
      sent: false,
      missingFields: [],
    });
    expect(result.draft.message).toBe(fields.message);
    expect(result.draft).not.toHaveProperty("consent");
  });
  it("reports required and invalid fields, allowing incremental completion", () => {
    const first = fillContactDraft(empty(), {
      route: "contract",
      fields: { need: "React architecture", replyEmail: "bad" },
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.result.status).toBe("needs_details");
    expect(first.result.missingFields).toContain("company");
    expect(first.result.issues).toContainEqual({
      field: "replyEmail",
      message: "Add a valid reply email address.",
    });
  });
  it("retries idempotently while preserving existing text and attachments", () => {
    const first = fillContactDraft(empty(), {
      route: "general",
      fields: { ...fields, message: "First line\nSecond line" },
    });
    if (!first.ok) throw new Error("Expected draft");
    const retry = fillContactDraft(first.draft, {
      route: "general",
      fields: { ...fields, message: "First line\nSecond line" },
    });
    expect(retry.ok && retry.draft).toEqual(first.draft);
    const attachment = {
      pathname: "private/file",
      filename: "role.pdf",
      contentType: "application/pdf" as const,
      size: 100,
    };
    const contract = {
      ...createContactDraft({ route: "contract" }),
      attachment,
      need: "Keep this\nformatting",
    };
    const filled = fillContactDraft(contract, {
      route: "contract",
      fields: { company: "Example", need: "Keep this\nformatting" },
    });
    expect(filled.ok && filled.draft.attachment).toEqual(attachment);
    expect(filled.ok && filled.draft.need).toBe(contract.need);
  });
  it("rejects stale input, changes of route and overwrites atomically", () => {
    const draft = {
      ...empty(),
      route: "general" as const,
      ...fields,
      version: 3,
    };
    for (const input of [
      { route: "general", expectedVersion: 2, fields: {} },
      { route: "product", fields: { product: "voiced" } },
      { route: "general", fields: { topic: "Overwrite", company: "New" } },
      { route: "general", fields: { topic: null } },
    ])
      expect(fillContactDraft(draft, input).ok).toBe(false);
    expect(draft).toEqual({
      ...empty(),
      route: "general",
      ...fields,
      version: 3,
    });
  });
  it.each([
    { route: "general", fields, consent: true },
    {
      route: "general",
      fields: { ...fields, attachment: { pathname: "private" } },
    },
    { route: "general", fields: { ...fields, need: "Wrong route" } },
    { route: "contract", fields: { briefLink: "javascript:alert(1)" } },
    {
      route: "contract",
      fields: { briefLink: "https://user:password@example.com" },
    },
    { route: "general", fields: { message: "x".repeat(12001) } },
  ])("rejects privileged or invalid input", (input) =>
    expect(fillContactDraft(empty(), input).ok).toBe(false),
  );
});
