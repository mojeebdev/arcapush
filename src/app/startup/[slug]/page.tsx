import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  HiOutlineGlobeAlt, HiOutlineLink,
  HiOutlineShieldCheck, HiOutlineArrowUpRight, HiOutlineShare,
} from "react-icons/hi2";
import { ClientDetails } from "../../../components/ClientDetails";
import { ReviewSection } from "@/components/ReviewSection";
import { AdminConfig } from "@/lib/adminConfig";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getStartup(slugOrId: string) {
  return prisma.startup.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
    include: { _count: { select: { accessRequests: true } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug }   = await params;
  const startup    = await getStartup(slug);
  if (!startup) return { title: `Not Found | ${AdminConfig.SITE_NAME}` };

  const canonicalPath = startup.slug ?? startup.id;
  const canonicalUrl  = `${AdminConfig.SITE_URL}/startup/${canonicalPath}`;

  return {
    title:       startup.metaTitle || `${startup.name} | ${AdminConfig.SITE_NAME}`,
    description: startup.metaDescription || startup.tagline,
    alternates:  { canonical: canonicalUrl },
    openGraph: {
      title:       `${startup.name} — Listed on ${AdminConfig.SITE_NAME}`,
      description: startup.metaDescription || startup.tagline,
      images:      [{ url: startup.bannerUrl || AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630 }],
      url:         canonicalUrl,
      type:        "website",
    },
    twitter: {
      card:        "summary_large_image",
      site:        AdminConfig.BRAND_TWITTER,
      title:       startup.name,
      description: startup.metaDescription || startup.tagline,
      images:      [startup.bannerUrl || AdminConfig.SITE_OG_IMAGE],
    },
  };
}

export default async function StartupDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const startup  = await getStartup(slug);

  if (!startup) notFound();
  if (startup.slug && slug !== startup.slug) redirect(`/startup/${startup.slug}`);

  const canonicalPath = startup.slug ?? startup.id;
  const canonicalUrl  = `${AdminConfig.SITE_URL}/startup/${canonicalPath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "SoftwareApplication",
    name:        startup.name,
    description: startup.metaDescription || startup.tagline,
    applicationCategory: startup.category,
    url:         startup.website,
    image:       startup.logoUrl || startup.bannerUrl,
    datePublished: startup.createdAt.toISOString(),
    dateModified:  startup.updatedAt.toISOString(),
    sameAs:      [startup.website, startup.twitter].filter(Boolean),
    author:      { "@type": "Person", name: startup.founderName },
    publisher:   { "@type": "Organization", name: AdminConfig.SITE_NAME, url: AdminConfig.SITE_URL },
  };

  return (
    <ClientDetails startup={startup}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className="min-h-screen pt-32 pb-20 px-6 relative z-10"
        style={{ color: "var(--text-primary)" }}
      >
        <div className="max-w-6xl mx-auto relative">

          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "rgba(91,43,255,0.03)", filter: "blur(120px)" }}
          />

          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest"
                  style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)" }}
                >
                  {startup.category || "Vibe Code"}
                </span>
                {startup.tier === "PINNED" && (
                  <span
                    className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2"
                    style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
                    Boosted
                  </span>
                )}
              </div>

              <h1
                className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]"
                style={{ color: "var(--text-primary)" }}
              >
                {startup.name}
              </h1>
              <p
                className="text-xl md:text-2xl font-medium max-w-2xl leading-tight"
                style={{ color: "var(--text-secondary)" }}
              >
                {startup.tagline}
              </p>
            </div>

            <div
              className="p-10 rounded-[3rem] text-center min-w-[200px] shadow-sm"
              style={{ border: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
            >
              <p className="ap-label mb-2">VC Interest</p>
              <p className="text-5xl font-black italic tracking-tighter" style={{ color: "var(--text-primary)" }}>
                {startup._count.accessRequests}
              </p>
            </div>
          </div>

          {startup.bannerUrl && (
            <div
              className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 shadow-sm"
              style={{ border: "1px solid var(--border)" }}
            >
              <img
                src={startup.bannerUrl}
                alt={`${startup.name} banner`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">

            <div className="lg:col-span-2 space-y-12">
              <section
                className="p-10 rounded-[3rem] relative overflow-hidden"
                style={{ border: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <HiOutlineShieldCheck className="w-24 h-24" />
                </div>
                <p className="ap-label mb-8">The Problem Statement</p>
                <p className="text-2xl leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
                  {startup.problemStatement}
                </p>

                <div className="flex gap-6 mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="ap-label flex items-center gap-2">
                    <HiOutlineShare /> Share:
                  </p>
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(startup.name)} on @arcapush%0A${canonicalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ap-link ap-label hover-accent"
                  >
                    X / Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${canonicalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ap-link ap-label hover-accent"
                  >
                    LinkedIn
                  </a>
                </div>
              </section>

              <ReviewSection startupId={startup.id} startupName={startup.name} />
            </div>

            <aside className="space-y-8">
              <div
                className="p-8 rounded-[3rem] space-y-4"
                style={{ border: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
              >
                <p className="ap-label mb-6">Links</p>
                {[
                  { href: startup.website       || "#", label: "Platform", Icon: HiOutlineGlobeAlt },
                  { href: startup.founderTwitter || "#", label: "Founder",  Icon: HiOutlineLink    },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 rounded-2xl transition-all group"
                    style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)" }}
                  >
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                      {label}
                    </span>
                    <Icon className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                  </a>
                ))}
              </div>

              <Link
                href={`/request?startupId=${startup.id}&name=${encodeURIComponent(startup.name)}`}
                className="ap-btn-primary w-full flex items-center justify-center gap-2"
              >
                Request Pitch Access <HiOutlineArrowUpRight className="w-4 h-4" />
              </Link>

              <p className="ap-label text-center">
                ID: {startup.slug ?? startup.id.slice(0, 8)}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </ClientDetails>
  );
}