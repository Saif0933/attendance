import { Fingerprint } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const AdminPunching = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
};

const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
  // Fingerprint + PIN/Password enabled
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const [punchType, setPunchType] = useState<"IN" | "OUT">("IN");

  const activeColor = punchType === "IN" ? "#10B981" : "#EF4444";

  const handleDeviceAuth = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert("Error", "Device authentication not available");
        return;
      }

      const result = await rnBiometrics.simplePrompt({
        promptMessage: `Verify Fingerprint or Enter PIN to Punch ${punchType}`,
      });

      if (result.success) {
        Alert.alert(
          "Punch Success",
          `Punch ${punchType} recorded successfully`
        );
      }
    } catch (error) {
      Alert.alert("Authentication Failed", "Authentication failed");
      console.log("Auth Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hello, Md. Saif</Text>
          <Text style={styles.subText}>Mark your attendance</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          {/* <RefreshCw size={20} color="#fff" /> */}
        </TouchableOpacity>
      </View>

      {/* Fingerprint Visual */}
      <View style={styles.scannerSection}>
        <View
          style={[
            styles.scannerCircle,
            { borderColor: activeColor, borderStyle: "dashed" },
          ]}
        >
          <Fingerprint size={100} color={activeColor} />
          <Text style={styles.visualHint}>Touch Sensor</Text>
          <Text style={styles.subVisualHint}>
            Use Fingerprint or Enter PIN
          </Text>
        </View>
      </View>

      {/* Punch Type */}
      <View style={styles.punchTypeContainer}>
        <Text style={styles.punchLabel}>Action Type:</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchBtn,
              punchType === "IN" && { backgroundColor: "#10B981" },
            ]}
            onPress={() => setPunchType("IN")}
          >
            <Text
              style={[
                styles.switchText,
                punchType === "IN" && { color: "#fff", fontWeight: "bold" },
              ]}
            >
              IN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchBtn,
              punchType === "OUT" && { backgroundColor: "#EF4444" },
            ]}
            onPress={() => setPunchType("OUT")}
          >
            <Text
              style={[
                styles.switchText,
                punchType === "OUT" && { color: "#fff", fontWeight: "bold" },
              ]}
            >
              OUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: activeColor }]}
          onPress={handleDeviceAuth}
          activeOpacity={0.8}
        >
          <View style={styles.btnContent}>
            <Fingerprint size={24} color="#fff" />
            <Text style={styles.actionBtnText}>VERIFY IDENTITY</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Current Shift: 09:00 AM - 06:00 PM
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AdminPunching;

/* ✅ STYLES (THIS FIXES THE ERROR) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subText: { color: "#aaa", fontSize: 14, marginTop: 4 },
  refreshBtn: { padding: 10, backgroundColor: "#222", borderRadius: 50 },

  scannerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  visualHint: {
    color: "#fff",
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 16,
  },
  subVisualHint: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },

  punchTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  punchLabel: { color: "#888" },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 2,
  },
  switchBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  switchText: {
    color: "#666",
    fontWeight: "600",
  },

  footer: {
    padding: 20,
    alignItems: "center",
  },
  actionButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerNote: {
    color: "#555",
    fontSize: 12,
  },
});