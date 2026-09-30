import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { AstackProductPage } from "@/components/products/astack-product-page";

export const metadata: Metadata = {
  title: "astack",
  description:
    "astack is an open-source Codex workflow for engineering outcomes, guardrails and verification. In development.",
  openGraph: {
    ...defaultOpenGraph,
    title: "astack | Applification",
    description:
      "An open-source Codex engineering workflow. Outcome first. Proof built in. In development.",
    url: "/products/astack",
  },
};

export default function AstackPage() {
  return (
    <>
      <StructuredData data={breadcrumbStructuredData([{ name: "Products", path: "/products" }, { name: "astack", path: "/products/astack" }])} />
      <AstackProductPage />
    </>
  );
}
