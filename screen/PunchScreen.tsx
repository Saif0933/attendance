// import React, { useRef, useState, useEffect } from "react";
// import {
//   Alert,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
//   SafeAreaView,
// } from "react-native";
// import {
//   Camera,
//   useCameraDevices,
//   useCameraPermission,
// } from "react-native-vision-camera";
// import { useIsFocused } from "@react-navigation/native";

// const { width } = Dimensions.get("window");

// const PunchScreen = () => {
//   // State for "Refresh" functionality
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleRefresh = () => {
//     // Incrementing key forces React to re-mount the component to simulate a reload
//     setRefreshKey((prev) => prev + 1);
//   };

//   return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
// };

// const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
//   const { hasPermission, requestPermission } = useCameraPermission();
//   const [isReady, setIsReady] = useState(false);
//   const camera = useRef<Camera>(null);
//   const devices = useCameraDevices();
//   const device = devices.find((d) => d.position === "front");
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     async function getPermission() {
//       const granted = await requestPermission();
//       setIsReady(granted);
//       if (!granted) {
//         Alert.alert(
//           "Permission Required",
//           "Camera permission is needed to mark attendance"
//         );
//       }
//     }

//     if (!hasPermission) {
//       getPermission();
//     } else {
//       setIsReady(true);
//     }
//   }, [hasPermission, requestPermission]);

//   const handlePunchIn = async () => {
//     if (camera.current) {
//       try {
//         const photo = await camera.current.takePhoto({
//           flash: "off",
//         });
//         Alert.alert("Attendance Marked", "Punch IN recorded successfully!");
//         console.log("Photo path:", photo.path);
//       } catch (error) {
//         Alert.alert("Error", "Failed to capture photo");
//       }
//     }
//   };

//   if (!isReady || !device) {
//     return (
//       <View style={styles.permissionContainer}>
//         <StatusBar barStyle="light-content" backgroundColor="#000" />
//         <Text style={styles.permissionText}>Initializing camera...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       {/* --- Top Header --- */}
//       <View style={styles.headerBar}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.logoText}>h.</Text>
//           <Text style={styles.appNameText}> Appna Rutine</Text>
//         </View>
//         <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//           {/* Refresh Symbol */}
//           <Text style={styles.iconText}>↻</Text>
//         </TouchableOpacity>
//       </View>

//       {/* --- Shift Info Banner --- */}
//       <View style={styles.shiftBanner}>
//         <Text style={styles.shiftTitle}>Ready to mark your attendance OUT</Text>
//         <Text style={styles.shiftSubtitle}>
//           Current Shift:- Day Shift (9:00 AM - 5:00 PM)
//         </Text>
//       </View>

//       {/* --- Main Content Area (Camera Circle) --- */}
//       <View style={styles.mainContent}>
//         <View style={styles.cameraOuterCircle}>
//           {/* Dashed Border Container */}
//           <View style={styles.dashedBorder}>
//             {/* The Actual Camera Mask */}
//             <View style={styles.cameraInnerCircle}>
//               <Camera
//                 ref={camera}
//                 style={styles.camera}
//                 device={device}
//                 isActive={isFocused}
//                 photo={true}
//               />
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* --- Action Buttons (Red/Green) --- */}
//       <View style={styles.actionButtonsContainer}>
//         {/* Red Button (Punch) */}
//         <TouchableOpacity style={styles.redButton} onPress={handlePunchIn}>
//           {/* Curved Arrow Symbol */}
//           <Text style={[styles.iconText, { fontSize: 16, marginBottom: 5, fontWeight: 500 }]}>
//             Punch In
//           </Text>
//         </TouchableOpacity>

//         {/* Green Button (Odometer) */}
//         <TouchableOpacity style={styles.greenButton}>
//           <Text style={styles.greenButtonText}>Odometer IN</Text>
//         </TouchableOpacity>
//       </View>

//     </SafeAreaView>
//   );
// };

// // Helper Component for Bottom Nav Items
// const NavPacket = ({ symbol, label, active, badge }: any) => (
//   <View style={styles.navItem}>
//     <View style={styles.iconContainer}>
//       <Text
//         style={[
//           styles.navSymbol,
//           { color: active ? "#4A90E2" : "#666" }, // Blue if active, grey if not
//         ]}
//       >
//         {symbol}
//       </Text>
//       {badge && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{badge}</Text>
//         </View>
//       )}
//     </View>
//     <Text style={[styles.navText, active && styles.navTextActive]}>
//       {label}
//     </Text>
//   </View>
// );

// export default PunchScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   permissionText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   // Header
//   headerBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     backgroundColor: "#000",
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logoText: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   appNameText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "500",
//     marginLeft: 5,
//   },
//   refreshButton: {
//     padding: 5,
//   },
//   iconText: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   // Shift Banner
//   shiftBanner: {
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     paddingVertical: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   shiftTitle: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   shiftSubtitle: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "400",
//   },
//   // Camera Section
//   mainContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraOuterCircle: {
//     width: width * 0.90,
//     height: width * 0.90,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dashedBorder: {
//     width: "100%",
//     height: "100%",
//     borderWidth: 2,
//     borderColor: "#666",
//     borderStyle: "dashed",
//     borderRadius: width * 0.90,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraInnerCircle: {
//     width: "90%",
//     height: "90%",
//     borderRadius: (width * 0.90 * 0.90) / 2,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "#4c529fff",
//   },
//   camera: {
//     width: "100%",
//     height: "100%",
//   },
//   // Action Buttons
//   actionButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   redButton: {
//     backgroundColor: "#FF4444",
//     width: "48%",
//     height: 55,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   greenButton: {
//     backgroundColor: "#4CAF50",
//     width: "48%",
//     height: 55,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   greenButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   // Bottom Nav
//   bottomNav: {
//     flexDirection: "row",
//     backgroundColor: "#F2F2F2",
//     paddingVertical: 10,
//     paddingBottom: 20,
//     justifyContent: "space-around",
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   navItem: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconContainer: {
//     marginBottom: 4,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navSymbol: {
//     fontSize: 22,
//   },
//   navText: {
//     fontSize: 10,
//     color: "#666",
//     marginTop: 2,
//   },
//   navTextActive: {
//     color: "#4A90E2",
//     fontWeight: "bold",
//   },
//   badge: {
//     position: "absolute",
//     top: -5,
//     right: -12,
//     backgroundColor: "#333",
//     borderRadius: 4,
//     paddingHorizontal: 3,
//     paddingVertical: 1,
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 8,
//     fontWeight: "bold",
//   },
// });


import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
} from "react-native-vision-camera";
import { useIsFocused } from "@react-navigation/native";
import ReactNativeBiometrics from "react-native-biometrics";

const { width } = Dimensions.get("window");

const PunchScreen = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
};

