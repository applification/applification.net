import { get, head } from "@vercel/blob";
import { FatalError, RetryableError, sleep } from "workflow";
import { start } from "workflow/api";
import type { ContactDraft } from "@/lib/contact-draft";
import { createAttachmentAccessToken } from "@/lib/contact-attachment-access";
import {
  assessContractSignals,
  contactCvReviewMetadataSchema,
  type ContactCvReviewMetadata,
} from "@/lib/contact-cv-review";
import { createOwnerReviewCapability } from "@/lib/contact-owner-review-capability";
import { getContactPublicBaseUrl } from "@/lib/contact-public-url";
import { getPortfolioProduct } from "@/lib/portfolio";
import { contactCvDecisionHook, contactCvHookToken } from "./contact-cv-decision-gate";

export type ContactDeliveryInput = {
  enquiryId: string;
  idempotencyKey: string;
  approvedAt: string;
  draft: ContactDraft;
};

export async function deliverContactEnquiryWorkflow(input: ContactDeliveryInput) {
  "use workflow";

  const delivery = await sendContactDelivery(input);
  const cvReviewRunId =
    input.draft.route === "contract"
      ? await startContractCvReview({
          ...input,
          deliveryId: delivery.deliveryId,
          deliveredAt: delivery.deliveredAt,
        })
      : null;
  return {
    route: input.draft.route,
    sentFields: deliveredFieldLabels(input.draft),
    deliveryId: delivery.deliveryId,
    cvFollowUpRequiresApproval: input.draft.route === "contract",
    cvReviewRunId,
  };
}

export type ContractCvReviewInput = ContactDeliveryInput & {
  deliveryId: string;
  deliveredAt: string;
};

export async function contractCvReviewWorkflow(input: ContractCvReviewInput) {
  "use workflow";

  if (input.draft.route !== "contract") {
    return { status: "not_applicable" as const };
  }

  const review = await prepareContractCvReview(input);
  const hookToken = contactCvHookToken(input.enquiryId);
  using decisionHook = contactCvDecisionHook.create({
    token: hookToken,
    metadata: review,
  });

  const conflict = await decisionHook.getConflict();
  if (conflict) {
    return { status: "already_waiting" as const, runId: conflict.runId };
  }

  const decision = await Promise.race([
    decisionHook,
    sleep(new Date(review.expiresAt)).then(() => ({ expired: true }) as const),
  ]);
  decisionHook.dispose();

  if ("expired" in decision) {
    return { status: "expired" as const };
  }
  if (decision.decision === "decline") {
    return { status: "declined" as const, decidedAt: decision.decidedAt };
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const result = await attemptCvDelivery(review);
    if (result.status === "sent") {
      return {
        status: "cv_sent" as const,
        deliveryId: result.deliveryId,
        cvVersion: review.cv.version,
        decidedAt: decision.decidedAt,
      };
    }
    if (result.status === "permanent_failure") {
      await reportCvDeliveryFailure(review, result.reason);
      return { status: "delivery_failed" as const, recoverable: true };
    }
    if (attempt < 5) {
      await sleep(attempt === 1 ? "5s" : attempt === 2 ? "15s" : "30s");
    }
  }

  await reportCvDeliveryFailure(review, "The delivery provider remained unavailable after retries.");
  return { status: "delivery_failed" as const, recoverable: true };
}

export async function startContractCvReview(input: ContractCvReviewInput) {
  "use step";

  const run = await start(contractCvReviewWorkflow, [input]);
  return run.runId;
}

