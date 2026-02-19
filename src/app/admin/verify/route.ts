import { NextResponse } from 'next/server';


export const dynamic = 'force-dynamic'; 

export async function POST(request: Request) {
  try {
    
    const body = await request.json().catch(() => ({}));
    const { pin } = body;
    
    const MASTER_KEY = process.env.ADMIN_PIN;

    if (!MASTER_KEY) {
      console.error("❌ ADMIN_PIN environment variable is missing!");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    if (pin === MASTER_KEY) {
      return NextResponse.json({ authorized: true });
    }

    return NextResponse.json({ authorized: false }, { status: 401 });
  } catch (error) {
    console.error("🛡️ Admin Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ 
    status: "active",
    engine: "VibeStream v18.52.0" 
  });
}