"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  loadSkillProfile,
  rankInternships,
  type StoredSkillProfile,
} from "@/lib/assessment/profile";

export default function SkillProfileCard() {
  const [profile, setProfile] = useState<StoredSkillProfile | null>(null);

  useEffect(() => {
    setProfile(loadSkillProfile());
  }, []);

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skill profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No assessment yet. Take a mixed language + aptitude test and your scores
            will show here.
          </p>
          <Button asChild>
            <Link href="/assessment">Take assessment</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const matches = rankInternships(profile.sections).slice(0, 3);
  const saved = profile.savedAt
    ? new Date(profile.savedAt).toLocaleString()
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Last test: {profile.language} + aptitude
            {saved ? ` · ${saved}` : ""}
          </p>
          <p className="mt-1 text-3xl font-semibold">{profile.overall}%</p>
        </div>
        <div className="space-y-2">
          {Object.entries(profile.sections).map(([name, value]) => (
            <div key={name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{name}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-medium">Closest sample internships</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {matches.map((job) => (
              <li key={job.title}>
                {job.title} · {(job.score * 100).toFixed(0)}% match
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/assessment">Retake assessment</Link>
          </Button>
          <Button asChild>
            <Link href="/assessment/gaps">See skill gaps</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/assessment/learn">Recommended learning</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/internships">Internships</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
