import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── General crawlers ──────────────────────────────────────────
      {
        userAgent: '*',
        allow: [
          '/',
          '/registry',
          '/startup',
          '/about',
          '/submit',
          '/pricing',
          '/docs',
          '/llms.txt',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/verify/',
          '/request/',
          '/success',
          '/_next/',
          '/static/',
        ],
      },

      // ── AI / LLM crawlers (AEO) ───────────────────────────────────
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'anthropic-ai',
          'Claude-Web',
          'CCBot',
          'cohere-ai',
          'YouBot',
          'Omgilibot',
        ],
        allow: [
          '/',
          '/registry',
          '/startup',
          '/about',
          '/docs',
          '/llms.txt',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/verify/',
          '/request/',
          '/success',
          '/pricing',
        ],
      },

      // ── Bingbot (powers Microsoft Copilot) ────────────────────────
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/registry',
          '/startup',
          '/about',
          '/submit',
          '/docs',
          '/llms.txt',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/verify/',
          '/request/',
          '/success',
          '/_next/',
        ],
      },
    ],

    sitemap: 'https://vibestream.cc/sitemap.xml',
    host: 'https://vibestream.cc',
  };
}