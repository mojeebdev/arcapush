import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      requesterName, 
      requesterEmail, 
      requesterFirm, 
      startupId, 
      requesterRole = "Investor, VC"
    } = body;

    
    const newRequest = await prisma.accessRequest.create({
      data: {
        requesterName,
        requesterEmail,
        requesterFirm,
        requesterRole,
        status: "PENDING",
        startupId: startupId || "general", 
      },
    });

    // 2. Automated Confirmation to the Requester
    await resend.emails.send({
      from: 'Guardian <system@vibestream.cc>', 
      to: requesterEmail,
      subject: 'Protocol Initiated: Pitch Deck Request',
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #1a1a1a;">
          <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #4E24CF;">Protocol Initiated</h1>
          <p>Hello ${requesterName},</p>
          <p>Your request to access the deck for <strong>Vibe Code ID: ${startupId}</strong> has been received by the Guardian.</p>
          <p>We are verifying your credentials with <strong>${requesterFirm}</strong>. You will receive the pitch link once approved.</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
          <p style="font-size: 10px; color: #666; letter-spacing: 0.1em; text-align: center;">VIBESTREAM ENCYCLOPEDIA</p>
        </div>
      `
    });

    // 3. Alert the Guardian (You)
    await resend.emails.send({
      from: 'System <system@vibestream.cc>',
      to: 'blindspotlabs1@gmail.com', 
      subject: `🚨 Investor Request: ${requesterFirm}`,
      text: `${requesterName} from ${requesterFirm} wants to view the pitch for ${startupId}. Approve them in the dashboard.`
    });

    return NextResponse.json({ success: true, requestId: newRequest.id }, { status: 200 });

  } catch (error: any) {
    console.error("Transmission Error:", error);
    return NextResponse.json({ error: 'Transmission Lost' }, { status: 500 });
  }
}