import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import CollegeShell from "@/components/layout/CollegeShell";

export default async function CollegeLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.portal !== "college") {
    redirect("/college/sign-in");
  }
  return <CollegeShell>{children}</CollegeShell>;
}
