import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminSecret } = body;

    if (adminSecret !== process.env.ADMIN_PIN) {
      console.error("Authorization Denied: PIN mismatch.");
      return NextResponse.json({ error: 'Invalid Guardian PIN' }, { status: 401 });
    }

    const approved = status === 'APPROVED';

    
    const startup = await prisma.startup.update({
      where: { id },
      data: {
        approved,
      },
    });

    if (approved) {
      const categorySlug = categoryToSlug(startup.category);
      const pathSlug = startup.slug ?? startup.id;
      const startupUrl = `https://arcapush.com/startup/${categorySlug}/${pathSlug}`;

      await resend.emails.send({
        from: 'Arcapush <system@arcapush.com>',
        to: startup.founderEmail,
        subject: `🚀 Your listing is live: ${startup.name}`,
        html: `
          <div style="font-family: sans-serif; background: #0a0a0a; color: #f0ede8; padding: 40px; border-radius: 20px; border: 1px solid rgba(232,255,71,0.15);">
            <h1 style="text-transform: uppercase; letter-spacing: -1px; color: #5b2bff;">You're Live.</h1>
            <p style="color: #888580;">Hello ${startup.founderName},</p>
            <p style="color: #888580;">
              Your listing for <strong style="color: #f0ede8;">${startup.name}</strong> has been approved
              and is now live in the Arcapush registry.
            </p>

            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
              <tr>
                <td>
                  <a href="${startupUrl}" target="_blank"
                     style="background: #5b2bff; color: #0a0a0a; padding: 14px 28px; border-radius: 10px;
                            text-decoration: none; font-weight: 900; font-size: 12px;
                            text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
                    View Your Listing
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size: 11px; color: #666;">
              Link not working? Copy this:<br/>
              <span style="color: #5b2bff;">${startupUrl}</span>
            </p>

            <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
            <p style="font-size: 10px; color: #4a4845; letter-spacing: 2px; text-transform: uppercase;">
              Arcapush — https://arcapush.com
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Startup ${status.toLowerCase()} successfully.`,
      data: startup,
    });

  } catch (error: any) {
    console.error('Startup approval error:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast signal', details: error.message },
      { status: 500 }
    );
  }
}