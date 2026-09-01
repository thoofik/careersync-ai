"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export default function HeroSectionOne() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-none flex-col items-center justify-center py-10 md:py-20">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4">
        <h1 className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3 text-center"
          >
            <LayoutTextFlip
              text="CareerSync AI helps you walk into your next interview ready with"
              words={[
                "voice mock interviews tailored to your role",
                "live peer rounds you can share with a friend",
                "ATS resume scans and rewrite tips for the job",
              ]}
              duration={3200}
              className="text-2xl md:text-4xl lg:text-6xl"
              wordClassName="text-xl md:text-3xl lg:text-4xl px-3 py-2"
            />
          </motion.div>
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          CareerSync AI is for mock rounds and resume checks. Talk to an AI, practice
          with a friend, then see what your CV looks like to an ATS.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/interview">
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" >
            Start a mock
          </button>
          </Link>
          <Link href="/skillscan">
          <button className="w-60 transform rounded-lg border border-neutral-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:bg-neutral-900" >
            Check resume
          </button>
          </Link>

        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="/interview-dashboard.png"
              alt="CareerSync AI dashboard preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

