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
          
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
            
            
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 brightness-[0.6] contrast-125"
              style={{ backgroundImage: "url('/hero-signal-bg.jpg')" }}
            />

            
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90" />

            
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#4E24CF]/15 rounded-full blur-[150px] opacity-80" />
            
            
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[130px]" />
          </div>

          
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