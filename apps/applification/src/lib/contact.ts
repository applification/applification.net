import { portfolioProductSlugs, type PortfolioProductSlug } from "./portfolio";
import type { SiteIdentity } from "./site-identity";

export const contactRoutes = ["contract", "product", "general"] as const;
export const contactProducts = portfolioProductSlugs;

export type ContactRoute = (typeof contactRoutes)[number];
export type ContactProduct = PortfolioProductSlug;

export function contactSite(route: ContactRoute): SiteIdentity {
  return route === "contract" ? "profile" : "business";
}

export function contactRoutesForSite(site?: SiteIdentity): readonly ContactRoute[] {
  return site ? contactRoutes.filter(route => contactSite(route) === site) : contactRoutes;
}

export function parseContactRoute(value: unknown): ContactRoute | null {
  return typeof value === "string" && contactRoutes.includes(value as ContactRoute)
    ? (value as ContactRoute)
    : null;
}

export function parseContactProduct(value: unknown): ContactProduct | null {
  return typeof value === "string" && contactProducts.includes(value as ContactProduct)
    ? (value as ContactProduct)
    : null;
}

export function buildContactHref({
  product,
  route = "contract",
}: {
  product?: string;
  route?: ContactRoute;
} = {}) {
  const search = new URLSearchParams({ route });

  if (product) {
    search.set("product", product);
  }

  return `/contact?${search.toString()}`;
}

export function isContactWorkflowAvailable() {
  const configured = process.env.CONTACT_WORKFLOW_ENABLED;

  if (configured === "true") {
    return true;
  }

  if (configured === "false") {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}
