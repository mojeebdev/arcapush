import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const pin = request.headers.get('x-guardian-pin');

    
    if (!pin || pin !== process.env.ADMIN_PIN) {
      console.warn("🚨 UNAUTHORIZED ACCESS ATTEMPT DETECTED");
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    
    const requests = await prisma.accessRequest.findMany({
      where: status === 'ALL' ? {} : { 
        status: status as any 
      },
      orderBy: { createdAt: 'desc' },
      
      
      include: {
        startup: {
          select: { 
            name: true,
            tier: true,
            category: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString(),
      count: requests.length,
      requests 
    });

  } catch (error: any) {
    console.error("🛡️ Guardian Fetch Error:", error);
    return NextResponse.json({ error: 'Signal Error: Database Sync Failed' }, { status: 500 });
  }
}