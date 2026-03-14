import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';
import { generateUniqueSlug } from "@/lib/slug";
import { AdminConfig } from "@/lib/adminConfig";

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
      const startupUrl = `${AdminConfig.SITE_URL}/startup/${canonicalPath}`;

      await resend.emails.send({
        from: 'Arcapush <system@arcapush.com>',
        to: [updatedStartup.founderEmail],
        subject: `Listing Live: ${updatedStartup.name}`,
        html: `
          <div style="font-family: sans-serif; background: #0a0a0a; color: #f0ede8; padding: 40px; border-radius: 20px; border: 1px solid rgba(232,255,71,0.15);">
            <h1 style="text-transform: uppercase; letter-spacing: -1px;">
              <span style="color: #e8ff47;">You're Live.</span>
            </h1>
            <p style="color: #888580;">
              Your product <strong style="color: #f0ede8;">${updatedStartup.name}</strong> has been approved
              and is now indexed in the Arcapush registry.
            </p>
            <div style="margin-top: 30px;">
              <a href="${startupUrl}"
                 style="background: #e8ff47; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                View Your Listing →
              </a>
            </div>
            <div style="margin-top: 30px; padding: 20px; background: rgba(232,255,71,0.05); border: 1px solid rgba(232,255,71,0.1); border-radius: 12px;">
              <p style="font-size: 11px; color: #888580; margin: 0 0 12px;">
                Boost your listing to the hero slot and get seen by VCs actively browsing the registry.
              </p>
              <a href="${AdminConfig.SITE_URL}/pricing"
                 style="font-size: 11px; color: #e8ff47; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">
                View Boost Options →
              </a>
            </div>
            <p style="margin-top: 40px; font-size: 10px; color: #4a4845; letter-spacing: 2px; text-transform: uppercase;">
              Arcapush — ${AdminConfig.SITE_URL}
            </p>
          </div>
        `
      });

      console.log(`✅ ${updatedStartup.name} is live at ${startupUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: body.approved ? "Listing live — founder notified" : "Status updated",
      startup: updatedStartup,
    });

  } catch (error: any) {
    console.error("Approve route error:", error);
    return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
  }
}