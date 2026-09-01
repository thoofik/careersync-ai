export type InternshipJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  stipend: string;
  mode: "Remote" | "Hybrid" | "On-site";
  tags: Record<string, number>;
  summary: string;
};

export const INTERNSHIP_JOBS: InternshipJob[] = [
  {
    id: "python-backend",
    title: "Python backend intern",
    company: "Campus Demo · Nimbus Labs",
    location: "Bengaluru",
    stipend: "₹15,000 / month",
    mode: "Hybrid",
    tags: { Python: 85, Quantitative: 40, "Logical reasoning": 45 },
    summary: "APIs, small services, and debugging production-like Python tasks.",
  },
  {
    id: "java-backend",
    title: "Java backend intern",
    company: "Campus Demo · Stackyard",
    location: "Hyderabad",
    stipend: "₹18,000 / month",
    mode: "On-site",
    tags: { Java: 85, Quantitative: 45, "Logical reasoning": 50 },
    summary: "REST services, collections, and OOP-heavy maintenance work.",
  },
  {
    id: "js-frontend",
    title: "Frontend intern (JavaScript)",
    company: "Campus Demo · Pixel Lane",
    location: "Pune",
    stipend: "₹12,000 / month",
    mode: "Remote",
    tags: { JavaScript: 85, "Verbal ability": 40, Quantitative: 30 },
    summary: "UI bugs, fetch/JSON screens, and accessible component tweaks.",
  },
  {
    id: "sql-data",
    title: "Data / SQL intern",
    company: "Campus Demo · Tableform",
    location: "Chennai",
    stipend: "₹14,000 / month",
    mode: "Hybrid",
    tags: { SQL: 85, Quantitative: 60, "Logical reasoning": 40 },
    summary: "Reporting queries, joins, and cleaning messy campus datasets.",
  },
  {
    id: "fullstack-js",
    title: "Full-stack intern",
    company: "Campus Demo · Northwire",
    location: "Remote",
    stipend: "₹16,000 / month",
    mode: "Remote",
    tags: { JavaScript: 70, SQL: 55, "Verbal ability": 35 },
    summary: "Small features across a JS UI and a SQL-backed API.",
  },
  {
    id: "qa-aptitude",
    title: "QA intern",
    company: "Campus Demo · ProveIt",
    location: "Noida",
    stipend: "₹10,000 / month",
    mode: "On-site",
    tags: { "Logical reasoning": 70, Quantitative: 50, "Verbal ability": 40 },
    summary: "Test cases, regression checks, and written bug reports.",
  },
];

export function getInternship(id: string) {
  return INTERNSHIP_JOBS.find((job) => job.id === id);
}
