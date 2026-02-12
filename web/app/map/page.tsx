import StatCard from "@/components/Statcard";

const pins = [
  { top: "38%", left: "72%", type: "crit", label: "Bull Bay — CRITICAL" },
  { top: "22%", left: "82%", type: "crit", label: "Buff Bay — CRITICAL" },
  { top: "50%", left: "55%", type: "hi", label: "Portmore — HIGH" },
  { top: "45%", left: "50%", type: "hi", label: "Spanish Town — HIGH" },
  { top: "65%", left: "42%", type: "hi", label: "May Pen — HIGH" },
  { top: "35%", left: "68%", type: "med", label: "Kingston — MEDIUM" },
  { top: "28%", left: "75%", type: "med", label: "Harbour View — MEDIUM" },
  { top: "55%", left: "28%", type: "med", label: "Mandeville — MEDIUM" },
  { top: "20%", left: "30%", type: "lo", label: "Montego Bay — LOW" },
  { top: "32%", left: "60%", type: "lo", label: "Constant Spring — LOW" },
];

const sosList = [
  { coords: "18.042°N, 76.712°W", area: "Bull Bay area", time: "14:18" },
  { coords: "17.981°N, 76.891°W", area: "Portmore area", time: "13:02" },
];

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

export default function MapPage() {
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
          <button className="btn btn-primary">Broadcast Alert</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Active Incidents"
          value={30}
          change="Across 6 parishes"
          variant="critical"
        />
        <StatCard
          label="SOS Alerts"
          value={7}
          change="2 unresponded"
          variant="high"
        />
        <StatCard
          label="Units Deployed"
          value={12}
          change="3 available"
          variant="medium"
        />
        <StatCard
          label="Shelters Open"
          value={8}
          change="2,140 capacity"
          variant="resolved"
        />
      </div>

      {/* Map */}
      <div className="map-mock">
        <div className="map-grid" />
        <div className="map-label">JAMAICA — INCIDENT MAP</div>

        {pins.map((pin, i) => (
          <div
            key={i}
            className={`map-pin ${pin.type}`}
            style={{ top: pin.top, left: pin.left }}
            title={pin.label}
          />
        ))}

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

      {/* SOS + Shelters */}
      <div className="grid-2" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">SOS Alerts — Unresponded</div>
          </div>
          <div className="card-body" style={{ padding: "0 20px" }}>
            {sosList.map((s, i) => (
              <div key={i} className="report-item">
                <div className="severity-dot sev-critical" />
                <div className="report-info">
                  <div className="report-title">SOS from {s.coords}</div>
                  <div className="report-meta">
                    {s.area} · Received {s.time} · No unit assigned
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{
                    fontSize: "11px",
                    padding: "5px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Assign Unit
                </button>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  );
}
