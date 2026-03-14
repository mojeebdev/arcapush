import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StartupTier } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req: Request) {
  try {
    const pin = req.headers.get("x-guardian-pin");
    const isAdmin = pin === process.env.ADMIN_PIN;

    const startups = await prisma.startup.findMany({
      where: isAdmin ? {} : { approved: true },
      orderBy: [
        { tier: "desc" },
        { pinnedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ startups });
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug = await generateUniqueSlug(body.name);

    const startup = await prisma.startup.create({
      data: {
        slug,
        name: body.name,
        tagline: body.tagline,
        problemStatement: body.problemStatement,
        category: body.category,
        website: body.website,
        twitter: body.twitter,
        bannerUrl: body.bannerUrl || "/default-banner.png",
        logoUrl: body.logoUrl,
        pitchDeckUrl: body.pitchDeckUrl,
        founderName: body.founderName,
        founderEmail: body.founderEmail,
        founderTwitter: body.founderTwitter,
        tier: StartupTier.FREE,
        approved: false,
      },
    });

    return NextResponse.json(startup, { status: 201 });
  } catch (error: any) {
    console.error("Startup POST error:", error);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}