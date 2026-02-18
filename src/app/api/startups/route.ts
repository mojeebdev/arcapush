import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();

    const startups = await prisma.startup.findMany({
      orderBy: [
        {
          
          pinnedAt: { sort: 'desc', nulls: 'last' } 
        },
        { 
          
          createdAt: 'desc' 
        }
      ],
      include: {
        _count: {
          select: { accessRequests: true }
        }
      }
    });

    
    const synchronizedStream = startups.map(startup => ({
      ...startup,
      isCurrentlyPinned: startup.pinnedUntil ? new Date(startup.pinnedUntil) > now : false
    }));

    return NextResponse.json(synchronizedStream);
  } catch (error) {
    console.error('VibeStream Feed Error:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize the Startup stream.' }, 
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    
    const newStartup = await prisma.startup.create({
      data: {
        name: body.name,
        tagline: body.tagline,
        problemStatement: body.problemStatement,
        bannerUrl: body.bannerUrl,
        logoUrl: body.logoUrl,
        category: body.category,
        website: body.website,
        twitter: body.twitter,
        founderName: body.founderName,
        founderEmail: body.founderEmail,
        founderLinkedIn: body.founderLinkedIn,
        pitchDeckUrl: body.pitchDeckUrl,
        tier: "Standard", 
      },
    });

    return NextResponse.json(newStartup, { status: 201 });
  } catch (error: any) {
    console.error("Induction Error:", error);
    return NextResponse.json({ error: "Failed to index Vibe Code." }, { status: 500 });
  }
}