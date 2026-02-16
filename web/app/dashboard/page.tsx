"use client";

// "use client" is needed because we use hooks and Firebase listeners
// which only work in the browser, not on the server.

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import StatCard from "@/components/Statcard";
import ReportItem from "@/components/Reportitem";
import RiskZone from "@/components/Riskzone";
import Link from "next/link";
import { useAuthGuard } from "@/lib/useAuthGuard";

// What a report looks like — must match what the mobile app saves to Firestore
interface Report {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "pending" | "progress" | "resolved";
  location: { lat: number; lng: number; address?: string };
  parish: string;
  createdAt: any;
}

// ─────────────────────────────────────────
// RISK SCORING ALGORITHM
// Takes all current reports and calculates a danger score (0–100) per parish.
// Score goes up based on: how many reports, how severe, how recent.
// This is the "computation" part your supervisor asked for.
// ─────────────────────────────────────────
function calculateRiskScores(reports: Report[]) {
  const parishScores: Record<string, number> = {};

  reports.forEach((r) => {
    if (r.status === "resolved") return; // resolved reports don't count toward risk

    // Weight each severity level differently
    const severityWeight =
      r.severity === "critical"
        ? 40
        : r.severity === "high"
          ? 25
          : r.severity === "medium"
            ? 10
            : 5;

    // Recency bonus: reports in the last hour count more
    const now = Date.now();
    const reportMs = r.createdAt?.toDate?.()?.getTime?.() ?? now;
    const ageHours = (now - reportMs) / (1000 * 60 * 60);
    const recencyBonus = ageHours < 1 ? 15 : ageHours < 6 ? 8 : 0;

    const parish = r.parish || "Unknown";
    parishScores[parish] =
      (parishScores[parish] ?? 0) + severityWeight + recencyBonus;
  });

  // Cap scores at 100 and sort highest first
  return Object.entries(parishScores)
    .map(([parish, score]) => ({
      name: parish,
      parish: parish,
      score: Math.min(Math.round(score), 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // show top 6 parishes
}

export default function DashboardPage() {
  const { loading: authLoading } = useAuthGuard();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // Live clock that updates every minute
  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleString("en-JM", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];

      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authLoading]);

  // ── Derived stats from real data ──
  // These recalculate automatically every time reports updates

  // Count reports by severity (only non-resolved ones)
  const active = reports.filter((r) => r.status !== "resolved");
  const critical = active.filter((r) => r.severity === "critical").length;
  const high = active.filter((r) => r.severity === "high").length;
  const medium = active.filter((r) => r.severity === "medium").length;

  // Count resolved reports from today only
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const resolvedToday = reports.filter((r) => {
    if (r.status !== "resolved") return false;
    const reportDate = r.createdAt?.toDate?.() ?? new Date(0);
    return reportDate >= todayStart;
  }).length;

  // Most recent 5 reports for the feed
  const recentReports = reports.slice(0, 5);

  // Run the risk scoring algorithm on all current reports
  const riskZones = calculateRiskScores(reports);

  // Format timestamp to readable time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate?.() ?? new Date(timestamp);
    return date.toLocaleTimeString("en-JM", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) return null;

  return (
    <div>
      {/* Alert Ticker — shown when there are critical reports */}
      {critical > 0 && (
        <div className="alert-ticker">
          <span>⚠</span>
          {critical} CRITICAL incident{critical > 1 ? "s" : ""} active —
          immediate response required
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Command Dashboard</div>
          <div className="page-subtitle">
            {loading ? "Loading..." : currentTime + " · Live"}
          </div>
        </div>
        <Link href="/reports">
          <button className="btn btn-primary">+ New Report</button>
        </Link>
      </div>

      {/* Stats — all calculated from real Firestore data */}
      <div className="stats-grid">
        <StatCard
          label="Critical"
          value={loading ? "—" : critical}
          change="Active incidents"
          variant="critical"
        />
        <StatCard
          label="High Priority"
          value={loading ? "—" : high}
          change="Active incidents"
          variant="high"
        />
        <StatCard
          label="Medium"
          value={loading ? "—" : medium}
          change="Active incidents"
          variant="medium"
        />
        <StatCard
          label="Resolved Today"
          value={loading ? "—" : resolvedToday}
          change="Closed today"
          variant="resolved"
        />
      </div>

      {/* Recent Reports + Risk Zones */}
      <div className="grid-3-1">
        {/* Recent Reports — live from Firestore */}
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
            {loading ? (
              <div
                style={{
                  padding: "20px",
                  color: "var(--gray)",
                  fontSize: "13px",
                }}
              >
                Loading...
              </div>
            ) : recentReports.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  color: "var(--gray)",
                  fontSize: "13px",
                }}
              >
                No reports yet.
              </div>
            ) : (
              recentReports.map((r) => (
                <ReportItem
                  key={r.id}
                  title={r.type}
                  meta={`${r.location?.address ?? r.parish} · ${formatTime(r.createdAt)}`}
                  severity={r.severity}
                  status={r.status}
                />
              ))
            )}
          </div>
        </div>

        {/* Risk Zones — calculated by algorithm from real report data */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Risk Zones</div>
          </div>
          <div className="card-body" style={{ padding: "8px 20px" }}>
            {loading ? (
              <div
                style={{
                  padding: "12px",
                  color: "var(--gray)",
                  fontSize: "13px",
                }}
              >
                Calculating...
              </div>
            ) : riskZones.length === 0 ? (
              <div
                style={{
                  padding: "12px",
                  color: "var(--gray)",
                  fontSize: "13px",
                }}
              >
                No risk data yet.
              </div>
            ) : (
              riskZones.map((z, i) => (
                <RiskZone
                  key={i}
                  name={z.name}
                  parish={z.parish}
                  score={z.score}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed — built from the 10 most recent reports */}
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
          {loading ? (
            <div
              style={{
                padding: "16px",
                color: "var(--gray)",
                fontSize: "13px",
              }}
            >
              Loading...
            </div>
          ) : reports.slice(0, 10).length === 0 ? (
            <div
              style={{
                padding: "16px",
                color: "var(--gray)",
                fontSize: "13px",
              }}
            >
              No activity yet.
            </div>
          ) : (
            reports.slice(0, 10).map((r) => (
              <div key={r.id} className="activity-item">
                <div className="activity-time">{formatTime(r.createdAt)}</div>
                <div className="activity-text">
                  New <strong>{r.severity}</strong> report — {r.type} in{" "}
                  <strong>{r.location?.address ?? r.parish}</strong> · Status:{" "}
                  {r.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
