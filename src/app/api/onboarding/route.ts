import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, twitterHandle, bio, role } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    
    const resolvedId = session.user.id ?? userId;

    if (!resolvedId) {
      return NextResponse.json({ error: "User ID could not be resolved." }, { status: 400 });
    }

    
    let user = await prisma.user.findUnique({ where: { id: resolvedId } });

    if (!user && session.user.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }

    if (!user) {
      return NextResponse.json(
        { error: `User not found. ID tried: ${resolvedId}` },
        { status: 404 }
      );
    }

    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
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