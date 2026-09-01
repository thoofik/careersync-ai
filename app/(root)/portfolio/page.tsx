import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserStats } from "@/lib/actions/general.action";
import PortfolioClient from "@/components/student/PortfolioClient";

export default async function PortfolioPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const stats = await getUserStats(user.id);

  return (
    <PortfolioClient
      userId={user.id}
      name={user.name}
      mockAverage={stats?.averageScore || 0}
      mockCount={stats?.totalInterviews || 0}
    />
  );
}
