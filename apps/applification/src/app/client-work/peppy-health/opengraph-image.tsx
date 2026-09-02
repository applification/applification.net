import { createSocialImage } from "@/lib/social-image";

export const alt = "Peppy Health case study by Dave Hudson. Rebuilding Peppy Admin as the business scaled.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createSocialImage({
    label: "Client work / Case study",
    title: "Peppy Health",
    description: "Rebuilding Peppy Admin as the business scaled.",
  });
}
