export type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  section?: string;
};

export type AssessmentBank = {
  id: string;
  title: string;
  kind: "skill" | "aptitude";
  minutes: number;
  questions: AssessmentQuestion[];
};

import { APTITUDE_BANK } from "@/lib/assessment/aptitude";
import {
  JAVA_QUESTIONS,
  JAVASCRIPT_QUESTIONS,
  PYTHON_QUESTIONS,
  SQL_QUESTIONS,
} from "@/lib/assessment/skill-questions";
import {
  CPP_QUESTIONS,
  C_QUESTIONS,
  GO_QUESTIONS,
  HTML_QUESTIONS,
  PHP_QUESTIONS,
  TYPESCRIPT_QUESTIONS,
} from "@/lib/assessment/extra-skill-questions";

export { APTITUDE_BANK };

export const SKILL_BANKS: AssessmentBank[] = [
  { id: "python", title: "Python", kind: "skill", minutes: 50, questions: PYTHON_QUESTIONS },
  { id: "java", title: "Java", kind: "skill", minutes: 50, questions: JAVA_QUESTIONS },
  { id: "javascript", title: "JavaScript", kind: "skill", minutes: 50, questions: JAVASCRIPT_QUESTIONS },
  { id: "typescript", title: "TypeScript", kind: "skill", minutes: 50, questions: TYPESCRIPT_QUESTIONS },
  { id: "c", title: "C", kind: "skill", minutes: 50, questions: C_QUESTIONS },
  { id: "cpp", title: "C++", kind: "skill", minutes: 50, questions: CPP_QUESTIONS },
  { id: "sql", title: "SQL", kind: "skill", minutes: 50, questions: SQL_QUESTIONS },
  { id: "html", title: "HTML/CSS", kind: "skill", minutes: 50, questions: HTML_QUESTIONS },
  { id: "php", title: "PHP", kind: "skill", minutes: 50, questions: PHP_QUESTIONS },
  { id: "go", title: "Go", kind: "skill", minutes: 50, questions: GO_QUESTIONS },
];

export function getBank(id: string): AssessmentBank | undefined {
  if (id === APTITUDE_BANK.id) return APTITUDE_BANK;
  return SKILL_BANKS.find((bank) => bank.id === id);
}

export function shuffleQuestions(items: AssessmentQuestion[]): AssessmentQuestion[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** 25 skill (split across selected languages) + 25 aptitude = 50. */
export function mixSkillsAndAptitude(
  skillSets: { title: string; questions: AssessmentQuestion[] }[],
  aptitude: AssessmentQuestion[],
  total = 50
): AssessmentQuestion[] {
  const sets = skillSets.filter((set) => set.questions.length > 0);
  const aptCount = Math.min(25, Math.floor(total / 2));
  const skillCount = total - aptCount;
  if (sets.length === 0) {
    return shuffleQuestions(aptitude)
      .slice(0, total)
      .map((item, index) => ({ ...item, id: `mix-${index + 1}` }));
  }

  const per = Math.floor(skillCount / sets.length);
  let remainder = skillCount % sets.length;
  const skillQs: AssessmentQuestion[] = [];
  for (const set of sets) {
    const take = per + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    skillQs.push(
      ...shuffleQuestions(set.questions)
        .slice(0, take)
        .map((item) => ({ ...item, section: set.title }))
    );
  }
  const apt = shuffleQuestions(aptitude).slice(0, aptCount);
  return shuffleQuestions([...skillQs, ...apt]).map((item, index) => ({
    ...item,
    id: `mix-${index + 1}`,
  }));
}

/** 25 language + 25 aptitude, shuffled to 50. */
export function mixLanguageAndAptitude(
  language: AssessmentQuestion[],
  aptitude: AssessmentQuestion[],
  title?: string
): AssessmentQuestion[] {
  return mixSkillsAndAptitude(
    [{ title: title || language[0]?.section || "Language", questions: language }],
    aptitude
  );
}
