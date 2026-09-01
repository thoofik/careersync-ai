import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { href: "/assessment", label: "Assess" },
  { href: "/assessment/gaps", label: "Gaps" },
  { href: "/assessment/learn", label: "Learn" },
  { href: "/internships", label: "Jobs" },
  { href: "/interview", label: "Interview" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function StudentPath({ current }: { current: string }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2 text-xs">
      {STEPS.map((step, index) => {
        const active = current === step.href;
        return (
          <Link
            key={step.href}
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
