import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://applification.net"),
  title: {
    default: "Applification | Dave Hudson",
    template: "%s | Applification",
  },
  description:
    "Dave Hudson builds user-facing AI products, agent workflows and TypeScript applications through Applification Ltd.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <div className="site-frame">
          <div className="availability-strip">
            Available for remote UK contract work
          </div>
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
