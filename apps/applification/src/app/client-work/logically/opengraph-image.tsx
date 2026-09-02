import { createSocialImage } from "@/lib/social-image";

export const alt = "Logically case study by Dave Hudson. Rebuild the product. Then connect AI to production.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createSocialImage({
    label: "Client work / Case study",
    title: "Logically",
    description: "Rebuild the product. Then connect AI to production.",
  });
}
