import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/pricing?status=failed", request.url));
  }

  try {
    
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (!data.status || data.data?.status !== "success") {
      return NextResponse.redirect(
        new URL("/pricing?status=failed", request.url)
      );
    }

    const { metadata, amount } = data.data;
    const { startupId, packageValue } = metadata;

    if (!startupId || !packageValue) {
      return NextResponse.redirect(
        new URL("/pricing?status=failed", request.url)
      );
    }

    // Duration per tier in minutes
    const TIER_DURATION: Record<string, number> = {
      LAUNCH:  60 * 24 * 21,
      PRO:     60 * 24 * 30,
      PRO_MAX: 60 * 24 * 365,
    };

    const durationMinutes = TIER_DURATION[packageValue] ?? 60 * 24 * 30;
    const pinnedUntil     = new Date(Date.now() + durationMinutes * 60 * 1000);

    await prisma.startup.update({
      where: { id: startupId },
      data: {
        tier:        packageValue as any,
        pinnedAt:    new Date(),
        pinnedUntil,
        pinTxHash:   reference,
        pinChain:    "paystack",
      },
    });

    return NextResponse.redirect(
      new URL(`/pricing?status=success&tier=${packageValue}`, request.url)
    );
  } catch (err) {
    console.error("Paystack callback error:", err);
    return NextResponse.redirect(
      new URL("/pricing?status=failed", request.url)
    );
  }
}