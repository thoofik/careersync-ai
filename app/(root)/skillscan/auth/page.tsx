"use client";

import { usePuterStore } from "@/lib/skillscan/puter";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthInner() {
  const { isLoading, auth, error } = usePuterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/skillscan";

  useEffect(() => {
    if (auth.isAuthenticated) router.push(next);
  }, [auth.isAuthenticated, next, router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-[#fe5933]">Resume analyzer</p>
          <h1 className="mt-1 text-3xl font-bold">Resume check</h1>
          <p className="mt-2 text-muted-foreground">Log in with Puter to score a PDF</p>
          {error && !auth.isAuthenticated && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}
        </div>
        <div className="flex justify-center">
          {isLoading ? (
            <button className="btn-primary min-w-48 animate-pulse">Signing you in...</button>
          ) : auth.isAuthenticated ? (
            <button className="btn-primary min-w-48" onClick={auth.signOut}>
              Log Out
            </button>
          ) : (
            <button className="btn-primary min-w-48" onClick={auth.signIn}>
              Log In
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SkillScanAuthPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading…</p>}>
      <AuthInner />
    </Suspense>
  );
}
