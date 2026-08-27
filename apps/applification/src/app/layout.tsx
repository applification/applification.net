import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { appFontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://applification.net"),
  title: {
    default: "Dave Hudson | Contract AI Product Engineer",
    template: "%s | Applification",
  },
  description:
    "Dave Hudson helps teams turn early ideas into production software with React and TypeScript, using AI workflows with clear scope, tests and human approval.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Applification",
    title: "Dave Hudson | Contract AI Product Engineer",
    description:
      "Production software and AI workflows built with React and TypeScript, clear scope, tests and human approval.",
  },
  twitter: {
    card: "summary",
    title: "Dave Hudson | Contract AI Product Engineer",
    description:
      "Production software and AI workflows built with React and TypeScript, clear scope, tests and human approval.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${appFontVariables} h-full`}
    >
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
