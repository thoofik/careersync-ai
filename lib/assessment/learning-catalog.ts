export type LearningKind = "course" | "practice" | "docs" | "video";
export type LearningLevel = "start" | "build" | "drill";

export type LearningResource = {
  id: string;
  skill: string;
  title: string;
  provider: string;
  kind: LearningKind;
  level: LearningLevel;
  hours: number;
  url: string;
  summary: string;
};

export const LEARNING_CATALOG: LearningResource[] = [
  {
    id: "py-docs-tutorial",
    skill: "Python",
    title: "Python official tutorial",
    provider: "python.org",
    kind: "docs",
    level: "start",
    hours: 6,
    url: "https://docs.python.org/3/tutorial/",
    summary: "Cover types, control flow, functions, and modules from the language docs.",
  },
  {
    id: "py-freecodecamp",
    skill: "Python",
    title: "Python for beginners",
    provider: "freeCodeCamp",
    kind: "video",
    level: "start",
    hours: 4,
    url: "https://www.freecodecamp.org/news/python-for-everybody/",
    summary: "Watch a beginner Python course, then rewrite one example without looking.",
  },
  {
    id: "py-exercism",
    skill: "Python",
    title: "Python tracks",
    provider: "Exercism",
    kind: "practice",
    level: "build",
    hours: 8,
    url: "https://exercism.org/tracks/python",
    summary: "Complete easy/medium exercises with mentor-style tests on lists and dicts.",
  },
  {
    id: "py-leetcode",
    skill: "Python",
    title: "Python interview drills",
    provider: "LeetCode",
    kind: "practice",
    level: "drill",
    hours: 6,
    url: "https://leetcode.com/problemset/?difficulty=EASY&page=1&topicSlugs=array",
    summary: "Solve 10 easy array/string problems in Python and keep an error log.",
  },
  {
    id: "java-oracle",
    skill: "Java",
    title: "Java tutorials",
    provider: "Oracle",
    kind: "docs",
    level: "start",
    hours: 8,
    url: "https://docs.oracle.com/javase/tutorial/",
    summary: "Read language basics, classes, and interfaces from the official trail.",
  },
  {
    id: "java-w3",
    skill: "Java",
    title: "Java tutorial",
    provider: "W3Schools",
    kind: "course",
    level: "start",
    hours: 5,
    url: "https://www.w3schools.com/java/",
    summary: "Work through syntax, OOP, and arrays with in-browser examples.",
  },
  {
    id: "java-exercism",
    skill: "Java",
    title: "Java track",
    provider: "Exercism",
    kind: "practice",
    level: "build",
    hours: 8,
    url: "https://exercism.org/tracks/java",
    summary: "Practice collections and OOP with small compiled exercises.",
  },
  {
    id: "java-leetcode",
    skill: "Java",
    title: "Java coding drills",
    provider: "LeetCode",
    kind: "practice",
    level: "drill",
    hours: 6,
    url: "https://leetcode.com/problemset/?difficulty=EASY&page=1",
    summary: "Solve 8 easy problems in Java using List and HashMap.",
  },
  {
    id: "js-mdn",
    skill: "JavaScript",
    title: "JavaScript first steps",
    provider: "MDN",
    kind: "docs",
    level: "start",
    hours: 5,
    url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps",
    summary: "Learn syntax, types, and functions from MDN’s learning path.",
  },
  {
    id: "js-javascript-info",
    skill: "JavaScript",
    title: "The Modern JavaScript Tutorial",
    provider: "javascript.info",
    kind: "course",
    level: "build",
    hours: 10,
    url: "https://javascript.info/",
    summary: "Study objects, arrays, and async, then rebuild one chapter example.",
  },
  {
    id: "js-freecodecamp",
    skill: "JavaScript",
    title: "JavaScript algorithms",
    provider: "freeCodeCamp",
    kind: "practice",
    level: "build",
    hours: 8,
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    summary: "Complete map/filter/reduce challenges and one small fetch UI.",
  },
  {
    id: "js-leetcode",
    skill: "JavaScript",
    title: "JS array drills",
    provider: "LeetCode",
    kind: "practice",
    level: "drill",
    hours: 5,
    url: "https://leetcode.com/problemset/?difficulty=EASY&page=1&topicSlugs=array",
    summary: "Solve 10 easy array problems using JavaScript array methods.",
  },
  {
    id: "sql-bolt",
    skill: "SQL",
    title: "SQLBolt lessons",
    provider: "SQLBolt",
    kind: "course",
    level: "start",
    hours: 4,
    url: "https://sqlbolt.com/",
    summary: "Finish SELECT, WHERE, JOIN, and GROUP BY interactive lessons.",
  },
  {
    id: "sql-mode",
    skill: "SQL",
    title: "SQL tutorial",
    provider: "Mode",
    kind: "course",
    level: "build",
    hours: 6,
    url: "https://mode.com/sql-tutorial/",
    summary: "Practice joins and aggregations on realistic sample tables.",
  },
  {
    id: "sql-w3",
    skill: "SQL",
    title: "SQL exercises",
    provider: "W3Schools",
    kind: "practice",
    level: "drill",
    hours: 3,
    url: "https://www.w3schools.com/sql/sql_exercises.asp",
    summary: "Drill INSERT/UPDATE plus JOIN quizzes until you can write them from memory.",
  },
  {
    id: "sql-leetcode",
    skill: "SQL",
    title: "SQL 50",
    provider: "LeetCode",
    kind: "practice",
    level: "drill",
    hours: 8,
    url: "https://leetcode.com/studyplan/top-sql-50/",
    summary: "Work through the SQL 50 study plan, starting with easy SELECT items.",
  },
  {
    id: "quant-khan",
    skill: "Quantitative",
    title: "Arithmetic and percentages",
    provider: "Khan Academy",
    kind: "course",
    level: "start",
    hours: 5,
    url: "https://www.khanacademy.org/math/arithmetic",
    summary: "Review percentages, ratios, and speed-distance with practice sets.",
  },
  {
    id: "quant-indiabix",
    skill: "Quantitative",
    title: "Campus quant MCQs",
    provider: "IndiaBIX",
    kind: "practice",
    level: "drill",
    hours: 6,
    url: "https://www.indiabix.com/aptitude/questions-and-answers/",
    summary: "Time 10 questions a day and log the formulas you miss.",
  },
  {
    id: "quant-geeks",
    skill: "Quantitative",
    title: "Quantitative aptitude",
    provider: "GeeksforGeeks",
    kind: "docs",
    level: "build",
    hours: 4,
    url: "https://www.geeksforgeeks.org/aptitude/quantitative-aptitude/",
    summary: "Read time-work and profit-loss notes, then solve the attached examples.",
  },
  {
    id: "logic-indiabix",
    skill: "Logical reasoning",
    title: "Logical reasoning bank",
    provider: "IndiaBIX",
    kind: "practice",
    level: "drill",
    hours: 6,
    url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
    summary: "Practice series, coding-decoding, and syllogisms in short timed sets.",
  },
  {
    id: "logic-geeks",
    skill: "Logical reasoning",
    title: "Logical reasoning",
    provider: "GeeksforGeeks",
    kind: "docs",
    level: "start",
    hours: 4,
    url: "https://www.geeksforgeeks.org/aptitude/logical-reasoning/",
    summary: "Learn the pattern types, then redraw one blood-relation tree by hand.",
  },
  {
    id: "logic-khan",
    skill: "Logical reasoning",
    title: "Critical thinking",
    provider: "Khan Academy",
    kind: "course",
    level: "build",
    hours: 3,
    url: "https://www.khanacademy.org/test-prep/sat/sat-reading-writing-practice",
    summary: "Use short reasoning passages to practice which conclusion must follow.",
  },
  {
    id: "verbal-bbc",
    skill: "Verbal ability",
    title: "Grammar and vocabulary",
    provider: "British Council",
    kind: "course",
    level: "start",
    hours: 4,
    url: "https://learnenglish.britishcouncil.org/grammar",
    summary: "Do tense, article, and preposition lessons with the on-site quizzes.",
  },
  {
    id: "verbal-indiabix",
    skill: "Verbal ability",
    title: "Verbal ability MCQs",
    provider: "IndiaBIX",
    kind: "practice",
    level: "drill",
    hours: 5,
    url: "https://www.indiabix.com/verbal-ability/questions-and-answers/",
    summary: "Practice 8 grammar items a day and write one example sentence per new word.",
  },
  {
    id: "verbal-voanews",
    skill: "Verbal ability",
    title: "Short news summaries",
    provider: "VOA Learning English",
    kind: "docs",
    level: "build",
    hours: 3,
    url: "https://learningenglish.voanews.com/",
    summary: "Read one short article and write a three-line summary without copying.",
  },
];

