import Link from "next/link";
import { getCollegeOverview } from "@/lib/actions/college.action";
import CollegePath from "@/components/college/CollegePath";

export default async function CollegeHomePage() {
  const { students, postings, demand } = await getCollegeOverview();
  const applied = students.reduce((n, s) => n + s.applications.length, 0);
  const placed = students.reduce(
    (n, s) => n + s.applications.filter((a) => a.status === "offered").length,
    0
  );
  const recruited = postings.reduce(
    (n, p) => n + Object.values(p.decisions || {}).filter((d) => d === "recruited").length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <CollegePath current="/college" />
      <p className="text-sm text-muted-foreground">College portal · live student + industry data</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">College</h1>
      <p className="mt-2 text-muted-foreground">
        Monitor skills, internships, and placements from the student portal. Then
        compare that to live industry skill demand.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat href="/college/skills" label="Students" value={students.length} />
        <Stat href="/college/internships" label="Applications" value={applied} />
        <Stat href="/college/placement" label="Offers / recruited" value={placed + recruited} />
        <Stat href="/college/demand" label="Industry listings" value={postings.length} />
      </div>

      {demand[0] && (
        <p className="mt-6 text-sm text-muted-foreground">
          Highest industry demand right now: <strong>{demand[0].skill}</strong> (
          {demand[0].listings} listings, campus avg {demand[0].studentAvg}% vs need{" "}
          {demand[0].avgNeed}%).
        </p>
      )}
    </div>
  );
}

function Stat({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: number;
}) {
  return (
    <Link href={href} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Link>
  );
}
