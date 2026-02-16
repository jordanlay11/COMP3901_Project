import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import { Colors } from "@/constants/colors";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [locLoading, setLocLoading] = useState(false);

  // Get GPS location as soon as screen loads
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLocLoading(true);
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is needed to submit accurate reports.",
        );
        setLocLoading(false);
        return;
      }

      // Get current GPS coords — high accuracy uses GPS chip instead of WiFi/cell
      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get a human-readable address from the coordinates
      const geocode = await Location.reverseGeocodeAsync({
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
      });

      const place = geocode[0];
      const address = place
        ? `${place.street ?? ""} ${place.city ?? place.district ?? ""}, ${place.region ?? ""}`.trim()
        : `${coords.coords.latitude.toFixed(4)}°N, ${coords.coords.longitude.toFixed(4)}°W`;

      setLocation({
        lat: coords.coords.latitude,
        lng: coords.coords.longitude,
        address: address,
      });
    } catch (err) {
      console.error("Location error:", err);
    } finally {
      setLocLoading(false);
    }
  };

  const pickPhoto = async () => {
    Alert.alert("Add Photo", "Choose a source", [
      {
        text: "Camera",
        onPress: async () => {
          // Ask camera permission then open camera
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission needed", "Camera permission is required.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7, // compress to reduce upload size
          });
          if (!result.canceled) setPhoto(result.assets[0].uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });
          if (!result.canceled) setPhoto(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Compress and encode the photo as a Base64 string.
  // This stores the image directly in Firestore without needing Firebase Storage.
  // We resize to 600px wide and compress to 40% quality to stay under Firestore's 1MB document limit.
  const encodePhoto = async (uri: string): Promise<string> => {
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );
    return compressed.base64!;
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Missing Info", "Please add a description of the incident.");
      return;
    }

    setLoading(true);

    try {
      let photoBase64: string | null = null;

      // Compress and encode photo if one was selected
      if (photo) {
        photoBase64 = await encodePhoto(photo);
      }

      const user = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        type: incidentTypes[selectedType].label,
        severity: selectedSev,
        description: description.trim(),
        status: "pending",
        location: {
          lat: location?.lat ?? 18.0042,
          lng: location?.lng ?? -76.7442,
          address: location?.address ?? "Location unavailable",
        },
        parish: location?.address?.split(",")[1]?.trim() ?? "Unknown",
        reportedBy: user?.uid ?? "anonymous",
        photoBase64: photoBase64, // Base64 string stored directly in Firestore, null if no photo
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset form
      setDescription("");
      setSelectedType(0);
      setSelectedSev("critical");
      setPhoto(null);

      Alert.alert(
        "Report Submitted",
        "Your report has been sent to emergency services.",
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* Location — real GPS */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationRow}>
            <Text style={{ fontSize: 18 }}>📍</Text>
            <View style={styles.locationInfo}>
              {locLoading ? (
                <ActivityIndicator size="small" color={Colors.green} />
              ) : location ? (
                <>
                  <Text style={styles.locationLabel}>
                    GPS Location Detected
                  </Text>
                  <Text style={styles.locationCoords} numberOfLines={1}>
                    {location.address}
                  </Text>
                </>
              ) : (
                <Text style={styles.locationLabel}>Location unavailable</Text>
              )}
            </View>
            {/* Tap to refresh location */}
            <TouchableOpacity onPress={getLocation} disabled={locLoading}>
              <Text style={styles.refreshIcon}>↻</Text>
            </TouchableOpacity>
          </View>

          {/* Photo Upload */}
          <Text style={styles.label}>Photo (Optional)</Text>
          {photo ? (
            // Show preview of selected photo with option to remove
            <View style={styles.photoPreview}>
              <Image source={{ uri: photo }} style={styles.previewImg} />
              <TouchableOpacity
                style={styles.removePhoto}
                onPress={() => setPhoto(null)}
              >
                <Text style={styles.removePhotoText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.photoUpload}
              onPress={pickPhoto}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 28 }}>📷</Text>
              <Text style={styles.photoText}>Tap to add photo</Text>
              <Text style={styles.photoSub}>Camera or Gallery</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitText}>Submit Report</Text>
            )}
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
  photoPreview: { marginBottom: 24, borderRadius: 16, overflow: "hidden" },
  previewImg: { width: "100%", height: 180, borderRadius: 16 },
  removePhoto: {
    backgroundColor: "rgba(232,83,74,0.15)",
    padding: 10,
    alignItems: "center",
    marginTop: 8,
    borderRadius: 10,
  },
  removePhotoText: { color: Colors.red, fontWeight: "600", fontSize: 13 },
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
