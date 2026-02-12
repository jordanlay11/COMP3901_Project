import StatCard from "@/components/Statcard";
import ReportItem from "@/components/Reportitem";
import RiskZone from "@/components/Riskzone";
import Link from "next/link";

const recentReports = [
  {
    title: "Persons trapped — flash flood",
    meta: "Bull Bay, St. Andrew · 14:18 · RPT-0041",
    severity: "critical" as const,
    status: "pending" as const,
  },
  {
    title: "Road completely blocked — landslide",
    meta: "Buff Bay, Portland · 13:55 · RPT-0040",
    severity: "critical" as const,
    status: "progress" as const,
  },
  {
    title: "Building structural damage",
    meta: "Portmore, St. Catherine · 13:30 · RPT-0039",
    severity: "high" as const,
    status: "progress" as const,
  },
  {
    title: "Power lines down — road hazard",
    meta: "Spanish Town, St. Catherine · 12:44 · RPT-0038",
    severity: "medium" as const,
    status: "pending" as const,
  },
  {
    title: "Minor flooding — residential area",
    meta: "Kingston 6 · 12:10 · RPT-0037",
    severity: "low" as const,
    status: "resolved" as const,
  },
];

const riskZones = [
  { name: "Bull Bay", parish: "St. Andrew", score: 92 },
  { name: "Buff Bay", parish: "Portland", score: 85 },
  { name: "Portmore", parish: "St. Catherine", score: 67 },
  { name: "Spanish Town", parish: "St. Catherine", score: 54 },
  { name: "May Pen", parish: "Clarendon", score: 38 },
  { name: "Mandeville", parish: "Manchester", score: 21 },
];

const activityFeed = [
  {
    time: "14:31",
    text: (
      <>
        <strong>AI Alert:</strong> 6 flood reports clustered in Bull Bay — surge
        detected, zone escalated to CRITICAL
      </>
    ),
  },
  {
    time: "14:18",
    text: (
      <>
        New SOS received from <strong>18.0°N, 76.7°W</strong> — Bull Bay area —
        assigned to Unit 7
      </>
    ),
  },
  {
    time: "13:55",
    text: (
      <>
        RPT-0040 status changed to <strong>In Progress</strong> — Cpl. Davis
        dispatched
      </>
    ),
  },
  {
    time: "13:45",
    text: (
      <>
        Push notification broadcast — <strong>Hurricane watch</strong> — sent to
        14,820 users in St. Thomas, Portland, St. Mary
      </>
    ),
  },
  {
    time: "12:10",
    text: (
      <>
        RPT-0037 marked <strong>Resolved</strong> — minor flooding cleared,
        Kingston 6
      </>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Alert Ticker */}
      <div className="alert-ticker">
        <span>⚠</span>
        ACTIVE ALERT: Hurricane watch in effect — St. Thomas, Portland, St. Mary
        — NWS bulletin issued 13:45
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Command Dashboard</div>
          <div className="page-subtitle">
            THU 12 FEB 2026 · Last updated 14:32
          </div>
        </div>
        <Link href="/reports">
          <button className="btn btn-primary">+ New Report</button>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Critical"
          value={4}
          change="+2 since 09:00"
          variant="critical"
        />
        <StatCard
          label="High Priority"
          value={9}
          change="+3 since 09:00"
          variant="high"
        />
        <StatCard label="Medium" value={17} change="Stable" variant="medium" />
        <StatCard
          label="Resolved Today"
          value={11}
          change="↑ 8 yesterday"
          variant="resolved"
        />
      </div>

      {/* Reports + Risk Zones */}
      <div className="grid-3-1">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Reports</div>
            <Link href="/reports">
              <button
                className="btn btn-outline"
                style={{ fontSize: "11px", padding: "5px 12px" }}
              >
                View All
              </button>
            </Link>
          </div>
          <div className="card-body" style={{ padding: "0 20px" }}>
            {recentReports.map((r, i) => (
              <ReportItem key={i} {...r} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Risk Zones</div>
          </div>
          <div className="card-body" style={{ padding: "8px 20px" }}>
            {riskZones.map((z, i) => (
              <RiskZone key={i} {...z} />
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Activity Feed</div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--gray)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Auto-refreshing
          </div>
        </div>
        <div className="card-body" style={{ padding: "4px 20px" }}>
          {activityFeed.map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-time">{a.time}</div>
              <div className="activity-text">{a.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
