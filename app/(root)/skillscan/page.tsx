"use client";

import Navbar from "@/components/skillscan/Navbar";
import ResumeCard from "@/components/skillscan/ResumeCard";
import LoadingScan from "@/components/skillscan/LoadingScan";
import { usePuterStore } from "@/lib/skillscan/puter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SkillScanResume } from "@/types/skillscan";

export default function SkillScanHomePage() {
  const { auth, kv, puterReady, error, isLoading, authChecked } = usePuterStore();
  const router = useRouter();
  const [resumes, setResumes] = useState<SkillScanResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!puterReady || !authChecked || isLoading) return;
    if (!auth.isAuthenticated) {
      router.push("/skillscan/auth?next=/skillscan");
    }
  }, [auth.isAuthenticated, authChecked, isLoading, puterReady, router]);

  useEffect(() => {
    if (!puterReady || !auth.isAuthenticated) return;

    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const items = (await kv.list("resume:*", true)) as KVItem[] | undefined;
        const parsed =
          items
            ?.map((item) => {
              try {
                const value =
                  typeof item.value === "string"
                    ? JSON.parse(item.value)
                    : item.value;
                return value as SkillScanResume;
              } catch {
                return null;
              }
            })
            .filter((item): item is SkillScanResume => Boolean(item?.id)) || [];
        setResumes(parsed);
      } catch {
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [auth.isAuthenticated, puterReady, kv]);

  return (
    <div className="mx-auto max-w-6xl">
      <Navbar />

      {error && auth.isAuthenticated && (
        <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {loadingResumes && <LoadingScan label="Loading your resumes…" />}

      {!loadingResumes && resumes.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">Track applications and resume ratings</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            No resumes yet. Upload a PDF to get an ATS score and improvement tips.
          </p>
          <Link href="/skillscan/upload" className="btn-primary mx-auto mt-6 w-fit">
            Upload Resume
          </Link>
        </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div>
          <p className="mb-6 text-muted-foreground">
            Review your submissions and AI-powered feedback.
          </p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
