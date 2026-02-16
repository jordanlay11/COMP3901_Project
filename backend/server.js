// This is your Express backend server.
// Its main job here is to receive alert requests from the web dashboard
// and forward them to Expo's push notification service.
//
// Why do we need a backend for this?
// You can't call Expo's push API directly from the browser because
// your Firebase credentials would be exposed. The backend keeps them safe.

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");
require("dotenv").config();

const app = express();
const expo = new Expo(); // Expo's push notification client

app.use(cors()); // allow requests from your Next.js web app
//app.use(cors({
//  origin: "http://localhost:3000"
//}));

app.use(express.json()); // parse JSON request bodies

// ─────────────────────────────────────────
// FIREBASE ADMIN SETUP
// The Admin SDK lets your backend read/write Firestore with full access.
// This is different from the client SDK used in the web and mobile apps.
// It uses a service account key file — download this from Firebase:
// Project Settings → Service Accounts → Generate New Private Key
// Save it as serviceAccountKey.json in your /backend folder.
// NEVER commit this file to GitHub — add it to .gitignore.
// ─────────────────────────────────────────
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const db = admin.firestore();

// ─────────────────────────────────────────
// POST /send-alert
// The web dashboard calls this endpoint when an officer broadcasts an alert.
// Body: { title: string, message: string }
// ─────────────────────────────────────────
app.post("/send-alert", async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "title and message are required" });
  }

  try {
    // Step 1: Get all push tokens from Firestore
    // Every mobile device that opened the app saved its token here
    const tokensSnapshot = await db.collection("pushTokens").get();
    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

    if (tokens.length === 0) {
      return res.status(200).json({ message: "No devices registered yet" });
    }

    // Step 2: Build the notification messages
    // Each message targets one device token
    const messages = [];

    for (const token of tokens) {
      // Validate the token is a real Expo push token before using it
      if (!Expo.isExpoPushToken(token)) {
        console.warn(`Invalid token skipped: ${token}`);
        continue;
      }

      messages.push({
        to: token,
        sound: "default",
        title,
        body: message,
        data: { type: "alert" }, // extra data the app can read when notification is tapped
      });
    }

    // Step 3: Send in chunks — Expo limits how many you can send at once
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const chunkTickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...chunkTickets);
    }

    // Step 4: Save the alert to Firestore so the dashboard can show history
    await db.collection("alerts").add({
      title,
      message,
      sentTo: tokens.length,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Alert sent to ${tokens.length} devices`);
    res.status(200).json({ success: true, sentTo: tokens.length, tickets });
  } catch (error) {
    console.error("Error sending alert:", error);
    res.status(500).json({ error: "Failed to send alert" });
  }
});

// Basic health check — visit /health to confirm the server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
