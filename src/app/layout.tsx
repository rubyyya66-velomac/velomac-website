import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Velomac Flow Meter | Industrial Flow Measurement",
    template: "%s"
  },
  description: site.description,
  icons: {
    icon: site.logos.favicon,
    shortcut: site.logos.favicon,
    apple: site.logos.favicon
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Velomac Flow Meter",
    description: site.description,
    url: site.url,
    images: [
      {
        url: site.logos.header,
        width: 422,
        height: 280,
        alt: site.logos.alt
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Velomac Flow Meter",
    description: site.description,
    images: [site.logos.header]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
