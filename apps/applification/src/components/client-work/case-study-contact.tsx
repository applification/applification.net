import { ExternalLink } from "@/components/external-link";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildContactHref, isContactWorkflowAvailable } from "@/lib/contact";
import { contractPositioning, personalLinkedInUrl } from "@/lib/contract-positioning";

const focusClasses = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function CaseStudyFacts({ role, engagement, stack }: { role: string; engagement: string; stack: string }) {
  return (
    <dl aria-label="Engagement details" className="mt-8 grid gap-5 border-t border-[var(--app-border)] pt-6 min-[720px]:grid-cols-3">
      {[["My role", role], ["Engagement", engagement], ["Stack", stack]].map(([label, value]) => (
        <div key={label}>
          <dt className="font-caption text-[11px] font-semibold uppercase tracking-wide text-[var(--app-label-text)]">{label}</dt>
          <dd className="mt-2 text-base leading-relaxed text-[var(--app-text-secondary)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyContact({ nextHref, nextLabel }: { nextHref: string; nextLabel: string }) {
  return (
    <section aria-labelledby="case-contact-heading" className="border-t border-[var(--app-border)] bg-[var(--app-muted-section)] px-6 py-12 min-[720px]:px-12">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-caption text-[11px] font-semibold uppercase tracking-wide text-[var(--app-label-text)]">{contractPositioning.availability} · {contractPositioning.location}</p>
        <h2 id="case-contact-heading" className="font-heading mt-4 max-w-[760px] text-[38px] leading-[1.08] font-medium min-[720px]:text-5xl">Have a similar challenge?</h2>
        <p className="mt-4 max-w-[680px] text-lg leading-relaxed text-[var(--app-text-secondary)]">I’m Dave Hudson. I join teams to build and improve web products, with production AI where it helps. Contracts through Applification Ltd.</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {isContactWorkflowAvailable() ? <Link href={buildContactHref()} className={`inline-flex min-h-[50px] items-center gap-2 rounded-full bg-[var(--app-action)] px-6 font-semibold text-[var(--app-text-on-action)] hover:bg-[var(--app-action-hover)] ${focusClasses}`}>
            Discuss a similar project <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link> : null}
          <ExternalLink href={personalLinkedInUrl} className={`link-sweep inline-flex min-h-11 items-center text-[var(--app-label-text)] ${focusClasses}`}><span className="link-sweep-label">Contact me on LinkedIn</span></ExternalLink>
        </div>
        <nav aria-label="Case study next steps" className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--app-border)] pt-5 text-sm text-[var(--app-text-secondary)]">
          <Link href="/client-work" className={`link-sweep inline-flex min-h-11 items-center ${focusClasses}`}><span className="link-sweep-label">Return to Client work</span></Link>
          <Link href={nextHref} className={`link-sweep inline-flex min-h-11 items-center ${focusClasses}`}><span className="link-sweep-label">{nextLabel}</span></Link>
        </nav>
      </div>
    </section>
  );
}
