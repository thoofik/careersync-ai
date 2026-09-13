export type StudentWorkItem = {
  title: string;
  status: string;
};

export type StudentWorkProfile = {
  id: string;
  name: string;
  headline: string;
  campus: string;
  demo: boolean;
  overall: number;
  sections: Record<string, number>;
  learningDone: string[];
  applications: StudentWorkItem[];
  mockAverage: number;
  mockCount: number;
  mockBest: number;
  notes: string[];
};

export const DEMO_PROFILES: StudentWorkProfile[] = [
  {
    id: "demo-ananya",
    name: "Ananya Rao",
    headline: "Python + SQL · 74% assessment",
    campus: "Demo · Bengaluru campus",
    demo: true,
    overall: 74,
    sections: {
      Python: 82,
      SQL: 74,
      Quantitative: 68,
      "Logical reasoning": 61,
      JavaScript: 40,
    },
    learningDone: [
      "Python official tutorial",
      "SQL joins practice set",
      "Quant daily drill (week 2)",
    ],
    applications: [
      { title: "Python backend intern", status: "Interviewing" },
      { title: "Data / SQL intern", status: "Applied" },
    ],
    mockAverage: 71,
    mockCount: 4,
    mockBest: 82,
    notes: [
      "Completed campus assessment this month",
      "Stronger on Python services than frontend",
    ],
  },
  {
    id: "demo-karthik",
    name: "Karthik Iyer",
    headline: "Java backend · 78% assessment",
    campus: "Demo · Hyderabad campus",
    demo: true,
    overall: 78,
    sections: {
      Java: 88,
      SQL: 55,
      Quantitative: 70,
      "Logical reasoning": 72,
      "Verbal ability": 48,
    },
    learningDone: ["Java collections drill", "OOP practice set"],
    applications: [{ title: "Java backend intern", status: "Applied" }],
    mockAverage: 76,
    mockCount: 6,
    mockBest: 88,
    notes: ["High Java marks", "Verbal score is the main gap"],
  },
  {
    id: "demo-meera",
    name: "Meera Shah",
    headline: "Frontend JS/TS · 80% assessment",
    campus: "Demo · Pune campus",
    demo: true,
    overall: 80,
    sections: {
      JavaScript: 86,
      TypeScript: 78,
      "HTML/CSS": 80,
      "Verbal ability": 64,
      Quantitative: 42,
    },
    learningDone: [
      "JavaScript array methods",
      "TypeScript handbook basics",
      "Accessible UI checklist",
    ],
    applications: [
      { title: "Frontend intern (JavaScript)", status: "Offered" },
    ],
    mockAverage: 79,
    mockCount: 5,
    mockBest: 90,
    notes: ["Consistent mock scores", "Quant is below typical intern bar"],
  },
  {
    id: "demo-arjun",
    name: "Arjun Nair",
    headline: "C / C++ · 73% assessment",
    campus: "Demo · Chennai campus",
    demo: true,
    overall: 73,
    sections: {
      C: 76,
      "C++": 71,
      Quantitative: 80,
      "Logical reasoning": 77,
      Python: 38,
    },
    learningDone: ["C pointers review", "Reasoning series pack"],
    applications: [],
    mockAverage: 68,
    mockCount: 2,
    mockBest: 74,
    notes: ["Strong aptitude", "Few applications yet"],
  },
  {
    id: "demo-zara",
    name: "Zara Khan",
    headline: "Full-stack JS · 66% assessment",
    campus: "Demo · Noida campus",
    demo: true,
    overall: 66,
    sections: {
      JavaScript: 70,
      SQL: 62,
      PHP: 58,
      "HTML/CSS": 66,
      "Verbal ability": 72,
      Quantitative: 50,
    },
    learningDone: ["HTML/CSS layout lab", "SQL SELECT + JOIN"],
    applications: [
      { title: "Full-stack intern", status: "Applied" },
      { title: "QA intern", status: "Rejected" },
    ],
    mockAverage: 64,
    mockCount: 3,
    mockBest: 70,
    notes: ["Improving after QA rejection", "Verbal is a strength"],
  },
];

export function getDemoProfile(id: string) {
  return DEMO_PROFILES.find((item) => item.id === id) || null;
}
