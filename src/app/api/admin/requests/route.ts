import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    const startups = await prisma.accessRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Admin Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startup data' },
      { status: 500 }
    );
  }
}