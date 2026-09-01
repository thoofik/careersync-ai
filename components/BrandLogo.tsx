"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAME = "CareerSync";
const BADGE = "AI";
const LABEL = "CareerSync AI";

export default function BrandLogo({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  const sizes = {
    sm: { wrap: "gap-2", mark: "size-8", text: "text-lg", badge: "text-[10px] px-1.5 py-0.5", ring: "border-2" },
    md: { wrap: "gap-2.5", mark: "size-10", text: "text-xl sm:text-2xl", badge: "text-xs px-2 py-0.5", ring: "border-[2.5px]" },
    lg: { wrap: "gap-3", mark: "size-14", text: "text-3xl sm:text-4xl", badge: "text-sm px-2.5 py-1", ring: "border-[3px]" },
  }[size];

  const ringStyle = {
    borderTopColor: "#fe5933",
    borderRightColor: "transparent",
    borderBottomColor: "#fe5933",
    borderLeftColor: "transparent",
  } as const;

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", sizes.wrap)}
      aria-label={LABEL}
      suppressHydrationWarning
    >
      <span className={cn("relative grid place-items-center", sizes.mark)}>
        {live ? (
          <motion.span
            className={cn("absolute inset-0 rounded-full border-[#fe5933]/30", sizes.ring)}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={ringStyle}
          />
        ) : (
          <span
            className={cn("absolute inset-0 rounded-full border-[#fe5933]/30", sizes.ring)}
            style={ringStyle}
          />
        )}
        {live ? (
          <motion.span
            className="size-2 rounded-full bg-[#fe5933]"
            animate={{ scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <span className="size-2 rounded-full bg-[#fe5933]" />
        )}
      </span>
      <span className={cn("flex items-center gap-1.5 font-extrabold tracking-tight", sizes.text)}>
        <span>
          {NAME.split("").map((letter, index) =>
            live ? (
              <motion.span
                key={`${letter}-${index}`}
                className="inline-block"
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: index * 0.07,
                  ease: "easeInOut",
                }}
              >
                {letter}
              </motion.span>
            ) : (
              <span key={`${letter}-${index}`} className="inline-block">
                {letter}
              </span>
            )
          )}
        </span>
        {live ? (
          <motion.span
            className={cn(
              "rounded-md bg-[#fe5933] font-bold uppercase tracking-wide text-white",
              sizes.badge
            )}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {BADGE}
          </motion.span>
        ) : (
          <span
            className={cn(
              "rounded-md bg-[#fe5933] font-bold uppercase tracking-wide text-white",
              sizes.badge
            )}
          >
            {BADGE}
          </span>
        )}
      </span>
    </Link>
  );
}
