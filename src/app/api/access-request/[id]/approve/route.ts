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
        
       const pitchLink = startup.pitchDeckUrl || `https://vibestream.cc/startup/${startup.slug ?? startup.id}`;
        
        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: updatedRequest.requesterEmail,
          subject: `🔐 Access Granted: ${startup.name} Pitch`,
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #4E24CF;">
              <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #D4AF37; margin-bottom: 20px;">Access Granted</h1>
              <p style="font-style: italic;">Hello ${updatedRequest.requesterName},</p>
              <p>The Guardian has verified your credentials for <strong>${updatedRequest.requesterFirm}</strong>.</p>
              <p>Access to the <strong>${startup.name}</strong> digital twin is now authorized.</p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td>
                    <a href="${pitchLink}" target="_blank" style="background-color: #4E24CF; color: #ffffff; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
                      View Pitch Deck
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 11px; color: #666; margin-top: 20px;">
                Link not clickable? Copy this: <br/>
                <span style="color: #4E24CF;">${pitchLink}</span>
              </p>
              <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
              <p style="font-size: 10px; color: #444; letter-spacing: 0.3em;">VIBESTREAM | VENTURE CAPITAL</p>
            </div>
          `
        });
      } else {
        
        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: updatedRequest.requesterEmail,
          subject: '🚀 Signal Live: Terminal Access Authorized',
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #D4AF37;">
              <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #4E24CF; margin-bottom: 20px;">Terminal Authorized</h1>
              <p style="font-style: italic;">Hello ${updatedRequest.requesterName},</p>
              <p>Your institutional signal for <strong>${updatedRequest.requesterFirm}</strong> is now live.</p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td>
                    <a href="https://vibestream.cc" target="_blank" style="background-color: #ffffff; color: #000000; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
                      Enter Terminal
                    </a>
                  </td>
                </tr>
              </table>

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