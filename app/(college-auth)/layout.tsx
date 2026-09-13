import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Card, CardContent } from "@/components/ui/card";

export default async function CollegeAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (user?.portal === "college") redirect("/college");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
