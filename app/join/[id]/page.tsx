import { getPeerInterviewById } from "@/lib/actions/peer-interview.action";
import { notFound } from "next/navigation";
import GuestJoin from "@/components/GuestJoin";

export default async function PublicJoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interview = await getPeerInterviewById(id);

  if (!interview) {
    notFound();
  }

  if (interview.status === "completed") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold">This interview is finished</h1>
        <p className="mt-2 text-muted-foreground">Ask the candidate to create a new session.</p>
      </div>
    );
  }

  return (
    <GuestJoin
      interviewId={id}
      roomId={interview.roomId}
      role={interview.role}
      level={interview.level || "junior"}
    />
  );
}
