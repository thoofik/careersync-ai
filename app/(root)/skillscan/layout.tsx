import PuterInit from "@/components/skillscan/PuterInit";

export default function SkillScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-8">
      <PuterInit />
      {children}
    </div>
  );
}
