"use server";

import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import type { StoredSkillProfile } from "@/lib/assessment/profile";
import type { InternshipApplication } from "@/lib/internships/applications";
import { getInternship } from "@/lib/internships/catalog";
import type { IndustryPosting } from "@/lib/industry/postings";

async function requireCollege() {
  const user = await getCurrentUser();
  if (!user || user.portal !== "college") return null;
  return user;
}

export type CollegeStudentRow = {
  id: string;
  name: string;
  overall: number;
  sections: Record<string, number>;
  learningCount: number;
  applications: { title: string; status: string }[];
  mockAverage: number;
  mockCount: number;
  updatedAt?: string;
};

export type SkillDemand = {
  skill: string;
  listings: number;
  avgNeed: number;
  studentAvg: number;
  gap: number;
};

export type CollegeOverview = {
  students: CollegeStudentRow[];
  postings: IndustryPosting[];
  demand: SkillDemand[];
};

export async function getCollegeOverview(): Promise<CollegeOverview> {
  const user = await requireCollege();
  if (!user || !db) return { students: [], postings: [], demand: [] };

  const [userSnap, postSnap] = await Promise.all([
    db.collection("users").limit(80).get(),
    db.collection("industry-postings").limit(80).get(),
  ]);

  const postings = postSnap.docs.map((doc) => {
    const data = doc.data() as IndustryPosting;
    return { ...data, id: doc.id };
  });

  const students: CollegeStudentRow[] = [];
  for (const doc of userSnap.docs) {
    const data = doc.data() as {
      name?: string;
      portal?: string;
      skillProfile?: StoredSkillProfile;
      learningDone?: string[];
      applications?: InternshipApplication[];
      studentWorkUpdatedAt?: string;
    };
    if (data.portal === "industry" || data.portal === "college") continue;
    const profile = data.skillProfile;
    students.push({
      id: doc.id,
      name: data.name || "Student",
      overall: profile?.overall ?? 0,
      sections: profile?.sections || {},
      learningCount: data.learningDone?.length || 0,
      applications: (data.applications || []).map((item) => ({
        title: getInternship(item.jobId)?.title || item.jobId,
        status: item.status,
      })),
      mockAverage: 0,
      mockCount: 0,
      updatedAt: data.studentWorkUpdatedAt,
    });
  }

  const studentAvgs: Record<string, { sum: number; n: number }> = {};
  for (const student of students) {
    for (const [skill, value] of Object.entries(student.sections)) {
      const cur = studentAvgs[skill] || { sum: 0, n: 0 };
      studentAvgs[skill] = { sum: cur.sum + value, n: cur.n + 1 };
    }
  }

  const demandMap: Record<string, { listings: number; needSum: number }> = {};
  for (const post of postings) {
    for (const [skill, need] of Object.entries(post.requiredSkills || {})) {
      const cur = demandMap[skill] || { listings: 0, needSum: 0 };
      demandMap[skill] = { listings: cur.listings + 1, needSum: cur.needSum + need };
    }
  }

  const demand: SkillDemand[] = Object.entries(demandMap)
    .map(([skill, info]) => {
      const avgNeed = Math.round(info.needSum / info.listings);
      const have = studentAvgs[skill];
      const studentAvg = have ? Math.round(have.sum / have.n) : 0;
      return {
        skill,
        listings: info.listings,
        avgNeed,
        studentAvg,
        gap: Math.max(0, avgNeed - studentAvg),
      };
    })
    .sort((a, b) => b.listings - a.listings || b.gap - a.gap);

  return {
    students: students.sort((a, b) => b.overall - a.overall),
    postings,
    demand,
  };
}
