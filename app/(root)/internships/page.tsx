"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentPath from "@/components/student/StudentPath";
import { INTERNSHIP_JOBS } from "@/lib/internships/catalog";
import {
  NEXT_STATUS,
  loadApplications,
  statusLabel,
  upsertApplication,
  type ApplicationStatus,
  type InternshipApplication,
} from "@/lib/internships/applications";
import { cosine, loadSkillProfile } from "@/lib/assessment/profile";

export default function InternshipsPage() {
  const [apps, setApps] = useState<InternshipApplication[]>([]);
  const [sections, setSections] = useState<Record<string, number>>({});

  useEffect(() => {
    setApps(loadApplications());
    setSections(loadSkillProfile()?.sections || {});
  }, []);

  const ranked = useMemo(() => {
    return INTERNSHIP_JOBS.map((job) => ({
      job,
      match: Object.keys(sections).length ? cosine(sections, job.tags) : 0,
    })).sort((a, b) => b.match - a.match);
  }, [sections]);

  const setStatus = (jobId: string, status: ApplicationStatus) => {
    setApps(upsertApplication(jobId, status, apps));
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <StudentPath current="/internships" />
      <p className="text-sm text-muted-foreground">Student portal · step 5</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Internships</h1>
      <p className="mt-2 text-muted-foreground">
        Demo campus listings only — not live company boards. Tap Apply first. Later
        steps unlock in order: interviewing, then offer or rejection.
      </p>

      <div className="mt-8 space-y-4">
        {ranked.map(({ job, match }) => {
          const application = apps.find((item) => item.jobId === job.id);
          return (
            <article
              key={job.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {job.company} · {job.location} · {job.mode} · {job.stipend}
                  </p>
                  {Object.keys(sections).length > 0 && (
                    <p className="mt-1 text-xs text-primary">
                      {(match * 100).toFixed(0)}% match to your skill profile
                    </p>
                  )}
                </div>
                {!application ? (
                  <Button size="sm" onClick={() => setStatus(job.id, "applied")}>
                    Apply
                  </Button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-border px-3 py-1 text-xs">
                      {statusLabel(application.status)}
                    </span>
                    {(NEXT_STATUS[application.status] || []).map((step) => (
                      <Button
                        key={step.id}
                        size="sm"
                        variant={step.id === "rejected" ? "outline" : "default"}
                        onClick={() => setStatus(job.id, step.id)}
                      >
                        {step.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{job.summary}</p>
              {application?.status === "interviewing" && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/interview">Practice mock for this role</Link>
                </Button>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/assessment/learn">Back to learning</Link>
        </Button>
        <Button asChild>
          <Link href="/portfolio">Open portfolio</Link>
        </Button>
      </div>
    </div>
  );
}
