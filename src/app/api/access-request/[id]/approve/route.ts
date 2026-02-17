import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminSecret } = body;

    
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid Guardian Secret' }, { status: 401 });
    }

    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid Status Signal' }, { status: 400 });
    }

    
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Request ${status.toLowerCase()} successfully.`,
      data: updatedRequest 
    });

  } catch (error) {
    console.error('Moderation Error:', error);
    return NextResponse.json({ error: 'Failed to process moderation signal' }, { status: 500 });
  }
}