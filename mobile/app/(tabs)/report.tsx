import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/colors";

const incidentTypes = [
  { icon: "🌊", label: "Flooding" },
  { icon: "⛰️", label: "Landslide" },
  { icon: "🔥", label: "Fire" },
  { icon: "🏠", label: "Damage" },
  { icon: "⚡", label: "Hazard" },
  { icon: "🚧", label: "Road Block" },
];

const severities = [
  { label: "Critical", key: "critical", color: Colors.red },
  { label: "High", key: "high", color: Colors.orange },
  { label: "Medium", key: "medium", color: Colors.yellow },
  { label: "Low", key: "low", color: Colors.green },
];

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState(0);
  const [selectedSev, setSelectedSev] = useState("critical");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    Alert.alert(
      "Report Submitted",
      "Your report has been sent to emergency services.",
      [{ text: "OK" }],
    );
    setDescription("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Submit Report</Text>
          <Text style={styles.headerSub}>Report an incident in your area</Text>
        </View>

        <View style={styles.form}>
          {/* Incident Type */}
          <Text style={styles.label}>Incident Type</Text>
          <View style={styles.typeGrid}>
            {incidentTypes.map((type, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.typeBtn,
                  selectedType === i && styles.typeBtnSelected,
                ]}
                onPress={() => setSelectedType(i)}
                activeOpacity={0.7}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === i && styles.typeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Severity */}
          <Text style={styles.label}>Severity</Text>
          <View style={styles.sevRow}>
            {severities.map((sev) => (
              <TouchableOpacity
                key={sev.key}
                style={[
                  styles.sevBtn,
                  selectedSev === sev.key && {
                    backgroundColor: sev.color + "25",
                    borderColor: sev.color + "80",
                  },
                ]}
                onPress={() => setSelectedSev(sev.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sevText,
                    selectedSev === sev.key && { color: sev.color },
                  ]}
                >
                  {sev.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Describe what you see — people affected, road conditions, water level..."
            placeholderTextColor={Colors.muted}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationRow}>
            <Text style={{ fontSize: 18 }}>📍</Text>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>GPS Location Detected</Text>
              <Text style={styles.locationCoords}>18.0042°N, 76.7442°W</Text>
            </View>
            <Text style={styles.refreshIcon}>↻</Text>
          </View>

          {/* Photo */}
          <Text style={styles.label}>Photo (Optional)</Text>
          <TouchableOpacity style={styles.photoUpload} activeOpacity={0.7}>
            <Text style={{ fontSize: 28 }}>📷</Text>
            <Text style={styles.photoText}>Tap to add photo</Text>
            <Text style={styles.photoSub}>Camera or Gallery</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy },

  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  headerSub: { fontSize: 12, color: Colors.muted, marginTop: 2 },

  form: { padding: 20 },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },

  // Type Grid
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  typeBtn: {
    width: "31%",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  typeBtnSelected: {
    borderColor: Colors.red,
    backgroundColor: "rgba(232,83,74,0.1)",
  },
  typeIcon: { fontSize: 22 },
  typeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.muted,
    textAlign: "center",
  },
  typeLabelSelected: { color: Colors.red },

  // Severity
  sevRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  sevBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  sevText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Textarea
  textarea: {
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    height: 100,
    marginBottom: 20,
  },

  // Location
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 11, color: Colors.muted, fontWeight: "600" },
  locationCoords: { fontSize: 12, color: Colors.green, marginTop: 2 },
  refreshIcon: { fontSize: 18, color: Colors.muted },

  // Photo
  photoUpload: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  photoText: { fontSize: 13, color: Colors.muted, fontWeight: "500" },
  photoSub: { fontSize: 11, color: "#3a4a5a" },

  // Submit
  submitBtn: {
    backgroundColor: Colors.red,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: { color: "white", fontSize: 16, fontWeight: "700" },
});
