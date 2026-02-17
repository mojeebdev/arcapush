"use client";

import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; 
import { verifyBasePayment, verifySolanaPayment } from "@/lib/payments";
import { AdminConfig } from "@/lib/adminConfig";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startupId, chain, txHash, packageValue } = body;

    
    if (!startupId || !chain || !txHash) {
      return NextResponse.json({ error: "Missing transmission data" }, { status: 400 });
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
        },
      });

      console.log(`🔥 Signal Confirmed: ${updated.name} for ${selectedPackage.label}. Expires: ${rotationExpiry.toISOString()}`);

      return NextResponse.json({ 
        success: true, 
        startup: updated,
        expiresAt: rotationExpiry,
        duration: selectedPackage.label
      });
    }

    
    return NextResponse.json(
      { success: false, error: "Invalid Signal: Verification Failed" }, 
      { status: 402 }
    );

  } catch (error: any) {
    console.error("🛡️ Shield Failure in /api/pin:", error);
    return NextResponse.json(
      { error: "System Error: Transmission Interrupted" }, 
      { status: 500 }
    );
  }
}