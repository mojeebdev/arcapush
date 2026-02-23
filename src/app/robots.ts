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
          '/registry',
          '/startup' 
        ],
        disallow: [
          '/api/',      
          '/admin/',    
          '/verify/',
          '/request/',
          '/success' 
        ],
      },
      {
        
        userAgent: ['GPTBot', 'PerplexityBot', 'anthropic-ai', 'CCBot'],
        allow: ['/', '/docs', '/startup', '/registry'],
        disallow: ['/admin/', '/api/'],
      }
    ],
    sitemap: 'https://vibestream.cc/sitemap.xml',
  };
}