import type { Metadata } from "next";
import { ClientWorkPage } from "@/components/client-work/client-work-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";

export const metadata: Metadata = {
  title: "Client work",
  description: contractPositioningDescriptions.clientWork,
  openGraph: {
    title: "Client work | Applification",
    description: contractPositioningDescriptions.clientWork,
    url: "/client-work",
  },
  twitter: {
    card: "summary",
    title: "Client work | Applification",
    description: contractPositioningDescriptions.clientWork,
  },
};

export default function ClientWorkRoute() {
  return <ClientWorkPage />;
}
