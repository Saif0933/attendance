

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fingerprint, RefreshCw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCheckIn, useCheckOut } from "../src/employee/hook/useAttendance";

const { width } = Dimensions.get("window");

const PunchScreen = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
};

const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
  const [employee, setEmployee] = useState<{ id: string; firstname: string; lastname: string } | null>(null);
  const [punchType, setPunchType] = useState<"IN" | "OUT">("IN");
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 28.6139,
    longitude: 77.2090,
  });

  // TanStack Query Hooks
  const { mutate: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("employeeData");
        if (storedData) {
          setEmployee(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading employee data:", error);
      }
    };
    loadEmployeeData();
  }, []);

  // Attempt to get real location on mount or refresh
  useEffect(() => {
    const getRealLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
          }
        } catch (err) {
          console.warn(err);
        }
      }
      
      // @ts-ignore
      navigator?.geolocation?.getCurrentPosition(
        (pos: any) => {
          setCurrentLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err: any) => console.log("Location Error:", err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    getRealLocation();
  }, [onRefresh]);

  const activeColor = punchType === "IN" ? "#10B981" : "#EF4444";
  const isPending = isCheckingIn || isCheckingOut;

  const handlePunch = async () => {
    if (!employee) {
      Alert.alert("Error", "User details not found. Please log in again.");
      return;
    }

    const payload = {
      employeeId: employee.id,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      remarks: punchType === "IN" ? "Reached office on time" : "Leaving for the day",
    };

    if (punchType === "IN") {
      checkIn(payload, {
        onSuccess: (res) => {
          Alert.alert("Success", res.message || "Checked-in successfully");
          onRefresh();
        },
        onError: (err: any) => {
          Alert.alert("Unauthorized", err?.response?.data?.message || "Outside Geofence or Check-in failed");
        },
      });
    } else {
      checkOut(payload, {
        onSuccess: (res) => {
          Alert.alert("Success", res.message || "Checked-out successfully");
          onRefresh();
        },
        onError: (err: any) => {
          Alert.alert("Unauthorized", err?.response?.data?.message || "Outside Geofence or Check-out failed");
        },
      });
    }
  };

  const handleDeviceAuth = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert(
          "Biometrics Not Found",
          "Fingerprint sensor is not available. For testing, would you like to skip biometric verification?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Skip & Punch", onPress: () => handlePunch() }
          ]
        );
        return;
      }

      const result = await rnBiometrics.simplePrompt({
        promptMessage: `Authorize ${punchType === "IN" ? "Check-In" : "Check-Out"}`,
      });

      if (result.success) {
        handlePunch();
      } else {
        Alert.alert("Verification Failed", "Biometric verification is required to proceed.");
      }
    } catch (error) {
      Alert.alert("Auth Error", "Could not verify identity. Please try again.");
      console.log("Auth Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>
            Hello, {employee ? `${employee.firstname} ${employee.lastname}` : "Employee"}
          </Text>
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
          style={[styles.actionButton, { backgroundColor: activeColor }, isPending && { opacity: 0.7 }]}
          onPress={handleDeviceAuth}
          activeOpacity={0.8}
          disabled={isPending}
        >
          <View style={styles.btnContent}>
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Fingerprint size={24} color="#fff" />
                <Text style={styles.actionBtnText}>
                  {punchType === "IN" ? "PUNCH IN" : "PUNCH OUT"}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PunchScreen;

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
    alignItems: "center",
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