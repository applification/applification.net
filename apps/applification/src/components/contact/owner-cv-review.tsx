import { AlertTriangle, CheckCircle2, FileText, LockKeyhole, ShieldCheck, XCircle } from "lucide-react";
import { contactReviewRows, type ContactCvReviewMetadata } from "@/lib/contact-cv-review";

export function OwnerCvReview({
  attachmentUrl,
  capability,
  review,
}: {
  attachmentUrl: string | null;
  capability: string;
  review: ContactCvReviewMetadata;
}) {
  return (
    <main className="flex-1 bg-[var(--app-bg)] px-5 py-14 min-[760px]:px-8 min-[760px]:py-20">
      <div className="mx-auto grid w-full max-w-[1180px] gap-8 min-[980px]:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="owner-review-heading" className="min-w-0">
          <div className="font-caption flex items-center gap-2 text-xs font-bold tracking-[1.1px] text-[var(--app-label-text)] uppercase">
            <LockKeyhole aria-hidden="true" className="size-4" />
            Private owner review
          </div>
          <h1
            className="font-heading mt-4 max-w-[760px] text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.98] tracking-[-0.035em]"
            id="owner-review-heading"
          >
            Decide whether this enquiry gets the CV.
          </h1>
          <p className="mt-6 max-w-[720px] text-lg leading-8 text-[var(--app-text-secondary)]">
            The contract brief has already reached you. This is a separate decision: inspect the
            sender and evidence, then approve or decline the current CV version.
          </p>

          <div className="mt-10 overflow-hidden rounded-[24px] border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm shadow-black/5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--app-border)] px-6 py-5">
              <div>
                <p className="font-caption text-xs font-bold tracking-[0.9px] text-[var(--app-label-text)] uppercase">
                  Delivered contract brief
                </p>
                <p className="mt-2 text-sm text-[var(--app-text-secondary)]">
                  Provider evidence {review.delivery.deliveryId} · {formatDate(review.delivery.deliveredAt)}
                </p>
              </div>
              <span className="font-caption rounded-full bg-[var(--app-label)] px-3 py-2 text-[11px] font-bold tracking-[0.6px] text-[var(--app-label-text)] uppercase">
                CV {review.cv.version}
              </span>
            </div>

            <dl className="divide-y divide-[var(--app-border)] px-6">
              {contactReviewRows(review.draft).map(([label, value]) => (
                <div className="grid gap-1 py-4 min-[640px]:grid-cols-[180px_1fr] min-[640px]:gap-6" key={label}>
                  <dt className="font-caption text-[11px] font-bold tracking-[0.55px] text-[var(--app-text-muted)] uppercase">
                    {label}
                  </dt>
                  <dd className="min-w-0 text-base leading-7 break-words text-[var(--app-text-primary)]">
                    {label === "Contract brief link" ? (
                      <a
                        className="font-semibold text-[var(--app-label-text)] underline decoration-[var(--app-border)] underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
                        href={value}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {value}
                      </a>
                    ) : label === "Private document" && attachmentUrl ? (
                      <a
                        className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--app-label-text)] underline decoration-[var(--app-border)] underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
                        href={attachmentUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <FileText aria-hidden="true" className="size-4" />
                        Open {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <aside aria-labelledby="decision-heading" className="min-w-0">
          <div className="sticky top-8 rounded-[24px] bg-[#0b1220] p-6 text-[#f8fafc] shadow-xl shadow-black/10 min-[760px]:p-7">
            <div className="font-caption flex items-center gap-2 text-xs font-bold tracking-[1px] text-[#7dd3fc] uppercase">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Human decision only
            </div>
            <h2 className="font-heading mt-4 text-3xl leading-tight" id="decision-heading">
              Advisory signals
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">
              These clues do not identify a recruiter or make the decision. Verify the sender
              independently.
            </p>

            <ul className="mt-6 space-y-3">
              {review.signals.map((signal) => (
                <li className="rounded-2xl border border-[#334155] bg-[#111827] p-4" key={signal.label}>
                  <div className="flex items-start gap-3">
                    {signal.tone === "caution" ? (
                      <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#fde68a]" />
                    ) : (
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#7dd3fc]" />
                    )}
                    <div>
                      <p className="font-semibold text-[#f8fafc]">{signal.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#cbd5e1]">{signal.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <form action="/api/contact/cv-review" className="mt-7" method="post">
              <input name="capability" type="hidden" value={capability} />
              <input name="decision" type="hidden" value="approve" />
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#334155] bg-[#111827] p-4 text-sm leading-6 text-[#e2e8f0]">
                <input
                  className="mt-1 size-4 shrink-0 accent-[#0ea5e9]"
                  name="confirm"
                  required
                  type="checkbox"
                  value="yes"
                />
                I have reviewed this sender and approve sending CV {review.cv.version} to {review.draft.replyEmail}.
              </label>
              <button
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0ea5e9] px-6 text-sm font-bold text-[#082f49] transition-colors hover:bg-[#7dd3fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7dd3fc]"
                type="submit"
              >
                <CheckCircle2 aria-hidden="true" className="size-5" />
                Approve and send CV
              </button>
            </form>

            <form action="/api/contact/cv-review" className="mt-3" method="post">
              <input name="capability" type="hidden" value={capability} />
              <input name="decision" type="hidden" value="decline" />
              <button
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#475569] px-6 text-sm font-bold text-[#f8fafc] transition-colors hover:bg-[#1e293b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7dd3fc]"
                type="submit"
              >
                <XCircle aria-hidden="true" className="size-5" />
                Decline CV follow-up
              </button>
            </form>

            <p className="mt-5 text-xs leading-5 text-[#94a3b8]">
              Opening this page sent nothing. The signed capability is single-use and expires on {formatDate(new Date(review.expiresAt).toISOString())}.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export function OwnerReviewUnavailable() {
  return (
    <main className="flex flex-1 items-center px-5 py-20 min-[760px]:px-8">
      <section className="mx-auto w-full max-w-[720px] rounded-[28px] border border-[var(--app-border)] bg-[var(--app-card)] p-8 min-[760px]:p-12">
        <p className="font-caption text-xs font-bold tracking-[1px] text-[var(--app-label-text)] uppercase">
          Private owner review
        </p>
        <h1 className="font-heading mt-4 text-4xl leading-tight min-[760px]:text-5xl">
          This review is no longer available.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--app-text-secondary)]">
          The capability may have expired, already been used, or failed validation. No CV was
          released by opening this page.
        </p>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(value));
}
