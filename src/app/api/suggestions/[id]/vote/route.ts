import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — increment vote on a suggestion
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing suggestion ID" }, { status: 400 });
    }

    const suggestion = await prisma.suggestion.update({
      where: { id },
      data:  { votes: { increment: 1 } },
    });

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }
    console.error("[PATCH /api/suggestions/[id]/vote]", error);
    return NextResponse.json({ error: "Failed to register vote" }, { status: 500 });
  }
}