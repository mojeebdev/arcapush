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

    
    try {
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
        count: requests.length,
        requests 
      });

    } catch (relationError) {
      
      console.warn("⚠️ Database Relation Mismatch: Fetching raw access signals.");
      
      const rawRequests = await prisma.accessRequest.findMany({
        where: status === 'ALL' ? {} : { 
          status: status as any 
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ 
        success: true,
        count: rawRequests.length,
        requests: rawRequests,
        warning: "Model relationship sync required in schema.prisma" 
      });
    }

  } catch (error: any) {
    console.error("🛡️ Guardian Fetch Error:", error);
    return NextResponse.json({ 
      error: 'Signal Error: Database Sync Failed',
      details: error.message 
    }, { status: 500 });
  }
}
