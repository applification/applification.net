import Link from "next/link";
import { CopyTextButton } from "@/components/copy-text-button";
import { markdownPath } from "@/lib/page-view";
import { InfoLink } from "./info-layout";

export function AgentPage({ title, path, markdown }: { title: string; path: string; markdown: string }) {
  return (
    <main className="agent-page flex-1 px-6 pt-12 pb-16 min-[720px]:px-12 min-[1024px]:pt-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm">
          <p className="font-caption flex items-center gap-2.5 text-xs text-[var(--app-label-text)]">
            <span aria-hidden="true" className="size-1.5 bg-current" />
            Agent view
          </p>
          <InfoLink href="/agents">Use this site with your AI</InfoLink>
        </div>
        <h1 className="font-caption mt-5 max-w-[900px] text-2xl leading-snug font-medium [overflow-wrap:anywhere] min-[720px]:text-[32px]">{title}</h1>
        <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-[var(--app-text-secondary)]">
          Public page content as Markdown. Copy it into a conversation or give your agent the Markdown link.
        </p>
        <div className="mt-8 border border-[var(--app-border)]">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 min-[720px]:px-6">
            <div className="font-data min-w-0 text-xs leading-6">
              <p className="[overflow-wrap:anywhere] text-[var(--app-text-primary)]">{markdownPath(path)}</p>
              <p className="text-[var(--app-text-muted)]">text/markdown</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <CopyTextButton key={path} text={markdown} label="Copy Markdown" variant="secondary" fallback="Copy the text below, or open the Markdown link." />
              <a href={markdownPath(path)} className="link-sweep inline-flex min-h-11 items-center text-sm text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]">
                <span className="link-sweep-label">Open Markdown</span>
              </a>
            </div>
          </div>
          <pre aria-label="Page Markdown" tabIndex={0} className="font-data max-w-full px-4 py-6 text-sm leading-7 whitespace-pre-wrap [overflow-wrap:anywhere] text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] min-[720px]:p-6"><code>{markdown}</code></pre>
        </div>
        <div className="mt-6">
          <Link href={path} className="link-sweep inline-flex min-h-11 items-center text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"><span className="link-sweep-label">Return to Human view</span></Link>
        </div>
      </div>
    </main>
  );
}
