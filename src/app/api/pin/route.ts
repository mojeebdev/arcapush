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

    
    if (!startupId || !chain || !txHash) {
      return NextResponse.json({ error: "Missing transmission data" }, { status: 400 });
    }

    
    const existingPayment = await prisma.startup.findFirst({
      where: { pinTxHash: txHash }
    });

    if (existingPayment) {
      return NextResponse.json({ error: "Hash already indexed" }, { status: 409 });
    }

    const selectedPackage = AdminConfig.PIN_PACKAGES.find(p => p.value === packageValue) 
      || AdminConfig.PIN_PACKAGES[0];

    
    const verification = chain === "base" 
      ? await verifyBasePayment(txHash) 
      : await verifySolanaPayment(txHash);

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

      
      try {
        await resend.emails.send({
          from: 'Guardian <system@vibestream.cc>',
          to: 'blindspotlabs1@gmail.com',
          subject: `💰 Ascension Detected: ${updated.name}`,
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border: 1px solid #D4AF37; border-radius: 24px; max-width: 500px; margin: auto;">
              <div style="text-align: center; margin-bottom: 30px;">
                 <h2 style="color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Signal Boost Activated</h2>
                 <p style="font-size: 10px; color: #666; letter-spacing: 1px;">VIBESTREAM ASCENSION PROTOCOL</p>
              </div>
              
              <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong style="color: #D4AF37;">STARTUP:</strong> ${updated.name}</p>
                <p style="margin: 5px 0;"><strong style="color: #D4AF37;">PACKAGE:</strong> ${selectedPackage.label}</p>
                <p style="margin: 5px 0;"><strong style="color: #D4AF37;">NETWORK:</strong> ${chain.toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong style="color: #D4AF37;">EXPIRES:</strong> ${rotationExpiry.toLocaleString()}</p>
              </div>
              
              <div style="border-top: 1px solid #222; padding-top: 20px;">
                <p style="font-size: 9px; color: #444; margin: 2px 0;">TX HASH: ${txHash}</p>
                <p style="font-size: 9px; color: #D4AF37; font-weight: bold; margin: 2px 0;">VIBE STREAM v18.43.0</p>
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("📧 Notification Ghost:", emailErr);
      }

      return NextResponse.json({ 
        success: true, 
        message: "Signal Amplified",
        startup: updated, 
        expiresAt: rotationExpiry,
        duration: selectedPackage.label
      });
    }

    
    return NextResponse.json({ error: "Payment Signal Not Found" }, { status: 402 });

  } catch (error: any) {
    console.error("🛡️ Shield Failure:", error);
    return NextResponse.json({ error: "Transmission Interrupted" }, { status: 500 });
  }
}