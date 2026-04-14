import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';
import { AdminConfig } from "@/lib/adminConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { founderEmail, founderName, startupName, startupId } = await req.json();

    
    await resend.emails.send({
      from: 'Arcapush <system@arcapush.com>',
      to: ['blindspotlabs1@gmail.com'],
      subject: `🚀 New Listing: ${startupName}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #f0ede8; padding: 30px; border: 1px solid rgba(232,255,71,0.2);">
          <h2 style="color: #5b2bff;">[NEW LISTING]</h2>
          <p>A new product has been submitted for review.</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;" />
          <p><strong>Product:</strong> ${startupName}</p>
          <p><strong>Founder:</strong> ${founderName} (${founderEmail})</p>
          <div style="margin-top: 30px;">
            <a href="${AdminConfig.SITE_URL}/admin"
               style="background: #5b2bff; color: #0a0a0a; padding: 10px 20px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase;">
              OPEN ADMIN PANEL
            </a>
          </div>
          <p style="font-size: 9px; color: #4a4845; margin-top: 20px;">ARCAPUSH v${AdminConfig.ARCAPUSH_VERSION}</p>
        </div>
      `
    });

    
    await resend.emails.send({
      from: 'Arcapush <system@arcapush.com>',
      to: [founderEmail],
      subject: `Listing Received: ${startupName}`,
      html: `
        <div style="font-family: sans-serif; background: #0a0a0a; color: #f0ede8; padding: 40px; border-radius: 20px; border: 1px solid rgba(232,255,71,0.15);">
          <h1 style="text-transform: uppercase; letter-spacing: -1px; color: #5b2bff;">Listing Received.</h1>
          <p style="color: #888580;">Hello ${founderName},</p>
          <p style="color: #888580;">We've received your listing for <strong style="color: #f0ede8;">${startupName}</strong>.</p>
          <p style="color: #888580;">We review all submissions within 6 hours. You'll get an email when your product goes live in the registry.</p>
          <div style="margin-top: 30px; padding: 20px; background: rgba(232,255,71,0.05); border: 1px solid rgba(232,255,71,0.1); border-radius: 12px;">
            <p style="font-size: 11px; color: #888580; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">
              Want faster visibility? Boost your listing to the hero slot with USDC or SOL.
            </p>
            <a href="${AdminConfig.SITE_URL}/pricing"
               style="display: inline-block; margin-top: 12px; background: #5b2bff; color: #0a0a0a; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">
              View Boost Options
            </a>
          </div>
          <p style="margin-top: 40px; font-size: 10px; color: #4a4845; letter-spacing: 2px; text-transform: uppercase;">
            Arcapush — ${AdminConfig.SITE_URL}
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}