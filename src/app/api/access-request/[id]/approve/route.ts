import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, adminSecret } = await request.json();

   
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid Guardian Secret' }, { status: 401 });
    }

    
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: { status, reviewedAt: new Date() }, 
    });

    
    if (status === 'APPROVED') {
      
      
      if (updatedRequest.requesterRole === 'Investor' && updatedRequest.startupId !== 'waitlist') {
        const startup = await prisma.startup.findUnique({
          where: { id: updatedRequest.startupId }
        });

        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: updatedRequest.requesterEmail,
          subject: `🔐 Access Granted: ${startup?.name} Pitch`,
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #4E24CF;">
              <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #D4AF37;">Access Granted</h1>
              <p>Hello ${updatedRequest.requesterName},</p>
              <p>The Guardian has approved your request to view the pitch for <strong>${startup?.name}</strong>.</p>
              <div style="margin: 30px 0;">
                <a href="${startup?.pitchDeckUrl}" style="background: #4E24CF; color: #fff; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Open Pitch Deck</a>
              </div>
              <p style="font-size: 10px; color: #666;">This link is confidential and intended for ${updatedRequest.requesterFirm}.</p>
              <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
              <p style="font-size: 10px; color: #666; letter-spacing: 0.1em; text-align: center;">VIBESTREAM ENCYCLOPEDIA</p>
            </div>
          `
        });
      } else {
        
        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: updatedRequest.requesterEmail,
          subject: '🚀 Signal Live: You are on the VibeStream!',
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #4E24CF;">
              <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #4E24CF;">Signal Approved</h1>
              <p>Hello ${updatedRequest.requesterName},</p>
              <p>Your transmission for <strong>${updatedRequest.requesterFirm}</strong> is now indexed.</p>
              <p style="font-size: 18px; font-weight: bold; color: #D4AF37;">Your Vibe Code is now live in the Encyclopedia.</p>
              <div style="margin: 30px 0;">
                <a href="https://vibestream.cc" style="background: #fff; color: #000; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; text-transform: uppercase;">View Your Signal</a>
              </div>
              <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
              <p style="font-size: 10px; color: #666; letter-spacing: 0.1em; text-align: center;"> VIBESTREAM.CC</p>
            </div>
          `
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Transmission status: ${status.toLowerCase()}`,
      data: updatedRequest 
    });

  } catch (error: any) {
    console.error('Moderation Error:', error);
    return NextResponse.json({ error: 'Failed to broadcast signal' }, { status: 500 });
  }
}