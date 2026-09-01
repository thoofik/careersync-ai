import StudentPath from "@/components/student/StudentPath";
import LanguagePicker from "@/components/assessment/LanguagePicker";

export default function AssessmentHomePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <StudentPath current="/assessment" />
      <p className="text-sm text-muted-foreground">Student portal · step 1</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Choose languages</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Check every language you want in this sitting. We still give one paper of 50:
        25 campus aptitude (quant, logical, verbal) plus 25 questions split across
        your picks.
      </p>
      <LanguagePicker />
    </div>
  );
}
