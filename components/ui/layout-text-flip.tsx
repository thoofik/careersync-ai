"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  className,
  wordClassName,
  inheritSize = false,
}: {
  text: string;
  words: string[];
  duration?: number;
  className?: string;
  wordClassName?: string;
  inheritSize?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  const travel = inheritSize ? 18 : 40;

  return (
    <>
      {text ? (
        <motion.span
          layoutId={`subtext-${text}`}
          className={cn(
            inheritSize
              ? "font-bold tracking-tight"
              : "text-2xl font-bold tracking-tight text-slate-700 md:text-4xl dark:text-slate-300",
            className,
          )}
        >
          {text}
        </motion.span>
      ) : null}

      <motion.span
        layout
        className={cn(
          "relative inline-flex w-fit max-w-full items-center overflow-hidden rounded-md border border-neutral-200 bg-white font-sans font-bold tracking-tight text-slate-700 shadow-sm ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-300 dark:ring-white/10",
          inheritSize
            ? "px-1.5 py-0 text-[1em] leading-none"
            : "px-3 py-1 text-2xl md:text-4xl",
          wordClassName,
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -travel, filter: "blur(10px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: travel, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            className="inline-block whitespace-normal text-center"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};
