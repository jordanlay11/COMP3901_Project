"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: "📊", href: "/dashboard" },
  { label: "Reports", icon: "📋", href: "/reports", badge: 12 },
  { label: "Map View", icon: "🗺️", href: "/map" },
];

const alertItems = [
  { label: "Notifications", icon: "🔔", href: "#", badge: 3 },
  { label: "Broadcast Alert", icon: "📡", href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on login page
  if (pathname === "/login") return null;

  return (
    <div className="sidebar">
      <div className="nav-section">
        <div className="nav-label">Operations</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}
      </div>

      <div className="nav-section" style={{ marginTop: "8px" }}>
        <div className="nav-label">Alerts</div>
        {alertItems.map((item) => (
          <a key={item.label} href={item.href} className="nav-item">
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </a>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => router.push("/login")}>
          <span>⬅</span> Sign Out
        </button>
      </div>
    </div>
  );
}
