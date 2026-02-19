import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { RequestStatus } from '@prisma/client'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    
    const { status, adminSecret } = body;

    if (adminSecret !== process.env.ADMIN_PIN) {
      console.error("Authorization Denied: PIN mismatch.");
      return NextResponse.json({ error: 'Invalid Guardian PIN' }, { status: 401 });
    }

    
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: { 
        status: status as RequestStatus, 
        reviewedAt: new Date() 
      },
      include: { startup: true } 
    });

    
    if (status === 'APPROVED') {
      const startup = updatedRequest.startup;

      if (startup && updatedRequest.startupId && updatedRequest.startupId !== 'general_access') {
        
        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: updatedRequest.requesterEmail,
          subject: `🔐 Access Granted: ${startup.name} Pitch`,
          html: `
            <div style="font-family: serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #4E24CF;">
              <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #D4AF37;">Access Granted</h1>
              <p style="font-style: italic;">Hello ${updatedRequest.requesterName},</p>
              <p>The Guardian has verified your credentials for <strong>${updatedRequest.requesterFirm}</strong>.</p>
              <p>Access to the <strong>${startup.name}</strong> digital twin is now authorized.</p>
              <div style="margin: 30px 0;">
                <a href="${startup.pitchDeckUrl}" style="background: #4E24CF; color: #fff; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">View Pitch Deck</a>
              </div>
              <p style="font-size: 10px; color: #666;">VIBESTREAM | VENTURE CAPITAL</p>
            </div>
          `
        });
      } else {
        // --- General Terminal Access ---
        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: updatedRequest.requesterEmail,
          subject: '🚀 Signal Live: Terminal Access Authorized',
          html: `
            <div style="font-family: serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #D4AF37;">
              <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #4E24CF;">Terminal Authorized</h1>
              <p style="font-style: italic;">Hello ${updatedRequest.requesterName},</p>
              <p>Your institutional signal for <strong>${updatedRequest.requesterFirm}</strong> is now live.</p>
              <div style="margin: 30px 0;">
                <a href="https://vibestream.cc" style="background: #fff; color: #000; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Enter Terminal</a>
              </div>
              <p style="font-size: 10px; color: #666; letter-spacing: 0.3em; text-align: center;">VIBESTREAM.CC </p>
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
    return NextResponse.json({ error: 'Failed to broadcast signal', details: error.message }, { status: 500 });
  }
}