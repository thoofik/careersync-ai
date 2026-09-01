interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const badgeColor =
    score > 70
      ? "bg-badge-green text-badge-green-text"
      : score > 49
        ? "bg-badge-yellow text-badge-yellow-text"
        : "bg-badge-red text-badge-red-text";
  const label = score > 70 ? "Strong" : score > 49 ? "Good start" : "Needs work";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
      {label}
    </span>
  );
};

export default ScoreBadge;
