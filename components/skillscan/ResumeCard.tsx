"use client";

import Link from "next/link";
import ScoreCircle from "@/components/skillscan/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "@/lib/skillscan/puter";
import type { SkillScanResume } from "@/types/skillscan";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: SkillScanResume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    let url = "";
    const loadResume = async () => {
      if (!imagePath) return;
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch {
        // Missing preview files should not block the scan list.
      }
    };

    loadResume();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imagePath, fs]);

  const score =
    typeof feedback === "object" && feedback ? feedback.overallScore : 0;

  return (
    <Link
      href={`/skillscan/resume/${id}`}
      className="flex h-[520px] w-full flex-col gap-5 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[#fe5933]/40"
    >
      <div className="flex min-h-[100px] items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          {companyName && <h2 className="break-words font-bold">{companyName}</h2>}
          {jobTitle && <h3 className="text-lg break-words text-muted-foreground">{jobTitle}</h3>}
          {!companyName && !jobTitle && <h2 className="font-bold">Resume</h2>}
        </div>
        <ScoreCircle score={score} />
      </div>
      {resumeUrl && (
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src={resumeUrl}
            alt="resume"
            decoding="async"
            className="h-[350px] w-full object-cover object-top max-sm:h-[200px]"
          />
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
