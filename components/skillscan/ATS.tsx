"use client";

import ScoreBadge from "@/components/skillscan/ScoreBadge";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const scoreColor =
    score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";
  const accent =
    score > 70
      ? "border-l-green-500"
      : score > 49
        ? "border-l-yellow-500"
        : "border-l-red-500";

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-border border-l-4 bg-card ${accent}`}>
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold">ATS Compatibility</h3>
            <ScoreBadge score={score} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            How well this resume is likely to pass applicant tracking systems.
          </p>
        </div>
        <p className="shrink-0 text-lg font-semibold tabular-nums">
          <span className={scoreColor}>{score}</span>
          <span className="text-muted-foreground">/100</span>
        </p>
      </div>

      <ul className="space-y-2 px-5 pb-5">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={
              suggestion.type === "good"
                ? "rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                : "rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2.5 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300"
            }
          >
            {suggestion.tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ATS;
