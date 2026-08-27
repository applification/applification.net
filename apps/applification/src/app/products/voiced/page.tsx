import type { Metadata } from "next";
import { VoicedProductPage } from "@/components/products/voiced-product-page";

export const metadata: Metadata = {
  title: "Voiced",
  description:
    "Voiced is a local macOS capture layer for speech, selected text and typed notes, with no account, telemetry, cloud storage or server.",
  openGraph: {
    title: "Voiced | Applification",
    description:
      "Capture speech, selected text and typed notes on macOS, then paste, queue or keep them locally.",
    url: "/products/voiced",
  },
};

export default function VoicedPage() {
  return <VoicedProductPage />;
}
