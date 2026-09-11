import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  contractPositioning,
  contractPositioningDescriptions,
} from "@/lib/contract-positioning";
import { isContactWorkflowAvailable } from "@/lib/contact";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { WebMcpTools } from "@/components/webmcp-tools";
import { appFontVariables } from "./fonts";
import "./globals.css";

const themeBootstrapScript = `(function(){try{var theme=localStorage.getItem("applification-theme");if(theme==="light"||theme==="dark"){document.documentElement.dataset.theme=theme}}catch(error){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.applification.net"),
  ...(process.env.WEBMCP_ORIGIN_TRIAL_TOKEN
    ? { other: { "origin-trial": process.env.WEBMCP_ORIGIN_TRIAL_TOKEN } }
    : {}),
  title: {
    default: `Dave Hudson | ${contractPositioning.role}`,
    template: "%s | Applification",
  },
  description: contractPositioningDescriptions.site,
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
    siteName: "Applification",
    title: `Dave Hudson | ${contractPositioning.role}`,
    description: contractPositioningDescriptions.site,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        <link rel="service-doc" href="/agents" />
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
      </head>
      <body className="font-body min-h-full bg-[var(--app-bg)] text-[var(--app-text-primary)] antialiased">
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader contactAvailable={isContactWorkflowAvailable()} />
            {children}
            <SiteFooter />
          </div>
        </TooltipProvider>
        <Toaster />
        <Analytics />
        <WebMcpTools />
      </body>
    </html>
  );
}
