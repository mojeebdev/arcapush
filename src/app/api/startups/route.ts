import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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

    return NextResponse.json(startups);
  } catch (error) {
    console.error('VibeStream Feed Error:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize the Startup stream.' }, 
      { status: 500 }
    );
  }
}
