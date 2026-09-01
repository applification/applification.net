import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV review recorded",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function ContactOwnerReviewCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ decision?: string | string[] }>;
}) {
  const { decision } = await searchParams;
  const approved = decision === "approve";
  return (
    <main className="flex flex-1 items-center px-5 py-20 min-[760px]:px-8">
      <section aria-live="polite" className="mx-auto w-full max-w-[720px] rounded-[28px] border border-[var(--app-border)] bg-[var(--app-card)] p-8 min-[760px]:p-12">
        <p className="font-caption text-xs font-bold tracking-[1px] text-[var(--app-label-text)] uppercase">
          Decision recorded
        </p>
        <h1 className="font-heading mt-4 text-4xl leading-tight min-[760px]:text-5xl">
          {approved ? "The workflow will send the approved CV." : "The CV follow-up was declined."}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--app-text-secondary)]">
          {approved
            ? "The private workflow has resumed. Delivery is idempotent and will report a recoverable failure privately rather than claim success."
            : "The waiting workflow has ended. No CV will be released for this enquiry."}
        </p>
      </section>
    </main>
  );
}
