"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import IndustryPath from "@/components/industry/IndustryPath";
import { INDUSTRY_SKILLS } from "@/lib/industry/skills";
import {
  POSTING_KINDS,
  upsertPosting,
  type PostingKind,
} from "@/lib/industry/postings";
import { saveIndustryPostingRemote } from "@/lib/actions/industry.action";

export default function IndustryPostPage() {
  const router = useRouter();
  const [kind, setKind] = useState<PostingKind>("internship");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [mode, setMode] = useState<"Remote" | "Hybrid" | "On-site">("Hybrid");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState<Record<string, number>>({});

  const toggleSkill = (skill: string) => {
    setSkills((prev) => {
      const next = { ...prev };
      if (skill in next) delete next[skill];
      else next[skill] = 70;
      return next;
    });
  };

  const setLevel = (skill: string, value: number) => {
    setSkills((prev) => ({ ...prev, [skill]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || Object.keys(skills).length === 0) return;
    const id = `ind-${Date.now()}`;
    const posting = {
      id,
      kind,
      title: title.trim(),
      company: company.trim() || "Campus partner",
      location: location.trim() || "Remote",
      stipend: stipend.trim(),
      mode,
      summary: summary.trim(),
      requiredSkills: skills,
      createdAt: new Date().toISOString(),
      decisions: {},
    };
    upsertPosting(posting);
    void saveIndustryPostingRemote(posting);
    router.push(`/industry/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <IndustryPath current="Post" />
      <p className="text-sm text-muted-foreground">Industry · step 1–2</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Post a listing
      </h1>
      <p className="mt-2 text-muted-foreground">
        Choose job, internship, or project, then the skills a student should have.
        Matching uses those scores against student skill profiles.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <fieldset className="flex flex-wrap gap-2">
          {POSTING_KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setKind(item.id)}
              className={`rounded-full border px-3 py-1 text-sm ${
                kind === item.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </fieldset>

        <label className="block text-sm">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
            placeholder="Python backend intern"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Organization
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="Nimbus Labs"
            />
          </label>
          <label className="block text-sm">
            Location
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="Bengaluru"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Stipend / pay
            <input
              value={stipend}
              onChange={(event) => setStipend(event.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="₹15,000 / month"
            />
          </label>
          <label className="block text-sm">
            Mode
            <select
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as "Remote" | "Hybrid" | "On-site")
              }
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </label>
        </div>
        <label className="block text-sm">
          Summary
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="mt-1 min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2"
            placeholder="What the student will work on."
          />
        </label>

        <div>
          <p className="text-sm font-medium">Required skills</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tick skills, then set how strong they need to be (0–100).
          </p>
          <div className="mt-3 space-y-2">
            {INDUSTRY_SKILLS.map((skill) => {
              const on = skill in skills;
              return (
                <div
                  key={skill}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-3 py-2"
                >
                  <label className="flex min-w-40 cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleSkill(skill)}
                    />
                    {skill}
                  </label>
                  {on && (
                    <label className="flex flex-1 items-center gap-2 text-xs text-muted-foreground">
                      Need {skills[skill]}
                      <input
                        type="range"
                        min={20}
                        max={100}
                        step={5}
                        value={skills[skill]}
                        onChange={(event) =>
                          setLevel(skill, Number(event.target.value))
                        }
                        className="flex-1"
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit" disabled={!title.trim() || Object.keys(skills).length === 0}>
          Save and match students
        </Button>
      </form>
    </div>
  );
}
