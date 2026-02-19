import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(req: Request) {
  try {
    const pin = req.headers.get("x-guardian-pin");

    
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: "Unauthorized Handshake" }, { status: 401 });
    }

    
    const requests = await prisma.accessRequest.findMany({
      include: {
        startup: {
          select: { 
            name: true, 
            id: true, 
            approved: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: 'Signal Interrupted' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      requesterName, 
      requesterEmail, 
      requesterFirm, 
      requesterLinkedIn,
      startupId, 
      requesterRole = "Investor, VC"
    } = body;

    
    if (startupId && startupId !== "general_access") {
      const startupExists = await prisma.startup.findUnique({
        where: { id: startupId }
      });
      if (!startupExists) {
        return NextResponse.json({ error: 'Signal Target Not Found' }, { status: 404 });
      }
    }

    /
    const newRequest = await prisma.accessRequest.create({
      data: {
        requesterName,
        requesterEmail,
        requesterFirm: requesterFirm || "Independent",
        requesterRole,
        requesterLinkedIn, 
        status: "PENDING",
        startupId: startupId === "general_access" ? null : startupId, 
      },
    });

    
    await resend.emails.send({
      from: 'Guardian <system@vibestream.cc>', 
      to: requesterEmail,
      subject: 'Protocol Initiated: Pitch Deck Request',
      html: `
        <div style="font-family: serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #1a1a1a;">
          <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #4E24CF;">Protocol Initiated</h1>
          <p style="font-style: italic;">Hello ${requesterName},</p>
          <p>Your request to access high-signal data for <strong>${requesterFirm}</strong> has been received by the Guardian.</p>
          <p>We are currently verifying your institutional credentials. You will receive the pitch link once approved.</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
          <p style="font-size: 10px; color: #666; letter-spacing: 0.1em; text-align: center;">VIBESTREAM | VENTURE CAPITAL</p>
        </div>
      `
    });

    
    await resend.emails.send({
      from: 'System <system@vibestream.cc>',
      to: 'blindspotlabs1@gmail.com', 
      subject: `🚨 Investor Request: ${requesterFirm}`,
      text: `${requesterName} (${requesterRole}) from ${requesterFirm} wants access to ${startupId}.`
    });

    return NextResponse.json({ success: true, requestId: newRequest.id }, { status: 200 });

  } catch (error: any) {
    console.error("Transmission Error:", error);
    return NextResponse.json({ error: 'Transmission Lost', details: error.message }, { status: 500 });
  }
}