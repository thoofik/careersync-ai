import Link from "next/link";
import { listStudentsForIndustry } from "@/lib/actions/student.action";
import IndustryPath from "@/components/industry/IndustryPath";

export default async function IndustryStudentsPage() {
  const students = await listStudentsForIndustry();

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <IndustryPath current="Match" />
      <p className="text-sm text-muted-foreground">Industry · student work</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Students</h1>
      <p className="mt-2 text-muted-foreground">
        Open a profile to see skill marks, learning, applications, and mock
        scores. This list is live from the student portal (assessment, learning,
        applications, and mocks).
      </p>

      <div className="mt-8 space-y-4">
        {students.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No live student work yet. When a student signs in and takes an
            assessment, marks learning done, or applies, they show up here.
          </p>
        )}
        {students.map((student) => {
          const top = Object.entries(student.sections)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
          return (
            <Link
              key={student.id}
              href={`/industry/students/${student.id}`}
              className="block rounded-2xl border border-border bg-card p-5 hover:border-primary/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{student.name}</h2>
                  <p className="text-sm text-muted-foreground">{student.headline}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Marks:{" "}
                    {top.map(([skill, value]) => `${skill} ${value}%`).join(" · ")}
                  </p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs">
                  {student.overall}% overall
                  {student.demo ? " · demo" : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
