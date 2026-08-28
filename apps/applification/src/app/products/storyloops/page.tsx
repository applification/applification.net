import type { Metadata } from "next";
import { StoryLoopsProductPage } from "@/components/products/storyloops-product-page";

export const metadata: Metadata = {
  title: "StoryLoops",
  description:
    "Buy StoryLoops as a complete collaborative story-mapping application, deploy it with your coding agent, and own the source.",
  openGraph: {
    title: "StoryLoops | Applification",
    description:
      "A complete collaborative story-mapping product, source code and agent installation playbook.",
    url: "/products/storyloops",
  },
};

export default function StoryLoopsPage() {
  return <StoryLoopsProductPage />;
}
