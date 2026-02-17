import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requesterName, requesterEmail, requesterFirm, startupId } = body;

    // 🛡️ Guardian Safety: Prevent empty submissions
    if (!requesterEmail || !requesterName || !startupId) {
      return NextResponse.json({ error: 'Missing identity signals' }, { status: 400 });
    }

    const newRequest = await prisma.accessRequest.create({
      data: {
        requesterName,
        requesterEmail,
        requesterFirm,
        startupId, 
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, data: newRequest });
  } catch (error) {
    console.error("Submission Crash:", error);
    return NextResponse.json({ error: 'Transmission failed' }, { status: 500 });
  }
}