import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { href: "/college", label: "College" },
  { href: "/college/skills", label: "Skills" },
  { href: "/college/internships", label: "Internships" },
  { href: "/college/placement", label: "Placement" },
  { href: "/college/demand", label: "Demand" },
];

export default function CollegePath({ current }: { current: string }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2 text-xs">
      {STEPS.map((step, index) => (
        <Link
          key={step.href}
          href={step.href}
          className={cn(
            "rounded-full border px-3 py-1",
            current === step.href
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {index + 1}. {step.label}
        </Link>
      ))}
    </nav>
  );
}
