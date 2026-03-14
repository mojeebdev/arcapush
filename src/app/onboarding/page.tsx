import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-widest">Set Up Your Profile</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
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