import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RetryableError } from "workflow";
import { createContactDraft } from "@/lib/contact-draft";
import {
  attemptCvDelivery,
  prepareContractCvReview,
  sendContactDelivery,
  type ContactDeliveryInput,
  type ContractCvReviewInput,
} from "./contact-delivery";

const input: ContactDeliveryInput = {
  enquiryId: "enquiry-1",
  idempotencyKey: "2ec60daf-1ca9-49ea-88d3-d5c05d01aabd",
  approvedAt: "2026-09-01T10:00:00.000Z",
  draft: {
    ...createContactDraft({ route: "general" }),
    topic: "Speaking <request>",
    message: "A conference invitation",
    replyName: "Alex & Co",
    replyEmail: "alex@example.com",
  },
};

describe("durable contact delivery step", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends the structured brief with stable provider idempotency", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "email-1" }));

    await expect(sendContactDelivery(input, request)).resolves.toEqual({
      deliveryId: "email-1",
      deliveredAt: expect.any(String),
    });
    const [, init] = request.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);
    const body = String(init?.body);
    expect(headers.get("Idempotency-Key")).toBe(`contact/${input.idempotencyKey}`);
    expect(body).toContain("Speaking &lt;request&gt;");
    expect(body).not.toContain("transcript");
    expect(body).not.toContain("RESEND_API_KEY");
  });

  it("marks transient provider failures retryable", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");

    await expect(
      sendContactDelivery(
        input,
        vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })),
      ),
    ).rejects.toBeInstanceOf(RetryableError);
  });

  it("fails permanently when delivery credentials are absent", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("CONTACT_DELIVERY_TO", "");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "");

    await expect(sendContactDelivery(input, vi.fn<typeof fetch>())).rejects.toThrow(
      "Contact delivery is not configured.",
    );
  });
});

const contractInput: ContractCvReviewInput = {
  enquiryId: "contract-1",
  idempotencyKey: "59aa12a4-91ee-41d2-b5ce-c61d905ddaf1",
  approvedAt: "2026-09-01T10:00:00.000Z",
  deliveryId: "email-contract-1",
  deliveredAt: "2026-09-01T10:01:00.000Z",
  draft: {
    ...createContactDraft({ route: "contract" }),
    company: "Example Ltd",
    need: "A senior React product engineer for an agent-assisted delivery workflow.",
    timing: "October for three months",
    workingArrangement: "Remote UK",
    replyName: "Alex Recruiter",
    replyEmail: "alex@example.com",
  },
};

