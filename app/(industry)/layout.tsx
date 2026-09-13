import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import IndustryShell from "@/components/layout/IndustryShell";

export default async function IndustryLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.portal !== "industry") {
    redirect("/industry/sign-in");
  }

  return <IndustryShell>{children}</IndustryShell>;
}
