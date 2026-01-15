
// import React, { useState } from "react";
// import {
//   Alert,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ReactNativeBiometrics from "react-native-biometrics";
// import {
//   RefreshCw,
//   Fingerprint,
//   ShieldCheck,
//   Unlock,
//   Smartphone,
// } from "lucide-react-native";

// const { width } = Dimensions.get("window");

// const PunchScreen = () => {
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
// };

// const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
//   // ✅ FIX APPLIED HERE (ONLY CHANGE)
//   const rnBiometrics = new ReactNativeBiometrics({
//     allowDeviceCredentials: true, // 👈 Enables PIN / Pattern
//   });

//   const [authMethod, setAuthMethod] =
//     useState<"SYSTEM_PIN" | "FINGER">("SYSTEM_PIN");
//   const [punchType, setPunchType] = useState<"IN" | "OUT">("IN");

//   const activeColor = punchType === "IN" ? "#10B981" : "#EF4444";

//   const handleDeviceAuth = async () => {
//     try {
//       const { available } = await rnBiometrics.isSensorAvailable();

//       if (!available) {
//         Alert.alert("Error", "Device authentication not available");
//         return;
//       }

//       const promptText =
//         authMethod === "SYSTEM_PIN"
//           ? `Unlock device using PIN / Pattern to Punch ${punchType}`
//           : `Verify Fingerprint to Punch ${punchType}`;

//       const result = await rnBiometrics.simplePrompt({
//         promptMessage: promptText,
//         cancelButtonText: "Cancel",
//       });

//       if (result.success) {
//         Alert.alert(
//           "Punch Success",
//           `Punch ${punchType} recorded successfully`
//         );
//       }
//     } catch (error) {
//       Alert.alert("Authentication Failed", "Authentication cancelled or failed");
//       console.log("Auth Error:", error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.greetingText}>Hello, Md. Saif</Text>
//           <Text style={styles.subText}>Mark your attendance</Text>
//         </View>
//         <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
//           <RefreshCw size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Auth Method Tabs */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             authMethod === "SYSTEM_PIN" && { backgroundColor: "#222" },
//           ]}
//           onPress={() => setAuthMethod("SYSTEM_PIN")}
//         >
//           <ShieldCheck
//             size={20}
//             color={authMethod === "SYSTEM_PIN" ? "#fff" : "#666"}
//           />
//           <Text
//             style={[
//               styles.tabText,
//               authMethod === "SYSTEM_PIN" && styles.activeTabText,
//             ]}
//           >
//             Pattern / PIN
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             authMethod === "FINGER" && { backgroundColor: "#222" },
//           ]}
//           onPress={() => setAuthMethod("FINGER")}
//         >
//           <Fingerprint
//             size={20}
//             color={authMethod === "FINGER" ? "#fff" : "#666"}
//           />
//           <Text
//             style={[
//               styles.tabText,
//               authMethod === "FINGER" && styles.activeTabText,
//             ]}
//           >
//             Fingerprint
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Scanner Visual */}
//       <View style={styles.scannerSection}>
//         {authMethod === "SYSTEM_PIN" ? (
//           <View
//             style={[
//               styles.scannerCircle,
//               { borderColor: activeColor, borderStyle: "solid" },
//             ]}
//           >
//             <Smartphone
//               size={80}
//               color={activeColor}
//               style={{ marginBottom: 10 }}
//             />
//             <View style={styles.lockBadge}>
//               <Unlock size={24} color="#000" />
//             </View>
//             <Text style={styles.visualHint}>System Lock</Text>
//             <Text style={styles.subVisualHint}>
//               Click below to enter PIN / Pattern
//             </Text>
//           </View>
//         ) : (
//           <View
//             style={[
//               styles.scannerCircle,
//               { borderColor: activeColor, borderStyle: "dashed" },
//             ]}
//           >
//             <Fingerprint size={100} color={activeColor} />
//             <Text style={styles.visualHint}>Touch Sensor</Text>
//             <Text style={styles.subVisualHint}>Use Fingerprint Sensor</Text>
//           </View>
//         )}
//       </View>

