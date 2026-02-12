"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-bg-text">JDRS</div>
        <div className="login-emblem">JA</div>
        <div className="login-headline">Government of Jamaica</div>
        <div className="login-tagline">
          Jamaica Disaster
          <br />
          Response System
        </div>
        <div className="login-desc">
          Authorised access only. This system is monitored and used exclusively
          by emergency services personnel and designated government officials.
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-box">
          <div className="login-form-title">Officer Sign In</div>
          <div className="login-form-sub">
            Enter your credentials to access the command dashboard
          </div>

          <div className="form-group">
            <label className="form-label">Officer ID / Email</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. JFD-20041 or officer@jfb.gov.jm"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button
            className="login-btn"
            onClick={() => router.push("/dashboard")}
          >
            ACCESS SYSTEM
          </button>

          <div className="login-note">
            RESTRICTED — Unauthorised access is a criminal offence
          </div>
        </div>
      </div>
    </div>
  );
}
