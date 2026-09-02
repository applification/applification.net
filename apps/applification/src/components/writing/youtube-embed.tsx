"use client";

import { ExternalLink } from "@/components/external-link";


import { useRef, useState } from "react";
import {
  youtubeSchema,
  type YouTubeProps,
} from "@/lib/rich-block-registry";

function watchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function embedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function YouTubeEmbed(props: Record<string, unknown>) {
  const video: YouTubeProps = youtubeSchema.parse(props);
  const [loaded, setLoaded] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  function loadPlayer() {
    setLoaded(true);
    requestAnimationFrame(() => playerRef.current?.focus());
  }

  return (
    <figure
      className="my-9 overflow-hidden rounded-[18px] border border-[var(--app-border)] bg-[var(--loop-bg)] shadow-sm shadow-black/10"
      data-rich-block="youtube"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {loaded ? (
          <iframe
            ref={playerRef}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-0 focus-visible:outline-2 focus-visible:-outline-offset-3 focus-visible:outline-[var(--loop-cyan)]"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embedUrl(video.videoId)}
            title={video.title}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-br from-[var(--loop-header)] via-[var(--loop-bg)] to-[var(--loop-cyan-bg)] p-6 min-[640px]:p-8">
            <p className="font-caption text-[10px] font-bold tracking-[0.8px] text-[var(--loop-cyan)] uppercase">
              Video · Privacy mode
            </p>
            <div className="max-w-[590px]">
              <p className="font-heading text-[25px] leading-[1.12] font-semibold text-[var(--storyloop-text-strong)] min-[640px]:text-[34px]">
                {video.title}
              </p>
              <p className="mt-3 max-w-[520px] text-sm leading-[1.5] text-[var(--storyloop-text-subtle)] min-[640px]:text-[15px]">
                From {video.channel} on YouTube.
              </p>
            </div>
            <button
              aria-label={`Play video: ${video.title}`}
              className="font-caption inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-[var(--writing-accent-fill)] px-5 text-[10px] font-bold tracking-[0.65px] text-[var(--writing-on-accent)] uppercase hover:bg-[var(--app-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--loop-cyan)]"
              onClick={loadPlayer}
              type="button"
            >
              <span aria-hidden="true" className="text-base leading-none">
                ▶
              </span>
              Play video
            </button>
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-[var(--writing-accent-fill)]"
            />
          </div>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-4 border-t border-[var(--storyloop-border-dark)] bg-[var(--loop-header)] px-5 py-3 min-[640px]:px-6">
        <span className="font-caption text-[9px] font-semibold tracking-[0.45px] text-[var(--storyloop-text-subtle)] uppercase">
          YouTube video
        </span>
        <ExternalLink
          className="link-sweep font-caption inline-flex min-h-11 items-center gap-2 text-[9px] font-bold tracking-[0.5px] text-[var(--loop-cyan)] uppercase focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--loop-cyan)]"
          href={watchUrl(video.videoId)}
        >
          <span className="link-sweep-label">Watch on YouTube</span>
        </ExternalLink>
      </figcaption>
    </figure>
  );
}
