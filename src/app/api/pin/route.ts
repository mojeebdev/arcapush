
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { verifyBasePayment, verifySolanaPayment } from "@/lib/payments";
import { AdminConfig } from "@/lib/adminConfig";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    let verification = { verified: false };
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
      const rotationExpiry = new Date(Date.now() + selectedPackage.minutes * 60 * 1000);

      const updated = await prisma.startup.update({
        where: { id: startupId },
        data: {
          tier: "PINNED",
          pinnedUntil: rotationExpiry,
          pinTxHash: txHash,
          pinChain: chain,
          pinnedAt: new Date(),
        },
      });

      // Admin notification
      try {
        await resend.emails.send({
          from: 'Arcapush <system@arcapush.com>',
          to: 'blindspotlabs1@gmail.com',
          subject: `💰 Boost Activated: ${updated.name}`,
          html: `
            <div style="font-family: sans-serif; background: #0a0a0a; color: #f0ede8; padding: 40px; border: 1px solid rgba(232,255,71,0.2); border-radius: 24px; max-width: 500px; margin: auto;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #e8ff47; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Boost Activated</h2>
                <p style="font-size: 10px; color: #888580; letter-spacing: 1px;">ARCAPUSH BOOST PROTOCOL</p>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong style="color: #e8ff47;">PRODUCT:</strong> ${updated.name}</p>
                <p style="margin: 5px 0;"><strong style="color: #e8ff47;">PACKAGE:</strong> ${selectedPackage.label}</p>
                <p style="margin: 5px 0;"><strong style="color: #e8ff47;">NETWORK:</strong> ${chain.toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong style="color: #e8ff47;">EXPIRES:</strong> ${rotationExpiry.toLocaleString()}</p>
              </div>
              <div style="border-top: 1px solid #222; padding-top: 20px;">
                <p style="font-size: 9px; color: #444; margin: 2px 0;">TX HASH: ${txHash}</p>
                <p style="font-size: 9px; color: #e8ff47; font-weight: bold; margin: 2px 0;">ARCAPUSH v${AdminConfig.ARCAPUSH_VERSION}</p>
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }

      return NextResponse.json({
        success: true,
        message: "Boost activated",
        startup: updated,
        expiresAt: rotationExpiry,
        duration: selectedPackage.label,
        txHash,
      });
    }

    return NextResponse.json({ error: "Payment not found on chain" }, { status: 402 });

  } catch (error: any) {
    console.error("Pin route error:", error);
    return NextResponse.json({ error: "Transmission interrupted" }, { status: 500 });
  }
}