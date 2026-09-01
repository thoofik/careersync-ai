import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { fallbackLearningTips } from "@/lib/assessment/profile";

export const maxDuration = 20;

export async function POST(request: Request) {
  const { skill, have, need, role } = await request.json();
  const name = String(skill || "this skill");
  const gap = Math.max(0, Number(need) - Number(have));

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      maxRetries: 0,
      maxTokens: 280,
      prompt: `A campus student scored ${have}/100 in ${name} but a "${role}" intern role needs ${need}. Gap is ${gap}.
Give exactly 3 short, practical study actions (one line each). No preamble. Number them 1. 2. 3.`,
    });
    const lines = text
      .split("\n")
      .map((line) => line.replace(/^\d+[.)]\s*/, "").trim())
      .filter((line) => line.length > 12)
      .slice(0, 3);
    if (lines.length >= 2) {
      return Response.json({ success: true, source: "groq", tips: lines });
    }
  } catch (error) {
    console.error("[suggest]", error);
  }

  return Response.json({
    success: true,
    source: "saved",
    tips: fallbackLearningTips(name, gap),
  });
}
