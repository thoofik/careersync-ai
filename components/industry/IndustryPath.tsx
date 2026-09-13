import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { href: "/industry/post", label: "Post" },
  { href: "/industry", label: "Listings" },
  { href: "/industry", label: "Match" },
  { href: "/industry", label: "Shortlist" },
  { href: "/industry", label: "Recruit / Mentor" },
];

export default function IndustryPath({ current }: { current: string }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2 text-xs">
      {STEPS.map((step, index) => {
        const active =
          current === step.label ||
          (step.href === "/industry/post" && current === "Post");
        return (
          <Link
            key={`${step.label}-${index}`}
            href={step.href}
            className={cn(
              "rounded-full border px-3 py-1",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {index + 1}. {step.label}
          </Link>
        );
      })}
    </nav>
  );
}
