import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import * as Location from "expo-location";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Colors } from "@/constants/colors";

const quickOptions = [
  { icon: "🚑", label: "Medical Emergency", type: "Medical" },
  { icon: "🔥", label: "Fire", type: "Fire" },
  { icon: "🌊", label: "Flooding", type: "Flooding" },
  { icon: "🏠", label: "Structural Damage", type: "Damage" },
  { icon: "⚡", label: "Power / Hazard", type: "Hazard" },
  { icon: "📋", label: "File Report", type: null, isReport: true },
];

export default function SOSScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [locLoading, setLocLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Get GPS location when screen loads
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocLoading(false);
          return;
        }

        const coords = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const geocode = await Location.reverseGeocodeAsync({
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
        });

        const place = geocode[0];
        const address = place
          ? `${place.city ?? place.district ?? ""}, ${place.region ?? ""}`.trim()
          : `${coords.coords.latitude.toFixed(4)}°N, ${coords.coords.longitude.toFixed(4)}°W`;

        setLocation({
          lat: coords.coords.latitude,
          lng: coords.coords.longitude,
          address,
        });
      } catch (e) {
        console.error("Location error:", e);
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  // Send SOS — saves to Firestore as a critical report so it shows on the web dashboard
  const sendSOS = async (type: string = "SOS") => {
    if (sending) return;
    setSending(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        type: type,
        severity: "critical", // SOS is always critical
        description: `SOS alert — ${type}. Immediate assistance required.`,
        status: "pending",
        location: {
          lat: location?.lat ?? 18.0042,
          lng: location?.lng ?? -76.7442,
          address: location?.address ?? "Location unavailable",
        },
        parish: location?.address?.split(",")[1]?.trim() ?? "Unknown",
        reportedBy: user?.uid ?? "anonymous",
        isSOS: true, // flag so the dashboard can highlight SOS reports
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
        "🚨 SOS Alert Sent",
        `Location: ${location?.address ?? "Unknown"}\n\nEmergency services have been notified.`,
        [{ text: "OK" }],
      );
    } catch (err) {
      console.error("SOS error:", err);
      Alert.alert("Error", "Failed to send SOS. Please call 119 directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Emergency SOS</Text>
          <Text style={styles.sub}>Sends your GPS location instantly</Text>
        </View>
        <View style={styles.locationChip}>
          <Text style={{ fontSize: 12 }}>📍</Text>
          {locLoading ? (
            <ActivityIndicator size="small" color={Colors.green} />
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {location ? location.address.split(",")[0] : "No GPS"}
            </Text>
          )}
        </View>
      </View>

      {/* SOS Button */}
      <View style={styles.center}>
        <View style={styles.ringOuter}>
          <View style={styles.ringMid}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[styles.sosBtn, sending && { opacity: 0.7 }]}
                onPress={() => sendSOS("SOS")}
                disabled={sending}
                activeOpacity={0.9}
              >
                {sending ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <>
                    <Text style={styles.sosBtnLabel}>SOS</Text>
                    <Text style={styles.sosBtnSub}>Tap to send</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <Text style={styles.caption}>
          Pressing SOS immediately alerts emergency services with your exact GPS
          location
        </Text>
      </View>

      {/* Quick type buttons */}
      <View style={styles.optionsGrid}>
        {quickOptions.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.optionBtn}
            activeOpacity={0.7}
            onPress={() => {
              if (opt.isReport) {
                router.push("/(tabs)/report");
              } else if (opt.type) {
                sendSOS(opt.type);
              }
            }}
          >
            <Text style={styles.optionIcon}>{opt.icon}</Text>
            <Text style={styles.optionLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
    justifyContent: "space-between",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: Colors.text },
  sub: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 150,
  },
  locationText: {
    fontSize: 11,
    color: Colors.green,
    fontWeight: "500",
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  ringOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(232,83,74,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringMid: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: "rgba(232,83,74,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  sosBtnLabel: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
    letterSpacing: 2,
  },
  sosBtnSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontWeight: "500",
  },
  caption: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 8,
    paddingBottom: 24,
  },
  optionBtn: {
    width: "31%",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  optionIcon: { fontSize: 24 },
  optionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.muted,
    textAlign: "center",
  },
});
