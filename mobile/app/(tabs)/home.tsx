import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Colors } from "@/constants/colors";

interface Report {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "pending" | "progress" | "resolved";
  location: { lat: number; lng: number; address?: string };
  parish: string;
  createdAt: any;
}

// Same risk scoring algorithm as the web dashboard
// Calculates a danger score per parish from real report data
function calcRiskZones(reports: Report[]) {
  const scores: Record<string, number> = {};

  reports.forEach((r) => {
    if (r.status === "resolved") return;
    const weight =
      r.severity === "critical"
        ? 40
        : r.severity === "high"
          ? 25
          : r.severity === "medium"
            ? 10
            : 5;
    const now = Date.now();
    const age = r.createdAt?.toDate?.()?.getTime?.() ?? now;
    const bonus = (now - age) / (1000 * 60 * 60) < 1 ? 15 : 0;
    const p = r.parish || "Unknown";
    scores[p] = (scores[p] ?? 0) + weight + bonus;
  });

  return Object.entries(scores)
    .map(([name, score]) => ({ name, score: Math.min(Math.round(score), 100) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// Pick color based on risk score
function scoreColor(score: number) {
  if (score >= 75) return Colors.red;
  if (score >= 50) return Colors.orange;
  if (score >= 25) return Colors.yellow;
  return Colors.green;
}

// Pick icon and tag color based on severity
function sevMeta(severity: string) {
  const map: Record<string, { icon: string; color: string; tag: string }> = {
    critical: { icon: "⚠️", color: Colors.red, tag: "Critical" },
    high: { icon: "🚧", color: Colors.orange, tag: "High" },
    medium: { icon: "⚡", color: Colors.yellow, tag: "Medium" },
    low: { icon: "✅", color: Colors.green, tag: "Low" },
  };
  return map[severity] ?? map.low;
}

function formatTime(ts: any) {
  if (!ts) return "";
  const d = ts.toDate?.() ?? new Date(ts);
  return d.toLocaleTimeString("en-JM", { hour: "2-digit", minute: "2-digit" });
}

export default function HomeScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Get logged-in user's name from Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName ?? user.email?.split("@")[0] ?? "User");
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to real-time reports from Firestore
  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Report[]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const riskZones = calcRiskZones(reports);
  const criticalCount = reports.filter(
    (r) => r.severity === "critical" && r.status !== "resolved",
  ).length;
  const feedItems = reports.slice(0, 8); // show 8 most recent

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.name}>{userName || "..."} 👋</Text>
            </View>
            <View style={styles.notifBtn}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              {criticalCount > 0 && <View style={styles.notifDot} />}
            </View>
          </View>

          {/* Only show alert banner when there are critical active reports */}
          {criticalCount > 0 && (
            <View style={styles.alertBanner}>
              <View style={styles.alertPulse} />
              <Text style={styles.alertText}>
                {criticalCount} critical incident{criticalCount > 1 ? "s" : ""}{" "}
                active in your area
              </Text>
            </View>
          )}
        </View>

        {/* Risk Zones */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Risk Zones</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.red} style={{ margin: 20 }} />
        ) : riskZones.length === 0 ? (
          <Text style={styles.emptyText}>No active risk zones</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.riskScroll}
          >
            {riskZones.map((zone) => (
              <View key={zone.name} style={styles.riskCard}>
                <Text
                  style={[styles.riskScore, { color: scoreColor(zone.score) }]}
                >
                  {zone.score}
                </Text>
                <Text style={styles.riskName}>{zone.name}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Live Feed */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Live Feed</Text>
          <Text style={styles.seeAll}>
            {loading ? "" : `${reports.length} reports`}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.red} style={{ margin: 20 }} />
        ) : feedItems.length === 0 ? (
          <Text style={styles.emptyText}>No reports yet</Text>
        ) : (
          feedItems.map((item) => {
            const meta = sevMeta(item.severity);
            return (
              <View key={item.id} style={styles.feedItem}>
                <View style={styles.feedIcon}>
                  <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
                </View>
                <View style={styles.feedContent}>
                  <Text style={styles.feedTitle}>{item.type}</Text>
                  <Text style={styles.feedMeta}>
                    {item.location?.address ?? item.parish} ·{" "}
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.feedTag,
                    { backgroundColor: meta.color + "25" },
                  ]}
                >
                  <Text style={[styles.feedTagText, { color: meta.color }]}>
                    {meta.tag}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy },
  emptyText: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: "center",
    margin: 20,
  },

  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  greeting: { fontSize: 13, color: Colors.muted },
  name: { fontSize: 18, fontWeight: "700", color: Colors.text },
  notifBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifDot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.red,
    borderRadius: 4,
    position: "absolute",
    top: 8,
    right: 8,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  alertBanner: {
    backgroundColor: "rgba(232,83,74,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,83,74,0.3)",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  alertPulse: {
    width: 8,
    height: 8,
    backgroundColor: Colors.red,
    borderRadius: 4,
  },
  alertText: { fontSize: 12, color: Colors.red, fontWeight: "600", flex: 1 },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  seeAll: { fontSize: 12, color: Colors.muted },

  riskScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  riskCard: {
    width: 110,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
  },
  riskScore: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 4,
  },
  riskName: { fontSize: 11, fontWeight: "600", color: Colors.text },

  feedItem: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  feedIcon: {
    width: 38,
    height: 38,
    backgroundColor: Colors.surface2,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  feedContent: { flex: 1 },
  feedTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  feedMeta: { fontSize: 11, color: Colors.muted },
  feedTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  feedTagText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
