import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { createContactDraft } from "@/lib/contact-draft";
import type { ContactCvReviewMetadata } from "@/lib/contact-cv-review";
import { OwnerCvReview } from "./owner-cv-review";

const review: ContactCvReviewMetadata = {
  kind: "contract_cv_review",
  enquiryId: "enquiry-1",
  idempotencyKey: "2ec60daf-1ca9-49ea-88d3-d5c05d01aabd",
  draft: {
    ...createContactDraft({ route: "contract" }),
    company: "North Star Recruitment",
    need: "A senior React and TypeScript engineer for an AI-assisted product workflow.",
    timing: "October for three months",
    workingArrangement: "Remote UK",
    summary: "Contract product engineering enquiry",
    replyName: "Alex Morgan",
    replyEmail: "alex@northstar.example",
    briefLink: "https://example.com/contract-brief",
  },
  delivery: {
    deliveryId: "email-delivery-1",
    deliveredAt: "2026-09-01T10:01:00.000Z",
  },
  cv: {
    pathname: "contact/cv/dave-hudson.pdf",
    filename: "Dave-Hudson-CV.pdf",
    contentType: "application/pdf",
    size: 512,
    version: "2026-09",
  },
  expiresAt: Date.parse("2026-09-15T10:01:00.000Z"),
  signals: [
    {
      tone: "context",
      label: "Organisation email supplied",
      detail: "The reply address uses northstar.example. This is context, not proof of identity.",
    },
    {
      tone: "caution",
      label: "Verify hiring authority",
      detail: "Confirm the organisation and the sender independently before sharing the CV.",
    },
  ],
};

const meta = {
  title: "Contact/Owner CV review",
  component: OwnerCvReview,
  parameters: { layout: "fullscreen" },
  args: {
    attachmentUrl: null,
    capability: "signed-test-capability",
    review,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OwnerCvReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Review: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Decide whether this enquiry gets the CV." }),
    ).toBeVisible();
    await expect(canvas.getByText("Human decision only")).toBeVisible();
    await expect(canvas.getByText("Provider evidence email-delivery-1 · 1 Sept 2026, 11:01")).toBeVisible();

    const confirmation = canvas.getByRole("checkbox", {
      name: /I have reviewed this sender and approve sending CV/,
    });
    confirmation.focus();
    await userEvent.keyboard(" ");
    await expect(confirmation).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Approve and send CV" })).toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Decline CV follow-up" })).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
};
