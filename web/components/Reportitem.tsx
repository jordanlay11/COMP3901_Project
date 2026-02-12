type Severity = "critical" | "high" | "medium" | "low";
type Status = "pending" | "progress" | "resolved";

interface ReportItemProps {
  title: string;
  meta: string;
  severity: Severity;
  status: Status;
}

const statusLabel: Record<Status, string> = {
  pending: "Pending",
  progress: "In Progress",
  resolved: "Resolved",
};

export default function ReportItem({
  title,
  meta,
  severity,
  status,
}: ReportItemProps) {
  return (
    <div className="report-item">
      <div className={`severity-dot sev-${severity}`} />
      <div className="report-info">
        <div className="report-title">{title}</div>
        <div className="report-meta">{meta}</div>
      </div>
      <span className={`status-pill pill-${status}`}>
        {statusLabel[status]}
      </span>
    </div>
  );
}
