import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { DetailContextRail } from "@/components/detail-context-rail";
import { RICH_BLOCK_LANGUAGE } from "@/lib/rich-blocks";
import type { WritingEntry } from "@/lib/writing";
import { RichBlock, type RichBlockRegistry } from "./rich-block";
import { displayWritingTopics, WritingTopicBadge } from "./writing-topic";

type WritingArticleProps = {
  entry: WritingEntry;
  newer?: WritingEntry;
  older?: WritingEntry;
  preview?: boolean;
  richBlockRegistry?: RichBlockRegistry;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

type CodeElementProps = {
  children?: ReactNode;
  className?: string;
};

export function createMarkdownComponents(
  article: string,
  registry?: RichBlockRegistry,
): Components {
  let richBlockIndex = 0;

  return {
    h1: ({ children }) => (
      <h2 className="font-heading mt-14 mb-5 text-[34px] leading-[1.12] font-medium text-[var(--app-text-primary)] min-[720px]:text-[40px]">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading mt-14 mb-5 text-[34px] leading-[1.12] font-medium text-[var(--app-text-primary)] min-[720px]:text-[40px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading mt-10 mb-4 text-[27px] leading-[1.18] font-semibold text-[var(--app-text-primary)] min-[720px]:text-[30px]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 mb-3 text-lg font-semibold text-[var(--app-text-primary)]">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="my-5 text-[17px] leading-[1.78] text-[var(--app-text-secondary)]">
        {children}
      </p>
    ),
    a: ({ children, href }) => {
      const external = href?.startsWith("http");
      return (
        <a
          className="font-medium text-[var(--writing-accent-text)] underline decoration-[var(--app-border)] underline-offset-4 hover:decoration-[var(--writing-accent-text)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
          href={href}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-[var(--app-text-secondary)] marker:text-[var(--writing-accent-text)]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-[var(--app-text-secondary)] marker:font-caption marker:text-[var(--writing-accent-text)]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[var(--writing-accent-text)] bg-[var(--app-muted-section)] px-6 py-2 font-heading text-xl italic text-[var(--app-text-primary)]">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-12 border-[var(--app-border)]" />,
    pre: ({ children }) => {
      const child = Children.only(children) as ReactElement<CodeElementProps>;

      if (
        isValidElement(child) &&
        child.props.className === `language-${RICH_BLOCK_LANGUAGE}`
      ) {
        return child;
      }

      return (
        <pre className="my-8 overflow-x-auto rounded-[16px] bg-[var(--loop-bg)] p-5 font-data text-[13px] leading-[1.65] text-[var(--storyloop-text-soft)] min-[720px]:p-6">
          {children}
        </pre>
      );
    },
    code: ({ children, className }) =>
      className === `language-${RICH_BLOCK_LANGUAGE}` ? (
        <RichBlock
          article={article}
          index={richBlockIndex++}
          registry={registry}
          source={String(children).replace(/\n$/, "")}
        />
      ) : className ? (
        <code className={className}>{children}</code>
      ) : (
        <code className="rounded bg-[var(--app-control)] px-1.5 py-0.5 font-data text-[0.88em] text-[var(--app-text-primary)]">
          {children}
        </code>
      ),
    img: ({ alt, src, title }) => (
      // The migration keeps original image dimensions unknown, so a responsive
      // native image avoids inventing an aspect ratio.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt ?? ""}
        className="my-9 h-auto w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-muted-section)]"
        loading="lazy"
        src={src}
        title={title}
      />
    ),
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-[12px] border border-[var(--app-border)]">
        <table className="w-full border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-[var(--app-muted-section)] px-4 py-3 font-caption text-[10px] tracking-[0.6px] text-[var(--app-text-primary)] uppercase">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-t border-[var(--app-border)] px-4 py-3 text-[var(--app-text-secondary)]">
        {children}
      </td>
    ),
  };
}

export function WritingArticle({
  entry,
  newer,
  older,
  preview = false,
  richBlockRegistry,
}: WritingArticleProps) {
  return (
    <main className="flex-1 bg-[var(--app-section)]">
      {preview ? (
        <aside
          className="bg-[var(--writing-accent-fill)] px-6 py-3 text-center font-caption text-[10px] font-bold tracking-[0.8px] text-[var(--writing-on-accent)] uppercase"
          role="status"
        >
          Local preview · {entry.draft ? "Draft" : "Published"}
        </aside>
      ) : null}
      <header className="bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 pt-12 pb-14 min-[720px]:px-12 min-[1024px]:pt-[66px] min-[1024px]:pb-[72px] min-[1440px]:px-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <DetailContextRail
            backHref="/writing"
            backLabel="Writing index"
            className="text-[var(--writing-accent-text)]"
            detail={`${entry.type} · ${formatDate(entry.date)} · ${entry.readingTime} min read`}
            family="Writing"
          />
          <div className="mt-5 max-w-[920px]">
            <h1 className="font-heading text-[44px] leading-[1.02] font-medium tracking-[-1px] text-[var(--app-text-primary)] min-[720px]:text-[58px] min-[1024px]:text-[68px]">
              {entry.title}
            </h1>
            <p className="mt-6 max-w-[760px] text-lg leading-[1.6] text-[var(--app-text-secondary)]">
              {entry.summary}
            </p>
            <ul
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Article topics"
            >
              {displayWritingTopics(entry.topics).map((topic) => (
                <li key={topic}>
                  <WritingTopicBadge topic={topic} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <article className="mx-auto w-full max-w-[760px] px-6 py-14 min-[720px]:px-10 min-[1024px]:py-[76px]">
        <ReactMarkdown
          components={createMarkdownComponents(entry.slug, richBlockRegistry)}
          remarkPlugins={[remarkGfm]}
        >
          {entry.body}
        </ReactMarkdown>
      </article>

      {preview ? null : (
        <nav
          aria-label="More writing"
          className="border-t border-[var(--app-border)] bg-[var(--app-muted-section)] px-6 py-10 min-[720px]:px-12 min-[1440px]:px-[120px]"
        >
          <div className="mx-auto grid w-full max-w-[920px] gap-4 min-[720px]:grid-cols-2">
            {newer ? (
              <Link
                className="group rounded-[14px] bg-[var(--app-card)] p-5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
                href={`/writing/${newer.slug}`}
              >
                <span className="font-caption inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.7px] text-[var(--app-text-muted)]">
                  <ArrowLeft aria-hidden="true" size={13} /> NEWER
                </span>
                <span className="font-heading mt-3 block text-xl font-semibold text-[var(--app-text-primary)] group-hover:text-[var(--writing-accent-text)]">
                  {newer.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {older ? (
              <Link
                className="group rounded-[14px] bg-[var(--app-card)] p-5 text-right focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
                href={`/writing/${older.slug}`}
              >
                <span className="font-caption inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.7px] text-[var(--app-text-muted)]">
                  OLDER <ArrowRight aria-hidden="true" size={13} />
                </span>
                <span className="font-heading mt-3 block text-xl font-semibold text-[var(--app-text-primary)] group-hover:text-[var(--writing-accent-text)]">
                  {older.title}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </main>
  );
}
