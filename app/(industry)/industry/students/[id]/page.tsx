import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import StudentWorkView from "@/components/industry/StudentWorkView";
import { getStudentDetailForIndustry } from "@/lib/actions/student.action";

export default async function IndustryStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudentDetailForIndustry(id);
  if (!student) notFound();

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/industry/students">All students</Link>
      </Button>
      <StudentWorkView student={student} />
    </div>
  );
}
