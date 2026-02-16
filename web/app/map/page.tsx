"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import StatCard from "@/components/Statcard";
import BroadcastModal from "@/components/BroadcastModal";
import { useAuthGuard } from "@/lib/useAuthGuard";

interface Report {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "pending" | "progress" | "resolved";
  location: { lat: number; lng: number; address?: string };
  parish: string;
  createdAt: any;
}

// Convert GPS coordinates to percentage positions on the map mock.
// Jamaica spans roughly lat 17.7–18.5, lng -78.4 to -76.2
// We map those ranges to 0–100% on the mock map div.
function coordsToPosition(lat: number, lng: number) {
  const top = ((18.5 - lat) / (18.5 - 17.7)) * 80 + 5; // % from top
  const left = ((lng - -78.4) / (-76.2 - -78.4)) * 85 + 5; // % from left
  return {
    top: `${Math.min(Math.max(top, 5), 90)}%`,
    left: `${Math.min(Math.max(left, 5), 90)}%`,
  };
}

// Map severity to pin CSS class
const sevToPin: Record<string, string> = {
  critical: "crit",
  high: "hi",
  medium: "med",
  low: "lo",
};

export default function MapPage() {
  const { loading: authLoading } = useAuthGuard();
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
      // Filter out resolved reports client-side to avoid needing a composite index
      setReports(data.filter((r) => r.status !== "resolved"));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authLoading]);

  if (authLoading) return null;

  // Derived counts from real data
  const critical = reports.filter((r) => r.severity === "critical").length;
  const sos = reports.filter((r) =>
    r.type?.toLowerCase().includes("sos"),
  ).length;

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate?.() ?? new Date(timestamp);
    return date.toLocaleTimeString("en-JM", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hardcoded shelters for now — you can move these to Firestore later
  const shelters = [
    {
      name: "Bull Bay Primary School",
      parish: "St. Andrew",
      used: 340,
      total: 400,
    },
    {
      name: "Portmore Community Centre",
      parish: "St. Catherine",
      used: 210,
      total: 500,
    },
    { name: "Buff Bay High School", parish: "Portland", used: 490, total: 500 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Map View</div>
          <div className="page-subtitle">
            Real-time incident locations across Jamaica
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-outline">Filter by Type</button>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Broadcast Alert
          </button>
        </div>
      </div>

      {/* Stats from real data */}
      <div className="stats-grid">
        <StatCard
          label="Active Incidents"
          value={loading ? "—" : reports.length}
          change="Non-resolved reports"
          variant="critical"
        />
        <StatCard
          label="Critical"
          value={loading ? "—" : critical}
          change="Highest severity"
          variant="high"
        />
        <StatCard
          label="Shelters Open"
          value={3}
          change="2,140 total capacity"
          variant="medium"
        />
        <StatCard
          label="Resolved Today"
          value="—"
          change="Check reports page"
          variant="resolved"
        />
      </div>

      {/* Map — pins come from real Firestore reports */}
      <div className="map-mock">
        <div className="map-grid" />
        <div className="map-label">
          JAMAICA — INCIDENT MAP
          {loading ? " · Loading..." : ` · ${reports.length} active`}
        </div>

        {reports.map((r) => {
          // Use GPS coords if available, otherwise skip the pin
          if (!r.location?.lat || !r.location?.lng) return null;
          const pos = coordsToPosition(r.location.lat, r.location.lng);
          return (
            <div
              key={r.id}
              className={`map-pin ${sevToPin[r.severity] ?? "lo"}`}
              style={{ top: pos.top, left: pos.left }}
              title={`${r.type} — ${r.severity.toUpperCase()} — ${r.location.address ?? r.parish}`}
            />
          );
        })}

        <div className="map-legend">
          {[
            { color: "var(--red-light)", label: "Critical" },
            { color: "var(--orange)", label: "High" },
            { color: "var(--yellow)", label: "Medium" },
            { color: "var(--green-light)", label: "Low" },
          ].map((l) => (
            <div key={l.label} className="legend-item">
              <div className="legend-dot" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Active Reports + Shelters */}
      <div className="grid-2" style={{ marginTop: "20px" }}>
        {/* Active reports list */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Active Incidents</div>
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
            ) : reports.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  color: "var(--gray)",
                  fontSize: "13px",
                }}
              >
                No active incidents.
              </div>
            ) : (
              reports.slice(0, 5).map((r) => (
                <div key={r.id} className="report-item">
                  <div className={`severity-dot sev-${r.severity}`} />
                  <div className="report-info">
                    <div className="report-title">{r.type}</div>
                    <div className="report-meta">
                      {r.location?.address ?? r.parish} ·{" "}
                      {formatTime(r.createdAt)}
                    </div>
                  </div>
                  <span className={`status-pill pill-${r.status}`}>
                    {r.status === "progress"
                      ? "In Progress"
                      : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shelters */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Open Shelters</div>
          </div>
          <div className="card-body" style={{ padding: "0 20px" }}>
            {shelters.map((s, i) => {
              const pct = Math.round((s.used / s.total) * 100);
              const statusClass =
                pct >= 90
                  ? "pill-pending"
                  : pct >= 50
                    ? "pill-progress"
                    : "pill-resolved";
              return (
                <div key={i} className="report-item">
                  <div
                    className={`severity-dot ${pct >= 90 ? "sev-medium" : "sev-low"}`}
                  />
                  <div className="report-info">
                    <div className="report-title">{s.name}</div>
                    <div className="report-meta">
                      {s.parish} · {s.used} / {s.total} capacity
                    </div>
                  </div>
                  <span className={`status-pill ${statusClass}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && <BroadcastModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
