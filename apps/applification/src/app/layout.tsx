import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  businessDescription,
  businessUrl,
  profileDescription,
  siteOrigin,
} from "@/lib/site-identity";
import { getSiteIdentity } from "@/lib/site-identity.server";
import { isContactWorkflowAvailable } from "@/lib/contact";
import { SiteAnalytics } from "@/components/site-analytics";
import { WebMcpTools } from "@/components/webmcp-tools";
import { appFontVariables } from "./fonts";
import "./globals.css";

const themeBootstrapScript = `(function(){try{var theme=localStorage.getItem("applification-theme");if(theme==="light"||theme==="dark"){document.documentElement.dataset.theme=theme}}catch(error){}})()`;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteIdentity();
  const title =
    site === "profile"
      ? "Dave Hudson | Contract frontend & product engineer"
      : "Applification | MCP integrations & MCP Apps";
  const description =
    site === "profile" ? profileDescription : businessDescription;
  return {
    metadataBase: new URL(siteOrigin(site)),
    ...(process.env.WEBMCP_ORIGIN_TRIAL_TOKEN
      ? { other: { "origin-trial": process.env.WEBMCP_ORIGIN_TRIAL_TOKEN } }
      : {}),
    title: {
      default: title,
      template: site === "profile" ? "%s | Dave Hudson" : "%s | Applification",
    },
    description,
    icons: {
      icon: [
        {
          url: "/brand/applification-mark-light.svg",
          type: "image/svg+xml",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/brand/applification-mark-dark.svg",
          type: "image/svg+xml",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: "/",
      siteName: site === "profile" ? "Dave Hudson" : "Applification",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteIdentity();
  return (
    <html
      lang="en"
      className={`${appFontVariables} h-full`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="service-desc"
          type="application/vnd.oai.openapi+json"
          href="/api/openapi.json"
        />
        <link rel="service-doc" href={site === "profile" ? `${businessUrl}/agents` : "/agents"} />
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
      </head>
      <body className="font-body min-h-full bg-[var(--app-bg)] text-[var(--app-text-primary)] antialiased">
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded-full focus-visible:bg-[var(--app-action)] focus-visible:px-5 focus-visible:font-semibold focus-visible:text-[var(--app-text-on-action)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
          href="#main-content"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteHeader
            site={site}
            contactAvailable={isContactWorkflowAvailable()}
          />
          {children}
          <SiteFooter site={site} />
        </div>
        <SiteAnalytics />
        <WebMcpTools />
      </body>
    </html>
  );
}