export async function prepareContractCvReview(
  input: ContractCvReviewInput,
  inspectBlob: typeof head = head,
) {
  "use step";

  if (input.draft.route !== "contract") {
    throw new FatalError("CV review is only available for contract enquiries.");
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const pathname = process.env.CONTACT_CV_BLOB_PATHNAME;
  const version = process.env.CONTACT_CV_VERSION;
  const filename = process.env.CONTACT_CV_FILENAME ?? "Dave-Hudson-CV.pdf";
  if (!token || !pathname?.startsWith("contact/cv/") || !version) {
    throw new FatalError("The private CV is not configured.");
  }

  const blob = await inspectBlob(pathname, { token }).catch(() => null);
  if (
    !blob ||
    blob.pathname !== pathname ||
    blob.contentType !== "application/pdf" ||
    blob.size <= 0 ||
    blob.size > 8 * 1_024 * 1_024
  ) {
    throw new FatalError("The configured private CV could not be verified.");
  }

  return contactCvReviewMetadataSchema.parse({
    kind: "contract_cv_review",
    enquiryId: input.enquiryId,
    idempotencyKey: input.idempotencyKey,
    draft: input.draft,
    delivery: {
      deliveryId: input.deliveryId,
      deliveredAt: input.deliveredAt,
    },
    cv: {
      pathname,
      filename,
      contentType: "application/pdf",
      size: blob.size,
      version,
    },
    expiresAt: contractReviewExpiresAt(input.approvedAt),
    signals: assessContractSignals(input.draft),
  });
}

type CvBlobResult = Awaited<ReturnType<typeof get>>;

export async function attemptCvDelivery(
  review: ContactCvReviewMetadata,
  request: typeof fetch = fetch,
  readBlob: (pathname: string, options: { access: "private"; token: string }) => Promise<CvBlobResult> =
    get,
) {
  "use step";

  const configuration = deliveryConfiguration();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return { status: "permanent_failure" as const, reason: "Private CV access is not configured." };
  }

  const stored = await readBlob(review.cv.pathname, { access: "private", token }).catch(() => null);
  if (
    !stored ||
    stored.statusCode !== 200 ||
    stored.blob.pathname !== review.cv.pathname ||
    stored.blob.contentType !== "application/pdf" ||
    stored.blob.size !== review.cv.size
  ) {
    return { status: "permanent_failure" as const, reason: "The reviewed CV version is unavailable." };
  }

  const content = Buffer.from(await new Response(stored.stream).arrayBuffer()).toString("base64");
  const response = await request("https://api.resend.com/emails", {
    method: "POST",
    headers: resendHeaders(
      configuration.apiKey,
      `contact-cv/${review.enquiryId}/${review.cv.version}`,
    ),
    body: JSON.stringify({
      from: configuration.from,
      to: [review.draft.replyEmail],
      reply_to: configuration.to,
      subject: "Dave Hudson — CV follow-up",
      html: `<p>Thanks for your contract enquiry. Dave reviewed it and approved this CV follow-up.</p><p>CV version: ${escapeHtml(review.cv.version)}</p>`,
      attachments: [{ filename: review.cv.filename, content }],
    }),
  });

  if (response.status === 429 || response.status >= 500) {
    return { status: "transient_failure" as const };
  }
  if (response.status === 409) {
    const error = (await response.json().catch(() => null)) as { name?: string } | null;
    return error?.name === "concurrent_idempotent_requests"
      ? { status: "transient_failure" as const }
      : {
          status: "permanent_failure" as const,
          reason: "The CV delivery idempotency key conflicts with another payload.",
        };
  }
  if (!response.ok) {
    return { status: "permanent_failure" as const, reason: "The CV delivery was rejected." };
  }

  const body = (await response.json().catch(() => null)) as { id?: string } | null;
  return body?.id
    ? { status: "sent" as const, deliveryId: body.id }
    : { status: "permanent_failure" as const, reason: "The CV delivery returned no identifier." };
}

export async function reportCvDeliveryFailure(
  review: ContactCvReviewMetadata,
  reason: string,
  request: typeof fetch = fetch,
) {
  "use step";

  try {
    const configuration = deliveryConfiguration();
    await request("https://api.resend.com/emails", {
      method: "POST",
      headers: resendHeaders(
        configuration.apiKey,
        `contact-cv-failure/${review.enquiryId}/${review.cv.version}`,
      ),
      body: JSON.stringify({
        from: configuration.from,
        to: [configuration.to],
        subject: `[Applification] CV follow-up needs recovery for ${review.draft.replyName}`,
        html: `<p>The approved CV follow-up was not reported as sent.</p><p>${escapeHtml(reason)}</p><p>Enquiry ${escapeHtml(review.enquiryId)} · CV ${escapeHtml(review.cv.version)}</p>`,
      }),
    });
  } catch {
    // The workflow result remains a private recoverable-failure record even if email is unavailable.
  }
}

export async function sendContactDelivery(
  input: ContactDeliveryInput,
  request: typeof fetch = fetch,
) {
  "use step";

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_DELIVERY_TO;
  const from = process.env.CONTACT_DELIVERY_FROM;
  if (!apiKey || !to || !from) {
    throw new FatalError("Contact delivery is not configured.");
  }
  const ownerReviewUrl = input.draft.route === "contract" ? createOwnerReviewUrl(input) : null;

  const response = await request("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact/${input.idempotencyKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.draft.replyEmail,
      subject: `[Applification] ${routeName(input.draft)} enquiry from ${input.draft.replyName}`,
      html: renderDeliveryEmail(input, ownerReviewUrl),
    }),
  });

  if (response.status === 429 || response.status >= 500) {
    throw new RetryableError("Contact delivery provider is temporarily unavailable.", {
      retryAfter: response.status === 429 ? "30s" : "5s",
    });
  }

  if (response.status === 409) {
    const error = await response.json().catch(() => null) as { name?: string } | null;
    if (error?.name === "concurrent_idempotent_requests") {
      throw new RetryableError("The same delivery is still being processed.", {
        retryAfter: "5s",
      });
    }
    throw new FatalError("The delivery idempotency key conflicts with another payload.");
  }

  if (!response.ok) {
    throw new FatalError("Contact delivery was rejected by the provider.");
  }

  const body = (await response.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) {
    throw new Error("Contact delivery returned no operational identifier.");
  }

  return { deliveryId: body.id, deliveredAt: new Date().toISOString() };
}

