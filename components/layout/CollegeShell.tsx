"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BarChart3,
  Briefcase,
  Trophy,
  LineChart,
  LogOut,
  Menu,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/utils";

const navItems = [
  { href: "/college", label: "Overview", icon: GraduationCap },
  { href: "/college/skills", label: "Skills", icon: BarChart3 },
  { href: "/college/internships", label: "Internships", icon: Briefcase },
  { href: "/college/placement", label: "Placement", icon: Trophy },
  { href: "/college/demand", label: "Demand", icon: LineChart },
];

export default function CollegeShell({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const leave = async () => {
    if (leaving) return;
    setLeaving(true);
    await signOut("/college/sign-in");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-20 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
          <Menu className="size-5" />
        </Button>
        <BrandLogo size="md" href="/college" />
        <span className="hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground sm:inline-flex">
          <GraduationCap className="size-3.5" />
          College
        </span>
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/college" ? pathname === "/college" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={leave} disabled={leaving}>
            <LogOut className="size-4" />
            {leaving ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-background p-4">
            <BrandLogo size="sm" href="/college" />
            <nav className="mt-6 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="p-6 pb-16">{children}</main>
    </div>
  );
}
