"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // signInWithEmailAndPassword checks the email and password against
      // Firebase Authentication. If it matches, the user is logged in.
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      // Firebase returns error codes — map them to readable messages
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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

          {/* Show error message if login fails */}
          {error && (
            <div
              style={{
                background: "rgba(231,76,60,0.1)",
                border: "1px solid rgba(231,76,60,0.3)",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#e74c3c",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="officer@jfb.gov.jm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "VERIFYING..." : "ACCESS SYSTEM"}
          </button>

          <div className="login-note">
            RESTRICTED — Unauthorised access is a criminal offence
          </div>
        </div>
      </div>
    </div>
  );
}
