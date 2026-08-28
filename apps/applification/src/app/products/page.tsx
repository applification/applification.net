import type { Metadata } from "next";
import { ProductsPageContent } from "@/components/products/products-page";

export const metadata: Metadata = {
  title: "Products",
  description:
    "StoryLoops, Contexture, Voiced and Plantry. Products built around real work, visible systems and explicit human control.",
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
