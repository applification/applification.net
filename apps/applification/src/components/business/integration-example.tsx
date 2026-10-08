"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { integrationExamples } from "@/lib/content/business";

export function IntegrationExample() {
  const [selected, setSelected] = useState<
    (typeof integrationExamples)[number]
  >(integrationExamples[0]);
  return (
    <figure
      className="min-w-0 rounded-2xl border border-[var(--hero-border)] bg-[var(--app-card)] p-5 text-[var(--hero-text)] min-[720px]:p-7"
      aria-labelledby="integration-example-title"
    >
      <figcaption
        className="font-caption text-xs text-[var(--hero-text-muted)]"
        id="integration-example-title"
      >
        Illustrative workflows · choose an example
      </figcaption>
      <div
        className="mt-4 flex flex-wrap gap-2"
        aria-label="Integration examples"
      >
        {integrationExamples.map((example) => (
          <button
            key={example.id}
            type="button"
            aria-pressed={selected.id === example.id}
            aria-controls="integration-example-detail"
            onClick={() => setSelected(example)}
            className="min-h-11 rounded-full border border-[var(--hero-border)] px-3 text-sm text-[var(--hero-text)] transition-colors hover:border-[var(--hero-label)] aria-pressed:border-[var(--hero-label)] aria-pressed:font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)] motion-reduce:transition-none"
          >
            {example.label}
          </button>
        ))}
      </div>
      <div
        className="mt-6"
        id="integration-example-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="font-heading max-w-[440px] text-[28px] leading-[1.15]">
          “{selected.question}”
        </p>
        <ol className="mt-6 grid gap-2 min-[520px]:grid-cols-[1fr_auto_1fr] min-[520px]:items-center">
          <li className="rounded-lg border border-[var(--hero-border)] p-3">
            <p className="font-caption text-[11px] text-[var(--hero-text-muted)]">
              Existing system
            </p>
            <p className="mt-1 text-sm font-semibold">{selected.system}</p>
          </li>
          <li
            className="flex justify-center text-[var(--hero-label)]"
            aria-hidden="true"
          >
            <ArrowRight className="hidden size-5 min-[520px]:block" />
            <ArrowDown className="size-5 min-[520px]:hidden" />
          </li>
          <li className="rounded-lg border border-[var(--hero-border)] p-3">
            <p className="font-caption text-[11px] text-[var(--hero-text-muted)]">
              Scoped MCP tool
            </p>
            <p className="mt-1 text-sm font-semibold">{selected.tool}</p>
          </li>
        </ol>
        <div className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[var(--hero-text-secondary)]">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--hero-label)]"
          />
          <p>{selected.access}</p>
        </div>
        <div className="mt-4 border-t border-[var(--hero-border)] pt-4">
          <p className="font-caption text-[11px] text-[var(--hero-text-muted)]">
            In the assistant
          </p>
          <p className="mt-2 text-base leading-relaxed">{selected.interface}</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[var(--hero-text-secondary)]">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {selected.approval}
          </p>
        </div>
      </div>
    </figure>
  );
}
