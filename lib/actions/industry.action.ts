"use server";

import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import type { IndustryPosting } from "@/lib/industry/postings";

export async function saveIndustryPostingRemote(posting: IndustryPosting) {
  const user = await getCurrentUser();
  if (!user || user.portal !== "industry" || !db) return { success: false };
  try {
    await db.collection("industry-postings").doc(posting.id).set({
      ...posting,
      ownerId: user.id,
      ownerName: user.name,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function listIndustryPostingsRemote(): Promise<IndustryPosting[]> {
  const user = await getCurrentUser();
  if (!user || !db) return [];
  if (user.portal !== "industry" && user.portal !== "college") return [];
  try {
    const snap = await db.collection("industry-postings").limit(80).get();
    return snap.docs.map((doc) => {
      const data = doc.data() as IndustryPosting;
      return { ...data, id: doc.id };
    });
  } catch {
    return [];
  }
}
