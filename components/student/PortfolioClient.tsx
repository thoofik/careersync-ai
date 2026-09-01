"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentPath from "@/components/student/StudentPath";
import { loadSkillProfile, type StoredSkillProfile } from "@/lib/assessment/profile";
import { LEARNING_CATALOG, loadLearningDone } from "@/lib/assessment/learning-catalog";
import {
  APPLICATION_STATUSES,
  loadApplications,
  type InternshipApplication,
} from "@/lib/internships/applications";
import { getInternship } from "@/lib/internships/catalog";
import { publishPortfolio } from "@/lib/actions/student.action";

export default function PortfolioClient({
  userId,
  name,
  mockAverage,
  mockCount,
}: {
  userId: string;
  name: string;
  mockAverage: number;
  mockCount: number;
}) {
  const [profile, setProfile] = useState<StoredSkillProfile | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [apps, setApps] = useState<InternshipApplication[]>([]);
  const [message, setMessage] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setProfile(loadSkillProfile());
    setDone(loadLearningDone());
    setApps(loadApplications());
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/p/${userId}`;
    return `${window.location.origin}/p/${userId}`;
  }, [userId]);

  const publish = async () => {
    setPublishing(true);
    setMessage("");
    const result = await publishPortfolio({
      headline: profile
        ? `${profile.language} · ${profile.overall}% assessment`
        : "CareerSync student",
      skillProfile: profile,
      learningDone: done,
      applications: apps,
      mockAverage,
      mockCount,
    });
    setPublishing(false);
    if (result.success) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setMessage("Published. Share link copied.");
      } catch {
        setMessage(`Published. Share ${shareUrl}`);
      }
    } else {
      setMessage(result.message || "Could not publish. You can still use this page privately.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <StudentPath current="/portfolio" />
      <p className="text-sm text-muted-foreground">Student portal · step 7</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Digital portfolio</h1>
      <p className="mt-2 text-muted-foreground">
        Evidence you can share: scores, learning, applications, and mock stats. Publish
        a public link for recruiters. Email stays private.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">
          {profile
            ? `Last assessment ${profile.language} + aptitude · ${profile.overall}%`
            : "No assessment yet"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={publish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish and copy link"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/p/${userId}`}>Preview public page</Link>
          </Button>
        </div>
        {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold">Skill profile</h3>
        {profile ? (
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(profile.sections).map(([skill, value]) => (
              <li key={skill} className="flex justify-between">
                <span>{skill}</span>
                <span>{value}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <Button asChild variant="outline" className="mt-3">
            <Link href="/assessment">Take assessment</Link>
          </Button>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold">Learning</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {done.length} catalog items marked done
          {LEARNING_CATALOG.length ? ` · ${LEARNING_CATALOG.length} in catalog` : ""}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/assessment/learn">Open learning path</Link>
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold">Applications</h3>
        {apps.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {apps.map((item) => {
              const job = getInternship(item.jobId);
              const status =
                APPLICATION_STATUSES.find((entry) => entry.id === item.status)?.label ||
                item.status;
              return (
                <li key={item.jobId}>
                  {job?.title || item.jobId} · {job?.company} · {status}
                </li>
              );
            })}
          </ul>
        )}
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/internships">Track internships</Link>
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold">Interviews</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {mockCount} mock{mockCount === 1 ? "" : "s"} · average {mockAverage}/100
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/interview">Mocks</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/peer-interview">Peers</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/skillscan">Resume scan</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
