
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import StartupPageClient from "@/components/StartupPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: { category: string; slug: string };
}

async function getStartup(category: string, slug: string) {
  const startup = await prisma.startup.findFirst({
    where: { slug, approved: true },
  });

  if (!startup) return null;

  const expectedCat = startup.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const incomingCat = decodeURIComponent(category).toLowerCase();

  if (expectedCat !== incomingCat) return null;

  return startup;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const startup = await getStartup(params.category, params.slug);
  if (!startup) return { title: "Not found — Arcapush" };

  const base = process.env.NEXT_PUBLIC_APP_URL || "https://arcapush.com";

  const ogParams = new URLSearchParams({
    name:     startup.name,
    tagline:  startup.tagline,
    category: startup.category,
    ...(startup.logoUrl    && { logo:    startup.logoUrl }),
    ...(startup.bannerUrl  && { banner:  startup.bannerUrl }),
    ...(startup.founderName && { founder: startup.founderName }),
  });

  const ogImageUrl = `${base}/api/og/startup?${ogParams.toString()}`;
  const pageUrl    = `${base}/startup/${params.category}/${params.slug}`;

  return {
    title:       `${startup.name} — Arcapush`,
    description: startup.tagline,
    openGraph: {
      title: startup.name, description: startup.tagline,
      url: pageUrl, siteName: "Arcapush", type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${startup.name} on Arcapush` }],
    },
    twitter: {
      card: "summary_large_image",
      title: startup.name, description: startup.tagline,
      images: [ogImageUrl],
    },
    alternates: { canonical: pageUrl },
  };
}

export default async function StartupPage({ params }: Props) {
  const startup = await getStartup(params.category, params.slug);
  if (!startup) notFound();

  prisma.startup
    .update({ where: { id: startup.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return <StartupPageClient startup={startup} />;
}