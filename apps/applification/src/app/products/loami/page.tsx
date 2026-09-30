import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { LoamiProductPage } from "@/components/products/loami-product-page";
import { productPageCopy } from "@/lib/content/product-details";
export const metadata: Metadata = {
  title: "Loami",
  description: productPageCopy.loami.hero.paragraphs[0],
  openGraph: {
    ...defaultOpenGraph,
    title: "Loami | Applification",
    description: productPageCopy.loami.hero.title,
    url: "/products/loami",
  },
};
export default function LoamiPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbStructuredData([
          { name: "Products", path: "/products" },
          { name: "Loami", path: "/products/loami" },
        ])}
      />
      <LoamiProductPage />
    </>
  );
}
