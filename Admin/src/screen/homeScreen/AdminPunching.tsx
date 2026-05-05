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
import { useTheme } from "../../../../src/theme/ThemeContext";

const { width } = Dimensions.get("window");

const AdminPunching = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
};

const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
  const { colors, isDark, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greetingText, { color: colors.text }]}>Hello, Md. Saif</Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>Mark your attendance</Text>
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
            { borderColor: activeColor, borderStyle: "dashed", backgroundColor: colors.surface },
          ]}
        >
          <Fingerprint size={100} color={activeColor} />
          <Text style={[styles.visualHint, { color: colors.text }]}>Touch Sensor</Text>
          <Text style={[styles.subVisualHint, { color: colors.textSecondary }]}>
            Use Fingerprint or Enter PIN
          </Text>
        </View>
      </View>

      {/* Punch Type */}
      <View style={styles.punchTypeContainer}>
        <Text style={[styles.punchLabel, { color: colors.textSecondary }]}>Action Type:</Text>
        <View style={[styles.switchContainer, { backgroundColor: colors.surface }]}>
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
                punchType === "IN" && { color: "#fff", fontFamily: fonts.bold },
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
                punchType === "OUT" && { color: "#fff", fontFamily: fonts.bold },
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

        <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
          Current Shift: 09:00 AM - 06:00 PM
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AdminPunching;

/* ✅ STYLES (THIS FIXES THE ERROR) */
const createStyles = (colors: any, fonts: any) => StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: { fontSize: 22, fontFamily: fonts.bold },
  subText: { fontSize: 14, marginTop: 4, fontFamily: fonts.regular },
  refreshBtn: { padding: 10, borderRadius: 50 },

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
  },
  visualHint: {
    marginTop: 15,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  subVisualHint: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: fonts.regular,
  },

  punchTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  punchLabel: { fontFamily: fonts.medium },
  switchContainer: {
    flexDirection: "row",
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
  },
  footerNote: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
});