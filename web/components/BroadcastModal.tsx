"use client";

// This component is the "Broadcast Alert" modal that pops up
// when an officer clicks the button on the dashboard or map page.
// It sends the alert to the backend which forwards it to all mobile devices.

import { useState } from "react";

interface BroadcastModalProps {
  onClose: () => void;
}

const presets = [
  {
    title: "Hurricane Warning",
    message:
      "A hurricane warning is in effect for your area. Seek shelter immediately.",
  },
  {
    title: "Flash Flood Alert",
    message:
      "Flash flooding reported in your area. Move to higher ground immediately.",
  },
  {
    title: "Evacuation Order",
    message: "Mandatory evacuation order issued. Please leave the area now.",
  },
  {
    title: "All Clear",
    message:
      "The immediate danger has passed. Await further instructions from authorities.",
  },
];

export default function BroadcastModal({ onClose }: BroadcastModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Fill in a preset message so officers don't have to type from scratch
  const applyPreset = (preset: (typeof presets)[0]) => {
    setTitle(preset.title);
    setMessage(preset.message);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setLoading(true);

    try {
      // Call your Express backend which sends the notification to all devices via Expo
      // Make sure your backend is running on port 4000
      const res = await fetch("http://localhost:4000/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true); // show success message
      } else {
        alert(
          "Failed to send alert. Check that your backend server is running.",
        );
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      alert("Could not reach backend. Make sure it is running on port 4000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dark overlay behind the modal
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: "var(--navy-mid)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "28px",
          width: "480px",
          maxWidth: "90vw",
        }}
      >
        {sent ? (
          // Success state
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--white)",
                marginBottom: "8px",
              }}
            >
              Alert Sent
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              Notification delivered to all registered devices
            </div>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--white)",
                }}
              >
                📡 Broadcast Alert
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray)",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* Quick preset buttons */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--gray)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Quick Presets
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {presets.map((p) => (
                  <button
                    key={p.title}
                    className="btn btn-outline"
                    style={{ fontSize: "11px", padding: "5px 10px" }}
                    onClick={() => applyPreset(p)}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Title input */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--gold)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Alert Title
              </div>
              <input
                className="filter-input"
                style={{ width: "100%" }}
                placeholder="e.g. Hurricane Warning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Message input */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--gold)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Message
              </div>
              <textarea
                className="filter-input"
                style={{ width: "100%", height: "90px", resize: "none" }}
                placeholder="Write your alert message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={loading || !title || !message}
                style={{ opacity: loading || !title || !message ? 0.6 : 1 }}
              >
                {loading ? "Sending..." : "Send to All Devices"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
