import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params; 

    
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: "Request approved successfully", 
      data: updatedRequest 
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to approve request" }, 
      { status: 500 }
    );
  }
}