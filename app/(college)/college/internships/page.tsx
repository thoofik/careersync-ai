import { getCollegeOverview } from "@/lib/actions/college.action";
import CollegePath from "@/components/college/CollegePath";
import { kindLabel } from "@/lib/industry/postings";

export default async function CollegeInternshipsPage() {
  const { students, postings } = await getCollegeOverview();
  const internships = postings.filter((item) => item.kind === "internship" || item.kind === "job");

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <CollegePath current="/college/internships" />
      <h1 className="text-3xl font-semibold tracking-tight">Monitor internships</h1>
      <p className="mt-2 text-muted-foreground">
        Live industry listings plus student applications from the student portal.
      </p>

      <section className="mt-8">
        <h2 className="font-semibold">Industry listings</h2>
        <div className="mt-3 space-y-3">
          {internships.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No live industry internships or jobs posted yet.
            </p>
          )}
          {internships.map((post) => (
            <article key={post.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground">{kindLabel(post.kind)}</p>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-muted-foreground">
                {post.company} · {post.location} · {post.mode}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Skills: {Object.keys(post.requiredSkills || {}).join(", ") || "—"}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Student applications</h2>
        <div className="mt-3 space-y-3">
          {students.every((s) => s.applications.length === 0) && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Students have not applied from the Jobs page yet.
            </p>
          )}
          {students.flatMap((student) =>
            student.applications.map((app) => (
              <article
                key={`${student.id}-${app.title}-${app.status}`}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {app.title} · <span className="capitalize">{app.status}</span>
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
