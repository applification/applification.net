import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Dave Hudson"
      title="Frontend judgement, full-stack delivery and AI-native practice."
      description="I work through Applification Ltd on remote UK contracts, usually inside small teams with a product to shape."
    />
  );
}
