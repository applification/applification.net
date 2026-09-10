import { permanentRedirect } from "next/navigation";

export default function PricingRedirect() {
  permanentRedirect("/api/v1/catalog?section=pricing");
}
