"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AssessmentBank, AssessmentQuestion } from "@/lib/assessment/catalog";
import { APTITUDE_BANK, mixSkillsAndAptitude } from "@/lib/assessment/catalog";
import { rankInternships, saveSkillProfile } from "@/lib/assessment/profile";
import { saveSkillProfileRemote } from "@/lib/actions/student.action";
import { cn } from "@/lib/utils";

export default function TestPlayer({ banks }: { banks: AssessmentBank[] }) {
  const languageLabel = banks.map((bank) => bank.title).join(", ");
  const bankKey = banks.map((bank) => bank.id).join(",");
  const [questions, setQuestions] = useState<AssessmentQuestion[] | null>(null);
  const [source, setSource] = useState<"groq" | "ollama" | "saved" | "loading">(
    "loading"
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const savedMix = () =>
      mixSkillsAndAptitude(
        banks.map((item) => ({ title: item.title, questions: item.questions })),
        APTITUDE_BANK.questions
      );

    const load = async () => {
      setSource("loading");
      setLoadError(null);
      try {
        const response = await fetch("/api/assessment/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bankIds: banks.map((item) => item.id) }),
        });
        const result = await response.json();
        if (cancelled) return;
        if (Array.isArray(result.questions) && result.questions.length > 0) {
          setQuestions(result.questions);
          setSource(
            result.source === "groq" || result.source === "ollama"
              ? result.source
              : "saved"
          );
          setLoadError(null);
        } else {
          setQuestions(savedMix());
          setSource("saved");
          setLoadError(null);
        }
      } catch {
        if (cancelled) return;
        setQuestions(savedMix());
        setSource("saved");
        setLoadError(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [bankKey]);

  const paper = questions || [];
  const question = paper[index];
  const total = paper.length;
  const selected = question ? answers[question.id] : undefined;

  const score = useMemo(() => {
    return paper.filter((item) => answers[item.id] === item.correctIndex).length;
  }, [answers, paper]);

  const sectionScores = useMemo(() => {
    const groups = new Map<string, { correct: number; total: number }>();
    for (const item of paper) {
      const name = item.section || "Score";
      const current = groups.get(name) || { correct: 0, total: 0 };
      current.total += 1;
      if (answers[item.id] === item.correctIndex) current.correct += 1;
      groups.set(name, current);
    }
    return Array.from(groups.entries());
  }, [answers, paper]);

  const sectionPercents = useMemo(() => {
    const profile: Record<string, number> = {};
    for (const [name, value] of sectionScores) {
      profile[name] = Math.round((value.correct / value.total) * 100);
    }
    return profile;
  }, [sectionScores]);

  useEffect(() => {
    if (!submitted || total === 0) return;
    const overall = Math.round((score / total) * 100);
    saveSkillProfile({
      language: languageLabel,
      overall,
      sections: sectionPercents,
    });
    void saveSkillProfileRemote({
      language: languageLabel,
      overall,
      sections: sectionPercents,
      savedAt: new Date().toISOString(),
    });
  }, [submitted, score, total, languageLabel, sectionPercents]);

  if (source === "loading" || !question) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-medium">Building your mixed paper…</p>
        <p className="mt-2 text-sm text-muted-foreground">
          25 language ({languageLabel}) + 25 aptitude. Tries Groq, then local Ollama
          if Groq is rate-limited, then the saved mix.
        </p>
      </div>
    );
  }

  if (submitted) {
    const percent = Math.round((score / total) * 100);
    const matches = rankInternships(sectionPercents).slice(0, 3);
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          {languageLabel} + aptitude
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Score: {percent}%</h1>
        <p className="mt-2 text-muted-foreground">
          {score} of {total} correct. Skill vector saved on this device.
        </p>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {sectionScores.map(([name, value]) => (
            <li key={name}>
              {name}: {Math.round((value.correct / value.total) * 100)}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-left">
          <p className="text-sm font-medium">Closest sample internships</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cosine similarity on the skill vector (demo jobs, not live listings).
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {matches.map((job) => (
              <li key={job.title}>
                {job.title} · {(job.score * 100).toFixed(0)}% match
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/assessment/gaps">See skill gaps</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/assessment/learn">Recommended learning</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/internships">Internships</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile">Open profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {question.section ? `${question.section} · ` : ""}
            {languageLabel} + aptitude
            {source === "groq"
              ? " · Groq"
              : source === "ollama"
                ? " · local Ollama"
                : " · saved mix"}
          </p>
          <h1 className="text-xl font-semibold">
            Question {index + 1} of {total}
          </h1>
          {loadError && <p className="mt-1 text-xs text-muted-foreground">{loadError}</p>}
        </div>
        <p className="text-sm text-muted-foreground">About 50 min</p>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-primary">{question.section}</p>
        <p className="mt-2 whitespace-pre-line text-lg font-medium leading-relaxed">
          {question.prompt}
        </p>
        <div className="mt-6 space-y-2">
          {question.options.map((option, optionIndex) => {
            const active = selected === optionIndex;
            return (
              <button
                key={`${optionIndex}-${option}`}
                type="button"
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                }
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mt-6 mb-24 flex flex-col items-stretch gap-2">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((value) => value - 1)}
          >
            Previous
          </Button>
          {index < total - 1 ? (
            <Button
              disabled={selected === undefined}
              onClick={() => setIndex((value) => value + 1)}
            >
              Next
            </Button>
          ) : (
            <Button onClick={() => setSubmitted(true)}>Submit</Button>
          )}
        </div>
        {selected === undefined && (
          <p className="text-center text-xs text-muted-foreground">
            {index < total - 1
              ? "Select an answer to continue."
              : "You can submit now. Skipped questions count as wrong."}
          </p>
        )}
      </div>
    </div>
  );
}
