// ============================================================
// FILE PATH: src/app/registry/page.tsx
// ORIGINAL — dark theme (black background)
// ============================================================

import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import { RegistrySearchHandler } from "./RegistrySearchHandler";

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Verified Signals — Startup Registry | VibeStream Encyclopedia',
  description: 'Browse every VC-backed vibe coding startup verified by VibeStream. The definitive encyclopedia of AI-native startup products — curated, indexed, and discoverable.',
  alternates: {
    canonical: 'https://vibestream.cc/registry',
  },
  openGraph: {
    title: 'Verified Signals — VibeStream Startup Registry',
    description: 'The definitive encyclopedia of VC-backed vibe coding startups. Curated, verified, and indexed.',
    url: 'https://vibestream.cc/registry',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified Signals — VibeStream Registry',
    description: 'Every VC-backed vibe coding startup, verified and indexed.',
    images: ['/og-image.png'],
  },
};

function RegistryJsonLd({ count }: { count: number }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "VibeStream Startup Registry",
    "description": "The definitive encyclopedia of VC-backed vibe coding startups. Every approved startup, verified and indexed.",
    "url": "https://vibestream.cc/registry",
    "numberOfItems": count,
    "publisher": {
      "@type": "Organization",
      "name": "VibeStream",
      "url": "https://vibestream.cc",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function RegistryPage() {
  const startups = await prisma.startup.findMany({
    where: { approved: true },
    orderBy: [
      { tier: 'desc' },
      { pinnedAt: 'desc' },
      { createdAt: 'desc' },
    ],
    select: {
      id: true,
      slug: true,
      name: true,
      tagline: true,
      category: true,
      tier: true,
      logoUrl: true,
    },
  });

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6">
      <RegistryJsonLd count={startups.length} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">Encyclopedia</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-2">
            Verified <span className="text-[#4E24CF]">Signals.</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-3">
            {startups.length} Vibe Code{startups.length !== 1 ? 's' : ''} Indexed
          </p>
        </div>

        <Suspense fallback={
          <div className="text-zinc-500 font-black text-[10px] uppercase animate-pulse">
            Scanning Frequencies...
          </div>
        }>
          <RegistrySearchHandler initialStartups={startups} />
        </Suspense>
      </div>
    </main>
  );
}