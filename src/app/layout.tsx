import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import { AdminConfig } from "@/lib/adminConfig";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Web3Provider } from "@/components/Web3Provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${AdminConfig.SITE_NAME} · ${AdminConfig.SITE_TAGLINE}`,
  description: AdminConfig.SITE_DESCRIPTION,
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: AdminConfig.SITE_URL },
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/arcapush_logo.png",
    shortcut: "/arcapush_logo.png",
    apple: "/arcapush_logo.png",
  },
  openGraph: {
    title: `${AdminConfig.SITE_NAME} · ${AdminConfig.SITE_TAGLINE}`,
    description: AdminConfig.SITE_DESCRIPTION,
    siteName: AdminConfig.SITE_NAME,
    url: AdminConfig.SITE_URL,
    type: "website",
    locale: "en_US",
    images: [{ url: AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630, alt: `${AdminConfig.SITE_NAME} — ${AdminConfig.SITE_TAGLINE}` }],
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
    "@id": `${AdminConfig.SITE_URL}/#organization`,
    name: "Arcapush",
    alternateName: ["arcapush", "Arca Push"],
    url: AdminConfig.SITE_URL,
    logo: `${AdminConfig.SITE_URL}/arcapush_logo.png`,
    description: "Arcapush is the home of vibe-coded products. Solo founders list once. Google indexes it. VCs discover it.",
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      name: "Mojeeb",
      url: "https://mojeeb.xyz",
      sameAs: ["https://twitter.com/mojeebeth", "https://mojeeb.xyz"],
    },
    sameAs: [
      `https://twitter.com/${AdminConfig.BRAND_TWITTER.replace("@", "")}`,
      AdminConfig.SITE_URL,
    ].filter(Boolean),
    knowsAbout: ["Vibe Coding", "AI Startups", "Venture Capital", "Solo Founders", "Product Discovery", "No-code development", "AI-powered app builders"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${AdminConfig.SITE_URL}/#website`,
    name: "Arcapush",
    url: AdminConfig.SITE_URL,
    description: AdminConfig.SITE_DESCRIPTION,
    publisher: { "@id": `${AdminConfig.SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${AdminConfig.SITE_URL}/registry?search={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Arcapush",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: AdminConfig.SITE_URL,
    description: "Discovery and visibility platform for vibe-coded products. List once, get indexed, get found by VCs.",
    offers: [
      { "@type": "Offer", price: "0",  priceCurrency: "USD", name: "Free — Permanent indexed listing" },
      { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Featured — Homepage placement + VC discovery panel" },
      { "@type": "Offer", price: "99", priceCurrency: "USD", name: "Pro — Unlimited listings + investor intros" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "Arcapush Registry",
    description: "A curated, living registry of vibe-coded products built by solo founders.",
    url: `${AdminConfig.SITE_URL}/registry`,
    publisher: { "@type": "Organization", name: "Arcapush", url: AdminConfig.SITE_URL },
    about: [
      { "@type": "Thing", name: "Vibe Coding"     },
      { "@type": "Thing", name: "AI Startups"     },
      { "@type": "Thing", name: "Venture Capital" },
      { "@type": "Thing", name: "Solo Founders"   },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is Arcapush?",           acceptedAnswer: { "@type": "Answer", text: "Arcapush is the home of vibe-coded products. Solo founders submit their product once — Arcapush creates an indexed page, adds structured data, and pushes it into the feed of VCs actively looking for early-stage products." } },
      { "@type": "Question", name: "Who founded Arcapush?",       acceptedAnswer: { "@type": "Answer", text: "Arcapush was founded by Mojeeb, a Web3 strategist and vibe coder. Learn more at mojeeb.xyz or follow @mojeebeth on X." } },
      { "@type": "Question", name: "What is vibe coding?",        acceptedAnswer: { "@type": "Answer", text: "Vibe coding is a software development approach where builders use AI tools like Cursor, Lovable, Replit, and Bolt to create apps through natural language prompts — coined by Andrej Karpathy in February 2025." } },
      { "@type": "Question", name: "How is Arcapush different from Product Hunt?", acceptedAnswer: { "@type": "Answer", text: "Arcapush is exclusively focused on vibe-coded products. Every listing requires a problem statement — not just marketing copy. This gives VCs investor-grade signal, not noise." } },
      { "@type": "Question", name: "How do I list my product on Arcapush?", acceptedAnswer: { "@type": "Answer", text: `Founders can list their product for free at ${AdminConfig.SITE_URL}/submit.` } },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mojeeb",
    url: "https://mojeeb.xyz",
    sameAs: ["https://twitter.com/mojeebeth", "https://mojeeb.xyz"],
    jobTitle: "Founder",
    worksFor: { "@type": "Organization", name: "Arcapush", url: AdminConfig.SITE_URL },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ── Removed "dark" class — site is now off-white light theme ──
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="971aabbd-b44f-4acf-9f43-f4f3ad7fac64"
        />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{ background: "var(--bg)", color: "var(--text-primary)" }}
      >
        <SessionProvider>
          <Web3Provider>

            {/* ── Atmospheric background — purple blobs on off-white ── */}
            <div
              className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"
              style={{ background: "var(--bg)" }}
            >
              <div
                className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
                style={{ background: "rgba(91,43,255,0.04)", filter: "blur(140px)" }}
              />
              <div
                className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full"
                style={{ background: "rgba(91,43,255,0.025)", filter: "blur(120px)" }}
              />
            </div>

            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-20">{children}</main>
              <Footer />
            </div>

          </Web3Provider>
        </SessionProvider>

        <Analytics />
        <SpeedInsights />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background:    "var(--bg)",
              color:         "var(--text-primary)",
              border:        "1px solid var(--border)",
              fontFamily:    "var(--font-mono)",
              fontSize:      "0.72rem",
              letterSpacing: "0.04em",
              boxShadow:     "0 4px 24px rgba(10,10,15,0.08)",
            },
          }}
        />
      </body>
    </html>
  );
}