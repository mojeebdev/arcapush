import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StartupTier } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    const startup = await prisma.startup.create({
      data: {
        name: body.name,
        tagline: body.tagline || "A new vibe in the ecosystem", 
        problemStatement: body.problemStatement || "Problem statement pending...", 
        bannerUrl: body.bannerUrl || "/default-banner.png", 
        category: body.category || "DeFi",
        website: body.website,
        founderName: body.founderName,
        founderEmail: body.founderEmail,
        founderLinkedIn: body.founderLinkedIn,
        pitchDeckUrl: body.pitchDeckUrl,
        
        
        tier: StartupTier.FREE, 
        
        
        founder: {
          connect: { id: body.founderId } 
        }
      },
    });

    return NextResponse.json(startup);
  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to process food item", details: error.message }, 
      { status: 500 }
    );
  }
}