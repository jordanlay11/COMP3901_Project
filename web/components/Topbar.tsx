"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Topbar() {
  const [time, setTime] = useState("");
  const [userName, setUserName] = useState("");

  // Live clock
  useEffect(() => {
    const update = () => setTime(new Date().toTimeString().slice(0, 8));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get the logged-in officer's display name from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Use displayName if set, otherwise fall back to the email prefix
        setUserName(user.displayName ?? user.email?.split("@")[0] ?? "Officer");
      }
    });
    return () => unsubscribe();
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
        {userName && <div className="admin-badge">👤 {userName} ▾</div>}
      </div>
    </div>
  );
}
