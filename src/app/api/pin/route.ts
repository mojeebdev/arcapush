import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { pin } = await request.json();
  
  if (pin === "2897") {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
}