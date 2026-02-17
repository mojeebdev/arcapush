import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibestream.cc';

  
  const startups = await prisma.startup.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  
  const startupEntries = startups.map((startup) => ({
    url: `${baseUrl}/startup/${startup.id}`,
    lastModified: startup.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    ...startupEntries,
  ];
}