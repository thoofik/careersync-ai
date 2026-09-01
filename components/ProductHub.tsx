"use client";

import Link from "next/link";
import { Bot, FileSearch, ClipboardList, Briefcase, FolderOpen } from "lucide-react";

const products = [
  {
    href: "/assessment",
    title: "Assess",
    description:
      "Pick a language. Get 50 mixed questions: that language plus aptitude.",
    icon: ClipboardList,
    cta: "Open assessment",
  },
  {
    href: "/internships",
    title: "Jobs",
    description:
      "Demo internships, apply, and track status. Then practice a mock.",
    icon: Briefcase,
    cta: "Browse internships",
  },
  {
    href: "/interview",
    title: "Mocks",
    description:
      "Voice and live practice rounds with scores and notes after each session.",
    icon: Bot,
    cta: "Start a mock",
  },
  {
    href: "/skillscan",
    title: "Resume",
    description:
      "Drop in a PDF, get an ATS-style score, and see what to fix before you apply.",
    icon: FileSearch,
    cta: "Analyze a resume",
  },
  {
    href: "/portfolio",
    title: "Portfolio",
    description:
      "One page of scores, learning, applications, and interview stats you can share.",
    icon: FolderOpen,
    cta: "Open portfolio",
  },
];

export default function ProductHub() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Student portal. One login.
        </h2>
        <p className="mt-2 text-muted-foreground">
          Assess, learn, apply, interview, then share a portfolio. Industry and
          college come later.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map(({ href, title, description, icon: Icon, cta }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
              {cta}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
