export type StudentCandidate = {
  id: string;
  name: string;
  headline: string;
  campus: string;
  sections: Record<string, number>;
  overall: number;
  demo: boolean;
};

export function loadIndustryCandidates(
  extra: StudentCandidate[] = []
): StudentCandidate[] {
  return extra;
}