const LEVEL_ORDER: LearningLevel[] = ["start", "build", "drill"];

function levelsForGap(gap: number): LearningLevel[] {
  if (gap >= 30) return ["start", "build", "drill"];
  if (gap >= 15) return ["build", "drill"];
  return ["drill"];
}

export function resourcesForSkill(skill: string) {
  return LEARNING_CATALOG.filter((item) => item.skill === skill);
}

export type LearningPathItem = {
  skill: string;
  have: number;
  need: number;
  gap: number;
  resources: LearningResource[];
};

export function buildLearningPath(
  gaps: { skill: string; have: number; need: number; gap: number }[]
): LearningPathItem[] {
  return gaps
    .filter((item) => item.gap > 0)
    .map((item) => {
      const wanted = levelsForGap(item.gap);
      const pool = resourcesForSkill(item.skill);
      const picked: LearningResource[] = [];
      for (const level of wanted) {
        const match = pool.find(
          (resource) => resource.level === level && !picked.includes(resource)
        );
        if (match) picked.push(match);
      }
      if (picked.length === 0) picked.push(...pool.slice(0, 2));
      picked.sort(
        (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
      );
      return { ...item, resources: picked };
    });
}

const PROGRESS_KEY = "careersync-learning-done";

export function loadLearningDone(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveLearningDone(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
}
