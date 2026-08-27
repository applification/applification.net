import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Writing" };

export default function WritingPage() {
  return (
    <PageShell
      eyebrow="Writing"
      title="Notes from the work."
      description="Field notes on AI-assisted development, product engineering, frontend architecture and delivery."
    />
  );
}
