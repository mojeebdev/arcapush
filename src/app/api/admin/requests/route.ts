import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const pin = request.headers.get('x-guardian-pin');

    
    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    
    const requests = await prisma.accessRequest.findMany({
      where: status === 'ALL' ? {} : { status: status as any },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: 'Signal Error' }, { status: 500 });
  }
}