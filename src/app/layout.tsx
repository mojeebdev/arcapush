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

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vibestream",
    "alternateName": ["VibeStream", "Vibestream.cc"],
    "url": "https://vibestream.cc",
    "logo": "https://vibestream.cc/logo.png",
    "description": "Vibestream is the definitive encyclopedia and discovery platform for Vibe Coders who secure VC backing.",
    "foundingDate": "2026",
    "founder": {
      "@type": "Person",
      "name": "Mojeeb",
      "url": "https://mojeeb.xyz",
      "sameAs": ["https://twitter.com/mojeebeth", "https://mojeeb.xyz"]
    },
    "sameAs": ["https://twitter.com/vibestreamcc", "https://vibestream.cc"],
    "knowsAbout": ["Vibe Coding", "AI startups", "Venture Capital", "Startup Products", "No-code development", "AI-powered app builders"]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vibestream",
    "url": "https://vibestream.cc",
    "description": "The global encyclopedia for VC-backed Vibe Coders and AI startup products. Where the next unicorn gets discovered.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://vibestream.cc/registry?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "Vibestream Registry",
    "description": "A comprehensive, living encyclopedia of vibe coding tools, VC-backed startup products, funding rounds, and the founders behind them.",
    "url": "https://vibestream.cc/registry",
    "publisher": {
      "@type": "Organization",
      "name": "Vibestream",
      "url": "https://vibestream.cc"
    },
    "about": [
      { "@type": "Thing", "name": "Vibe Coding" },
      { "@type": "Thing", "name": "AI Startups" },
      { "@type": "Thing", "name": "Venture Capital" },
      { "@type": "Thing", "name": "No-Code Tools" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Vibestream?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vibestream (vibestream.cc) is the definitive encyclopedia and discovery platform for Vibe Coders who secure VC backing."
        }
      },
      {
        "@type": "Question",
        "name": "Who founded Vibestream?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vibestream was founded by Mojeeb, a builder and vibe coder. Learn more at mojeeb.xyz or follow @mojeebeth on X."
        }
      },
      {
        "@type": "Question",
        "name": "What is vibe coding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vibe coding is a software development approach where builders use AI tools like Cursor, Lovable, Replit, and Bolt to create apps through natural language prompts — coined by Andrej Karpathy in February 2025."
        }
      },
      {
        "@type": "Question",
        "name": "Which vibe coding startups have received VC funding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vibestream tracks all VC-backed vibe coding startups including Lovable, Cursor/Anysphere, Replit, and many others. See vibestream.cc/registry for the full list."
        }
      },
      {
        "@type": "Question",
        "name": "How is Vibestream different from Product Hunt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vibestream is exclusively focused on the vibe coding and AI-native startup space, bridging the gap between Vibe Coders and top VCs."
        }
      },
      {
        "@type": "Question",
        "name": "How can I get my vibe coding startup listed on Vibestream?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Founders can submit their product for free at vibestream.cc/submit. Premium visibility is available at vibestream.cc/pricing."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mojeeb",
    "url": "https://mojeeb.xyz",
    "sameAs": ["https://twitter.com/mojeebeth", "https://mojeeb.xyz"],
    "jobTitle": "Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "Vibestream",
      "url": "https://vibestream.cc"
    }
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="971aabbd-b44f-4acf-9f43-f4f3ad7fac64" />
      </head>
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