

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { AdminConfig } from "@/lib/adminConfig";

const base = AdminConfig.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,               lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/registry`, lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${base}/blog`,     lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${base}/submit`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pricing`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/investors`,lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/about`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const categories = [
    "ai-tools", "saas", "dev-tools", "productivity",
    "web3", "no-code", "mobile", "analytics",
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const stacks = [
    "next-js", "react", "supabase", "planetscale",
    "vercel", "railway", "openai", "remix",
  ];
  const stackRoutes: MetadataRoute.Sitemap = stacks.map((s) => ({
    url: `${base}/stack/${s}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const startups = await prisma.startup.findMany({
      where: { approved: true },
      select: { id: true, slug: true, updatedAt: true },
    });
    productRoutes = startups.map((s) => ({
      url: `${base}/startup/${s.slug ?? s.id}`,
      lastModified: s.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    
  }

  return [...staticRoutes, ...categoryRoutes, ...stackRoutes, ...productRoutes];
}