const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isReady, setIsReady] = useState(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "front");
  const isFocused = useIsFocused();

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    async function getPermission() {
      const granted = await requestPermission();
      setIsReady(granted);
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is needed to mark attendance"
        );
      }
    }

    if (!hasPermission) {
      getPermission();
    } else {
      setIsReady(true);
    }
  }, [hasPermission, requestPermission]);

  // 🔴 FACE PUNCH (EXISTING)
  const handlePunchIn = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          flash: "off",
        });
        Alert.alert("Attendance Marked", "Punch IN recorded successfully!");
        console.log("Photo path:", photo.path);
      } catch (error) {
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  // 🟢 FINGERPRINT / BIOMETRIC PUNCH (NEW)
  const handleFingerprintPunch = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert("Unavailable", "Fingerprint not available on this device");
        return;
      }

      const result = await rnBiometrics.simplePrompt({
        promptMessage: "Verify fingerprint to mark attendance",
      });

      if (result.success) {
        Alert.alert(
          "Attendance Marked",
          "Punch IN / OUT recorded using fingerprint!"
        );
        console.log("Fingerprint verified");
      } else {
        Alert.alert("Cancelled", "Fingerprint authentication cancelled");
      }
    } catch (error) {
      Alert.alert("Error", "Fingerprint authentication failed");
      console.log(error);
    }
  };

  if (!isReady || !device) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={styles.permissionText}>Initializing camera...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoText}>h.</Text>
          <Text style={styles.appNameText}> Appna Rutine</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.iconText}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Shift Info */}
      <View style={styles.shiftBanner}>
        <Text style={styles.shiftTitle}>Ready to mark your attendance OUT</Text>
        <Text style={styles.shiftSubtitle}>
          Current Shift:- Day Shift (9:00 AM - 5:00 PM)
        </Text>
      </View>

      {/* Camera */}
      <View style={styles.mainContent}>
        <View style={styles.cameraOuterCircle}>
          <View style={styles.dashedBorder}>
            <View style={styles.cameraInnerCircle}>
              <Camera
                ref={camera}
                style={styles.camera}
                device={device}
                isActive={isFocused}
                photo={true}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.redButton} onPress={handlePunchIn}>
          <Text
            style={[
              styles.iconText,
              { fontSize: 16, marginBottom: 5, fontWeight: "500" },
            ]}
          >
            Punch In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.greenButton}
          onPress={handleFingerprintPunch}
        >
          <Text style={styles.greenButtonText}>Odometer IN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PunchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  permissionText: { color: "#fff", fontSize: 16 },

  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  appNameText: { color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: 5 },
  refreshButton: { padding: 5 },
  iconText: { color: "#fff", fontSize: 24, fontWeight: "bold" },

  shiftBanner: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  shiftTitle: { color: "#fff", fontSize: 14, fontWeight: "500" },
  shiftSubtitle: { color: "#fff", fontSize: 12 },

  mainContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  cameraOuterCircle: {
    width: width * 0.9,
    height: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  dashedBorder: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraInnerCircle: {
    width: "90%",
    height: "90%",
    borderRadius: (width * 0.9 * 0.9) / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#4c529f",
  },
  camera: { width: "100%", height: "100%" },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  redButton: {
    backgroundColor: "#FF4444",
    width: "48%",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  greenButton: {
    backgroundColor: "#4CAF50",
    width: "48%",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  greenButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
