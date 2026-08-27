import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <PageShell
      eyebrow="Products"
      title="Software built around real constraints."
      description="StoryLoops, Contexture, Voiced and the product experiments that inform how I work with AI."
    />
  );
}
