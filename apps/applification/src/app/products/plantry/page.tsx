import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { PlantryProductPage } from "@/components/products/plantry-product-page";

export const metadata: Metadata = {
  title: "Plantry",
  description:
    "Plantry is an iPhone meal-planning experiment built around household preferences, available effort, food that needs using and short planning horizons.",
  openGraph: {
    ...defaultOpenGraph,
    title: "Plantry | Applification",
    description:
      "A short, adaptive household meal-planning loop for Apple platforms.",
    url: "/products/plantry",
  },
};

export default function PlantryPage() {
  return <PlantryProductPage />;
}
