"use server";

import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import type { StoredSkillProfile } from "@/lib/assessment/profile";
import type { InternshipApplication } from "@/lib/internships/applications";

export type PublishedPortfolio = {
  name: string;
  headline: string;
  skillProfile: StoredSkillProfile | null;
  learningDone: string[];
  applications: InternshipApplication[];
  mockAverage: number;
  mockCount: number;
  publishedAt: string;
};

export async function saveSkillProfileRemote(profile: StoredSkillProfile) {
  return syncStudentWorkRemote({ skillProfile: profile });
}

export type StudentWorkPayload = {
  skillProfile?: StoredSkillProfile | null;
  learningDone?: string[];
  applications?: InternshipApplication[];
};

export async function syncStudentWorkRemote(payload: StudentWorkPayload) {
  const user = await getCurrentUser();
  if (!user || user.portal === "industry" || !db) return { success: false };
  try {
    const next: Record<string, unknown> = {
      portal: "student",
      name: user.name,
      studentWorkUpdatedAt: new Date().toISOString(),
    };
    if (payload.skillProfile) next.skillProfile = payload.skillProfile;
    if (payload.learningDone) next.learningDone = payload.learningDone;
    if (payload.applications) next.applications = payload.applications;
    await db.collection("users").doc(user.id).set(next, { merge: true });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export type MyStudentWork = {
  skillProfile: StoredSkillProfile | null;
  learningDone: string[];
  applications: InternshipApplication[];
};

export async function getMyStudentWork(): Promise<MyStudentWork> {
  const empty: MyStudentWork = { skillProfile: null, learningDone: [], applications: [] };
  const user = await getCurrentUser();
  if (!user || !db) return empty;
  try {
    const snap = await db.collection("users").doc(user.id).get();
    const data = snap.data() as Partial<MyStudentWork> | undefined;
    return {
      skillProfile: data?.skillProfile || null,
      learningDone: Array.isArray(data?.learningDone) ? data.learningDone : [],
      applications: Array.isArray(data?.applications) ? data.applications : [],
    };
  } catch {
    return empty;
  }
}

export async function publishPortfolio(payload: Omit<PublishedPortfolio, "name" | "publishedAt">) {
  const user = await getCurrentUser();
  if (!user || !db) {
    return { success: false, message: "Sign-in or Firebase is required to publish." };
  }
  const portfolio: PublishedPortfolio = {
    ...payload,
    name: user.name,
    publishedAt: new Date().toISOString(),
  };
  try {
    await db.collection("users").doc(user.id).set({ portfolio }, { merge: true });
    return { success: true, userId: user.id };
  } catch {
    return { success: false, message: "Could not publish portfolio." };
  }
}

export async function getPublishedPortfolio(userId: string): Promise<PublishedPortfolio | null> {
  if (!db || !userId) return null;
  try {
    const snap = await db.collection("users").doc(userId).get();
    const data = snap.data() as { portfolio?: PublishedPortfolio } | undefined;
    return data?.portfolio || null;
  } catch {
    return null;
  }
}

export type IndustryStudentCard = {
  id: string;
  name: string;
  headline: string;
  campus: string;
  sections: Record<string, number>;
  overall: number;
  demo: boolean;
};

export type IndustryStudentDetail = IndustryStudentCard & {
  learningDone: string[];
  applications: { title: string; status: string }[];
  mockAverage: number;
  mockCount: number;
  mockBest: number;
  notes: string[];
};

function requireIndustry() {
  return getCurrentUser().then((user) => {
    if (!user || user.portal !== "industry") return null;
    return user;
  });
}

export async function listStudentsForIndustry(): Promise<IndustryStudentCard[]> {
  const user = await requireIndustry();
  if (!user || !db) return [];

  try {
    const snap = await db.collection("users").limit(80).get();
    const remote: IndustryStudentCard[] = [];
    for (const doc of snap.docs) {
      const data = doc.data() as {
        name?: string;
        portal?: string;
        skillProfile?: StoredSkillProfile;
        portfolio?: PublishedPortfolio;
        learningDone?: string[];
        applications?: InternshipApplication[];
        studentWorkUpdatedAt?: string;
      };
      if (data.portal === "industry") continue;
      const profile = data.skillProfile || data.portfolio?.skillProfile;
      const hasWork =
        Boolean(profile?.sections) ||
        (data.learningDone && data.learningDone.length > 0) ||
        (data.applications && data.applications.length > 0);
      if (!hasWork && !data.name) continue;
      remote.push({
        id: doc.id,
        name: data.name || data.portfolio?.name || "Student",
        headline: profile
          ? `${profile.language || "Assessment"} · ${profile.overall}%`
          : "Signed up · no assessment yet",
        campus: data.studentWorkUpdatedAt
          ? `Live student portal · updated ${new Date(data.studentWorkUpdatedAt).toLocaleDateString()}`
          : "Live student portal",
        sections: profile?.sections || {},
        overall: profile?.overall ?? 0,
        demo: false,
      });
    }
    return remote.sort((a, b) => b.overall - a.overall);
  } catch {
    return [];
  }
}

export async function getStudentDetailForIndustry(
  studentId: string
): Promise<IndustryStudentDetail | null> {
  const user = await requireIndustry();
  if (!user || !studentId) return null;

  if (!db) return null;
  try {
    const snap = await db.collection("users").doc(studentId).get();
    if (!snap.exists) return null;
    const data = snap.data() as {
      name?: string;
      portal?: string;
      skillProfile?: StoredSkillProfile;
      portfolio?: PublishedPortfolio;
      learningDone?: string[];
      applications?: InternshipApplication[];
      studentWorkUpdatedAt?: string;
    };
    if (data.portal === "industry") return null;
    const profile = data.skillProfile || data.portfolio?.skillProfile;
    const { getUserStats } = await import("@/lib/actions/general.action");
    const { getInternship } = await import("@/lib/internships/catalog");
    const { LEARNING_CATALOG } = await import("@/lib/assessment/learning-catalog");
    const stats = await getUserStats(studentId);
    const learningIds = data.learningDone || data.portfolio?.learningDone || [];
    const learningDone = learningIds.map(
      (id) => LEARNING_CATALOG.find((item) => item.id === id)?.title || id
    );
    const applications = (data.applications || data.portfolio?.applications || []).map(
      (item) => ({
        title: getInternship(item.jobId)?.title || item.jobId,
        status: item.status,
      })
    );

    return {
      id: snap.id,
      name: data.name || data.portfolio?.name || "Student",
      headline: profile
        ? `${profile.language || "Assessment"} · ${profile.overall}%`
        : "Signed up · no assessment yet",
      campus: "Live from student portal",
      sections: profile?.sections || {},
      overall: profile?.overall ?? 0,
      demo: false,
      learningDone,
      applications,
      mockAverage: stats?.averageScore ?? data.portfolio?.mockAverage ?? 0,
      mockCount: stats?.totalInterviews ?? data.portfolio?.mockCount ?? 0,
      mockBest: stats?.bestScore ?? 0,
      notes: [
        profile?.savedAt
          ? `Last assessment ${new Date(profile.savedAt).toLocaleString()}`
          : "No assessment uploaded yet",
        data.studentWorkUpdatedAt
          ? `Student work last synced ${new Date(data.studentWorkUpdatedAt).toLocaleString()}`
          : "Waiting for the student to use Assess, Learn, or Jobs",
        `${stats?.totalInterviews || 0} live mock interviews in Firebase`,
      ],
    };
  } catch {
    return null;
  }
}
