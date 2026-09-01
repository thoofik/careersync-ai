import ScoreGauge from "@/components/skillscan/ScoreGauge";
import ScoreBadge from "@/components/skillscan/ScoreBadge";
import type { SkillScanFeedback } from "@/types/skillscan";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium">{title}</p>
        <ScoreBadge score={score} />
      </div>
      <p className="text-lg font-semibold tabular-nums">
        <span className={textColor}>{score}</span>
        <span className="text-muted-foreground">/100</span>
      </p>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: SkillScanFeedback }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-6 p-5">
        <ScoreGauge score={feedback.overallScore} />
        <div>
          <h3 className="text-xl font-semibold">Your Resume Score</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on tone, content, structure, and skills.
          </p>
        </div>
      </div>
      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
