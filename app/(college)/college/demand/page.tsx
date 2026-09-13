import { getCollegeOverview } from "@/lib/actions/college.action";
import CollegePath from "@/components/college/CollegePath";

export default async function CollegeDemandPage() {
  const { demand, postings } = await getCollegeOverview();

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <CollegePath current="/college/demand" />
      <h1 className="text-3xl font-semibold tracking-tight">Industry skill demand</h1>
      <p className="mt-2 text-muted-foreground">
        Required skills from live industry listings, compared with campus averages.
      </p>

      {demand.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No industry listings yet. When industry posts a job with required skills,
          demand shows here.
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {demand.map((item) => (
          <li key={item.skill} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{item.skill}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.listings} listing{item.listings === 1 ? "" : "s"} · industry
                  need {item.avgNeed}% · campus avg {item.studentAvg}%
                </p>
              </div>
              <span className="text-sm">
                {item.gap > 0 ? `Gap ${item.gap}` : "Meets demand"}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              <Bar label="Industry need" value={item.avgNeed} />
              <Bar label="Campus average" value={item.studentAvg} />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-muted-foreground">{postings.length} live industry posts</p>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
