"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import BroadcastModal from "./BroadcastModal";

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  const [pendingCount, setPendingCount] = useState(0);
  const [showBroadcast, setShowBroadcast] = useState(false);

  // Listen for pending reports count in real time — this drives the badge number
  useEffect(() => {
    if (path === "/login") return;

    const q = query(
      collection(db, "reports"),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingCount(snapshot.size); // snapshot.size = number of matching docs
    });

    return () => unsubscribe();
  }, [path]);

  // Hide sidebar on login page
  if (path === "/login") return null;

  const navItems = [
    { label: "Dashboard", icon: "📊", href: "/dashboard" },
    { label: "Reports", icon: "📋", href: "/reports", badge: pendingCount },
    { label: "Map View", icon: "🗺️", href: "/map" },
  ];

  return (
    <>
      <div className="sidebar">
        <div className="nav-section">
          <div className="nav-label">Operations</div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${path === item.href ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {/* Only show badge if count is greater than 0 */}
              {item.badge != null && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="nav-section" style={{ marginTop: "8px" }}>
          <div className="nav-label">Alerts</div>

          {/* Notifications — placeholder for now */}
          <div
            className="nav-item"
            onClick={() => alert("Notifications coming soon")}
          >
            <span className="nav-icon">🔔</span>
            Notifications
          </div>

          {/* Broadcast Alert — opens the modal */}
          <div className="nav-item" onClick={() => setShowBroadcast(true)}>
            <span className="nav-icon">📡</span>
            Broadcast Alert
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
          >
            <span>⬅</span> Sign Out
          </button>
        </div>
      </div>

      {/* Broadcast modal rendered outside sidebar div so it overlays the whole page */}
      {showBroadcast && (
        <BroadcastModal onClose={() => setShowBroadcast(false)} />
      )}
    </>
  );
}
