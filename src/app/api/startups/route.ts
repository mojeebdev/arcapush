import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StartupTier } from "@prisma/client";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = req.headers.get('x-guardian-pin');
    const isAdmin = pin === process.env.ADMIN_PIN;

    
    const startups = await prisma.startup.findMany({
      where: isAdmin ? {} : { approved: true }, 
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ startups });
  } catch (error: any) {
    return NextResponse.json({ error: "Signal Failure" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const startup = await prisma.startup.create({
      data: {
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
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Transmission Interrupted", details: error.message },
      { status: 500 }
    );
  }
}