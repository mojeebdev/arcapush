import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const startupId = req.nextUrl.searchParams.get("startupId");

  if (!startupId) {
    return NextResponse.json({ error: "startupId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { startupId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({ reviews, avgRating, total: reviews.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startupId, name, email, rating, comment } = body;

    if (!startupId || !name || !email || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (comment.trim().length < 10) {
      return NextResponse.json({ error: "Comment must be at least 10 characters." }, { status: 400 });
    }

    const startup = await prisma.startup.findUnique({ where: { id: startupId } });
    if (!startup) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        startupId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rating: Number(rating),
        comment: comment.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
    });

  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
    }
    console.error("Review POST error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}