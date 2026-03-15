import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, twitterHandle, bio, role, userId, email } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    
    console.log("[api/onboarding] Received:", { userId, email, name });

    let user = null;

    
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
      console.log("[api/onboarding] Lookup by id:", user?.id ?? "not found");
    }

    
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
      console.log("[api/onboarding] Lookup by email:", user?.id ?? "not found");
    }

    
    if (!user && email) {
      user = await prisma.user.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });
      console.log("[api/onboarding] Lookup by findFirst:", user?.id ?? "not found");
    }

    if (!user) {
      
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      console.log("[api/onboarding] Recent users in DB:", JSON.stringify(allUsers));
      
      return NextResponse.json(
        { 
          error: "User not found.",
          debug: { userId, email, hint: "Check Vercel logs for DB user list" }
        },
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

    console.log("[api/onboarding] Updated user:", user.id);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("[api/onboarding] Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}