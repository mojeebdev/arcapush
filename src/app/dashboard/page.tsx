import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FounderDashboard } from "@/components/FounderDashboard";

export const metadata = {
  title: "Dashboard · Arcapush",
  description: "Manage your listed products on Arcapush.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/auth/signin");
  if (!(session.user as any).onboardingComplete) redirect("/onboarding");

  return (
    <FounderDashboard
      user={{
        id:    session.user.id   ?? "",
        name:  session.user.name ?? "Founder",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
    />
  );
}