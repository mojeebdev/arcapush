import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        
        userAgent: '*',
        allow: [
          '/', 
          '/docs', 
          '/about', 
          '/submit', 
          '/pricing',
          '/registry'
        ],
        disallow: [
          '/api/',      
          '/admin/',    
          '/verify/',
          '/request/', 
          '/startup/'
        ],
      },
      {
        
        userAgent: ['GPTBot', 'PerplexityBot', 'anthropic-ai', 'CCBot'],
        allow: ['/', '/docs', '/startup/'],
        disallow: ['/admin/', '/api/'],
      }
    ],
    sitemap: 'https://vibestream.cc/sitemap.xml',
  };
}