type Variant = "critical" | "high" | "medium" | "resolved";

interface StatCardProps {
  label: string;
  value: number | string;
  change: string;
  variant: Variant;
}

export default function StatCard({
  label,
  value,
  change,
  variant,
}: StatCardProps) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-change">{change}</div>
    </div>
  );
}
