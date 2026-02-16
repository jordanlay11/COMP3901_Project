// This file handles everything related to push notifications on the mobile side.
// It asks the user for permission, gets their unique push token from Expo,
// and saves it to Firestore so the backend can send them notifications later.

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Tell Expo how to display notifications when the app is open (foreground).
// Without this, notifications are silently ignored while the app is running.
//Notifications.setNotificationHandler({
//  handleNotification: async () => ({
//   shouldShowAlert: true, // show the notification banner
//    shouldPlaySound: true, // play the default sound
//    shouldSetBadge: false, // don't show a number badge on the app icon
//  }),
//});

// ─────────────────────────────────────────
// REQUEST PERMISSION + GET PUSH TOKEN
// Call this once when the user logs in.
// The token is a unique address for this device — Expo uses it to deliver notifications.
// ─────────────────────────────────────────
export async function registerForPushNotifications(
  userId: string,
): Promise<string | null> {
  // Push notifications don't work on simulators/emulators — need a real device

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Ask user for permission to send notifications
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If they denied permission, we can't send notifications
  if (finalStatus !== "granted") {
    console.log("Push notification permission denied");
    return null;
  }

  // Get this device's unique Expo push token
  // This is like an address — Expo uses it to know which device to send to
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID, // from your app.json EAS project ID
  });

  const token = tokenData.data;
  console.log("Push token:", token);

  // Save the token to Firestore under a "pushTokens" collection.
  // Before saving, check if this token already exists to avoid duplicates.
  const tokensRef = collection(db, "pushTokens");
  const existing = await getDocs(query(tokensRef, where("token", "==", token)));

  if (existing.empty) {
    await addDoc(tokensRef, {
      token,
      userId, // who this token belongs to
      platform: Platform.OS,
      createdAt: new Date(),
    });
    console.log("Push token saved to Firestore");
  }

  return token;
}
