import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Colors } from "@/constants/colors";

const quickOptions = [
  { icon: "🚑", label: "Medical Emergency" },
  { icon: "🔥", label: "Fire" },
  { icon: "🌊", label: "Flooding" },
  { icon: "🏠", label: "Structural Damage" },
  { icon: "⚡", label: "Power / Hazard" },
  { icon: "📋", label: "File Report", isReport: true },
];

export default function SOSScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSOS = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      "SOS Alert Sent",
      "Location: 18.0042°N, 76.7442°W\nEmergency services have been notified.",
      [{ text: "OK" }],
    );
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
          <Text style={styles.locationText}>GPS Active</Text>
        </View>
      </View>

      {/* SOS Button */}
      <View style={styles.center}>
        <View style={styles.ringOuter}>
          <View style={styles.ringMid}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.sosBtn}
                onPress={handleSOS}
                activeOpacity={0.9}
              >
                <Text style={styles.sosBtnLabel}>SOS</Text>
                <Text style={styles.sosBtnSub}>Tap to send</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <Text style={styles.caption}>
          Pressing SOS will immediately alert emergency services with your exact
          GPS location
        </Text>
      </View>

      {/* Quick Options */}
      <View style={styles.optionsGrid}>
        {quickOptions.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.optionBtn}
            activeOpacity={0.7}
            onPress={() => opt.isReport && router.push("/(tabs)/report")}
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
  },
  locationText: { fontSize: 11, color: Colors.green, fontWeight: "500" },

  // SOS center
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

  // Options
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
