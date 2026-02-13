import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/colors";

const riskZones = [
  {
    id: "1",
    name: "Bull Bay",
    parish: "St. Andrew",
    score: 92,
    color: Colors.red,
  },
  {
    id: "2",
    name: "Buff Bay",
    parish: "Portland",
    score: 85,
    color: Colors.red,
  },
  {
    id: "3",
    name: "Portmore",
    parish: "St. Catherine",
    score: 67,
    color: Colors.orange,
  },
  {
    id: "4",
    name: "May Pen",
    parish: "Clarendon",
    score: 38,
    color: Colors.yellow,
  },
];

const feedItems = [
  {
    id: "1",
    icon: "⚠️",
    title: "Flash flood — Bull Bay",
    meta: "14:18 · St. Andrew",
    tag: "Critical",
    tagColor: Colors.red,
  },
  {
    id: "2",
    icon: "📡",
    title: "Hurricane watch issued",
    meta: "13:45 · NWS Bulletin",
    tag: "Alert",
    tagColor: Colors.blue,
  },
  {
    id: "3",
    icon: "🚧",
    title: "Road blocked — Buff Bay",
    meta: "13:55 · Portland",
    tag: "High",
    tagColor: Colors.orange,
  },
  {
    id: "4",
    icon: "✅",
    title: "Flooding cleared — Kingston 6",
    meta: "12:10 · Kingston",
    tag: "Resolved",
    tagColor: Colors.green,
  },
  {
    id: "5",
    icon: "🏫",
    title: "Shelter open — Bull Bay Primary",
    meta: "11:30 · 340/400 capacity",
    tag: "Shelter",
    tagColor: Colors.blue,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good afternoon,</Text>
              <Text style={styles.name}>Marcus 👋</Text>
            </View>
            <View style={styles.notifBtn}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <View style={styles.notifDot} />
            </View>
          </View>

          {/* Alert Banner */}
          <View style={styles.alertBanner}>
            <View style={styles.alertPulse} />
            <Text style={styles.alertText}>
              Hurricane Watch — St. Thomas, Portland, St. Mary
            </Text>
          </View>
        </View>

        {/* Risk Zones */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Risk Zones</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.riskScroll}
        >
          {riskZones.map((zone) => (
            <View key={zone.id} style={styles.riskCard}>
              <Text style={[styles.riskScore, { color: zone.color }]}>
                {zone.score}
              </Text>
              <Text style={styles.riskName}>{zone.name}</Text>
              <Text style={styles.riskParish}>{zone.parish}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Feed */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Live Feed</Text>
          <Text style={styles.seeAll}>Filter</Text>
        </View>
        {feedItems.map((item) => (
          <View key={item.id} style={styles.feedItem}>
            <View style={styles.feedIcon}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            </View>
            <View style={styles.feedContent}>
              <Text style={styles.feedTitle}>{item.title}</Text>
              <Text style={styles.feedMeta}>{item.meta}</Text>
            </View>
            <View
              style={[
                styles.feedTag,
                { backgroundColor: item.tagColor + "25" },
              ]}
            >
              <Text style={[styles.feedTagText, { color: item.tagColor }]}>
                {item.tag}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy },

  // Header
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

  // Sections
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
  seeAll: { fontSize: 12, color: Colors.red, fontWeight: "600" },

  // Risk
  riskScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  riskCard: {
    width: 120,
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
  riskName: { fontSize: 12, fontWeight: "600", color: Colors.text },
  riskParish: { fontSize: 11, color: Colors.muted },

  // Feed
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
  feedTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  feedTagText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
