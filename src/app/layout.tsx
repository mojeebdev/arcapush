import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import { Providers } from "./providers"; 
import { Footer } from "@/components/Footer";
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
      <body className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden antialiased">
        <Providers>
          {/* 1. Ambient Background (Guardian Aesthetic) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
          </div>

          {/* 2. Main Layout Container */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>

            {/* VibeStream Global Footer */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}