import { getHookByToken, getRun, resumeHook, start } from "workflow/api";
import { waitForHook, waitForSleep } from "@workflow/vitest";
import { describe, expect, it } from "vitest";
import { createContactDraft } from "@/lib/contact-draft";
import type { ContactCvReviewMetadata } from "@/lib/contact-cv-review";
import { contactCvDecisionGateWorkflow, contactCvHookToken } from "./contact-cv-decision-gate";

function createReview(enquiryId: string, expiresAt = Date.now() + 60_000): ContactCvReviewMetadata {
  return {
    kind: "contract_cv_review",
    enquiryId,
    idempotencyKey: "59aa12a4-91ee-41d2-b5ce-c61d905ddaf1",
    draft: {
      ...createContactDraft({ route: "contract" }),
      company: "Example Ltd",
      need: "A senior React product engineer for an agent-assisted delivery workflow.",
      timing: "October for three months",
      workingArrangement: "Remote UK",
      replyName: "Alex Recruiter",
      replyEmail: "alex@example.com",
    },
    delivery: {
      deliveryId: "email-contract-1",
      deliveredAt: "2026-09-01T10:01:00.000Z",
    },
    cv: {
      pathname: "contact/cv/dave-hudson.pdf",
      filename: "Dave-Hudson-CV.pdf",
      contentType: "application/pdf",
      size: 3,
      version: "2026-09",
    },
    expiresAt,
    signals: [],
  };
}

describe("owner CV decision hook", () => {
  it("waits for explicit approval and consumes the hook once", async () => {
    const review = createReview("contract-approve");
    const token = contactCvHookToken(review.enquiryId);
    const run = await start(contactCvDecisionGateWorkflow, [review]);

    await waitForHook(run, { token });
    const hook = await getHookByToken(token);
    expect(hook.metadata).toEqual(expect.objectContaining({ kind: "contract_cv_review" }));
    await resumeHook(token, { decision: "approve", decidedAt: "2026-09-01T11:00:00.000Z" });
    await expect(run.returnValue).resolves.toEqual({
      status: "approve",
      decidedAt: "2026-09-01T11:00:00.000Z",
    });
    await expect(
      resumeHook(token, { decision: "approve", decidedAt: "2026-09-01T11:01:00.000Z" }),
    ).rejects.toThrow();
  });

  it("returns a decline without any approval state", async () => {
    const review = createReview("contract-decline");
    const token = contactCvHookToken(review.enquiryId);
    const run = await start(contactCvDecisionGateWorkflow, [review]);

    await waitForHook(run, { token });
    await resumeHook(token, { decision: "decline", decidedAt: "2026-09-01T11:00:00.000Z" });

    await expect(run.returnValue).resolves.toEqual({
      status: "decline",
      decidedAt: "2026-09-01T11:00:00.000Z",
    });
  });

  it("expires without receiving or inventing a decision", async () => {
    const review = createReview("contract-expiry", Date.now() + 24 * 60 * 60 * 1_000);
    const run = await start(contactCvDecisionGateWorkflow, [review]);

    await waitForHook(run, { token: contactCvHookToken(review.enquiryId) });
    const sleepId = await waitForSleep(run);
    await getRun(run.runId).wakeUp({ correlationIds: [sleepId] });

    await expect(run.returnValue).resolves.toEqual({ status: "expired" });
  });
});
