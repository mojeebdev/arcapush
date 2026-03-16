import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { AdminConfig } from "@/lib/adminConfig";

const base = AdminConfig.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/registry`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/how-arcapush-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/What-is-vibe-coding`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  
  const externalProducts: MetadataRoute.Sitemap = [
    { url: "https://promptrank.arcapush.com", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://arcaprompt.arcapush.com", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  
  let startupRoutes: MetadataRoute.Sitemap = [];
  try {
    const startups = await prisma.startup.findMany({
      where: { approved: true },
      select: { id: true, slug: true, updatedAt: true },
    });

    startupRoutes = startups.map((s) => ({
      url: `${base}/startup/${s.slug ?? s.id}`,
      lastModified: s.updatedAt ?? new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap Startup fetch failed:", error);
  }

  
  const blogDirectory = path.join(process.cwd(), "content/blog");
  let blogRoutes: MetadataRoute.Sitemap = [];

  if (fs.existsSync(blogDirectory)) {
    try {
      const files = fs.readdirSync(blogDirectory);
      blogRoutes = files
        .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
        .map((file) => {
          const slug = file.replace(/\.mdx?$/, "");
          const stats = fs.statSync(path.join(blogDirectory, file));
          return {
            url: `${base}/blog/${slug}`,
            lastModified: stats.mtime,
            changeFrequency: "hourly",
            priority: 0.9,
          };
        });
    } catch (error) {
      console.error("Sitemap Blog file reading failed:", error);
    }
  }

  return [...staticRoutes, ...externalProducts, ...startupRoutes, ...blogRoutes];
}