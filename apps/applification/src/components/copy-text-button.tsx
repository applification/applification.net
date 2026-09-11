"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyTextButton({ text, label, fallback }: {
  text: string;
  label: string;
  fallback: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Button type="button" onClick={copy} className="min-h-11 px-4 motion-reduce:transform-none motion-reduce:transition-none">
        {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {label}
      </Button>
      <span role="status" className="text-sm text-[var(--app-text-secondary)]">
        {status === "copied" ? "Copied to clipboard." : status === "failed" ? fallback : ""}
      </span>
    </div>
  );
}
