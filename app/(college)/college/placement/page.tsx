import { getCollegeOverview } from "@/lib/actions/college.action";
import CollegePath from "@/components/college/CollegePath";

export default async function CollegePlacementPage() {
  const { students, postings } = await getCollegeOverview();
  const offered = students.flatMap((student) =>
    student.applications
      .filter((app) => app.status === "offered")
      .map((app) => ({ student: student.name, title: app.title, via: "Student job tracker" }))
  );
  const recruited = postings.flatMap((post) =>
    Object.entries(post.decisions || {})
      .filter(([, action]) => action === "recruited" || action === "mentoring")
      .map(([studentId, action]) => {
        const student = students.find((item) => item.id === studentId);
        return {
          student: student?.name || studentId,
          title: post.title,
          via: action === "mentoring" ? "Industry mentor" : "Industry recruit",
        };
      })
  );
  const pipeline = [...offered, ...recruited];
  const interviewing = students.reduce(
    (n, s) => n + s.applications.filter((a) => a.status === "interviewing").length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <CollegePath current="/college/placement" />
      <h1 className="text-3xl font-semibold tracking-tight">Monitor placement</h1>
      <p className="mt-2 text-muted-foreground">
        Offers from the student tracker and recruit / mentor actions from industry.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Interviewing</p>
          <p className="mt-2 text-3xl font-semibold">{interviewing}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Offers</p>
          <p className="mt-2 text-3xl font-semibold">{offered.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Recruited / mentored</p>
          <p className="mt-2 text-3xl font-semibold">{recruited.length}</p>
        </div>
      </div>

      <section className="mt-8 space-y-3">
        {pipeline.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No placements yet. They appear when a student marks an offer or
            industry recruits / mentors a matched student.
          </p>
        )}
        {pipeline.map((item, index) => (
          <article key={`${item.student}-${item.title}-${index}`} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold">{item.student}</h3>
            <p className="text-sm text-muted-foreground">
              {item.title} · {item.via}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
