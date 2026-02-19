import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    
    const pinnedStartups = await prisma.startup.findMany({
      where: {
        pinTxHash: { not: null }, 
      },
      select: {
        pinChain: true,
        pinTxHash: true,
        pinnedUntil: true,
        name: true,
        id: true,
        
      },
      orderBy: {
        pinnedAt: 'desc',
      },
    });

    
    const baseCount = pinnedStartups.filter(s => s.pinChain === 'base').length;
    const solCount = pinnedStartups.filter(s => s.pinChain === 'solana').length;
    return NextResponse.json({
      totalUsd: "Calculated", 
      baseCount,
      solCount,
      recent: pinnedStartups.slice(0, 10), 
      totalPinned: pinnedStartups.length
    });

  } catch (error) {
    console.error("🛡️ Guardian Stats Failure:", error);
    return NextResponse.json({ 
      totalUsd: 0, 
      baseCount: 0, 
      solCount: 0, 
      recent: [] 
    }, { status: 500 });
  }
}
