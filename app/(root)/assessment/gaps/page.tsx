"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SAMPLE_INTERNSHIPS,
  findGaps,
  loadSkillProfile,
  rankInternships,
  type StoredSkillProfile,
} from "@/lib/assessment/profile";
import { buildLearningPath } from "@/lib/assessment/learning-catalog";
import StudentPath from "@/components/student/StudentPath";

export default function SkillGapPage() {
  const [profile, setProfile] = useState<StoredSkillProfile | null>(null);
  const [role, setRole] = useState("");
  const [tips, setTips] = useState<Record<string, string[]>>({});
  const [loadingSkill, setLoadingSkill] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadSkillProfile();
    setProfile(stored);
    if (stored) {
      const top = rankInternships(stored.sections)[0];
      setRole(top?.title || SAMPLE_INTERNSHIPS[0].title);
    }
  }, []);

  const target = SAMPLE_INTERNSHIPS.find((job) => job.title === role);
  const gaps = useMemo(() => {
    if (!profile || !target) return [];
    return findGaps(profile.sections, target.tags);
  }, [profile, target]);
  const path = useMemo(() => buildLearningPath(gaps), [gaps]);

  const loadTips = async (skill: string, have: number, need: number) => {
    setLoadingSkill(skill);
    try {
      const response = await fetch("/api/assessment/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, have, need, role }),
      });
      const result = await response.json();
      setTips((prev) => ({ ...prev, [skill]: result.tips || [] }));
    } catch {
      setTips((prev) => ({
        ...prev,
        [skill]: [`Practice ${skill} for 30 minutes and review mistakes.`],
      }));
    } finally {
      setLoadingSkill(null);
    }
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">Skill gap</h1>
        <p className="mt-2 text-muted-foreground">
          Take an assessment first. We need your scores to compare against a role.
        </p>
        <Button asChild className="mt-6">
          <Link href="/assessment">Take assessment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <StudentPath current="/assessment/gaps" />
      <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
        ← Profile
      </Link>
      <p className="mt-3 text-sm text-muted-foreground">Student portal · step 3</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Skill gap</h1>
      <p className="mt-2 text-muted-foreground">
        Your last {profile.language} + aptitude scores vs a target intern role. A gap
        means you scored below what that role needs. Open the catalog for a study path,
        or ask AI for extra practice tips.
      </p>
      {path.length > 0 && (
        <Button asChild className="mt-4">
          <Link href={`/assessment/learn?role=${encodeURIComponent(role)}`}>
            Open learning path
          </Link>
        </Button>
      )}

      <label className="mt-6 block text-sm font-medium">Target role</label>
      <select
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2"
        value={role}
        onChange={(event) => {
          setRole(event.target.value);
          setTips({});
        }}
      >
        {SAMPLE_INTERNSHIPS.map((job) => (
          <option key={job.title} value={job.title}>
            {job.title}
          </option>
        ))}
      </select>

      <div className="mt-6 space-y-4">
        {gaps.map((item) => (
          <div
            key={item.skill}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.skill}</p>
                <p className="text-sm text-muted-foreground">
                  You {item.have} · role needs {item.need}
                  {item.gap > 0 ? ` · gap ${item.gap}` : " · on track"}
                </p>
              </div>
              {item.gap > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingSkill === item.skill}
                  onClick={() => loadTips(item.skill, item.have, item.need)}
                >
                  {loadingSkill === item.skill ? "Asking AI…" : "Suggest practice"}
                </Button>
              )}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(100, item.have)}%` }}
              />
            </div>
            {(path.find((entry) => entry.skill === item.skill)?.resources ?? [])
              .slice(0, 2)
              .map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm text-primary"
                >
                  {resource.title} · {resource.provider}
                </a>
              ))}
            {tips[item.skill] && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {tips[item.skill].map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
