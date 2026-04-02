import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startups = await prisma.startup.findMany({
      where:   { founderEmail: session.user.email! },
      orderBy: { createdAt: "desc" },
      include: {
        reviews: {
          select: { id: true, rating: true },
        },
      },
    });

    const enriched = startups.map((s) => ({
      id:           s.id,
      slug:         s.slug,
      name:         s.name,
      tagline:      s.tagline,
      category:     s.category,
      logoUrl:      s.logoUrl,
      faviconUrl:   s.faviconUrl,
      website:      s.website,
      tier:         s.tier,
      approved:     s.approved,
      viewCount:    s.viewCount,
      pinnedUntil:  s.pinnedUntil,
      pinnedAt:     s.pinnedAt,
      createdAt:    s.createdAt,
      reviewCount:  s.reviews.length,
      avgRating:    s.reviews.length
        ? Math.round((s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length) * 10) / 10
        : null,
    }));

    return NextResponse.json({ startups: enriched });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}