import type { AssessmentQuestion } from "@/lib/assessment/catalog";

export function parseGeneratedQuestions(
  raw: string,
  minCount = 8
): AssessmentQuestion[] {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON array in model output");

  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Need a JSON array");
  }

  const questions = parsed.flatMap((item, index) => {
    const row = item as Record<string, unknown>;
    const options = Array.isArray(row.options)
      ? row.options.map((option) => String(option))
      : [];
    const correctIndex = Number(row.correctIndex);
    const prompt = String(row.prompt || "").trim();
    if (
      options.length !== 4 ||
      Number.isNaN(correctIndex) ||
      correctIndex < 0 ||
      correctIndex > 3 ||
      prompt.length < 8
    ) {
      return [];
    }
    return [
      {
        id: String(row.id || `live-${index + 1}`),
        prompt,
        options,
        correctIndex,
        section: row.section ? String(row.section) : undefined,
      },
    ];
  });

  if (questions.length < minCount) {
    throw new Error(`Need at least ${minCount} valid questions in this batch`);
  }

  return questions;
}
