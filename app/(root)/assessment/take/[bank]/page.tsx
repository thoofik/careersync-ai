import { redirect } from "next/navigation";
import { getBank } from "@/lib/assessment/catalog";

export default async function AssessmentTakeBankRedirect({
  params,
}: {
  params: Promise<{ bank: string }>;
}) {
  const { bank: bankId } = await params;
  const bank = getBank(bankId);
  if (!bank || bank.kind !== "skill") redirect("/assessment");
  redirect(`/assessment/take?langs=${encodeURIComponent(bank.id)}`);
}
