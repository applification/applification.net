import Link from "next/link";
import { CopyTextButton } from "@/components/copy-text-button";
import { markdownPath } from "@/lib/page-view";
import { InfoLink } from "./info-layout";

export function AgentPage({ title, path, markdown }: { title: string; path: string; markdown: string }) {
  return (
    <main className="flex-1 px-6 pt-12 pb-16 min-[720px]:px-12 min-[1024px]:pt-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-6 border-b border-[var(--app-border)] pb-6">
          <div className="min-w-0 max-w-[760px]">
            <p className="font-caption text-xs text-[var(--app-label-text)]">Agent view</p>
            <h1 className="font-heading mt-3 text-4xl leading-tight font-medium min-[720px]:text-5xl">{title}</h1>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-[var(--app-text-secondary)]">
              Public page content as Markdown. Copy it into a conversation or give your agent the Markdown link.
            </p>
            <InfoLink href="/agents">Use this site with your AI</InfoLink>
          </div>
          <div className="flex flex-col items-start gap-2">
            <CopyTextButton key={path} text={markdown} label="Copy Markdown" fallback="Copy the text below, or open the Markdown link." />
            <a href={markdownPath(path)} className="link-sweep inline-flex min-h-11 items-center text-sm text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]">
              <span className="link-sweep-label">Open Markdown</span>
            </a>
          </div>
        </div>
        <pre aria-label="Page Markdown" tabIndex={0} className="font-data mt-8 max-w-full rounded-lg text-sm leading-7 whitespace-pre-wrap [overflow-wrap:anywhere] text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]">{markdown}</pre>
        <div className="mt-10 border-t border-[var(--app-border)] pt-4">
          <Link href={path} className="link-sweep inline-flex min-h-11 items-center text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"><span className="link-sweep-label">Return to Human view</span></Link>
        </div>
      </div>
    </main>
  );
}
