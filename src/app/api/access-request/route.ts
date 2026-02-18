
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        status: "PENDING",
        startupId: "waitlist",
      },
    });

    
    await resend.emails.send({
      from: 'Guardian <system@vibestream.cc>', 
      to: requesterEmail,
      subject: 'Signal Received: Welcome to the VibeStream',
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #333;">
          <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #a855f7;">Signal Received</h1>
          <p>Hello ${requesterName},</p>
          <p>Your application for <strong>${requesterFirm}</strong> has reached the Guardian. We are currently calibrating the stream.</p>
          <p>You will receive a notification once your signal is live.</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
          <p style="font-size: 10px; color: #666; letter-spacing: 0.1em;"> VIBESTREAM.CC</p>
        </div>
      `
    });

    
    await resend.emails.send({
      from: 'System <system@vibestream.cc>',
      to: 'blindspotlabs1@gmail.com', 
      subject: `🚨 New Signal: ${requesterFirm}`,
      text: `${requesterName} from ${requesterFirm} has just joined the waitlist. Review them in the dashboard.`
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Transmission Error:", error);
    return NextResponse.json({ error: 'Transmission Lost' }, { status: 500 });
  }
}