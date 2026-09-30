import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { StoryLoopsProductPage } from "@/components/products/storyloops-product-page";

export const metadata: Metadata = {
  title: "StoryLoops",
  description:
    "StoryLoops is an archived story-mapping experiment. Its lessons led to astack, an outcome-led workflow for Codex.",
  openGraph: {
    ...defaultOpenGraph,
    title: "StoryLoops | Applification",
    description:
      "An archived story-mapping experiment. Its lessons shaped astack.",
    url: "/products/storyloops",
  },
};

export default function StoryLoopsPage() {
  return (
    <>
      <StructuredData data={breadcrumbStructuredData([{ name: "Products", path: "/products" }, { name: "StoryLoops", path: "/products/storyloops" }])} />
      <StoryLoopsProductPage />
    </>
  );
}
