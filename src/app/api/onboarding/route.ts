import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, twitterHandle, bio, role } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign out and sign in again." },
        { status: 404 }
      );
    }

    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name:               name.trim(),
        twitterHandle:      twitterHandle?.replace("@", "").trim() || null,
        bio:                bio?.trim() || null,
        role:               role || "viewer",
        onboardingComplete: true,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("[api/onboarding] Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}