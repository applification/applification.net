import Link from "next/link";

export function displayWritingTopics(topics: string[]) {
  return topics.filter((topic) => topic !== "weeknote");
}

export function formatWritingTopic(topic: string) {
  if (topic === "ai") return "AI";
  if (topic === "next.js") return "Next.js";
  return topic
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function WritingTopicBadge({ topic }: { topic: string }) {
  return (
    <Link
      className="font-caption inline-flex min-h-7 items-center gap-1.5 rounded-full border border-[var(--writing-topic-border)] bg-[var(--writing-topic-bg)] px-2.5 text-[11px] font-semibold tracking-[0.5px] text-[var(--writing-topic-text)] uppercase transition-colors hover:border-[var(--writing-accent-text)] hover:bg-[var(--writing-topic-bg-hover)] hover:text-[var(--writing-accent-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
      href={`/writing?topic=${encodeURIComponent(topic)}#writing-index`}
    >
      <span aria-hidden="true" className="text-[var(--writing-topic-mark)]">
        #
      </span>
      {formatWritingTopic(topic)}
    </Link>
  );
}
