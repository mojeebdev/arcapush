import { MetadataRoute } from "next";
import { AdminConfig } from "@/lib/adminConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/studio/"],
      },
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "GoogleOther",   allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "CCBot",         allow: "/" },
      { userAgent: "anthropic-ai",  allow: "/" },
      { userAgent: "cohere-ai",     allow: "/" },
    ],
    sitemap: `${AdminConfig.SITE_URL}/sitemap.xml`,
    host:    AdminConfig.SITE_URL,
  };
}