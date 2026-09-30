export const portfolioProductSlugs = [
  "contexture",
  "astack",
  "storyloops",
  "voiced",
  "loami",
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
    description: "Give Codex an outcome, guardrails and a verification loop.",
    href: "/products/astack",
    name: "astack",
    slug: "astack",
    status: "IN DEVELOPMENT",
  },
  {
    accent: "#7dd3fc",
    description: "An archived story-mapping experiment. Its lessons shaped astack.",
    href: "/products/storyloops",
    name: "StoryLoops",
    slug: "storyloops",
    status: "ARCHIVED",
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
    accent: "#e3bb35",
    description: "A household assistant that knows your tastes and works with your agents.",
    href: "/products/loami",
    name: "Loami",
    slug: "loami",
    status: "IN DEVELOPMENT",
  },
  {
    accent: "#e8c66a",
    description: "An archived household meal-planning experiment. Its work continues in Loami.",
    href: "/products/plantry",
    name: "Plantry",
    slug: "plantry",
    status: "ARCHIVED",
  },
] as const;

export function getPortfolioProduct(slug: PortfolioProductSlug) {
  return portfolioProducts.find((product) => product.slug === slug);
}
