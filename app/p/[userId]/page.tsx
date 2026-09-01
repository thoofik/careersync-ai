import { getPublishedPortfolio } from "@/lib/actions/student.action";
import { APPLICATION_STATUSES } from "@/lib/internships/applications";
import { getInternship } from "@/lib/internships/catalog";
import Link from "next/link";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const portfolio = await getPublishedPortfolio(userId);

  if (!portfolio) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Portfolio not published</h1>
        <p className="mt-2 text-muted-foreground">
          This student has not published a CareerSync portfolio yet.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-primary">
          CareerSync AI
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 pb-24">
      <p className="text-sm text-primary">CareerSync AI · student portfolio</p>
      <h1 className="mt-2 text-3xl font-semibold">{portfolio.name}</h1>
      <p className="mt-1 text-muted-foreground">{portfolio.headline}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Published {new Date(portfolio.publishedAt).toLocaleDateString()}
      </p>

      {portfolio.skillProfile && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {portfolio.skillProfile.language} + aptitude · {portfolio.skillProfile.overall}%
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {Object.entries(portfolio.skillProfile.sections).map(([skill, value]) => (
              <li key={skill} className="flex justify-between">
                <span>{skill}</span>
                <span>{value}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Learning</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {portfolio.learningDone.length} catalog items completed
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Applications</h2>
        {portfolio.applications.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">None listed.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {portfolio.applications.map((item) => {
              const job = getInternship(item.jobId);
              const status =
                APPLICATION_STATUSES.find((entry) => entry.id === item.status)?.label ||
                item.status;
              return (
                <li key={item.jobId}>
                  {job?.title || item.jobId} · {status}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Interview practice</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {portfolio.mockCount} mocks · average {portfolio.mockAverage}/100
        </p>
      </section>
    </div>
  );
}
