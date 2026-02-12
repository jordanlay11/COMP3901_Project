const reports = [
  {
    id: "RPT-0041",
    type: "Flood / Trapped Persons",
    location: "Bull Bay",
    parish: "St. Andrew",
    severity: "critical",
    status: "pending",
    time: "14:18",
    assigned: "—",
  },
  {
    id: "RPT-0040",
    type: "Landslide / Road Block",
    location: "Buff Bay",
    parish: "Portland",
    severity: "critical",
    status: "progress",
    time: "13:55",
    assigned: "Cpl. Davis",
  },
  {
    id: "RPT-0039",
    type: "Structural Damage",
    location: "Portmore",
    parish: "St. Catherine",
    severity: "high",
    status: "progress",
    time: "13:30",
    assigned: "Unit 3",
  },
  {
    id: "RPT-0038",
    type: "Power Lines Down",
    location: "Spanish Town",
    parish: "St. Catherine",
    severity: "high",
    status: "pending",
    time: "12:44",
    assigned: "—",
  },
  {
    id: "RPT-0037",
    type: "Flooding",
    location: "Kingston 6",
    parish: "Kingston",
    severity: "medium",
    status: "resolved",
    time: "12:10",
    assigned: "Unit 1",
  },
  {
    id: "RPT-0036",
    type: "Flooding",
    location: "Harbour View",
    parish: "St. Andrew",
    severity: "medium",
    status: "progress",
    time: "11:52",
    assigned: "Sgt. Brown",
  },
  {
    id: "RPT-0035",
    type: "Tree on Road",
    location: "Constant Spring",
    parish: "St. Andrew",
    severity: "low",
    status: "resolved",
    time: "11:20",
    assigned: "Unit 2",
  },
  {
    id: "RPT-0034",
    type: "SOS — Person Injured",
    location: "May Pen",
    parish: "Clarendon",
    severity: "high",
    status: "pending",
    time: "10:58",
    assigned: "—",
  },
];

const statusLabel: Record<string, string> = {
  pending: "Pending",
  progress: "In Progress",
  resolved: "Resolved",
};

export default function ReportsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Incident Reports</div>
          <div className="page-subtitle">41 total reports · 12 active</div>
        </div>
        <button className="btn btn-primary">+ New Report</button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="filter-input"
          style={{ flex: 1, minWidth: "200px" }}
          type="text"
          placeholder="🔍  Search reports..."
        />
        <select className="filter-input">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="filter-input">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select className="filter-input">
          <option>All Parishes</option>
          <option>Kingston</option>
          <option>St. Andrew</option>
          <option>St. Catherine</option>
          <option>Portland</option>
          <option>St. Thomas</option>
        </select>
        <button className="btn btn-outline">Export CSV</button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
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
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="id-col">{r.id}</td>
                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td>{r.parish}</td>
                  <td>
                    <span className={`sev-badge ${r.severity}`}>
                      {r.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill pill-${r.status}`}>
                      {statusLabel[r.status]}
                    </span>
                  </td>
                  <td
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
                  >
                    {r.time}
                  </td>
                  <td style={{ color: "var(--gray)" }}>{r.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
