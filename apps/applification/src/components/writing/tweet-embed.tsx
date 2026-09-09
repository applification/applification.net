"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import { ExternalLink } from "@/components/external-link";
import { tweetSchema } from "@/lib/rich-block-registry";

type TwitterWindow = Window & {
  twttr?: { widgets: { createTweet: (
    id: string,
    element: HTMLElement,
    options: Record<string, string | boolean>,
  ) => Promise<HTMLElement | undefined> } };
};

export function TweetEmbed(props: Record<string, unknown>) {
  const tweet = tweetSchema.parse(props);
  const target = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  function renderTweet() {
    const element = target.current;
    const widgets = (window as TwitterWindow).twttr?.widgets;
    if (!element || !widgets || element.dataset.requested) return;
    element.dataset.requested = "true";
    // The host owns the iframe contents. Keep it light in either site theme.
    void widgets.createTweet(tweet.id, element, {
      dnt: true, conversation: "none", cards: "hidden", theme: "light",
    }).then((result) => {
      if (result && target.current === element) setLoaded(true);
    }).catch(() => { /* Keep the readable fallback if X is unavailable. */ });
  }

  return (
    <figure className="mx-auto my-9 w-full max-w-[550px]" data-rich-block="tweet">
      <div ref={target} />
      {!loaded && (
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6">
          <blockquote className="text-base leading-relaxed text-[var(--app-text-primary)]">
            {tweet.quote}
          </blockquote>
          <p className="mt-3 text-sm text-[var(--app-text-secondary)]">{tweet.author}</p>
        </div>
      )}
      <figcaption>
        <ExternalLink
          href={`https://x.com/i/status/${tweet.id}`}
          className="link-sweep inline-flex min-h-11 items-center gap-2 text-sm text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
        >
          <span className="link-sweep-label">Read {tweet.author}&apos;s post on X</span>
        </ExternalLink>
      </figcaption>
      <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" onReady={renderTweet} />
    </figure>
  );
}
