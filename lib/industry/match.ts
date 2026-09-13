import { cosine } from "@/lib/assessment/profile";
import type { StudentCandidate } from "@/lib/industry/candidates";
import type { IndustryPosting } from "@/lib/industry/postings";

export type RankedCandidate = {
  student: StudentCandidate;
  match: number;
  gaps: { skill: string; have: number; need: number; gap: number }[];
};

export function rankCandidates(
  posting: IndustryPosting,
  students: StudentCandidate[]
): RankedCandidate[] {
  return students
    .map((student) => {
      const match = cosine(student.sections, posting.requiredSkills);
      const gaps = Object.entries(posting.requiredSkills)
        .map(([skill, need]) => {
          const have = student.sections[skill] ?? 0;
          return { skill, have, need, gap: Math.max(0, need - have) };
        })
        .filter((item) => item.gap > 0)
        .sort((a, b) => b.gap - a.gap);
      return { student, match, gaps };
    })
    .sort((a, b) => b.match - a.match);
}
