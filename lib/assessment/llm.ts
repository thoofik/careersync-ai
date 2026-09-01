import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { parseGeneratedQuestions } from "@/lib/assessment/parse-paper";
import type { AssessmentQuestion } from "@/lib/assessment/catalog";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function groqBatch(prompt: string): Promise<AssessmentQuestion[]> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const { text } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        prompt,
        maxTokens: 2200,
      });
      return parseGeneratedQuestions(text, 6);
    } catch (error) {
      console.error("[groq batch]", error);
      await wait(2000 * (attempt + 1));
    }
  }
  return [];
}

export async function ollamaBatch(prompt: string): Promise<AssessmentQuestion[]> {
  const base = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2";

  try {
    const response = await fetch(`${base}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.3, num_predict: 1800 },
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { response?: string };
    if (!data.response) return [];
    return parseGeneratedQuestions(data.response, 5);
  } catch (error) {
    console.error("[ollama batch]", error);
    return [];
  }
}
