import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { verifyBasePayment, verifySolanaPayment } from "@/lib/payments";
import { AdminConfig } from "@/lib/adminConfig";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Duration for each paid tier in minutes
const TIER_DURATION: Record<string, number> = {
  LAUNCH:  60 * 24 * 21,    // 3 weeks
  PRO:     60 * 24 * 30,    // 1 month
  PRO_MAX: 60 * 24 * 365,   // 1 year
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startupId, chain, txHash, packageValue } = body;

    if (!startupId || !chain || !txHash || !packageValue) {
      return NextResponse.json({ error: "Missing transmission data" }, { status: 400 });
    }

    // Prevent duplicate hash
    const existingPayment = await prisma.startup.findFirst({
      where: { pinTxHash: txHash }
    });
    if (existingPayment) {
      return NextResponse.json({ error: "Hash already indexed" }, { status: 409 });
    }

    // Find package
    const selectedPackage = AdminConfig.PIN_PACKAGES.find(p => p.value === packageValue);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Verify payment on-chain with retries
    let verification = { verified: false } as any;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      verification = chain === "base"
        ? await verifyBasePayment(txHash)
        : await verifySolanaPayment(txHash);
      if (verification.verified) break;
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, i === 0 ? 3000 : 5000));
      }
    }

    if (verification.verified) {
      const durationMinutes = TIER_DURATION[packageValue] ?? 60 * 24 * 30;
      const rotationExpiry  = new Date(Date.now() + durationMinutes * 60 * 1000);

      const updated = await prisma.startup.update({
        where: { id: startupId },
        data: {
          tier:        packageValue as any,
          pinnedUntil: rotationExpiry,
          pinTxHash:   txHash,
          pinChain:    chain,
          pinnedAt:    new Date(),
        },
      });

      // Admin notification
      try {
        await resend.emails.send({
          from: 'Arcapush <system@arcapush.com>',
          to:   'blindspotlabs1@gmail.com',
          subject: `💰 ${selectedPackage.label} Activated: ${updated.name}`,
          html: `
            <div style="font-family: sans-serif; background: #0a0a0a; color: #f0ede8; padding: 40px; border: 1px solid rgba(91,43,255,0.2); border-radius: 24px; max-width: 500px; margin: auto;">
              <h2 style="color: #5B2BFF; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Payment Confirmed</h2>
              <p style="font-size: 10px; color: #888580; letter-spacing: 1px; margin: 0 0 24px;">ARCAPUSH ${AdminConfig.ARCAPUSH_VERSION}</p>
              <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong style="color: #5B2BFF;">PRODUCT:</strong> ${updated.name}</p>
                <p style="margin: 5px 0;"><strong style="color: #5B2BFF;">PLAN:</strong> ${selectedPackage.label} — $${selectedPackage.price}</p>
                <p style="margin: 5px 0;"><strong style="color: #5B2BFF;">NETWORK:</strong> ${chain.toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong style="color: #5B2BFF;">EXPIRES:</strong> ${rotationExpiry.toLocaleString()}</p>
              </div>
              <p style="font-size: 9px; color: #444; margin: 2px 0;">TX: ${txHash}</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }

      return NextResponse.json({
        success:   true,
        message:   "Boost activated",
        startup:   updated,
        expiresAt: rotationExpiry,
        tier:      packageValue,
        txHash,
      });
    }

    return NextResponse.json({ error: "Payment not found on chain" }, { status: 402 });

  } catch (error: any) {
    console.error("Pin route error:", error);
    return NextResponse.json({ error: "Transmission interrupted" }, { status: 500 });
  }
}