//       {/* Punch Type */}
//       <View style={styles.punchTypeContainer}>
//         <Text style={styles.punchLabel}>Action Type:</Text>
//         <View style={styles.switchContainer}>
//           <TouchableOpacity
//             style={[
//               styles.switchBtn,
//               punchType === "IN" && { backgroundColor: "#10B981" },
//             ]}
//             onPress={() => setPunchType("IN")}
//           >
//             <Text
//               style={[
//                 styles.switchText,
//                 punchType === "IN" && { color: "#fff", fontWeight: "bold" },
//               ]}
//             >
//               IN
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.switchBtn,
//               punchType === "OUT" && { backgroundColor: "#EF4444" },
//             ]}
//             onPress={() => setPunchType("OUT")}
//           >
//             <Text
//               style={[
//                 styles.switchText,
//                 punchType === "OUT" && { color: "#fff", fontWeight: "bold" },
//               ]}
//             >
//               OUT
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Action Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.actionButton, { backgroundColor: activeColor }]}
//           onPress={handleDeviceAuth}
//           activeOpacity={0.8}
//         >
//           <View style={styles.btnContent}>
//             {authMethod === "SYSTEM_PIN" ? (
//               <ShieldCheck size={24} color="#fff" />
//             ) : (
//               <Fingerprint size={24} color="#fff" />
//             )}
//             <Text style={styles.actionBtnText}>
//               {authMethod === "SYSTEM_PIN"
//                 ? "OPEN SYSTEM LOCK"
//                 : "VERIFY IDENTITY"}
//             </Text>
//           </View>
//         </TouchableOpacity>

//         <Text style={styles.footerNote}>
//           Current Shift: 09:00 AM - 06:00 PM
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PunchScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },

//   header: {
//     padding: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   greetingText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
//   subText: { color: "#aaa", fontSize: 14, marginTop: 4 },
//   refreshBtn: { padding: 10, backgroundColor: "#222", borderRadius: 50 },

//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#111",
//     marginHorizontal: 20,
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 20,
//   },
//   tabButton: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
//   },
//   tabText: { color: "#666", fontWeight: "600" },
//   activeTabText: { color: "#fff" },

//   scannerSection: { flex: 1, justifyContent: "center", alignItems: "center" },
//   scannerCircle: {
//     width: width * 0.7,
//     height: width * 0.7,
//     borderRadius: (width * 0.7) / 2,
//     borderWidth: 2,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#0a0a0a",
//   },
//   lockBadge: {
//     position: "absolute",
//     backgroundColor: "#fff",
//     padding: 8,
//     borderRadius: 50,
//     bottom: 60,
//     right: 50,
//   },
//   visualHint: {
//     color: "#fff",
//     marginTop: 15,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   subVisualHint: { color: "#666", fontSize: 12, marginTop: 4 },

//   punchTypeContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     gap: 15,
//   },
//   punchLabel: { color: "#888" },
//   switchContainer: {
//     flexDirection: "row",
//     backgroundColor: "#222",
//     borderRadius: 20,
//     padding: 2,
//   },
//   switchBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 20,
//     borderRadius: 18,
//   },
//   switchText: { color: "#666", fontWeight: "600" },

//   footer: { padding: 20, alignItems: "center" },
//   actionButton: {
//     width: "100%",
//     paddingVertical: 18,
//     borderRadius: 16,
//     marginBottom: 15,
//     alignItems: "center",
//   },
//   btnContent: { flexDirection: "row", gap: 10 },
//   actionBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
//   footerNote: { color: "#555", fontSize: 12 },
// });



import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactNativeBiometrics from "react-native-biometrics";
import { RefreshCw, Fingerprint } from "lucide-react-native";

const { width } = Dimensions.get("window");

const PunchScreen = () => {
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
          <RefreshCw size={20} color="#fff" />
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

export default PunchScreen;

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
