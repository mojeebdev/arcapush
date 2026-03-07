import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';
import { generateUniqueSlug } from "@/lib/slug";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const pin = req.headers.get("x-guardian-pin");
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   
    let slugData: { slug?: string } = {};

    if (body.approved === true) {
      const existing = await prisma.startup.findUnique({
        where: { id },
        select: { slug: true, name: true },
      });


      if (existing && !existing.slug) {
        const slug = await generateUniqueSlug(existing.name, id);
        slugData = { slug };
      }
    }

    const updatedStartup = await prisma.startup.update({
      where: { id },
      data: {
        approved: body.approved,
        ...slugData,
      },
    });

 
    if (body.approved === true) {
      const canonicalPath = updatedStartup.slug ?? updatedStartup.id;
      const startupUrl = `https://vibestream.cc/startup/${canonicalPath}`;

      await resend.emails.send({
        from: 'Guardian <system@vibestream.cc>',
        to: [updatedStartup.founderEmail],
        subject: `Vibe Code Approved: ${updatedStartup.name}`,
        html: `
          <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
            <h1 style="text-transform: uppercase; letter-spacing: -2px;">Signal Indexed.</h1>
            <p style="color: #a1a1aa;">Your project <strong>${updatedStartup.name}</strong> has been verified by the Guardian.</p>
            <div style="margin-top: 30px;">
              <a href="${startupUrl}" style="background: #fff; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase;">View Encyclopedia Entry</a>
            </div>
            <p style="margin-top: 40px; font-size: 10px; color: #3f3f46; letter-spacing: 2px;">VIBESTREAM // VENTURE CAPITAL ECOSYSTEM</p>
          </div>
        `
      });

      console.log(`🚀 Milestone: ${updatedStartup.name} is live at ${startupUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: body.approved ? "Vibe Code Live & Founder Notified" : "Vibe Code Status Updated",
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