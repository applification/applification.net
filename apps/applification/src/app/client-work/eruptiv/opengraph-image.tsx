import { createSocialImage } from "@/lib/social-image";

export const alt = "Eruptiv case study by Dave Hudson. A complete Next.js frontend, in production in four months.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createSocialImage({
    label: "Client work / Case study",
    title: "Eruptiv",
    description: "A complete Next.js frontend, in production in four months.",
  });
}
