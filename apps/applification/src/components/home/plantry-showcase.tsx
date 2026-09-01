import { MotionReveal } from "./motion";
import { ProductStatus } from "./product-status";

const capabilities = [
  "Plans around preferences, effort and what needs using",
  "Learns from meals cooked, skipped or changed",
];

const previewAlt =
  "Plantry iPhone preview showing a three-day August meal plan and a prompt to plan tonight's dinner.";

export function PlantryShowcase() {
  return (
    <MotionReveal>
      <section
      aria-labelledby="plantry-heading"
      className="bg-[var(--app-section)] px-6 pt-6 pb-14 min-[821px]:px-20 min-[1024px]:pt-8 min-[1024px]:pb-16"
      id="plantry"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div
          aria-hidden="true"
          className="hidden h-[50px] grid-cols-[1fr_auto_1fr] items-center gap-[18px] min-[1024px]:grid"
        >
          <span className="h-px bg-[var(--app-border)]" />
          <span className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
            02&nbsp; / &nbsp;PLANTRY&nbsp; · &nbsp;PRODUCT R&amp;D
          </span>
          <span className="h-px bg-[var(--app-border)]" />
        </div>

        <article className="relative grid grid-cols-1 gap-[18px] border-t border-[var(--app-border)] pt-[18px] min-[1024px]:mt-8 min-[1024px]:min-h-[298px] min-[1024px]:grid-cols-[minmax(0,1fr)_340px] min-[1024px]:grid-rows-[auto_1fr] min-[1024px]:gap-x-8 min-[1024px]:gap-y-3 min-[1024px]:overflow-hidden min-[1024px]:rounded-[18px] min-[1024px]:border min-[1024px]:bg-[var(--app-card)] min-[1024px]:p-6 min-[1024px]:pl-7">
          <div className="flex min-w-0 flex-col gap-3 min-[1024px]:col-start-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-caption text-xs font-bold tracking-[0.7px] text-[var(--app-label-text)]">
                02&nbsp; / &nbsp;PLANTRY&nbsp; · &nbsp;APPLE PLATFORMS
              </p>
              <ProductStatus status={"R&D"} />
            </div>
            <h2
              className="font-heading text-4xl leading-none font-medium text-[var(--app-text-primary)]"
              id="plantry-heading"
            >
              Meal planning that understands the household.
            </h2>
            <p className="max-w-[760px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[17px]">
              Plans the next 2 to 7 days around what the household likes, what
              needs using and what is in season. Shopping hands off to
              Reminders.
            </p>
          </div>

          <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-muted-section)] min-[1024px]:absolute min-[1024px]:top-6 min-[1024px]:right-0 min-[1024px]:bottom-0 min-[1024px]:h-auto min-[1024px]:w-[340px] min-[1024px]:rounded-none min-[1024px]:border-0 min-[1024px]:bg-transparent">
            {/* The native image keeps this static product preview portable in Storybook. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={previewAlt}
              className="absolute top-0 left-1/2 h-auto w-[calc(100%-16px)] max-w-[330px] -translate-x-1/2 min-[1024px]:w-[330px] min-[1024px]:max-w-none"
              decoding="async"
              height={940}
              loading="lazy"
              src="/images/plantry-phone.png"
              width={536}
            />
          </div>

          <ul className="divide-y divide-[var(--app-border)] border-y border-[var(--app-border)] min-[1024px]:col-start-1 min-[1024px]:self-end">
            {capabilities.map((capability) => (
              <li
                className="flex min-h-10 items-center gap-2.5 py-[11px] text-[15px] leading-[1.45] text-[var(--app-text-primary)] min-[1024px]:text-base"
                key={capability}
              >
                <span
                  aria-hidden="true"
                  className="size-[7px] shrink-0 rounded-full bg-[var(--app-accent)]"
                />
                {capability}
              </li>
            ))}
          </ul>
        </article>

        <p className="font-caption mt-[18px] hidden text-center text-[10px] font-semibold tracking-[1.4px] text-[var(--app-label-text)] min-[1024px]:block">
          ······&nbsp; BUILDING IN PUBLIC &nbsp;······
        </p>
      </div>
      </section>
    </MotionReveal>
  );
}
