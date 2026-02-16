import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure this path matches your prisma client location

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // The "Guardian" logic to update the request status
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    return NextResponse.json({ 
      message: 'Access approved successfully',
      data: updatedRequest 
    });
  } catch (error) {
    console.error('Approval Error:', error);
    return NextResponse.json(
      { error: 'Failed to approve access' },
      { status: 500 }
    );
  }
}