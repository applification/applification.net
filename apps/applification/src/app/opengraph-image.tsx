import { contractPositioning } from "@/lib/contract-positioning";
import { createSocialImage } from "@/lib/social-image";

export const alt = "Dave Hudson, Contract AI Product Engineer at Applification";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createSocialImage({
    label: `${contractPositioning.stack} · ${contractPositioning.location}`,
    title: "Dave Hudson",
    description: contractPositioning.role,
  });
}
