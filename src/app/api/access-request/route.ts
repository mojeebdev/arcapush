
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { AdminConfig } from '@/lib/adminConfig';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const pin = req.headers.get("x-guardian-pin");
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.accessRequest.findMany({
      include: {
        startup: { select: { name: true, id: true, approved: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
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
      requesterRole = "Investor"
    } = body;

    if (startupId && startupId !== "general_access") {
      const startupExists = await prisma.startup.findUnique({ where: { id: startupId } });
      if (!startupExists) {
        return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
      }
    }

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
      from: 'Arcapush <system@arcapush.com>',
      to: requesterEmail,
      subject: 'Access Request Received — Arcapush',
      html: `
        <div style="font-family: serif; background: #0a0a0a; color: #f0ede8; padding: 40px; border-radius: 20px; border: 1px solid rgba(232,255,71,0.15);">
          <h1 style="text-transform: uppercase; letter-spacing: 0.2em; color: #5b2bff; font-size: 1.2rem;">Request Received</h1>
          <p style="font-style: italic; color: #888580;">Hello ${requesterName},</p>
          <p style="color: #888580;">
            Your access request for <strong style="color: #f0ede8;">${requesterFirm}</strong> has been received.
            We'll review your credentials and send the pitch deck link once approved.
          </p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;" />
          <p style="font-size: 10px; color: #4a4845; letter-spacing: 0.1em; text-align: center; text-transform: uppercase;">
            Arcapush — Venture Capital Discovery
          </p>
        </div>
      `
    });

    // Admin notification
    await resend.emails.send({
      from: 'Arcapush <system@arcapush.com>',
      to: 'blindspotlabs1@gmail.com',
      subject: `🏦 Investor Request: ${requesterFirm}`,
      text: `${requesterName} (${requesterRole}) from ${requesterFirm} wants access.\nEmail: ${requesterEmail}\nLinkedIn: ${requesterLinkedIn}\nStartup ID: ${startupId}`
    });

    return NextResponse.json({ success: true, requestId: newRequest.id });

  } catch (error: any) {
    console.error("Access request error:", error);
    return NextResponse.json({ error: 'Submission failed', details: error.message }, { status: 500 });
  }
}