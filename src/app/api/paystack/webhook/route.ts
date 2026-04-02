import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body      = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret    = process.env.PAYSTACK_SECRET_KEY!;

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Only handle successful charges
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const { reference, metadata, amount, customer } = event.data;
  const { startupId, packageValue } = metadata ?? {};

  if (!startupId || !packageValue) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  // Prevent duplicate processing
  const existing = await prisma.startup.findFirst({
    where: { pinTxHash: reference },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  const TIER_DURATION: Record<string, number> = {
    LAUNCH:  60 * 24 * 21,
    PRO:     60 * 24 * 30,
    PRO_MAX: 60 * 24 * 365,
  };

  const durationMinutes = TIER_DURATION[packageValue] ?? 60 * 24 * 30;
  const pinnedUntil     = new Date(Date.now() + durationMinutes * 60 * 1000);

  const updated = await prisma.startup.update({
    where: { id: startupId },
    data: {
      tier:        packageValue as any,
      pinnedAt:    new Date(),
      pinnedUntil,
      pinTxHash:   reference,
      pinChain:    "paystack",
    },
  });

  // Admin email notification
  try {
    await resend.emails.send({
      from:    "Arcapush <system@arcapush.com>",
      to:      "blindspotlabs1@gmail.com",
      subject: `💳 Card Payment: ${updated.name} — ${packageValue}`,
      html: `
        <div style="font-family:sans-serif;background:#0a0a0a;color:#f0ede8;padding:40px;border-radius:24px;max-width:500px;margin:auto;border:1px solid rgba(91,43,255,0.2)">
          <h2 style="color:#5B2BFF;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Card Payment Confirmed</h2>
          <p style="font-size:10px;color:#888580;margin:0 0 24px">ARCAPUSH · PAYSTACK</p>
          <div style="background:rgba(255,255,255,0.03);padding:20px;border-radius:15px;margin-bottom:20px">
            <p style="margin:5px 0"><strong style="color:#5B2BFF">PRODUCT:</strong> ${updated.name}</p>
            <p style="margin:5px 0"><strong style="color:#5B2BFF">PLAN:</strong> ${packageValue}</p>
            <p style="margin:5px 0"><strong style="color:#5B2BFF">AMOUNT:</strong> ₦${(amount / 100).toLocaleString()}</p>
            <p style="margin:5px 0"><strong style="color:#5B2BFF">CUSTOMER:</strong> ${customer?.email ?? "N/A"}</p>
            <p style="margin:5px 0"><strong style="color:#5B2BFF">EXPIRES:</strong> ${pinnedUntil.toLocaleString()}</p>
            <p style="margin:5px 0"><strong style="color:#5B2BFF">REF:</strong> ${reference}</p>
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Email failed:", e);
  }

  return NextResponse.json({ received: true });
}