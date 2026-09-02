"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactTextLimits, type ContactDraft } from "@/lib/contact-draft";
import { validateContactDraft } from "@/lib/contact-state";
import type { ContactRoute } from "@/lib/contact";

const fields = {
  contract: [["company", "Company or agency"], ["need", "Role or project"], ["timing", "Start date and duration"], ["workingArrangement", "Working arrangement and location"]],
  product: [["question", "Your question"], ["context", "Additional context"]],
  general: [["topic", "Subject"], ["message", "Your message"]],
} as const;
const optional = new Set(["context", "summary"]);
type TextField = keyof typeof contactTextLimits;

export function ManualContactBrief({ draft, originalMessage, onRoute, onField, onReview, onAssistant }: {
  draft: ContactDraft;
  originalMessage: string;
  onRoute: (route: ContactRoute) => void;
  onField: (field: TextField | "product", value: string) => void;
  onReview: () => void;
  onAssistant: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  const route = draft.route ?? "general";
  const valid = validateContactDraft(draft).valid;
  return (
    <form className="flex-1 overflow-y-auto bg-[var(--app-section)] p-4 sm:p-6" aria-label="Complete enquiry manually" onSubmit={(event) => { event.preventDefault(); if (valid) onReview(); }}>
      <div className="mx-auto grid max-w-[760px] gap-5">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="font-heading text-3xl focus-visible:outline-2 focus-visible:outline-[var(--app-focus)]">Complete your enquiry</h2>
          <p className="mt-2 text-sm text-[var(--app-text-secondary)]">No AI is needed here. Your existing details and attachment are kept. You will review everything before sending.</p>
        </div>
        {originalMessage ? <details className="rounded-xl bg-[var(--contact-card)] p-3"><summary className="cursor-pointer text-sm font-semibold">Your original message</summary><p className="mt-3 whitespace-pre-wrap break-words text-sm">{originalMessage}</p></details> : null}
        <label className="grid gap-2 text-sm font-semibold">Enquiry type
          <select className="h-11 rounded-lg border border-[var(--app-border)] bg-[var(--contact-input)] px-3" value={route} onChange={(event) => onRoute(event.target.value as ContactRoute)}>
            <option value="contract">Contract enquiry</option><option value="product">Product enquiry</option><option value="general">General enquiry</option>
          </select>
        </label>
        {route === "product" ? <label className="grid gap-2 text-sm font-semibold">Product
          <select required className="h-11 rounded-lg border border-[var(--app-border)] bg-[var(--contact-input)] px-3" value={draft.product ?? ""} onChange={(event) => onField("product", event.target.value)}>
            <option value="">Choose a product</option>{Object.entries({ storyloops: "StoryLoops", contexture: "Contexture", voiced: "Voiced", plantry: "Plantry" }).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label> : null}
        {([...fields[route], ["replyName", "Your name"], ["replyEmail", "Reply email"], ["summary", "Overview / additional details"]] as Array<readonly [TextField, string]>).map(([field, label]) => {
          const long = contactTextLimits[field] >= 4000;
          return <label className="grid gap-2 text-sm font-semibold" key={field}>
            {label}{optional.has(field) ? " (optional)" : ""}
            {long ? <Textarea required={!optional.has(field)} maxLength={contactTextLimits[field]} rows={5} className="bg-[var(--contact-input)] text-base" value={draft[field] ?? ""} onChange={(event) => onField(field, event.target.value)} />
              : <Input required={!optional.has(field)} maxLength={contactTextLimits[field]} type={field === "replyEmail" ? "email" : "text"} className="h-11 bg-[var(--contact-input)] text-base" value={draft[field] ?? ""} onChange={(event) => onField(field, event.target.value)} />}
            {long ? <span className="text-xs font-normal text-[var(--app-text-muted)]">{(draft[field] ?? "").length.toLocaleString()} / {contactTextLimits[field].toLocaleString()} characters</span> : null}
          </label>;
        })}
        {!valid ? <p className="text-sm text-[var(--app-text-secondary)]">Complete the required details and add a valid reply email to continue.</p> : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={!valid}>Review enquiry</Button>
          <Button type="button" variant="outline" onClick={onAssistant}>Return to assistant</Button>
        </div>
      </div>
    </form>
  );
}
