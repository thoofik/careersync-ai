export type AssessmentTrackId =
  | "python"
  | "javascript"
  | "java"
  | "sql"
  | "aptitude";

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  topic: string;
};

export const ASSESSMENT_TRACKS: {
  id: AssessmentTrackId;
  name: string;
  tag: string;
  minutes: number;
  blurb: string;
}[] = [
  {
    id: "python",
    name: "Python",
    tag: "Language",
    minutes: 10,
    blurb: "Syntax, data types, loops, and problem-solving in Python.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    tag: "Language",
    minutes: 10,
    blurb: "Core JS, arrays, functions, and how the language actually behaves.",
  },
  {
    id: "java",
    name: "Java",
    tag: "Language",
    minutes: 10,
    blurb: "OOP, types, and common interview-style Java questions.",
  },
  {
    id: "sql",
    name: "SQL",
    tag: "Language",
    minutes: 10,
    blurb: "SELECT, joins, grouping — the queries industry actually asks.",
  },
  {
    id: "aptitude",
    name: "Logical aptitude",
    tag: "Aptitude",
    minutes: 10,
    blurb: "Patterns, ratios, and reasoning — same style as campus placement tests.",
  },
];

export const ASSESSMENT_QUESTIONS: Record<AssessmentTrackId, AssessmentQuestion[]> = {
  python: [
    {
      id: "py1",
      prompt: "What is the output of `print(type([]) is list)`?",
      options: ["False", "True", "list", "Error"],
      answer: 1,
      topic: "Types",
    },
    {
      id: "py2",
      prompt: "Which structure is ordered and changeable, and allows duplicate members?",
      options: ["Set", "Dictionary", "List", "frozenset"],
      answer: 2,
      topic: "Collections",
    },
    {
      id: "py3",
      prompt: "What does `range(1, 5)` produce?",
      options: ["1 2 3 4 5", "1 2 3 4", "0 1 2 3 4", "5 4 3 2 1"],
      answer: 1,
      topic: "Loops",
    },
    {
      id: "py4",
      prompt: "Which keyword creates a generator function?",
      options: ["return", "yield", "generate", "async"],
      answer: 1,
      topic: "Functions",
    },
    {
      id: "py5",
      prompt: "What is `[x*x for x in range(3)]`?",
      options: ["[0, 1, 4]", "[1, 4, 9]", "[0, 1, 2]", "Error"],
      answer: 0,
      topic: "Comprehensions",
    },
  ],
  javascript: [
    {
      id: "js1",
      prompt: "What is `typeof null` in JavaScript?",
      options: ["null", "undefined", "object", "boolean"],
      answer: 2,
      topic: "Types",
    },
    {
      id: "js2",
      prompt: "Which comparison is true?",
      options: ["[] == false", "[] === false", "null === undefined", "NaN === NaN"],
      answer: 0,
      topic: "Equality",
    },
    {
      id: "js3",
      prompt: "What does `const` prevent?",
      options: ["Mutating an object", "Reassigning the binding", "Using the variable", "Hoisting"],
      answer: 1,
      topic: "Scope",
    },
    {
      id: "js4",
      prompt: "`[1,2,3].map(x => x * 2)` returns:",
      options: ["[1, 2, 3]", "[2, 4, 6]", "undefined", "6"],
      answer: 1,
      topic: "Arrays",
    },
    {
      id: "js5",
      prompt: "Promises settle with which two states besides pending?",
      options: ["start / end", "open / close", "fulfilled / rejected", "then / catch"],
      answer: 2,
      topic: "Async",
    },
  ],
  java: [
    {
      id: "jv1",
      prompt: "Which keyword prevents a class from being subclassed?",
      options: ["static", "final", "private", "sealed"],
      answer: 1,
      topic: "OOP",
    },
    {
      id: "jv2",
      prompt: "The entry point of a Java app is:",
      options: ["init()", "main(String[] args)", "start()", "run()"],
      answer: 1,
      topic: "Basics",
    },
    {
      id: "jv3",
      prompt: "Which collection does not allow duplicates?",
      options: ["ArrayList", "LinkedList", "HashSet", "Vector"],
      answer: 2,
      topic: "Collections",
    },
    {
      id: "jv4",
      prompt: "`==` on two Integer objects compares:",
      options: ["Always numeric value", "Object identity (with boxing caveats)", "hashCode only", "Nothing"],
      answer: 1,
      topic: "Types",
    },
    {
      id: "jv5",
      prompt: "Checked exceptions must be:",
      options: ["Ignored", "Declared or caught", "Always RuntimeException", "Only in main"],
      answer: 1,
      topic: "Exceptions",
    },
  ],
  sql: [
    {
      id: "sq1",
      prompt: "Which join returns only matching rows from both tables?",
      options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"],
      answer: 2,
      topic: "Joins",
    },
    {
      id: "sq2",
      prompt: "`GROUP BY` is used with:",
      options: ["WHERE only", "Aggregate functions", "ORDER BY only", "LIMIT only"],
      answer: 1,
      topic: "Aggregation",
    },
    {
      id: "sq3",
      prompt: "Which clause filters groups after aggregation?",
      options: ["WHERE", "HAVING", "FROM", "SELECT"],
      answer: 1,
      topic: "Aggregation",
    },
    {
      id: "sq4",
      prompt: "Primary key implies:",
      options: ["Duplicates allowed", "NULL allowed", "Unique and not null", "Only strings"],
      answer: 2,
      topic: "Schema",
    },
    {
      id: "sq5",
      prompt: "`COUNT(*)` counts:",
      options: ["Non-null column values only", "All rows", "Distinct rows only", "Indexes"],
      answer: 1,
      topic: "Functions",
    },
  ],
  aptitude: [
    {
      id: "ap1",
      prompt: "Find the next number: 2, 6, 12, 20, 30, ?",
      options: ["36", "40", "42", "48"],
      answer: 2,
      topic: "Series",
    },
    {
      id: "ap2",
      prompt: "If 15% of x is 45, x is:",
      options: ["250", "300", "350", "400"],
      answer: 1,
      topic: "Percent",
    },
    {
      id: "ap3",
      prompt: "A train 120 m long runs at 60 km/h. Time to pass a pole:",
      options: ["6.2 s", "7.2 s", "8 s", "12 s"],
      answer: 1,
      topic: "Speed",
    },
    {
      id: "ap4",
      prompt: "Ratio 3:5. If the sum is 40, the larger part is:",
      options: ["15", "20", "24", "25"],
      answer: 3,
      topic: "Ratio",
    },
    {
      id: "ap5",
      prompt: "All codes are maps. Some maps are books. Conclusion: some codes are books.",
      options: ["Follows", "Does not follow", "Follows only if maps = books", "Cannot say from options 1–2"],
      answer: 1,
      topic: "Logic",
    },
  ],
};
