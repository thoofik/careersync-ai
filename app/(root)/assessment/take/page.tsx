import Link from "next/link";
import { notFound } from "next/navigation";
import TestPlayer from "@/components/assessment/TestPlayer";
import { getBank } from "@/lib/assessment/catalog";

export default async function AssessmentTakePage({
  searchParams,
}: {
  searchParams: Promise<{ langs?: string }>;
}) {
  const { langs } = await searchParams;
  const ids = String(langs || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const banks = ids
    .map((id) => getBank(id))
    .filter((bank): bank is NonNullable<typeof bank> => Boolean(bank && bank.kind === "skill"));

  if (banks.length === 0) notFound();

  return (
    <div>
      <Link
        href="/assessment"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Choose languages
      </Link>
      <TestPlayer banks={banks} />
    </div>
  );
}
