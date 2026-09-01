import type { AssessmentBank, AssessmentQuestion } from "@/lib/assessment/catalog";

const q = (
  id: string,
  section: string,
  prompt: string,
  options: string[],
  correctIndex: number
): AssessmentQuestion => ({ id, section, prompt, options, correctIndex });

/** Campus / MNC-style aptitude (original items, not copied from any company paper). */
export const APTITUDE_QUESTIONS: AssessmentQuestion[] = [
  q("qa-1", "Quantitative", "20% of 450 is:", ["80", "90", "100", "110"], 1),
  q(
    "qa-2",
    "Quantitative",
    "An article is bought for ₹800 and sold for ₹920. Profit percent is:",
    ["12%", "15%", "18%", "20%"],
    1
  ),
  q(
    "qa-3",
    "Quantitative",
    "A can finish a job in 6 days and B in 12 days. Working together they finish in:",
    ["3 days", "4 days", "5 days", "8 days"],
    1
  ),
  q(
    "qa-4",
    "Quantitative",
    "A car travels at 60 km/h for 2.5 hours. Distance covered is:",
    ["120 km", "140 km", "150 km", "180 km"],
    2
  ),
  q(
    "qa-5",
    "Quantitative",
    "Simple interest on ₹5000 at 10% per annum for 2 years is:",
    ["₹500", "₹800", "₹1000", "₹1500"],
    2
  ),
  q(
    "qa-6",
    "Quantitative",
    "The ratio of two numbers is 3 : 5 and their sum is 80. The larger number is:",
    ["30", "40", "48", "50"],
    3
  ),
  q(
    "lr-1",
    "Logical reasoning",
    "Find the next term: 3, 9, 27, 81, ?",
    ["162", "216", "243", "324"],
    2
  ),
  q(
    "lr-2",
    "Logical reasoning",
    "If in a certain code APPLE is written as BQQMF, how is BALL written?",
    ["CBMM", "CBMN", "ABMM", "CBNN"],
    0
  ),
  q(
    "lr-3",
    "Logical reasoning",
    "A is the sister of B. C is the mother of B. D is the father of C. How is A related to D?",
    ["Daughter", "Granddaughter", "Niece", "Sister"],
    1
  ),
  q(
    "lr-4",
    "Logical reasoning",
    "A person faces North, turns 90° right, then 90° left. Which direction is he facing now?",
    ["East", "West", "North", "South"],
    2
  ),
  q(
    "lr-5",
    "Logical reasoning",
    "Odd one out: 3, 5, 7, 9, 11",
    ["3", "7", "9", "11"],
    2
  ),
  q(
    "lr-6",
    "Logical reasoning",
    "Statements: All pens are pencils. Some pencils are erasers.\nConclusions: I. Some pens are erasers. II. All erasers are pens.\nWhich follows?",
    ["Only I", "Only II", "Both I and II", "Neither I nor II"],
    3
  ),
  q(
    "vb-1",
    "Verbal ability",
    "Choose the word nearest in meaning to CANDID.",
    ["Secret", "Frank", "Angry", "Slow"],
    1
  ),
  q(
    "vb-2",
    "Verbal ability",
    "Choose the word opposite in meaning to ABUNDANT.",
    ["Plentiful", "Scarce", "Huge", "Rich"],
    1
  ),
  q(
    "vb-3",
    "Verbal ability",
    "Neither of the two boys ___ present today.",
    ["are", "is", "were", "have"],
    1
  ),
  q(
    "vb-4",
    "Verbal ability",
    "Book : Author :: Painting : ?",
    ["Canvas", "Colour", "Artist", "Museum"],
    2
  ),
  q(
    "vb-5",
    "Verbal ability",
    "Choose the grammatically correct sentence.",
    [
      "He is working here since 2019.",
      "He has been working here since 2019.",
      "He have been working here since 2019.",
      "He working here since 2019.",
    ],
    1
  ),
  q(
    "vb-6",
    "Verbal ability",
    "A campus notice says: \"Interns will report at 9 a.m. Late entry will not be allowed after 9:15 a.m.\" What can be inferred?",
    [
      "Interns may arrive at any time",
      "Entry is closed after 9:15 a.m.",
      "The internship is optional",
      "Reporting time is 9:15 a.m.",
    ],
    1
  ),
  q("qa-7", "Quantitative", "15% of 200 is:", ["20", "25", "30", "35"], 2),
  q("qa-8", "Quantitative", "The average of 10, 20, 30 and 40 is:", ["20", "25", "30", "40"], 1),
  q("qa-9", "Quantitative", "If 25% of a number is 40, the number is:", ["80", "100", "120", "160"], 3),
  q("qa-10", "Quantitative", "HCF of 24 and 36 is:", ["6", "8", "12", "18"], 2),
  q("qa-11", "Quantitative", "LCM of 12 and 18 is:", ["24", "36", "48", "72"], 1),
  q("qa-12", "Quantitative", "2/5 of 250 is:", ["50", "75", "100", "125"], 2),
  q("qa-13", "Quantitative", "A sum of ₹1000 at 10% simple interest for 3 years earns:", ["₹100", "₹200", "₹300", "₹330"], 2),
  q("qa-14", "Quantitative", "12 workers finish a job in 8 days. 6 workers need:", ["8 days", "12 days", "16 days", "24 days"], 2),
  q("qa-15", "Quantitative", "A train 100 m long crosses a pole in 10 s. Speed is:", ["10 km/h", "18 km/h", "36 km/h", "72 km/h"], 2),
  q("qa-16", "Quantitative", "If cost price is ₹250 and loss is 10%, selling price is:", ["₹200", "₹225", "₹240", "₹275"], 1),
  q("qa-17", "Quantitative", "Two pipes fill a tank in 10 and 15 minutes. Together they fill in:", ["5 min", "6 min", "8 min", "12 min"], 1),
  q("lr-7", "Logical reasoning", "Next term: 5, 10, 20, 40, ?", ["60", "70", "80", "90"], 2),
  q("lr-8", "Logical reasoning", "If CAT is coded as DBU, DOG is coded as:", ["EPH", "EPI", "DPH", "FOH"], 0),
  q("lr-9", "Logical reasoning", "Odd one out: 2, 4, 6, 9, 10", ["2", "6", "9", "10"], 2),
  q("lr-10", "Logical reasoning", "A person faces South and turns left. New direction:", ["East", "West", "North", "South"], 0),
  q("lr-11", "Logical reasoning", "Next square: 1, 4, 9, 16, ?", ["20", "24", "25", "36"], 2),
  q("lr-12", "Logical reasoning", "If 1 January is Monday, 8 January is:", ["Sunday", "Monday", "Tuesday", "Wednesday"], 1),
  q("lr-13", "Logical reasoning", "P is the mother of Q. Q is the brother of R. R is P's:", ["Uncle", "Child", "Father", "Cousin"], 1),
  q("lr-14", "Logical reasoning", "In a row of 10, A is 4th from left. Position from right:", ["6th", "7th", "8th", "4th"], 1),
  q("lr-15", "Logical reasoning", "All roses are flowers. Some flowers fade. Necessarily:", ["All roses fade", "Some roses may fade", "No rose fades", "All flowers are roses"], 1),
  q("lr-16", "Logical reasoning", "If in a code TREE is USFF, then LEAF is:", ["MFBG", "MEBG", "MFBH", "NEBG"], 0),
  q("lr-17", "Logical reasoning", "Find the odd pair: (2,4), (3,9), (4,16), (5,20)", ["(2,4)", "(3,9)", "(4,16)", "(5,20)"], 3),
  q("vb-7", "Verbal ability", "Nearest meaning of HONEST:", ["Clever", "Truthful", "Rich", "Silent"], 1),
  q("vb-8", "Verbal ability", "Opposite of ANCIENT:", ["Old", "Modern", "Historic", "Rare"], 1),
  q("vb-9", "Verbal ability", "Doctor : Hospital :: Teacher : ?", ["Book", "School", "Chalk", "Student"], 1),
  q("vb-10", "Verbal ability", "Choose the correct word: They forgot _____ keys.", ["there", "their", "they're", "theirs'"], 1),
  q("vb-11", "Verbal ability", "Fill in: She is good _____ mathematics.", ["in", "at", "on", "with"], 1),
  q("vb-12", "Verbal ability", "One-word for \"a person who writes poems\":", ["Novelist", "Poet", "Editor", "Critic"], 1),
  q("vb-13", "Verbal ability", "The idiom \"once in a blue moon\" means:", ["Very often", "Rarely", "At night", "Never"], 1),
  q("vb-14", "Verbal ability", "Correct article: He is _____ honest man.", ["a", "an", "the", "no article"], 1),
  q("vb-15", "Verbal ability", "Choose the correct tense: She _____ to campus yesterday.", ["go", "goes", "went", "gone"], 2),
  q("vb-16", "Verbal ability", "\"Although it rained, the match continued.\" The sentence shows:", ["Contrast", "Cause only", "Time only", "Question"], 0),
];

export const APTITUDE_BANK: AssessmentBank = {
  id: "aptitude",
  title: "Campus aptitude (Quant · Logical · Verbal)",
  kind: "aptitude",
  minutes: 50,
  questions: APTITUDE_QUESTIONS,
};
