import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubmitForm from "./SubmitForm";

export default async function SubmitPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/submit");
  }

  return <SubmitForm />;
}