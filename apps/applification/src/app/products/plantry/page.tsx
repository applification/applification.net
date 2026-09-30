import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { PlantryProductPage } from "@/components/products/plantry-product-page";

export const metadata: Metadata = {
  title: "Plantry",
  description:
    "Plantry is an archived iPhone meal-planning experiment. Its household product work continues in Loami.",
  openGraph: {
    ...defaultOpenGraph,
    title: "Plantry | Applification",
    description:
      "Archived household meal-planning prototype. Continued in Loami.",
    url: "/products/plantry",
  },
};

export default function PlantryPage() {
  return (
    <>
      <StructuredData data={breadcrumbStructuredData([{ name: "Products", path: "/products" }, { name: "Plantry", path: "/products/plantry" }])} />
      <PlantryProductPage />
    </>
  );
}