sendContactDelivery.maxRetries = 5;

function renderDeliveryEmail(input: ContactDeliveryInput, ownerReviewUrl: string | null) {
  const rows = deliveryRows(input.draft)
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 12px 8px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const attachment = input.draft.attachment
    ? `<p><a href="${escapeHtml(createPrivateAttachmentUrl(input.draft.attachment))}">Open private ${escapeHtml(input.draft.attachment.filename)}</a> (available for 7 days)</p>`
    : "";
  const ownerReview = ownerReviewUrl
    ? `<hr><h2>CV follow-up review</h2><p>Review the enquiry and decide whether to send the CV.</p><p><a href="${escapeHtml(ownerReviewUrl)}">Open the private review</a></p><p>Opening the link does not send the CV. Approval requires a separate action and expires after 14 days.</p>`
    : "";

  return `<h1>${escapeHtml(routeName(input.draft))} enquiry</h1><p>Enquiry ${escapeHtml(input.enquiryId)}</p><table>${rows}</table>${attachment}<p>Approved by the visitor at ${escapeHtml(input.approvedAt)}.</p>${ownerReview}`;
}

function createOwnerReviewUrl(input: ContactDeliveryInput) {
  const secret = process.env.CONTACT_OWNER_REVIEW_SECRET;
  const baseUrl = getContactPublicBaseUrl();
  if (!secret || !baseUrl) {
    throw new FatalError("Owner CV review is not configured.");
  }

  const capability = createOwnerReviewCapability(
    {
      hookToken: contactCvHookToken(input.enquiryId),
      enquiryId: input.enquiryId,
      expiresAt: contractReviewExpiresAt(input.approvedAt),
    },
    secret,
  );
  return `${baseUrl.replace(/\/$/, "")}/contact/review/${encodeURIComponent(capability)}`;
}

function contractReviewExpiresAt(approvedAt: string) {
  const approvedAtMs = Date.parse(approvedAt);
  if (!Number.isFinite(approvedAtMs)) {
    throw new FatalError("The contact approval timestamp is invalid.");
  }
  return approvedAtMs + 14 * 24 * 60 * 60 * 1_000;
}

function deliveryConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_DELIVERY_TO;
  const from = process.env.CONTACT_DELIVERY_FROM;
  if (!apiKey || !to || !from) {
    throw new FatalError("Contact delivery is not configured.");
  }
  return { apiKey, to, from };
}

function resendHeaders(apiKey: string, idempotencyKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };
}

function createPrivateAttachmentUrl(attachment: NonNullable<ContactDraft["attachment"]>) {
  const secret = process.env.CONTACT_ATTACHMENT_ACCESS_SECRET;
  const baseUrl = getContactPublicBaseUrl();
  if (!secret || secret.length < 24 || !baseUrl) {
    throw new FatalError("Private attachment access is not configured.");
  }

  const token = createAttachmentAccessToken(
    {
      pathname: attachment.pathname,
      filename: attachment.filename,
      contentType: attachment.contentType,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1_000,
    },
    secret,
  );
  return `${baseUrl.replace(/\/$/, "")}/api/contact/attachment/download?token=${encodeURIComponent(token)}`;
}

function deliveredFieldLabels(draft: ContactDraft) {
  return deliveryRows(draft).map(([label]) => label);
}

function deliveryRows(draft: ContactDraft): Array<[string, string]> {
  const rows: Array<[string, string | undefined]> = [
    ["Route", routeName(draft)],
    ["Summary", draft.summary],
    ["Reply name", draft.replyName],
    ["Reply email", draft.replyEmail],
    ["Company or agency", draft.company],
    ["Role or project need", draft.need],
    ["Timing", draft.timing],
    ["Working arrangement", draft.workingArrangement],
    ["Contract brief link", draft.briefLink],
    ["Product", draft.product ? getPortfolioProduct(draft.product)?.name : undefined],
    ["Question", draft.question],
    ["Context", draft.context],
    ["Topic", draft.topic],
    ["Message", draft.message],
    ["Document", draft.attachment?.filename],
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}

function routeName(draft: ContactDraft) {
  if (draft.route === "contract") return "Contract";
  if (draft.route === "product") return "Product";
  return "General";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}
