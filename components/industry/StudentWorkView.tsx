import type { IndustryStudentDetail } from "@/lib/actions/student.action";

export default function StudentWorkView({
  student,
}: {
  student: IndustryStudentDetail;
}) {
  const skills = Object.entries(student.sections).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs text-muted-foreground">
          {student.demo ? "Demo student" : "CareerSync student"} · {student.campus}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{student.name}</h1>
        <p className="mt-1 text-muted-foreground">{student.headline}</p>
        <p className="mt-3 text-sm">
          Overall assessment <span className="font-semibold">{student.overall}%</span>
          {student.mockCount > 0 && (
            <>
              {" "}
              · {student.mockCount} mocks · avg {student.mockAverage}/100 · best{" "}
              {student.mockBest}/100
            </>
          )}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Skill marks</h2>
        <ul className="mt-4 space-y-3">
          {skills.map(([skill, value]) => (
            <li key={skill}>
              <div className="flex justify-between text-sm">
                <span>{skill}</span>
                <span className="tabular-nums">{value}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">How they are working</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {student.learningDone.length} learning items done
        </p>
        {student.learningDone.length > 0 && (
          <ul className="mt-3 list-inside list-disc text-sm">
            {student.learningDone.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {student.notes.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {student.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Applications</h2>
        {student.applications.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No applications listed.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {student.applications.map((item) => (
              <li key={`${item.title}-${item.status}`} className="flex justify-between gap-3">
                <span>{item.title}</span>
                <span className="text-muted-foreground capitalize">{item.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
