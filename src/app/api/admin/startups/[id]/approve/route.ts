import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const pin = req.headers.get("x-guardian-pin");

    
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const updatedStartup = await prisma.startup.update({
      where: { id },
      data: {
        approved: body.approved,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vibe Code Status Updated",
      startup: updatedStartup,
    });
    
  } catch (error: any) {
    console.error("Guardian Switch Error:", error);
    return NextResponse.json(
      { error: "Transmission Failed", details: error.message },
      { status: 500 }
    );
  }
}