import { SKILL_BANKS } from "@/lib/assessment/catalog";

export const INDUSTRY_SKILLS = [
  ...SKILL_BANKS.map((bank) => bank.title),
  "Quantitative",
  "Logical reasoning",
  "Verbal ability",
] as const;

export type IndustrySkill = (typeof INDUSTRY_SKILLS)[number];
