import { prisma } from "@/lib/prisma";

export function categoryToSlug(cat: string | null | undefined): string {
  if (!cat) return "";
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function getStartupsByCategory(categorySlug: string) {
  const all = await prisma.startup.findMany({
    where:   { approved: true },
    orderBy: [{ tier: "desc" }, { pinnedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, name: true, tagline: true,
      category: true, tier: true, logoUrl: true,
      faviconUrl: true, bannerUrl: true, ogImage: true,
      viewCount: true, scrapedAt: true, createdAt: true,
    },
  });

  const matching = all.filter((s) => {
    if (s.category == null) return false;
    return categoryToSlug(s.category) === categorySlug.toLowerCase();
  });

  if (matching.length === 0) return null;

  return {
    startups:     matching,
    realCategory: matching[0].category as string,
  };
}