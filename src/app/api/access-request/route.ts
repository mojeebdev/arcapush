import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requesterName, requesterEmail, requesterFirm } = body;

    
    const newRequest = await prisma.accessRequest.create({
      data: {
        requesterName,
        requesterEmail,
        requesterFirm,
        requesterRole: "Founder", 
        requesterLinkedIn: "https://linkedin.com/in/pending", 
        status: "PENDING",
        startupId: "waitlist", 
      },
    });

    return NextResponse.json({ 
      message: "Signal Received", 
      id: newRequest.id 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Transmission Error:", error);
    return NextResponse.json({ 
      message: "Signal Lost", 
      error: error.message 
    }, { status: 500 });
  }
}