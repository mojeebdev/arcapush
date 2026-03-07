import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Web3Provider } from "@/components/Web3Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: `${AdminConfig.SITE_NAME} · ${AdminConfig.SITE_TAGLINE}`,
  description: AdminConfig.SITE_DESCRIPTION,
  metadataBase: new URL(AdminConfig.SITE_URL),

  // ── SEO ───────────────────────────────────────────────────────────
  alternates: {
    canonical: AdminConfig.SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  
  openGraph: {
    title: `${AdminConfig.SITE_NAME} · ${AdminConfig.SITE_TAGLINE}`,
    description: AdminConfig.SITE_DESCRIPTION,
    siteName: AdminConfig.SITE_NAME,
    url: AdminConfig.SITE_URL,
    type: "website",
    images: [{
      url: AdminConfig.SITE_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: `${AdminConfig.SITE_NAME} — ${AdminConfig.SITE_TAGLINE}`,
    }],
  },

 
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,     
    creator: AdminConfig.FOUNDER_TWITTER, 
    title: `${AdminConfig.SITE_NAME} · ${AdminConfig.SITE_TAGLINE}`,
    description: AdminConfig.SITE_DESCRIPTION,
    images: [AdminConfig.SITE_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] antialiased">

        <Web3Provider>
          {/* Atmospheric Glow Layer */}
          <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#4E24CF]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
          </div>

          {/* Content Layer */}
          <div className="relative flex flex-col min-h-screen bg-transparent">
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </Web3Provider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}