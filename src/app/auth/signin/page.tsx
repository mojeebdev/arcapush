import { signIn } from "@/lib/auth";
import Image from "next/image";
import { SignInButtons } from "../../../components/SignInButtons";

interface Props {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const params      = await searchParams;
  const callbackUrl = params.callbackUrl || "/onboarding";

  const googleAction = async () => {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  };

  const githubAction = async () => {
    "use server";
    await signIn("github", { redirectTo: callbackUrl });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/arcapush_wordmark.png"
              alt="Arcapush"
              width={160}
              height={36}
              className="h-9 w-auto object-contain"
              style={{ filter: "brightness(0)" }}
              priority
            />
          </div>
          <h1
            className="text-4xl font-black uppercase tracking-tighter leading-none mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Sign In to<br />
            <span style={{ color: "var(--accent)" }}>List Your Product</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Google or GitHub — no passwords, no friction.
          </p>
        </div>

        {/* Error */}
        {params.error && (
          <div
            className="mb-6 px-5 py-4 rounded-xl border text-sm"
            style={{
              fontFamily:  "var(--font-mono)",
              background:  "rgba(220,38,38,0.05)",
              borderColor: "rgba(220,38,38,0.2)",
              color:       "#dc2626",
            }}
          >
            {params.error === "OAuthSignin"
              ? "Something went wrong. Try again."
              : params.error}
          </div>
        )}

        {/* Client component for interactive buttons */}
        <SignInButtons
          googleAction={googleAction}
          githubAction={githubAction}
        />

        <p className="text-center mt-8 text-xs" style={{ color: "var(--text-tertiary)" }}>
          Signing in creates your free founder account.<br />
          Wallet connect stays separate for payments.
        </p>
        <p className="text-center mt-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
          By continuing you agree to our{" "}
          <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a>
          {" "}and{" "}
          <a href="/terms" style={{ color: "var(--accent)" }}>Terms</a>
        </p>

      </div>
    </div>
  );
}