import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;
    
    
    const MASTER_KEY = process.env.ADMIN_PIN;

    if (!MASTER_KEY) {
      console.error("❌ CRITICAL: ADMIN_PIN is not set in Environment Variables.");
      return NextResponse.json({ error: "System Configuration Missing" }, { status: 500 });
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
  return NextResponse.json({ 
    status: "online", 
    message: "Guardian Gateway Active",
    version: "18.51.0"
  });
}