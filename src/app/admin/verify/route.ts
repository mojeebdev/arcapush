import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    
    
    const MASTER_KEY = process.env.ADMIN_PIN;

    if (pin === MASTER_KEY) {
      return NextResponse.json({ authorized: true });
    }

    return NextResponse.json({ authorized: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "System Breach" }, { status: 500 });
  }
}