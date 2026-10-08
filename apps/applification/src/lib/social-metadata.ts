import type { Metadata } from "next";

// Next.js replaces nested openGraph objects at each route. Pages with their own
// metadata must explicitly retain the fallback image from the site layout.
// Case studies use their own colocated opengraph-image files instead.
export const defaultOpenGraph = {
  type: "website",
  siteName: "Applification",
  locale: "en_GB",
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Applification and Dave Hudson’s engineering profile",
    },
  ],
} satisfies NonNullable<Metadata["openGraph"]>;

export const profileOpenGraph = {
  ...defaultOpenGraph,
  siteName: "Dave Hudson",
  images: defaultOpenGraph.images.map((image) => ({
    ...image,
    alt: "Dave Hudson — contract frontend and product engineer",
  })),
} satisfies NonNullable<Metadata["openGraph"]>;
