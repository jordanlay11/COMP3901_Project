import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [weatherUpdates, setWeatherUpdates] = useState(true);
  const [nearbyIncidents, setNearbyIncidents] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 30 }}>👤</Text>
        </View>
        <Text style={styles.profileName}>Marcus Williams</Text>
        <Text style={styles.profileEmail}>marcus.w@gmail.com</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>7</Text>
            <Text style={styles.statLbl}>Reports</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>2</Text>
            <Text style={styles.statLbl}>SOS Sent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>14</Text>
            <Text style={styles.statLbl}>Days Active</Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <Text style={styles.sectionLabel}>Notifications</Text>

      <View style={styles.settingsCard}>
        <View style={styles.settingsItem}>
          <View
            style={[
              styles.settingsIcon,
              { backgroundColor: "rgba(232,83,74,0.15)" },
            ]}
          >
            <Text style={{ fontSize: 18 }}>🚨</Text>
          </View>
          <View style={styles.settingsText}>
            <Text style={styles.settingsTitle}>Emergency Alerts</Text>
            <Text style={styles.settingsSub}>
              Critical warnings and evacuations
            </Text>
          </View>
          <Switch
            value={emergencyAlerts}
            onValueChange={setEmergencyAlerts}
            trackColor={{ false: Colors.surface2, true: Colors.red }}
            thumbColor="white"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingsItem}>
          <View
            style={[
              styles.settingsIcon,
              { backgroundColor: "rgba(240,131,58,0.15)" },
            ]}
          >
            <Text style={{ fontSize: 18 }}>🌀</Text>
          </View>
          <View style={styles.settingsText}>
            <Text style={styles.settingsTitle}>Weather Updates</Text>
            <Text style={styles.settingsSub}>
              Storms, floods, wind warnings
            </Text>
          </View>
          <Switch
            value={weatherUpdates}
            onValueChange={setWeatherUpdates}
            trackColor={{ false: Colors.surface2, true: Colors.red }}
            thumbColor="white"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingsItem}>
          <View
            style={[
              styles.settingsIcon,
              { backgroundColor: "rgba(59,130,246,0.15)" },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📍</Text>
          </View>
          <View style={styles.settingsText}>
            <Text style={styles.settingsTitle}>Nearby Incidents</Text>
            <Text style={styles.settingsSub}>Reports within 5km of you</Text>
          </View>
          <Switch
            value={nearbyIncidents}
            onValueChange={setNearbyIncidents}
            trackColor={{ false: Colors.surface2, true: Colors.red }}
            thumbColor="white"
          />
        </View>
      </View>

      {/* Account */}
      <Text style={styles.sectionLabel}>Account</Text>

      <View style={styles.settingsCard}>
        {[
          {
            icon: "👤",
            bg: "rgba(46,204,113,0.15)",
            title: "Edit Profile",
            sub: "Name, phone, parish",
          },
          {
            icon: "📋",
            bg: "rgba(245,200,66,0.15)",
            title: "My Reports",
            sub: "View your submitted reports",
          },
          {
            icon: "🔒",
            bg: "rgba(59,130,246,0.15)",
            title: "Change Password",
            sub: "",
          },
        ].map((item, i, arr) => (
          <View key={i}>
            <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
              <View style={[styles.settingsIcon, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>{item.title}</Text>
                {item.sub ? (
                  <Text style={styles.settingsSub}>{item.sub}</Text>
                ) : null}
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 20 }}>⬅</Text>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy },

  // Profile header
  profileHeader: {
    backgroundColor: Colors.surface,
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  profileName: { fontSize: 20, fontWeight: "700", color: Colors.text },
  profileEmail: { fontSize: 13, color: Colors.muted },

  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface2,
    borderRadius: 14,
    width: "100%",
    marginTop: 8,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", padding: 12 },
  statVal: { fontSize: 20, fontWeight: "800", color: Colors.text },
  statLbl: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: { width: 1, backgroundColor: Colors.border },

  // Sections
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },

  settingsCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },

  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: { flex: 1 },
  settingsTitle: { fontSize: 14, fontWeight: "600", color: Colors.text },
  settingsSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  arrow: { fontSize: 18, color: Colors.muted },

  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 64 },

  // Logout
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "rgba(232,83,74,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,83,74,0.2)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logoutText: { fontSize: 14, fontWeight: "600", color: Colors.red },
});
