"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import IndustryPath from "@/components/industry/IndustryPath";
import { loadIndustryCandidates } from "@/lib/industry/candidates";
import { rankCandidates } from "@/lib/industry/match";
import { listStudentsForIndustry } from "@/lib/actions/student.action";
import { saveIndustryPostingRemote } from "@/lib/actions/industry.action";
import type { StudentCandidate } from "@/lib/industry/candidates";
import {
  actionLabel,
  getPosting,
  kindLabel,
  loadPostings,
  setCandidateAction,
  type CandidateAction,
  type IndustryPosting,
} from "@/lib/industry/postings";

function nextActions(current: CandidateAction): { id: CandidateAction; label: string }[] {
  if (current === "none") return [{ id: "shortlisted", label: "Shortlist" }];
  if (current === "shortlisted") {
    return [
      { id: "recruited", label: "Recruit" },
      { id: "mentoring", label: "Mentor" },
    ];
  }
  return [];
}

export default function IndustryMatchPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [post, setPost] = useState<IndustryPosting | null>(null);
  const [ready, setReady] = useState(false);
  const [remote, setRemote] = useState<StudentCandidate[]>([]);

  useEffect(() => {
    setPost(getPosting(id) || null);
    setReady(true);
    listStudentsForIndustry().then(setRemote).catch(() => undefined);
  }, [id]);

  const ranked = useMemo(() => {
    if (!post) return [];
    return rankCandidates(post, loadIndustryCandidates(remote));
  }, [post, remote]);

  const decide = (studentId: string, action: CandidateAction) => {
    const items = setCandidateAction(id, studentId, action, loadPostings());
    const next = items.find((item) => item.id === id) || null;
    setPost(next);
    if (next) void saveIndustryPostingRemote(next);
  };

  if (!ready) {
    return <div className="mx-auto max-w-3xl pb-24 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl pb-24">
        <p className="text-muted-foreground">Listing not found on this browser.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/industry">Back to listings</Link>
        </Button>
      </div>
    );
  }

  const pipeline = (action: CandidateAction) =>
    ranked.filter(({ student }) => (post.decisions[student.id] || "none") === action);

  const currentStep =
    pipeline("recruited").length + pipeline("mentoring").length > 0
      ? "Recruit / Mentor"
      : pipeline("shortlisted").length > 0
        ? "Shortlist"
        : "Match";

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <IndustryPath current={currentStep} />
      <p className="text-sm text-muted-foreground">
        {kindLabel(post.kind)} · AI match
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {post.company} · {post.location} · {post.mode}
        {post.stipend ? ` · ${post.stipend}` : ""}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{post.summary}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Required:{" "}
        {Object.entries(post.requiredSkills)
          .map(([skill, need]) => `${skill} ${need}`)
          .join(" · ")}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Matched students</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live students from the student portal, ranked by skill match.
        </p>
        <div className="mt-4 space-y-4">
          {ranked.map(({ student, match, gaps }) => {
            const action = post.decisions[student.id] || "none";
            return (
              <article
                key={student.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.headline} · {student.campus}
                    </p>
                    <p className="mt-1 text-xs text-primary">
                      {(match * 100).toFixed(0)}% match
                      {student.demo ? " · demo" : ""}
                    </p>
                    {gaps.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Gaps:{" "}
                        {gaps
                          .slice(0, 3)
                          .map((item) => `${item.skill} −${item.gap}`)
                          .join(", ")}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Marks:{" "}
                      {Object.entries(student.sections)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([skill, value]) => `${skill} ${value}%`)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/industry/students/${student.id}`}>
                        View profile
                      </Link>
                    </Button>
                    {action !== "none" && (
                      <span className="rounded-full border border-border px-3 py-1 text-xs">
                        {actionLabel(action)}
                      </span>
                    )}
                    {nextActions(action).map((step) => (
                      <Button
                        key={step.id}
                        size="sm"
                        variant={step.id === "mentoring" ? "outline" : "default"}
                        onClick={() => decide(student.id, step.id)}
                      >
                        {step.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/industry">All listings</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/industry/post">Post another</Link>
        </Button>
      </div>
    </div>
  );
}
