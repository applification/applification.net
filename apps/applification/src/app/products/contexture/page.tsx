import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { ContextureProductPage } from "@/components/products/contexture-product-page";

export const metadata: Metadata = {
  title: "Contexture",
  description:
    "Design one reviewed domain model for a Convex application, then generate its schema, validators and agent context.",
  openGraph: {
    ...defaultOpenGraph,
    title: "Contexture | Applification",
    description:
      "An open-source domain model editor and contract generator for Convex applications built with agents.",
    url: "/products/contexture",
  },
};

export default function ContexturePage() {
  return <ContextureProductPage />;
}
