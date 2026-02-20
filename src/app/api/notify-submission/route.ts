import { NextResponse, NextRequest } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { founderEmail, founderName, startupName, startupId } = await req.json();

    
    await resend.emails.send({
      from: 'Guardian Alert <system@vibestream.cc>',
      to: ['blindspotlabs1@gmail.com'],
      subject: `🚨 NEW VIBE CODE: ${startupName}`,
      html: `
        <div style="font-family: monospace; background: #09090b; color: #fff; padding: 30px; border: 1px solid #27272a;">
          <h2 style="color: #4E24CF;">[INCOMING TRANSMISSION]</h2>
          <p>A new "food item" has been submitted for verification.</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
          <p><strong>Startup:</strong> ${startupName}</p>
          <p><strong>Founder:</strong> ${founderName} (${founderEmail})</p>
          <div style="margin-top: 30px;">
            <a href="https://vibestream.cc/admin" style="background: #4E24CF; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: bold; font-size: 12px;">
              OPEN ADMIN PANEL
            </a>
          </div>
        </div>
      `
    });

    
    await resend.emails.send({
      from: 'VibeStream <system@vibestream.cc>',
      to: [founderEmail],
      subject: `Vibe Code Received: ${startupName}`,
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="text-transform: uppercase;">Awaiting Verification.</h1>
          <p style="color: #a1a1aa;">Hello ${founderName}, we've received your submission for <strong>${startupName}</strong>.</p>
          <p style="color: #a1a1aa;">The Guardian is currently reviewing your signal. You will receive an update once it is indexed in the Encyclopedia.</p>
          <p style="margin-top: 40px; font-size: 10px; color: #3f3f46; letter-spacing: 2px;">VIBESTREAM // SYSTEM STATUS: INITIALIZED</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("Notification System Error:", error);
    return NextResponse.json({ error: "Alert Failed" }, { status: 500 });
  }
}