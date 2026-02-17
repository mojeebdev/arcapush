import { MetadataRoute } from 'next';


export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',      
        '/admin/',    
        '/verify/',   
      ],
    },
    sitemap: 'https://vibestream.cc/sitemap.xml',
  };
}