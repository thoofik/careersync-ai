import { INTERNSHIP_JOBS } from "@/lib/internships/catalog";

export function cosine(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const key of keys) {
    const x = a[key] || 0;
    const y = b[key] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export const SAMPLE_INTERNSHIPS = INTERNSHIP_JOBS.map(({ title, tags }) => ({
  title,
  tags,
}));

export function findGaps(
  student: Record<string, number>,
  required: Record<string, number>
) {
  return Object.entries(required)
    .map(([skill, need]) => {
      const have = student[skill] ?? 0;
      return {
        skill,
        have,
        need,
        gap: Math.max(0, need - have),
      };
    })
    .sort((a, b) => b.gap - a.gap);
}

export function fallbackLearningTips(
  skill: string,
  gap: number
): string[] {
  const tips: Record<string, string[]> = {
    Python: [
      "Complete 10 LeetCode easy problems in Python (lists, dicts, loops).",
      "Rewrite a small script using functions, then classes.",
      "Read official docs on list comprehensions and exceptions.",
    ],
    Java: [
      "Practice OOP: one class with inheritance and an interface.",
      "Solve 8 array/string problems in Java.",
      "Review collections (List, HashMap, HashSet) with small examples.",
    ],
    JavaScript: [
      "Build a small UI that fetches JSON and renders a list.",
      "Drill array methods: map, filter, reduce.",
      "Review promises/async-await with one API call.",
    ],
    SQL: [
      "Write SELECT + WHERE + JOIN on a 2-table sample schema.",
      "Practice GROUP BY and HAVING on sales-style data.",
      "Explain PRIMARY KEY vs FOREIGN KEY in your own words.",
    ],
    Quantitative: [
      "Daily 15 minutes: percentages, ratios, time-work.",
      "Time yourself on 10 campus quant MCQs.",
      "Keep an error log of formulas you miss.",
    ],
    "Logical reasoning": [
      "Practice 10 series and coding-decoding items.",
      "Draw family trees for blood-relation questions.",
      "Do 5 syllogism questions and mark which conclusion must follow.",
    ],
    "Verbal ability": [
      "Learn 10 new words with one example sentence each.",
      "Do 8 grammar (tense/article/preposition) items.",
      "Read one short article and write a 3-line summary.",
    ],
  };
  const list = tips[skill] || [
    `Spend 30 minutes this week on ${skill}.`,
    `Find 5 practice questions on ${skill} and review mistakes.`,
    `Explain ${skill} out loud as if teaching a junior.`,
  ];
  if (gap >= 30) return list;
  return list.slice(0, 2);
}

export function rankInternships(profile: Record<string, number>) {
  return SAMPLE_INTERNSHIPS.map((job) => ({
    title: job.title,
    score: cosine(profile, job.tags),
  })).sort((a, b) => b.score - a.score);
}

const PROFILE_KEY = "careersync-skill-profile";

export type StoredSkillProfile = {
  language: string;
  overall: number;
  sections: Record<string, number>;
  savedAt: string;
};

export function saveSkillProfile(profile: {
  language: string;
  overall: number;
  sections: Record<string, number>;
}) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({ ...profile, savedAt: new Date().toISOString() })
  );
}

export function loadSkillProfile(): StoredSkillProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSkillProfile;
    if (!parsed.sections || typeof parsed.overall !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}
