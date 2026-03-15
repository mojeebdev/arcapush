import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();

  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  
  if ((session.user as any).onboardingComplete === true) {
    redirect("/submit");
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div
          className="pb-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="mb-2 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span className="inline-block w-4 h-px" style={{ background: "var(--accent)" }} />
            Welcome
          </div>
          <h1
            className="ap-display mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)" }}
          >
            Set Up Your Profile
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}>
            Tell us a bit about yourself before listing your product.
          </p>
        </div>

        <OnboardingForm
          userId={session.user.id ?? ""}
          defaultName={session.user.name ?? ""}
          defaultEmail={session.user.email ?? ""}
        />

      </div>
    </main>
  );
}