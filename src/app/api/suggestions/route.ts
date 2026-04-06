import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — fetch all suggestions
export async function GET() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: { votes: "desc" },
    });
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[GET /api/suggestions]", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

// POST — submit a new suggestion
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json({ error: "Suggestion text is too short." }, { status: 400 });
    }

    if (text.trim().length > 300) {
      return NextResponse.json({ error: "Suggestion must be under 300 characters." }, { status: 400 });
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        text:   text.trim(),
        status: "open",
        votes:  0,
      },
    });

    return NextResponse.json({ suggestion }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/suggestions]", error);
    return NextResponse.json({ error: "Failed to submit suggestion" }, { status: 500 });
  }
}