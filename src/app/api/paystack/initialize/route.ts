import { NextResponse } from "next/server";
import { AdminConfig } from "@/lib/adminConfig";

const USD_TO_NGN = 1420;

export async function POST(request: Request) {
  try {
    const { email, startupId, packageValue } = await request.json();

    if (!email || !startupId || !packageValue) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pkg = AdminConfig.PIN_PACKAGES.find((p) => p.value === packageValue);
    if (!pkg || pkg.price === 0) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Convert USD to kobo (NGN * 100)
    const amountKobo = Math.round(pkg.price * USD_TO_NGN * 100);

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount:       amountKobo,
        currency:     "NGN",
        reference:    `ap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        callback_url: `${AdminConfig.SITE_URL}/api/paystack/callback`,
        metadata: {
          startupId,
          packageValue,
          packageLabel: pkg.label,
          custom_fields: [
            { display_name: "Product ID",  variable_name: "startup_id",  value: startupId    },
            { display_name: "Plan",         variable_name: "package",     value: pkg.label    },
          ],
        },
        channels: ["card", "apple_pay", "bank", "ussd"],
      }),
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || "Paystack error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference:        data.data.reference,
    });
  } catch (err) {
    console.error("Paystack init error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}