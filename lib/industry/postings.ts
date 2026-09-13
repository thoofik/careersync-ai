export type PostingKind = "job" | "internship" | "project";

export type CandidateAction = "none" | "shortlisted" | "recruited" | "mentoring";

export type IndustryPosting = {
  id: string;
  kind: PostingKind;
  title: string;
  company: string;
  location: string;
  stipend: string;
  mode: "Remote" | "Hybrid" | "On-site";
  summary: string;
  requiredSkills: Record<string, number>;
  createdAt: string;
  decisions: Record<string, CandidateAction>;
};

const KEY = "careersync-industry-postings";

export const POSTING_KINDS: { id: PostingKind; label: string }[] = [
  { id: "internship", label: "Internship" },
  { id: "job", label: "Job" },
  { id: "project", label: "Project" },
];

export function kindLabel(kind: PostingKind) {
  return POSTING_KINDS.find((item) => item.id === kind)?.label || kind;
}

export function loadPostings(): IndustryPosting[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item === "object" && typeof item.id === "string"
    ) as IndustryPosting[];
  } catch {
    return [];
  }
}

export function savePostings(items: IndustryPosting[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function getPosting(id: string, items = loadPostings()) {
  return items.find((item) => item.id === id);
}

export function upsertPosting(posting: IndustryPosting, items = loadPostings()) {
  const next = items.some((item) => item.id === posting.id)
    ? items.map((item) => (item.id === posting.id ? posting : item))
    : [posting, ...items];
  savePostings(next);
  return next;
}

export function setCandidateAction(
  postingId: string,
  studentId: string,
  action: CandidateAction,
  items = loadPostings()
) {
  const posting = items.find((item) => item.id === postingId);
  if (!posting) return items;
  const next: IndustryPosting = {
    ...posting,
    decisions: { ...posting.decisions, [studentId]: action },
  };
  return upsertPosting(next, items);
}

export function actionLabel(action: CandidateAction) {
  if (action === "shortlisted") return "Shortlisted";
  if (action === "recruited") return "Recruited";
  if (action === "mentoring") return "Mentoring";
  return "Matched";
}
