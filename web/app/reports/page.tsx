"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthGuard } from "@/lib/useAuthGuard";

interface Report {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "pending" | "progress" | "resolved";
  description: string;
  location: { lat: number; lng: number; address?: string };
  parish: string;
  assignedTo?: string;
  photoBase64?: string;
  createdAt: any;
}

export default function ReportsPage() {
  const { loading: authLoading } = useAuthGuard();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ALL hooks must be called before any early returns — this fixes the hooks order error.
  // The useEffect below still runs but won't do anything harmful if auth isn't ready yet.
  useEffect(() => {
    if (authLoading) return; // don't subscribe until auth is confirmed

    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Report[];
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authLoading]); // re-run when authLoading changes from true to false

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.parish.toLowerCase().includes(search.toLowerCase()) ||
      (r.location?.address ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesSev = sevFilter === "all" || r.severity === sevFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesSev && matchesStatus;
  });

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate?.() ?? new Date(timestamp);
    return date.toLocaleTimeString("en-JM", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Early return AFTER all hooks — this is the correct place
  if (authLoading) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Incident Reports</div>
          <div className="page-subtitle">
            {loading
              ? "Loading..."
              : `${reports.length} total · ${reports.filter((r) => r.status !== "resolved").length} active`}
          </div>
        </div>
        <button className="btn btn-primary">+ New Report</button>
      </div>

      <div className="filter-bar">
        <input
          className="filter-input"
          style={{ flex: 1, minWidth: "200px" }}
          type="text"
          placeholder="🔍  Search by type, parish, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-input"
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="filter-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button className="btn btn-outline">Export CSV</button>
      </div>

      <div className="card">
        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--gray)",
            }}
          >
            Loading reports...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--gray)",
            }}
          >
            No reports found.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Photo</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Parish</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Reported</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="id-col">
                      #{r.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td>
                      {/* Show thumbnail if photo was attached, dash if not */}
                      {r.photoBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${r.photoBase64}`}
                          style={{
                            width: 52,
                            height: 36,
                            borderRadius: 4,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span
                          style={{ color: "var(--gray)", fontSize: "12px" }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td>{r.type}</td>
                    <td>{r.location?.address ?? "Unknown"}</td>
                    <td>{r.parish}</td>
                    <td>
                      <span className={`sev-badge ${r.severity}`}>
                        {r.severity}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`status-pill pill-${r.status}`}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                        value={r.status}
                        onChange={(e) =>
                          handleStatusChange(r.id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                      }}
                    >
                      {formatTime(r.createdAt)}
                    </td>
                    <td style={{ color: "var(--gray)" }}>
                      {r.assignedTo ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
