import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  HiOutlineGlobeAlt,
  HiOutlineLink,
  HiOutlineShieldCheck,
  HiOutlineArrowUpRight,
  HiOutlineShare
} from "react-icons/hi2";
import { ClientDetails } from './ClientDetails';

interface PageProps {
  params: Promise<{ slug: string }>;
}


async function getStartup(slugOrId: string) {
  return prisma.startup.findFirst({
    where: {
      OR: [
        { slug: slugOrId },
        { id: slugOrId }, 
      ],
    },
    include: {
      _count: { select: { accessRequests: true } },
    },
  });
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) return { title: "Signal Lost | VibeStream" };

 
  const canonicalPath = startup.slug ?? startup.id;
  const canonicalUrl = `https://vibestream.cc/startup/${canonicalPath}`;

  return {
    title: startup.metaTitle || `${startup.name} | VibeStream Encyclopedia`,
    description: startup.metaDescription || startup.tagline,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${startup.name} — Verified on VibeStream`,
      description: startup.metaDescription || startup.tagline,
      images: [{ url: startup.bannerUrl || '/og-image.png', width: 1200, height: 630 }],
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: startup.name,
      description: startup.metaDescription || startup.tagline,
      images: [startup.bannerUrl || '/og-image.png'],
    },
  };
}


export default async function StartupDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) notFound();

  
  if (startup.slug && slug !== startup.slug) {
    redirect(`/startup/${startup.slug}`);
  }

  const canonicalPath = startup.slug ?? startup.id;
  const canonicalUrl = `https://vibestream.cc/startup/${canonicalPath}`;

  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": startup.name,
    "description": startup.metaDescription || startup.tagline,
    "applicationCategory": startup.category,
    "url": startup.website,
    "image": startup.logoUrl || startup.bannerUrl,
    "datePublished": startup.createdAt.toISOString(),
    "dateModified": startup.updatedAt.toISOString(),
    "sameAs": [
      startup.website,
      startup.twitter,
    ].filter(Boolean),
    "author": {
      "@type": "Person",
      "name": startup.founderName,
    },
    "publisher": {
      "@type": "Organization",
      "name": "VibeStream",
      "url": "https://vibestream.cc",
    },
  };

  return (
    <ClientDetails startup={startup}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4E24CF]/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-[#4E24CF]/10 text-[#4E24CF] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-[#4E24CF]/20">
                  {startup.category || "Vibe Code"}
                </span>
                {startup.tier === "PINNED" && (
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-[#D4AF37]/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    In Limelight
                  </span>
                )}
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                {startup.name}
              </h1>
              <p className="text-zinc-500 text-xl md:text-2xl font-medium max-w-2xl leading-tight">
                {startup.tagline}
              </p>
            </div>

            <div className="p-10 border border-white/5 bg-zinc-950 rounded-[3rem] text-center min-w-[200px] shadow-2xl">
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">VC Interest</p>
              <p className="text-5xl font-black text-white italic tracking-tighter">
                {startup._count.accessRequests}
              </p>
            </div>
          </div>

          {/* Banner */}
          {startup.bannerUrl && (
            <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 mb-16 shadow-2xl">
              <img
                src={startup.bannerUrl}
                alt={`${startup.name} banner`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            <div className="lg:col-span-2 space-y-12">
              <section className="p-10 border border-white/5 rounded-[3rem] bg-zinc-950/50 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <HiOutlineShieldCheck className="w-24 h-24" />
                </div>
                <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-8">The Problem Statement</h3>
                <p className="text-2xl text-zinc-300 leading-relaxed font-medium">
                  {startup.problemStatement}
                </p>

                {/* Share */}
                <div className="flex gap-6 mt-12 border-t border-white/5 pt-8">
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <HiOutlineShare /> Broadcast Signal:
                  </p>
                  <a
                    href={`https://twitter.com/intent/tweet?text=Analyzing ${encodeURIComponent(startup.name)} on @Vibestream_cc. No Marketing. Just Code.&url=${canonicalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4E24CF] hover:text-white transition-colors"
                  >
                    Share on X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${canonicalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <div className="p-8 border border-white/5 rounded-[3rem] bg-zinc-950 space-y-4">
                <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Signals</h3>
                <a href={startup.website || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#4E24CF]/50 hover:bg-[#4E24CF]/5 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Platform</span>
                  <HiOutlineGlobeAlt className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                </a>
                <a href={startup.founderTwitter || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#4E24CF]/50 hover:bg-[#4E24CF]/5 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Founder</span>
                  <HiOutlineLink className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                </a>
              </div>

              <Link
                href={`/request?startupId=${startup.id}&name=${encodeURIComponent(startup.name)}`}
                className="w-full py-6 rounded-[2rem] bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#D4AF37] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
              >
                Request Pitch Access <HiOutlineArrowUpRight className="w-4 h-4" />
              </Link>

              {/* Show slug as VIBE-ID if available, otherwise truncated id */}
              <p className="text-[9px] text-zinc-700 font-black text-center uppercase tracking-[0.5em]">
                VIBE-ID: {startup.slug ?? startup.id.slice(0, 8)}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </ClientDetails>
  );
}