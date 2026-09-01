export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"
  | "withdrawn";

export type InternshipApplication = {
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
};

const KEY = "careersync-applications";

export const APPLICATION_STATUSES: { id: ApplicationStatus; label: string }[] = [
  { id: "applied", label: "Applied" },
  { id: "interviewing", label: "Interviewing" },
  { id: "offered", label: "Offered" },
  { id: "rejected", label: "Rejected" },
  { id: "withdrawn", label: "Withdrawn" },
];

export const NEXT_STATUS: Partial<
  Record<ApplicationStatus, { id: ApplicationStatus; label: string }[]>
> = {
  applied: [{ id: "interviewing", label: "Move to interviewing" }],
  interviewing: [
    { id: "offered", label: "Got an offer" },
    { id: "rejected", label: "Rejected after interview" },
  ],
};

export function statusLabel(status: ApplicationStatus) {
  return APPLICATION_STATUSES.find((item) => item.id === status)?.label || status;
}

export function loadApplications(): InternshipApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item === "object" && typeof item.jobId === "string"
    ) as InternshipApplication[];
  } catch {
    return [];
  }
}

export function saveApplications(items: InternshipApplication[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function upsertApplication(
  jobId: string,
  status: ApplicationStatus,
  existing = loadApplications()
) {
  const now = new Date().toISOString();
  const current = existing.find((item) => item.jobId === jobId);
  const next: InternshipApplication = {
    jobId,
    status,
    appliedAt: current?.appliedAt || now,
    updatedAt: now,
  };
  const items = current
    ? existing.map((item) => (item.jobId === jobId ? next : item))
    : [...existing, next];
  saveApplications(items);
  return items;
}
