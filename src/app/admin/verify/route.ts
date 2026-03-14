import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { pin } = body;
    
    const MASTER_KEY = process.env.ADMIN_PIN;

    if (!MASTER_KEY) {
      console.error("❌ CRITICAL: ADMIN_PIN environment variable missing.");
      return NextResponse.json({ error: "Config Missing" }, { status: 500 });
    }

    if (pin === MASTER_KEY) {
      return NextResponse.json({ authorized: true });
    }

    return NextResponse.json({ authorized: false }, { status: 401 });
  } catch (error) {
    console.error("🛡️ Shield Failure:", error);
    return NextResponse.json({ error: "System Breach" }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ status: "Arcapush Guardian Gateway Active" });
}
