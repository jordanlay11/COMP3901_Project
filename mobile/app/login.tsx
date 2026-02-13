import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.emblem}>
            <Text style={styles.emblemText}>🚨</Text>
          </View>
          <Text style={styles.title}>Jamaica Disaster{"\n"}Response</Text>
          <Text style={styles.subtitle}>Stay informed Stay safe</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Phone Number or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 876-XXX-XXXX"
            placeholderTextColor={Colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.muted}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.replace("/(tabs)/home")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Don't have an account? Register</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  hero: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emblem: {
    width: 72,
    height: 72,
    backgroundColor: Colors.red,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  emblemText: { fontSize: 32 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: "center",
    width: 100,
  },
  form: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: Colors.red,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.muted,
    marginTop: 16,
  },
});
