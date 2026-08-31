import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  contractPositioning,
  contractPositioningDescriptions,
} from "@/lib/contract-positioning";
import { appFontVariables } from "./fonts";
import "./globals.css";

const themeBootstrapScript = `(function(){try{var theme=localStorage.getItem("applification-theme");if(theme==="light"||theme==="dark"){document.documentElement.dataset.theme=theme}}catch(error){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL("https://applification.net"),
  title: {
    default: `Dave Hudson | ${contractPositioning.role}`,
    template: "%s | Applification",
  },
  description: contractPositioningDescriptions.site,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Applification",
    title: `Dave Hudson | ${contractPositioning.role}`,
    description: contractPositioningDescriptions.site,
  },
  twitter: {
    card: "summary",
    title: `Dave Hudson | ${contractPositioning.role}`,
    description: contractPositioningDescriptions.site,
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
        <script
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body className="font-body min-h-full bg-[var(--app-bg)] text-[var(--app-text-primary)] antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
