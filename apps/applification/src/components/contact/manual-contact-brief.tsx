"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactTextLimits, type ContactDraft } from "@/lib/contact-draft";
import { validateContactDraft } from "@/lib/contact-state";
import type { ContactRoute } from "@/lib/contact";
import { portfolioProducts } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const fields = {
  contract: [["company", "Company or agency"], ["need", "Role or project"], ["timing", "Start date and duration"], ["workingArrangement", "Working arrangement and location"]],
  product: [["question", "Your question"], ["context", "Additional context"]],
  general: [["topic", "Subject"], ["message", "Your message"]],
} as const;
const optional = new Set(["context", "summary"]);
type TextField = keyof typeof contactTextLimits;
const selectClassName = "min-h-11 w-full border-[var(--app-border)] bg-[var(--contact-input)] px-3 text-base text-[var(--app-text-primary)]";

export function ManualContactBrief({ draft, originalMessage, onRoute, onField, onReview }: {
  draft: ContactDraft;
  originalMessage: string;
  onRoute: (route: ContactRoute) => void;
  onField: (field: TextField | "product", value: string) => void;
  onReview: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefix = useId();
  useEffect(() => { headingRef.current?.focus(); }, []);
  const route = draft.route ?? "general";
  const valid = validateContactDraft(draft).valid;
  return (
    <form className="flex-1 overflow-y-auto bg-[var(--app-section)] p-4 sm:p-6" aria-label="Complete enquiry manually" onSubmit={(event) => { event.preventDefault(); if (valid) onReview(); }}>
      <div className="mx-auto grid max-w-[760px] gap-4">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="font-heading text-3xl focus-visible:outline-2 focus-visible:outline-[var(--app-focus)]">Complete your enquiry</h2>
          <p className="mt-1 text-sm text-[var(--app-text-secondary)]">No AI is needed here. Your existing details and attachment are kept. You will review everything before sending.</p>
        </div>
        {originalMessage ? <details className="rounded-xl bg-[var(--contact-card)] p-3"><summary className="cursor-pointer text-sm font-semibold">Your original message</summary><p className="mt-3 whitespace-pre-wrap break-words text-sm">{originalMessage}</p></details> : null}
        <div className="grid grid-cols-1 items-start gap-x-5 gap-y-4 sm:grid-cols-2" data-manual-fields>
          <Field className="min-w-0 gap-1.5">
            <FieldLabel htmlFor={`${prefix}-route`} className="text-[13px] font-semibold">Enquiry type</FieldLabel>
            <Select name="route" value={route} onValueChange={(value) => onRoute(value as ContactRoute)}>
              <SelectTrigger id={`${prefix}-route`} className={selectClassName}><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="contract">Contract enquiry</SelectItem>
                <SelectItem value="product">Product enquiry</SelectItem>
                <SelectItem value="general">General enquiry</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {route === "product" ? <Field className="min-w-0 gap-1.5">
            <FieldLabel htmlFor={`${prefix}-product`} className="text-[13px] font-semibold">Product</FieldLabel>
            <Select required name="product" value={draft.product ?? ""} onValueChange={(value) => onField("product", value)}>
              <SelectTrigger id={`${prefix}-product`} className={selectClassName}><SelectValue placeholder="Choose a product" /></SelectTrigger>
              <SelectContent position="popper">
                {portfolioProducts.map(product => <SelectItem key={product.slug} value={product.slug}>{product.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field> : null}
          {([...fields[route], ["replyName", "Your name"], ["replyEmail", "Reply email"], ["summary", "Overview / additional details"]] as Array<readonly [TextField, string]>).map(([field, label]) => {
            const long = contactTextLimits[field] >= 4000;
            const id = `${prefix}-${field}`;
            return <Field className={cn("min-w-0 gap-1.5", long && "sm:col-span-2")} key={field}>
              <FieldLabel htmlFor={id} className="text-[13px] font-semibold">{label}{optional.has(field) ? " (optional)" : ""}</FieldLabel>
              {long ? <Textarea id={id} aria-describedby={`${id}-count`} required={!optional.has(field)} maxLength={contactTextLimits[field]} rows={3} className={cn("resize-y bg-[var(--contact-input)] text-base", optional.has(field) ? "min-h-18" : "min-h-24")} value={draft[field] ?? ""} onChange={(event) => onField(field, event.target.value)} />
                : <Input id={id} required={!optional.has(field)} maxLength={contactTextLimits[field]} autoComplete={field === "replyEmail" ? "email" : field === "replyName" ? "name" : undefined} type={field === "replyEmail" ? "email" : "text"} className="h-11 bg-[var(--contact-input)] text-base" value={draft[field] ?? ""} onChange={(event) => onField(field, event.target.value)} />}
              {long ? <span id={`${id}-count`} className="text-xs font-normal text-[var(--app-text-muted)]">{(draft[field] ?? "").length.toLocaleString()} / {contactTextLimits[field].toLocaleString()} characters</span> : null}
            </Field>;
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--app-border)] pt-4">
          {!valid ? <p className="max-w-[460px] text-sm text-[var(--app-text-secondary)]">Complete the required details and add a valid reply email to continue.</p> : null}
          <Button className="min-h-11 sm:ml-auto" type="submit" disabled={!valid}>Review enquiry</Button>
        </div>
      </div>
    </form>
  );
}
