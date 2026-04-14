import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const ADMIN_SECRET = process.env.GUARDIAN_PIN!;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { reason, adminSecret } = await req.json();
    if (adminSecret !== ADMIN_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!reason?.trim()) return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });

    const startup = await prisma.startup.findUnique({
      where: { id },
      select: { id: true, name: true, founderName: true, founderEmail: true, approved: true },
    });

    if (!startup) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (startup.approved) return NextResponse.json({ error: "Cannot reject an approved listing" }, { status: 400 });

    await prisma.startup.delete({ where: { id } });

    await resend.emails.send({
      from: "Arcapush <noreply@arcapush.com>",
      to: startup.founderEmail,
      subject: `Your Arcapush submission — ${startup.name}`,
      html: `<p>Hi ${startup.founderName}, your submission for <strong>${startup.name}</strong> was not approved. Feedback: ${reason}. Resubmit at <a href="https://arcapush.com/submit">arcapush.com/submit</a>.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reject-startup]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
