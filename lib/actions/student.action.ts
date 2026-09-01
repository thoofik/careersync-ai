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
  const user = await getCurrentUser();
  if (!user || !db) return { success: false };
  try {
    await db.collection("users").doc(user.id).set({ skillProfile: profile }, { merge: true });
    return { success: true };
  } catch {
    return { success: false };
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
