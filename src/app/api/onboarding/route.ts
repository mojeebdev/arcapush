import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, twitterHandle, bio, role } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name:               name.trim(),
        twitterHandle:      twitterHandle?.replace("@", "").trim() || null,
        bio:                bio?.trim() || null,
        role:               role || "viewer",
        onboardingComplete: true,
      },
      select: {
        id:                 true,
        name:               true,
        twitterHandle:      true,
        bio:                true,
        role:               true,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });

  } catch (err: any) {
    console.error("[api/onboarding] Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}