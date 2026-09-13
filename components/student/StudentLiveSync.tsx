"use client";

import { useEffect } from "react";
import { loadSkillProfile, saveSkillProfile } from "@/lib/assessment/profile";
import { loadLearningDone, saveLearningDone } from "@/lib/assessment/learning-catalog";
import { loadApplications, saveApplications } from "@/lib/internships/applications";
import { getMyStudentWork, syncStudentWorkRemote } from "@/lib/actions/student.action";

export default function StudentLiveSync() {
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const remote = await getMyStudentWork();
      if (cancelled) return;

      const localProfile = loadSkillProfile();
      const localLearn = loadLearningDone();
      const localApps = loadApplications();

      if (!localProfile && remote.skillProfile) {
        saveSkillProfile(remote.skillProfile);
      }
      if (localLearn.length === 0 && remote.learningDone.length > 0) {
        saveLearningDone(remote.learningDone);
      }
      if (localApps.length === 0 && remote.applications.length > 0) {
        saveApplications(remote.applications);
      }

      const profile = loadSkillProfile();
      const learningDone = loadLearningDone();
      const applications = loadApplications();
      if (profile || learningDone.length || applications.length) {
        await syncStudentWorkRemote({
          skillProfile: profile,
          learningDone,
          applications,
        });
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
