"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toTimeString().slice(0, 8));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="coat-of-arms">JA</div>
        <div className="system-title">
          <span className="agency">Government of Jamaica</span>
          <span className="name">Jamaica Disaster Response System</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="live-indicator">
          <div className="live-dot" />
          LIVE — {time}
        </div>
        <div className="admin-badge">👤 Cpl. Williams ▾</div>
      </div>
    </div>
  );
}
