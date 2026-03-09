import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibestream.cc';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/registry`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  
  let startupEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  try {
    const startups = await prisma.startup.findMany({
      where: { approved: true },
      select: { id: true, slug: true, category: true, pinnedAt: true, updatedAt: true },
    });

    startupEntries = startups.map((startup) => ({
      url: `${baseUrl}/startup/${startup.slug ?? startup.id}`,
      lastModified: startup.updatedAt,
      changeFrequency: 'daily',
      priority: startup.pinnedAt ? 0.95 : 0.85,
    }));

    const categories = [...new Set(startups.map((s) => s.category).filter(Boolean))];
    categoryEntries = categories.map((category) => ({
      url: `${baseUrl}/registry?category=${encodeURIComponent(category!.toLowerCase())}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Sitemap: failed to fetch startups', e);
  }

  
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = getAllPosts();
    blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly',
      priority: post.featured ? 0.9 : 0.8,
    }));
  } catch (e) {
    console.error('Sitemap: failed to fetch blog posts', e);
  }

  return [...staticRoutes, ...blogEntries, ...startupEntries, ...categoryEntries];
}