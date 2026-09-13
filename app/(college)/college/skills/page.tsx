import { getCollegeOverview } from "@/lib/actions/college.action";
import CollegePath from "@/components/college/CollegePath";

export default async function CollegeSkillsPage() {
  const { students } = await getCollegeOverview();
  const skillSums: Record<string, { sum: number; n: number }> = {};
  for (const student of students) {
    for (const [skill, value] of Object.entries(student.sections)) {
      const cur = skillSums[skill] || { sum: 0, n: 0 };
      skillSums[skill] = { sum: cur.sum + value, n: cur.n + 1 };
    }
  }
  const averages = Object.entries(skillSums)
    .map(([skill, info]) => ({
      skill,
      avg: Math.round(info.sum / info.n),
      n: info.n,
    }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <CollegePath current="/college/skills" />
      <h1 className="text-3xl font-semibold tracking-tight">Monitor skills</h1>
      <p className="mt-2 text-muted-foreground">
        Live assessment marks from students who signed in and took a test.
      </p>

      {averages.length > 0 && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Campus averages</h2>
          <ul className="mt-4 space-y-3">
            {averages.map((item) => (
              <li key={item.skill}>
                <div className="flex justify-between text-sm">
                  <span>{item.skill}</span>
                  <span>
                    {item.avg}% · {item.n} students
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${item.avg}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 space-y-3">
        <h2 className="font-semibold">Students</h2>
        {students.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No live student assessments yet.
          </p>
        )}
        {students.map((student) => (
          <article key={student.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {student.updatedAt
                    ? `Updated ${new Date(student.updatedAt).toLocaleString()}`
                    : "Student portal account"}
                </p>
              </div>
              <span className="text-sm font-medium">{student.overall}%</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {Object.entries(student.sections)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([skill, value]) => `${skill} ${value}%`)
                .join(" · ") || "No marks yet"}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
