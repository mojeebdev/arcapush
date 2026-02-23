import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibestream.cc';

  
  const startups = await prisma.startup.findMany({
    where: {
      approved: true,
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const startupEntries = startups.map((startup) => ({
    url: `${baseUrl}/startup/${startup.id}`,
    lastModified: startup.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8, 
  }));

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1.0, 
    },
    {
      url: `${baseUrl}/registry`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0, 
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return [
    ...staticRoutes,
    ...startupEntries,
  ];
}