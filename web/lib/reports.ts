// This file contains all the functions for reading and writing reports in Firestore.
// Instead of writing database logic inside each page, we put it all here.
// This keeps your pages clean and makes it easy to change later.

import {
  collection, // reference to a Firestore collection (like a table)
  addDoc, // add a new document (like inserting a row)
  getDocs, // get all documents from a collection
  doc, // reference to a single document
  updateDoc, // update fields on an existing document
  onSnapshot, // listen for real-time changes (live updates)
  query, // build a query
  orderBy, // sort results
  serverTimestamp, // use Firebase server time instead of device time
} from "firebase/firestore";

import { db } from "./firebase";

// ─────────────────────────────────────────
// TYPES
// Defines what a report object looks like.
// Every report in Firestore will follow this structure.
// ─────────────────────────────────────────
export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "pending" | "progress" | "resolved";

export interface Report {
  id?: string; // Firestore auto-generates this
  type: string; // e.g. "Flooding", "Landslide"
  severity: Severity;
  status: Status;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  parish: string;
  reportedBy?: string; // user ID of who submitted it
  assignedTo?: string; // officer or unit assigned
  riskScore?: number; // calculated by your algorithm
  createdAt: any; // Firestore timestamp
  updatedAt: any;
}

// ─────────────────────────────────────────
// SUBMIT A REPORT (used in mobile app)
// Call this when a citizen hits "Submit Report"
// ─────────────────────────────────────────
export async function submitReport(
  data: Omit<Report, "id" | "createdAt" | "updatedAt" | "status">,
) {
  try {
    // addDoc adds a new document to the "reports" collection.
    // Firestore automatically generates a unique ID for it.
    const docRef = await addDoc(collection(db, "reports"), {
      ...data,
      status: "pending", // all new reports start as pending
      createdAt: serverTimestamp(), // use server time so all timestamps match
      updatedAt: serverTimestamp(),
    });

    console.log("Report submitted with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting report:", error);
    throw error;
  }
}

// ─────────────────────────────────────────
// GET ALL REPORTS ONCE (used in web dashboard)
// Fetches reports sorted by newest first.
// Use this for the reports table page.
// ─────────────────────────────────────────
export async function getAllReports(): Promise<Report[]> {
  try {
    // Build a query: get all reports, ordered by creation time (newest first)
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    // Map each Firestore document to our Report type
    return snapshot.docs.map((doc) => ({
      id: doc.id, // Firestore document ID
      ...doc.data(), // all the fields we stored
    })) as Report[];
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

// ─────────────────────────────────────────
// LISTEN FOR REAL-TIME REPORT UPDATES (used in web dashboard)
// Instead of fetching once, this keeps listening.
// Every time a new report is added or changed, your callback runs automatically.
// This is what makes the dashboard update live without refreshing.
// ─────────────────────────────────────────
export function subscribeToReports(callback: (reports: Report[]) => void) {
  const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

  // onSnapshot returns an "unsubscribe" function.
  // Call unsubscribe() when you want to stop listening (e.g. when the component unmounts).
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Report[];

    callback(reports); // pass the updated list to whoever is listening
  });

  return unsubscribe;
}

// ─────────────────────────────────────────
// UPDATE REPORT STATUS (used in web dashboard)
// Call this when an officer changes a report from Pending → In Progress → Resolved
// ─────────────────────────────────────────
export async function updateReportStatus(
  reportId: string,
  status: Status,
  assignedTo?: string,
) {
  try {
    // doc() gives us a reference to a specific document by its ID
    const reportRef = doc(db, "reports", reportId);

    await updateDoc(reportRef, {
      status,
      assignedTo: assignedTo ?? null,
      updatedAt: serverTimestamp(), // record when it was last updated
    });

    console.log("Report updated:", reportId);
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}
