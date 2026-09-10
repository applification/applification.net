import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { StoryLoopsProductPage } from "@/components/products/storyloops-product-page";

export const metadata: Metadata = {
  title: "StoryLoops",
  description:
    "Buy StoryLoops as a complete collaborative story-mapping application, deploy it with your coding agent, and own the source.",
  openGraph: {
    ...defaultOpenGraph,
    title: "StoryLoops | Applification",
    description:
      "A complete collaborative story-mapping product, source code and agent installation playbook.",
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
