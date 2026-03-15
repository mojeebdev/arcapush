import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 }, 
    });
    const html = await res.text();

    const getMeta = (property: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, "i"));
      return match?.[1] ?? null;
    };

    const getMetaName = (name: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, "i"));
      return match?.[1] ?? null;
    };

    const origin = new URL(url).origin;

    const image =
      getMeta("og:image") ||
      `https://www.google.com/s2/favicons?domain=${origin}&sz=128`;

    const description =
      getMeta("og:description") ||
      getMetaName("description") ||
      null;

    return NextResponse.json({ image, description });
  } catch {
    return NextResponse.json({ image: null, description: null });
  }
}