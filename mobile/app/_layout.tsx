import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "@/lib/notifications";

export default function RootLayout() {
  useEffect(() => {
    // Register for push notifications when the app first opens.
    // "citizen" is hardcoded — replace with real auth user ID later.
    registerForPushNotifications("citizen");

    // Listen for notifications while the app is open (foreground)
    const foregroundSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received in foreground:", notification);
        // You can update app state here e.g. show a custom in-app banner
      },
    );

    // Listen for when the user taps a notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("User tapped notification:", response);
        // Navigate to a screen based on the notification data e.g. router.push('/home')
      },
    );

    // Clean up listeners when the layout unmounts
    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
