"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  SAMPLE_INTERNSHIPS,
  findGaps,
  loadSkillProfile,
  rankInternships,
  type StoredSkillProfile,
} from "@/lib/assessment/profile";
import {
  buildLearningPath,
  loadLearningDone,
  saveLearningDone,
  type LearningPathItem,
} from "@/lib/assessment/learning-catalog";
import { syncStudentWorkRemote } from "@/lib/actions/student.action";
import StudentPath from "@/components/student/StudentPath";

function LearningPathInner() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<StoredSkillProfile | null>(null);
  const [role, setRole] = useState("");
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const stored = loadSkillProfile();
    setProfile(stored);
    setDone(loadLearningDone());
    const fromQuery = searchParams.get("role");
    if (fromQuery && SAMPLE_INTERNSHIPS.some((job) => job.title === fromQuery)) {
      setRole(fromQuery);
      return;
    }
    if (stored) {
      const top = rankInternships(stored.sections)[0];
      setRole(top?.title || SAMPLE_INTERNSHIPS[0].title);
    }
  }, [searchParams]);

  const target = SAMPLE_INTERNSHIPS.find((job) => job.title === role);
  const path = useMemo<LearningPathItem[]>(() => {
    if (!profile || !target) return [];
    return buildLearningPath(findGaps(profile.sections, target.tags));
  }, [profile, target]);

  const allIds = path.flatMap((item) => item.resources.map((resource) => resource.id));
  const completed = allIds.filter((id) => done.includes(id)).length;

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveLearningDone(next);
      void syncStudentWorkRemote({ learningDone: next });
      return next;
    });
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">Recommended learning</h1>
        <p className="mt-2 text-muted-foreground">
          Take an assessment first. Your gaps pick the catalog items.
        </p>
        <Button asChild className="mt-6">
          <Link href="/assessment">Take assessment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <StudentPath current="/assessment/learn" />
      <Link
        href="/assessment/gaps"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Skill gaps
      </Link>
      <p className="mt-3 text-sm text-muted-foreground">Student portal · step 4</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Recommended learning</h1>
      <p className="mt-2 text-muted-foreground">
        A saved catalog matched to your {profile.language} + aptitude gaps for a
        sample intern role. Mark items done as you go. Internships stay demo listings
        until the next step.
      </p>
      <Button asChild className="mt-4">
        <Link href="/internships">Browse internships</Link>
      </Button>

      <label className="mt-6 block text-sm font-medium">Target role</label>
      <select
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2"
        value={role}
        onChange={(event) => setRole(event.target.value)}
      >
        {SAMPLE_INTERNSHIPS.map((job) => (
          <option key={job.title} value={job.title}>
            {job.title}
          </option>
        ))}
      </select>

      {allIds.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Progress {completed} / {allIds.length} items
        </p>
      )}

      {path.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="font-medium">No gaps for this role</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your scores already meet the sample bar. Pick another role or retake the
            test.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {path.map((item) => (
            <section
              key={item.skill}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h2 className="font-semibold">{item.skill}</h2>
              <p className="text-sm text-muted-foreground">
                You {item.have} · role needs {item.need} · gap {item.gap}
              </p>
              <ul className="mt-4 space-y-3">
                {item.resources.map((resource) => {
                  const checked = done.includes(resource.id);
                  return (
                    <li
                      key={resource.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.provider} · {resource.kind} · {resource.level} ·{" "}
                            {resource.hours}h
                          </p>
                        </div>
                        <label className="flex shrink-0 items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDone(resource.id)}
                          />
                          Done
                        </label>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {resource.summary}
                      </p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-primary"
                      >
                        Open resource
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LearningPathPage() {
  return (
    <Suspense fallback={<p className="p-6 text-muted-foreground">Loading path…</p>}>
      <LearningPathInner />
    </Suspense>
  );
}
