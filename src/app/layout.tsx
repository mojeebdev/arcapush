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
      <body className="min-h-screen bg-black text-white selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] antialiased">
        
        <Web3Provider>
         
          <div className="fixed inset-0 z-[-1] overflow-hidden">
            
            <div 
              className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-60"
              style={{ 
                backgroundImage: "url('/hero-signal-bg.jpg')",
                backgroundColor: "black" 
              }}
            />
            
            {/* 🛡️ Simple Gradient Overlay for text protection */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Glows */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#4E24CF]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
          </div>

          {/* 🛡️ Content Layer */}
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