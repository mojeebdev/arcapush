import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, twitterHandle, bio, role } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name:               name.trim(),
        twitterHandle:      twitterHandle?.replace("@", "").trim() || null,
        bio:                bio?.trim() || null,
        role:               role || "viewer",
        onboardingComplete: true,
      },
    });

    console.log("[api/onboarding] Updated user:", session.user.id);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("[api/onboarding] Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}