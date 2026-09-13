"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import IndustryPath from "@/components/industry/IndustryPath";
import { kindLabel, loadPostings, type IndustryPosting } from "@/lib/industry/postings";

export default function IndustryPage() {
  const [posts, setPosts] = useState<IndustryPosting[]>([]);

  useEffect(() => {
    setPosts(loadPostings());
  }, []);

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <IndustryPath current="Listings" />
      <p className="text-sm text-muted-foreground">Industry portal · separate login</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Industry</h1>
      <p className="mt-2 text-muted-foreground">
        Post a job, internship, or project. Set required skills. CareerSync ranks
        suitable students. Then shortlist, recruit, or mentor. Demo matching only.
      </p>

      <div className="mt-6">
        <Button asChild>
          <Link href="/industry/post">Post listing</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No listings yet. Post one with required skills to see AI matches.
          </p>
        )}
        {posts.map((post) => {
          const shortlisted = Object.values(post.decisions).filter(
            (item) => item !== "none"
          ).length;
          return (
            <article
              key={post.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {kindLabel(post.kind)}
                  </p>
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {post.company} · {post.location} · {post.mode}
                    {post.stipend ? ` · ${post.stipend}` : ""}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Skills: {Object.keys(post.requiredSkills).join(", ") || "—"}
                    {shortlisted > 0 ? ` · ${shortlisted} in pipeline` : ""}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/industry/${post.id}`}>View matches</Link>
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{post.summary}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
