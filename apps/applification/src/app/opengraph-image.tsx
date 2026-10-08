import { contractPositioning } from "@/lib/contract-positioning";
import { createSocialImage } from "@/lib/social-image";
import { getSiteIdentity } from "@/lib/site-identity.server";

export const alt =
  "Applification MCP integration delivery and Dave Hudson’s engineering profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const site = await getSiteIdentity();
  if (site === "business")
    return createSocialImage({
      label: "MCP integrations · MCP Apps · controlled access",
      title: "Applification",
      description: "Your systems and data, usable through AI assistants.",
    });
  return createSocialImage({
    label: `${contractPositioning.stack} · ${contractPositioning.location}`,
    title: "Dave Hudson",
    description: contractPositioning.role,
  });
}
