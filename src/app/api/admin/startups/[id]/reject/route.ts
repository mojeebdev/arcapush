import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const ADMIN_SECRET = process.env.GUARDIAN_PIN!;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason, adminSecret } = await req.json();
    if (adminSecret !== ADMIN_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!reason?.trim()) return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });

    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, founderName: true, founderEmail: true, approved: true },
    });

    if (!startup) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (startup.approved) return NextResponse.json({ error: "Cannot reject an approved listing" }, { status: 400 });

    await prisma.startup.delete({ where: { id: params.id } });

    await resend.emails.send({
      from: "Arcapush <noreply@arcapush.com>",
      to: startup.founderEmail,
      subject: `Your Arcapush submission — ${startup.name}`,
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Mono','Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 24px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#111;border:1px solid #222;border-radius:24px;overflow:hidden;">
        <tr><td style="padding:32px 36px 24px;border-bottom:1px solid #222;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#5b2bff;font-weight:700;">Arcapush</p>
          <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#555;">Submission Review</p>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <p style="margin:0 0 20px;font-size:14px;color:#888;">Hi ${startup.founderName},</p>
          <p style="margin:0 0 20px;font-size:14px;color:#888;line-height:1.7;">
            Thank you for submitting <strong style="color:#e8e8e8;">${startup.name}</strong> to Arcapush. After reviewing your listing, we weren't able to approve it at this time.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:3px solid #5b2bff;border-radius:12px;padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#5b2bff;font-weight:700;">Feedback from the Arcapush team</p>
              <p style="margin:0;font-size:14px;color:#ccc;line-height:1.7;">${reason}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 20px;font-size:14px;color:#888;line-height:1.7;">
            Address the feedback above and resubmit at any time.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="border-radius:12px;background:#5b2bff;">
              <a href="https://arcapush.com/submit" style="display:inline-block;padding:14px 28px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                Resubmit Your Product →
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#555;line-height:1.7;">
            Questions? Find us on X at <a href="https://x.com/mojeebeth" style="color:#5b2bff;text-decoration:none;">@mojeebeth</a>.
          </p>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #1a1a1a;">
          <p style="margin:0;font-size:11px;color:#333;letter-spacing:0.1em;">ARCAPUSH.COM — Where vibe-coded products get discovered.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reject-startup]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
