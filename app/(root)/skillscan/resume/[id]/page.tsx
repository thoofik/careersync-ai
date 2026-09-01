"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePuterStore } from "@/lib/skillscan/puter";
import Summary from "@/components/skillscan/Summary";
import ATS from "@/components/skillscan/ATS";
import Details from "@/components/skillscan/Details";
import LoadingScan from "@/components/skillscan/LoadingScan";
import type { SkillScanFeedback } from "@/types/skillscan";

const hasFeedback = (value: unknown): value is SkillScanFeedback =>
  typeof value === "object" && value !== null && "overallScore" in value;

export default function SkillScanResumePage() {
  const { auth, isLoading, authChecked, puterReady, fs, kv } = usePuterStore();
  const params = useParams();
  const id = params.id as string;
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<SkillScanFeedback | null>(null);
  const [status, setStatus] = useState("Loading resume…");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authChecked && !auth.isAuthenticated) {
      router.push(`/skillscan/auth?next=/skillscan/resume/${id}`);
    }
  }, [isLoading, authChecked, auth.isAuthenticated, id, router]);

  useEffect(() => {
    if (!puterReady || !id) return;

    let cancelled = false;
    let imagesLoaded = false;
    const objectUrls: string[] = [];

    const parseRecord = (raw: unknown) => {
      if (typeof raw === "string") return JSON.parse(raw);
      if (raw && typeof raw === "object") return raw as Record<string, unknown>;
      throw new Error("Invalid resume record");
    };

    const applyRecord = async (raw: unknown) => {
      const data = parseRecord(raw) as {
        feedback?: unknown;
        imagePath?: string;
        resumePath?: string;
      };
      if (hasFeedback(data.feedback)) setFeedback(data.feedback);

      if (!imagesLoaded && data.imagePath) {
        imagesLoaded = true;
        const [resumeBlob, imageBlob] = await Promise.all([
          fs.read(data.resumePath),
          fs.read(data.imagePath),
        ]);
        if (cancelled) return;
        if (resumeBlob) {
          const pdfUrl = URL.createObjectURL(
            new Blob([resumeBlob], { type: "application/pdf" })
          );
          objectUrls.push(pdfUrl);
          setResumeUrl(pdfUrl);
        }
        if (imageBlob) {
          const previewUrl = URL.createObjectURL(imageBlob);
          objectUrls.push(previewUrl);
          setImageUrl(previewUrl);
        }
      }
    };

    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (cancelled || !resume) {
          if (!cancelled) setStatus("Resume not found yet. Waiting…");
          return;
        }
        await applyRecord(resume);
      } catch {
        if (!cancelled) setStatus("Could not load this resume.");
      }
    };

    loadResume();

    const interval = window.setInterval(async () => {
      if (cancelled) return;
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) return;
        const data = parseRecord(resume) as { feedback?: unknown };
        if (hasFeedback(data.feedback)) {
          setFeedback(data.feedback);
          window.clearInterval(interval);
        } else {
          setStatus("Still analyzing your resume…");
        }
      } catch {
        // Keep polling until a valid record is stored.
      }
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id, puterReady, fs, kv]);

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/skillscan"
        className="mb-6 inline-flex text-sm font-medium text-muted-foreground hover:text-[#fe5933]"
      >
        ← Back
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,2fr)_minmax(320px,3fr)]">
        <section className="rounded-2xl border border-border bg-card p-3">
          {imageUrl && resumeUrl ? (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={imageUrl}
                className="w-full rounded-xl object-contain"
                alt="Resume preview"
                decoding="async"
              />
            </a>
          ) : (
            <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
              Preview unavailable
            </div>
          )}
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Resume Review</h2>
          {feedback ? (
            <>
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </>
          ) : (
            <LoadingScan label={status} />
          )}
        </section>
      </div>
    </div>
  );
}
