export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `Score this resume for ATS and the role. Be honest. Exactly 2 tips per category.
Job title: ${jobTitle || "not specified"}
Job description: ${jobDescription || "not specified"}
Return ONLY valid JSON matching:
{
  "overallScore": 0,
  "ATS": { "score": 0, "tips": [{ "type": "good"|"improve", "tip": "short" }] },
  "toneAndStyle": { "score": 0, "tips": [{ "type": "good"|"improve", "tip": "title", "explanation": "1-2 sentences" }] },
  "content": { "score": 0, "tips": [{ "type": "good"|"improve", "tip": "title", "explanation": "1-2 sentences" }] },
  "structure": { "score": 0, "tips": [{ "type": "good"|"improve", "tip": "title", "explanation": "1-2 sentences" }] },
  "skills": { "score": 0, "tips": [{ "type": "good"|"improve", "tip": "title", "explanation": "1-2 sentences" }] }
}`;
