
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
  metadataBase: new URL('https://vibestream.cc'),
  
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title: `${AdminConfig.SITE_NAME} · ${AdminConfig.SITE_TAGLINE}`,
    description: AdminConfig.SITE_DESCRIPTION,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ 
      url: '/og-vibestream.png',
      width: 1200,
      height: 630,
      alt: `${AdminConfig.SITE_NAME} Official Open Graph Image`,
    }], 
  },

  twitter: {
    card: "summary_large_image",
    title: AdminConfig.SITE_NAME,
    description: AdminConfig.SITE_TAGLINE,
    images: ['/og-vibestream.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] overflow-x-hidden antialiased">
        
       
        <Web3Provider>
          {/* 🌌 Background Ambience (Purple/Gold Guardian Theme) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Top Purple Glow */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[#4E24CF]/10 rounded-full blur-[140px] opacity-70" />
            {/* Bottom Gold Glow */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
          </div>

          {/* 🛡️ Main Layout Container */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow pt-20">
              {children}
            </main>

            <Footer />
          </div>
        </Web3Provider>

        {/* Vercel Monitoring */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}