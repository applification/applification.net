import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Client work" };

export default function ClientWorkPage() {
  return (
    <PageShell
      eyebrow="Client work"
      title="Production work with the decisions attached."
      description="Evidence-led case studies from greenfield builds, architectural resets and small product teams."
    />
  );
}
