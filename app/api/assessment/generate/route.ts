import {
  APTITUDE_BANK,
  getBank,
  mixSkillsAndAptitude,
} from "@/lib/assessment/catalog";
import { groqBatch, ollamaBatch } from "@/lib/assessment/llm";
import type { AssessmentQuestion } from "@/lib/assessment/catalog";

export const maxDuration = 120;

const jsonShape =
  'Return ONLY a JSON array: [{"id":"q1","section":"...","prompt":"...","options":["A","B","C","D"],"correctIndex":0}]';

type Source = "groq" | "ollama" | "saved";

function parseIds(body: { bankId?: unknown; bankIds?: unknown }) {
  if (Array.isArray(body.bankIds)) {
    return body.bankIds.map((id) => String(id));
  }
  if (body.bankId) return [String(body.bankId)];
  return [];
}

async function tryLivePaper(titles: string[]) {
  const prompt = `Original campus/MNC-style MCQs. Do not copy exam papers. 4 options, correctIndex 0-3.
Create exactly 50 questions.
- 25 aptitude mixed across sections "Quantitative", "Logical reasoning", "Verbal ability".
- 25 skill questions split as evenly as possible across: ${titles.join(", ")}. Set section to that language name.
${jsonShape}`;
  return groqBatch(prompt.replace("Create exactly 50", "Create at least 40")).catch(
    () => [] as AssessmentQuestion[]
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const ids = [...new Set(parseIds(body))];
  const banks = ids
    .map((id) => getBank(id))
    .filter((bank): bank is NonNullable<typeof bank> => Boolean(bank && bank.kind === "skill"));

  if (banks.length === 0) {
    return Response.json(
      { success: false, error: "Pick at least one language" },
      { status: 400 }
    );
  }

  const titles = banks.map((bank) => bank.title);
  let questions: AssessmentQuestion[] = [];
  let source: Source = "saved";

  const groqPaper = await tryLivePaper(titles);
  if (groqPaper.length >= 40) {
    questions = groqPaper.slice(0, 50);
    source = "groq";
  } else {
    const ollamaPaper = await ollamaBatch(
      `Create 50 campus MCQs as JSON. 25 aptitude (Quantitative, Logical reasoning, Verbal ability) and 25 skill split across ${titles.join(", ")}. 4 options, correctIndex 0-3. ${jsonShape}`
    );
    if (ollamaPaper.length >= 30) {
      questions = ollamaPaper.slice(0, 50);
      source = "ollama";
    } else {
      questions = mixSkillsAndAptitude(
        banks.map((bank) => ({ title: bank.title, questions: bank.questions })),
        APTITUDE_BANK.questions
      );
      source = "saved";
    }
  }

  if (questions.length < 50 && source !== "saved") {
    const saved = mixSkillsAndAptitude(
      banks.map((bank) => ({ title: bank.title, questions: bank.questions })),
      APTITUDE_BANK.questions
    );
    const have = new Set(questions.map((item) => item.prompt));
    for (const item of saved) {
      if (questions.length >= 50) break;
      if (!have.has(item.prompt)) questions.push(item);
    }
  }

  return Response.json({
    success: true,
    source,
    live: source !== "saved",
    language: titles.join(", "),
    questions: questions.slice(0, 50),
  });
}
