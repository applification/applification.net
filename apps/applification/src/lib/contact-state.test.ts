import { describe, expect, it } from "vitest";
import { changeContactRoute, createContactDraft } from "./contact-draft";
import {
  assessContractFit,
  deriveContactWorkflowState,
  getNextContactQuestion,
  validateContactDraft,
} from "./contact-state";

const stateFor = (draft: ReturnType<typeof createContactDraft>) =>
  deriveContactWorkflowState({
    delivery: "idle",
    draft,
    hasRecoverableError: false,
    isPreparing: false,
    visitorApproved: false,
  });

describe("contact application state", () => {
  it("derives route selection and validation from accepted fields", () => {
    expect(stateFor(createContactDraft({ route: null }))).toBe("route_selection");
    expect(stateFor(createContactDraft({ route: "contract" }))).toBe("validation");
  });

  it.each([
    [
      "contract",
      {
        company: "Acme",
        need: "React product build",
        timing: "October",
        workingArrangement: "Remote UK",
        replyName: "Alex",
        replyEmail: "alex@example.com",
      },
    ],
    [
      "product",
      {
        product: "contexture",
        question: "Can it generate validators?",
        replyName: "Alex",
        replyEmail: "alex@example.com",
      },
    ],
    [
      "general",
      {
        topic: "Speaking",
        message: "Conference invitation",
        replyName: "Alex",
        replyEmail: "alex@example.com",
      },
    ],
  ] as const)("marks a complete %s route ready for review", (route, fields) => {
    const draft = { ...createContactDraft({ route }), ...fields };
    expect(validateContactDraft(draft).valid).toBe(true);
    expect(stateFor(draft)).toBe("review_ready");
  });

  it("recalculates readiness after a route switch", () => {
    const contract = {
      ...createContactDraft({ route: "contract" }),
      company: "Acme",
      need: "React product build",
      timing: "October",
      workingArrangement: "Remote UK",
      replyName: "Alex",
      replyEmail: "alex@example.com",
    };
    expect(stateFor(contract)).toBe("review_ready");
    expect(stateFor(changeContactRoute(contract, "general"))).toBe("validation");
  });

  it("asks from validated missing fields rather than repeating supplied commercial terms", () => {
    const initial = {
      ...createContactDraft({ route: "contract" }),
      company: "North Star Recruitment",
      need: "Full stack engineer contract",
      summary: "The rate is £450 per day and the contract is outside IR35.",
      replyName: "Harry",
    };

    expect(getNextContactQuestion(initial)).toBe(
      "When should the work start, and how long do you expect it to run?",
    );

    const withTiming = { ...initial, timing: "3 months", workingArrangement: "Remote UK" };
    expect(getNextContactQuestion(withTiming)).toBe(
      "What email address should Dave reply to?",
    );

    expect(
      getNextContactQuestion({ ...withTiming, replyEmail: "harry@northstar.example" }),
    ).toBeNull();
  });

  it("reports strong, review and unlikely contract-fit outcomes with evidence", () => {
    expect(
      assessContractFit({
        ...createContactDraft({ route: "contract" }),
        need: "A small product team needs a React AI agent workflow rebuild",
        workingArrangement: "Remote UK",
      }),
    ).toMatchObject({ status: "strong_fit" });

    expect(
      assessContractFit({
        ...createContactDraft({ route: "contract" }),
        need: "A software project",
        workingArrangement: "Flexible",
      }),
    ).toMatchObject({ status: "needs_review" });

    expect(
      assessContractFit({
        ...createContactDraft({ route: "contract" }),
        need: "Permanent data scientist",
        workingArrangement: "Office only in London",
      }),
    ).toMatchObject({
      status: "unlikely_fit",
      evidence: expect.arrayContaining(["Permanent role mentioned"]),
    });
  });
});
