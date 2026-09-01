export const portfolioProductSlugs = [
  "contexture",
  "storyloops",
  "voiced",
  "plantry",
] as const;

export type PortfolioProductSlug = (typeof portfolioProductSlugs)[number];

export const portfolioProducts = [
  {
    accent: "#cba6f7",
    description: "Turn one domain model into contracts your code can share.",
    href: "/products/contexture",
    name: "Contexture",
    slug: "contexture",
    status: "LIVE",
  },
  {
    accent: "#7dd3fc",
    description: "Keep product scope visible to coding agents and people.",
    href: "/products/storyloops",
    name: "StoryLoops",
    slug: "storyloops",
    status: "IN DEVELOPMENT",
  },
  {
    accent: "#8fe3a8",
    description: "Speak into the text field you are already using.",
    href: "/products/voiced",
    name: "Voiced",
    slug: "voiced",
    status: "LIVE",
  },
  {
    accent: "#e8c66a",
    description: "Plan a few meals around the household and what needs using.",
    href: "/products/plantry",
    name: "Plantry",
    slug: "plantry",
    status: "R&D",
  },
] as const;

export function getPortfolioProduct(slug: PortfolioProductSlug) {
  return portfolioProducts.find((product) => product.slug === slug);
}