describe("owner-approved CV steps", () => {
  beforeEach(() => vi.stubEnv("CONTACT_CV_FILENAME", "Dave-Hudson-CV.pdf"));
  afterEach(() => vi.unstubAllEnvs());

  it("prepares only a stable private CV reference and advisory review context", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "blob-token");
    vi.stubEnv("CONTACT_CV_BLOB_PATHNAME", "contact/cv/dave-hudson.pdf");
    vi.stubEnv("CONTACT_CV_VERSION", "2026-09");
    const inspect = vi.fn().mockResolvedValue({
      pathname: "contact/cv/dave-hudson.pdf",
      contentType: "application/pdf",
      size: 512,
    });

    const review = await prepareContractCvReview(contractInput, inspect as never);
    expect(review.cv).toEqual({
      pathname: "contact/cv/dave-hudson.pdf",
      filename: "Dave-Hudson-CV.pdf",
      contentType: "application/pdf",
      size: 512,
      version: "2026-09",
    });
    expect(review).not.toHaveProperty("bytes");
    expect(review).not.toHaveProperty("url");
    expect(review.signals.length).toBeGreaterThan(0);
    expect(review.expiresAt).toBe(Date.parse(contractInput.approvedAt) + 14 * 24 * 60 * 60 * 1_000);
  });

  it("includes the signed GET-only CV review link in the contract enquiry email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");
    vi.stubEnv("CONTACT_PUBLIC_BASE_URL", "https://applification.net");
    vi.stubEnv("CONTACT_OWNER_REVIEW_SECRET", "owner-review-secret-longer-than-32-characters");
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "contract-email" }));

    await sendContactDelivery(contractInput, request);
    const [, init] = request.mock.calls[0] ?? [];
    const body = String(init?.body);
    expect(new Headers(init?.headers).get("Idempotency-Key")).toBe(
      `contact/${contractInput.idempotencyKey}`,
    );
    expect(body).toContain("/contact/review/");
    expect(body).toContain("Opening the link does not send the CV");
    expect(body).not.toContain('"decision":"approve"');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("reads the reviewed private PDF only inside the delivery step", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "blob-token");
    vi.stubEnv("CONTACT_CV_BLOB_PATHNAME", "contact/cv/dave-hudson.pdf");
    vi.stubEnv("CONTACT_CV_VERSION", "2026-09");
    const review = await prepareContractCvReview(
      contractInput,
      vi.fn().mockResolvedValue({
        pathname: "contact/cv/dave-hudson.pdf",
        contentType: "application/pdf",
        size: 3,
      }) as never,
    );
    const readBlob = vi.fn().mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream({ start: (controller) => { controller.enqueue(new Uint8Array([1, 2, 3])); controller.close(); } }),
      blob: {
        pathname: "contact/cv/dave-hudson.pdf",
        contentType: "application/pdf",
        size: 3,
      },
    });
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "cv-email-1" }));

    await expect(attemptCvDelivery(review, request, readBlob as never)).resolves.toEqual({
      status: "sent",
      deliveryId: "cv-email-1",
    });
    const [, init] = request.mock.calls[0] ?? [];
    const body = JSON.parse(String(init?.body));
    expect(new Headers(init?.headers).get("Idempotency-Key")).toBe(
      "contact-cv/contract-1/2026-09",
    );
    expect(body.to).toEqual(["alex@example.com"]);
    expect(body.attachments).toEqual([
      { filename: "Dave-Hudson-CV.pdf", content: "AQID" },
    ]);
    expect(String(init?.body)).not.toContain("contact/cv/dave-hudson.pdf");
  });

  it("reports transient CV provider failures without false success", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "blob-token");
    vi.stubEnv("CONTACT_CV_BLOB_PATHNAME", "contact/cv/dave-hudson.pdf");
    vi.stubEnv("CONTACT_CV_VERSION", "2026-09");
    const review = await prepareContractCvReview(
      contractInput,
      vi.fn().mockResolvedValue({
        pathname: "contact/cv/dave-hudson.pdf",
        contentType: "application/pdf",
        size: 3,
      }) as never,
    );
    const readBlob = vi.fn().mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream({ start: (controller) => { controller.enqueue(new Uint8Array([1, 2, 3])); controller.close(); } }),
      blob: {
        pathname: "contact/cv/dave-hudson.pdf",
        contentType: "application/pdf",
        size: 3,
      },
    });

    await expect(
      attemptCvDelivery(
        review,
        vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })),
        readBlob as never,
      ),
    ).resolves.toEqual({ status: "transient_failure" });
  });

  it("never reports an idempotency conflict as a sent CV", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "blob-token");
    vi.stubEnv("CONTACT_CV_BLOB_PATHNAME", "contact/cv/dave-hudson.pdf");
    vi.stubEnv("CONTACT_CV_VERSION", "2026-09");
    const review = await prepareContractCvReview(
      contractInput,
      vi.fn().mockResolvedValue({
        pathname: "contact/cv/dave-hudson.pdf",
        contentType: "application/pdf",
        size: 3,
      }) as never,
    );
    const readBlob = vi.fn().mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream({
        start: (controller) => {
          controller.enqueue(new Uint8Array([1, 2, 3]));
          controller.close();
        },
      }),
      blob: {
        pathname: "contact/cv/dave-hudson.pdf",
        contentType: "application/pdf",
        size: 3,
      },
    });

    await expect(
      attemptCvDelivery(
        review,
        vi.fn<typeof fetch>().mockResolvedValue(
          Response.json({ name: "validation_error" }, { status: 409 }),
        ),
        readBlob as never,
      ),
    ).resolves.toMatchObject({ status: "permanent_failure" });
  });
});
