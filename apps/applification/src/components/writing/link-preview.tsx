import Image from "next/image";
import {
  linkPreviewSchema,
  type LinkPreviewProps,
} from "@/lib/rich-block-registry";

function destinationHost(destination: string) {
  return new URL(destination).hostname.replace(/^www\./, "");
}

export function LinkPreview(props: Record<string, unknown>) {
  const preview: LinkPreviewProps = linkPreviewSchema.parse(props);
  const host = destinationHost(preview.destination);

  return (
    <a
      aria-label={`${preview.title} on ${preview.siteName}, external link`}
      className="group relative my-9 grid min-h-44 overflow-hidden rounded-[18px] border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm shadow-black/5 outline-none hover:border-[var(--writing-accent-text)] focus-visible:border-[var(--writing-accent-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] min-[640px]:grid-cols-[minmax(0,1fr)_auto]"
      data-rich-block="link-preview"
      href={preview.destination}
      rel="noreferrer"
      target="_blank"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-[var(--writing-accent-fill)]"
      />
      <span className="flex min-w-0 flex-col px-6 py-6 pl-7 min-[640px]:px-7 min-[640px]:py-7 min-[640px]:pl-8">
        <span className="font-caption flex items-center justify-between gap-4 text-[10px] font-bold tracking-[0.7px] text-[var(--writing-accent-text)] uppercase">
          <span>{preview.siteName}</span>
          <span
            aria-hidden="true"
            className="shrink-0 text-lg leading-none motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </span>
        <span className="font-heading mt-4 text-[25px] leading-[1.16] font-semibold text-[var(--app-text-primary)] min-[640px]:text-[29px]">
          {preview.title}
        </span>
        <span className="mt-3 text-[15px] leading-[1.55] text-[var(--app-text-secondary)]">
          {preview.description}
        </span>
        <span className="font-caption mt-5 text-[9px] font-semibold tracking-[0.35px] text-[var(--app-text-muted)] uppercase">
          {host} · External reference
        </span>
      </span>
      {preview.image ? (
        <span className="relative order-first aspect-[16/9] w-full overflow-hidden border-b border-[var(--app-border)] bg-[var(--app-muted-section)] min-[640px]:order-last min-[640px]:aspect-auto min-[640px]:w-[220px] min-[640px]:border-b-0 min-[640px]:border-l">
          <Image
            alt={preview.image.alt}
            className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.025]"
            fill
            sizes="(min-width: 640px) 220px, 100vw"
            src={preview.image.src}
          />
        </span>
      ) : null}
    </a>
  );
}
