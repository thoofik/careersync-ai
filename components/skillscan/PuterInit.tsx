"use client";

import { useEffect } from "react";
import { usePuterStore } from "@/lib/skillscan/puter";

export default function PuterInit() {
  const init = usePuterStore((state) => state.init);
  const checkAuthStatus = usePuterStore((state) => state.auth.checkAuthStatus);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const refresh = () => {
      if (typeof window !== "undefined" && window.puter) {
        void checkAuthStatus();
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [checkAuthStatus]);

  return null;
}
