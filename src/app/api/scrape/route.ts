import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function extractMeta(html: string, property: string): string | null {

  const ogMatch = html.match(
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    )
  );
  if (ogMatch) return ogMatch[1].trim();

  const nameMatch = html.match(
    new RegExp(
      `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    )
  );
  if (nameMatch) return nameMatch[1].trim();

  
  const ogRev = html.match(
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i"
    )
  );
  if (ogRev) return ogRev[1].trim();

  const nameRev = html.match(
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`,
      "i"
    )
  );
  if (nameRev) return nameRev[1].trim();

  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractFavicon(html: string, baseUrl: string): string | null {
  
  const patterns = [
    /rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i,
    /rel=["']shortcut icon["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']shortcut icon["']/i,
    /rel=["']icon["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']icon["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const href = match[1].trim();
      if (href.startsWith("http")) return href;
      if (href.startsWith("//")) return `https:${href}`;
      if (href.startsWith("/")) return `${baseUrl}${href}`;
      return `${baseUrl}/${href}`;
    }
  }

  
  return `${baseUrl}/favicon.ico`;
}

function resolveUrl(url: string, baseUrl: string): string {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  return `${baseUrl}/${url}`;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // normalise URL
    const normalised = url.startsWith("http") ? url : `https://${url}`;
    const parsedUrl = new URL(normalised);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(normalised, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Arcapush-Bot/1.0; +https://arcapush.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 422 }
      );
    }

    const html = await response.text();

    // extract metadata
    const ogTitle = extractMeta(html, "og:title");
    const ogDescription =
      extractMeta(html, "og:description") ||
      extractMeta(html, "description");
    const ogImage = extractMeta(html, "og:image");
    const twitterImage = extractMeta(html, "twitter:image");
    const pageTitle = extractTitle(html);
    const favicon = extractFavicon(html, baseUrl);

    // resolve relative image URLs
    const resolvedOgImage = ogImage
      ? resolveUrl(ogImage, baseUrl)
      : twitterImage
      ? resolveUrl(twitterImage, baseUrl)
      : null;

    const result = {
      name: ogTitle || pageTitle || "",
      tagline: ogDescription ? ogDescription.slice(0, 160) : "",
      bannerUrl: resolvedOgImage || "",
      logoUrl: favicon || "",
      ogImage: resolvedOgImage || "",
      faviconUrl: favicon || "",
      scrapedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. The site took too long to respond." },
        { status: 408 }
      );
    }

    if (error instanceof TypeError && error.message.includes("Invalid URL")) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    console.error("[scrape]", error);
    return NextResponse.json(
      { error: "Failed to scrape URL" },
      { status: 500 }
    );
  }
}