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

    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid Status Signal' }, { status: 400 });
    }

    
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: { status },
    });

    
    if (status === 'APPROVED') {
      await resend.emails.send({
        from: 'Guardian <system@vibestream.cc>',
        to: updatedRequest.requesterEmail,
        subject: '🚀 Signal Live: You are on the VibeStream!',
        html: `
          <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #10b981;">
            <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #10b981;">Signal Approved</h1>
            <p>Hello ${updatedRequest.requesterName},</p>
            <p>The Guardian has reviewed your transmission for <strong>${updatedRequest.requesterFirm}</strong>.</p>
            <p style="font-size: 18px; font-weight: bold;">Your signal is now live on the global feed.</p>
            <div style="margin: 30px 0;">
              <a href="https://vibestream.cc" style="background: #fff; color: #000; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; text-transform: uppercase;">View Your Signal</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
            <p style="font-size: 10px; color: #666; letter-spacing: 0.1em;"> VIBESTREAM.CC</p>
          </div>
        `
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Founder notified: ${status.toLowerCase()}`,
      data: updatedRequest 
    });

  } catch (error: any) {
    console.error('Moderation Error:', error);
    return NextResponse.json({ error: 'Failed to broadcast signal' }, { status: 500 });
  }
}