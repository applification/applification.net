import { describe, expect, it } from "vitest";
import { createContactDraft } from "./contact-draft";
import { assessContractSignals, contactReviewRows } from "./contact-cv-review";

describe("contract CV review context", () => {
  it("provides advisory evidence without deciding whether the sender is trustworthy", () => {
    const draft = {
      ...createContactDraft({ route: "contract" }),
      company: "Example Ltd",
      need: "A React product engineer to deliver an agent-assisted workflow with the existing team.",
      timing: "October for three months",
      workingArrangement: "Remote UK",
      replyName: "Alex Recruiter",
      replyEmail: "alex@example.com",
      briefLink: "https://example.com/brief",
    };

    const signals = assessContractSignals(draft);
    expect(signals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Organisation email supplied" }),
        expect.objectContaining({ label: "Contract brief supplied" }),
      ]),
    );
    expect(JSON.stringify(signals)).not.toMatch(/approved|legitimate|trusted/i);
    expect(contactReviewRows(draft)).toContainEqual(["Reply address", "alex@example.com"]);
  });

  it("flags limited evidence as caution, never as an automatic decline", () => {
    const signals = assessContractSignals({
      ...createContactDraft({ route: "contract" }),
      need: "React role",
      replyEmail: "person@gmail.com",
    });

    expect(signals.filter((signal) => signal.tone === "caution")).toHaveLength(3);
    expect(JSON.stringify(signals)).not.toMatch(/decline|reject|spam bot/i);
  });

  it("does not assess product or general enquiries", () => {
    expect(assessContractSignals(createContactDraft({ route: "general" }))).toEqual([]);
  });
});
