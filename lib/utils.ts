import { interviewCovers, mappings } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@/firebase/client";
import { signOut as firebaseSignOut } from "firebase/auth";
import { clearSessionCookie } from "@/lib/actions/auth.action";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Comprehensive sign-out function that clears all login cache and authentication state
 * This should be used consistently across the application for signing out
 */
export async function signOut(redirectTo = "/sign-in"): Promise<void> {
  try {
    await clearSessionCookie();
  } catch (error) {
    console.warn("Could not clear server session cookie:", error);
  }

  try {
    if (auth) {
      await firebaseSignOut(auth);
    }
  } catch (error) {
    console.warn("Firebase client sign out skipped:", error);
  }

  window.location.href = redirectTo;
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
