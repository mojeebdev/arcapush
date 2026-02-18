import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import { Providers } from "./providers"; 
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"; 
import { SpeedInsights } from "@vercel/speed-insights/next"; 
import "./globals.css";

export const metadata: Metadata = {
  title: `${AdminConfig.SITE_NAME} — ${AdminConfig.SITE_TAGLINE}`,
  description: AdminConfig.SITE_DESCRIPTION,
  metadataBase: new URL('https://vibestream.cc'),
  
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title: `${AdminConfig.SITE_NAME} — ${AdminConfig.SITE_TAGLINE}`,
    description: AdminConfig.SITE_DESCRIPTION,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ 
      url: '/wordmark.png',
      width: 1200,
      height: 630,
      alt: `${AdminConfig.SITE_NAME} Wordmark`,
    }], 
  },

  twitter: {
    card: "summary_large_image",
    title: AdminConfig.SITE_NAME,
    description: AdminConfig.SITE_TAGLINE,
    images: ['/wordmark.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {/* बॉडी में गोल्डन सिलेक्शन: selection:bg-[#D4AF37]/30 */}
      <body className="min-h-screen bg-black text-white selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] overflow-x-hidden antialiased">
        <Providers>
          {/* 🌌 1. Ambient Royal Depth */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Core #4E24CF Glow */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[#4E24CF]/10 rounded-full blur-[140px] opacity-70" />
            
            {/* Subtle Gold Accent Glow in the corner */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
          </div>

          {/* 🛡️ 2. Main Layout Container */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>

            {/* VibeStream Global Footer */}
            <Footer />
          </div>

          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}