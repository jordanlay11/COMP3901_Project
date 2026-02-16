// This file sets up the connection between your Next.js web app and Firebase.
// It runs once when the app starts and exports the tools you need (db, auth, etc.)

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// These values come from your .env.local file.
// NEXT_PUBLIC_ means Next.js will expose them to the browser (needed for client-side Firebase).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent Firebase from being initialized more than once.
// Next.js can run this file multiple times during hot reload,
// so we check if an app already exists before creating a new one.
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// db = your Firestore database. Import this anywhere you need to read/write data.
export const db = getFirestore(app);

// auth = Firebase Authentication. Import this for login/logout features.
export const auth = getAuth(app);
