import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { ProductsPageContent } from "@/components/products/products-page";

const description =
  "astack, Contexture, Voiced and Loami, plus the StoryLoops and Plantry archives. Products built around real work, visible systems and explicit human control.";

export const metadata: Metadata = {
  title: "Products",
  description,
  openGraph: {
    ...defaultOpenGraph,
    title: "Products | Applification",
    description,
    url: "/products",
  },
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
