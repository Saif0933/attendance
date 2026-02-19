

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Fingerprint, RefreshCw } from "lucide-react-native";
import React, { useCallback, useState } from "react";
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
import * as RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import ReactNativeBiometrics from "react-native-biometrics";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";
import { useCheckIn, useCheckOut } from "../src/employee/hook/useAttendance";
import { useEmployeeAuthStore } from "../src/store/useEmployeeAuthStore";

const { width } = Dimensions.get("window");

const PunchScreen = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return <PunchScreenContent key={refreshKey} onRefresh={handleRefresh} />;
};

const PunchScreenContent = ({ onRefresh }: { onRefresh: () => void }) => {
  const navigation = useNavigation<any>();
  const { employee: hookEmployee } = useEmployeeAuthStore();
  const [punchType, setPunchType] = useState<"IN" | "OUT">("IN");
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // TanStack Query Hooks
  const { mutate: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  // Attempt to get real location on focus or refresh
  useFocusEffect(
    useCallback(() => {
      const checkLocationAndFetch = async () => {
        if (Platform.OS === 'android') {
          try {
            // 1. Check if location services are enabled
            const result = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
              interval: 10000,
            });
            
            if (result !== 'already-enabled' && result !== 'enabled') {
              navigation.navigate('PermissionsScreen');
              return;
            }

            // 2. Request Permissions
            const granted = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);
            
            if (granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED) {
              console.log("Location permission denied");
              return;
            }
          } catch (err: any) {
            console.warn("Location Helper Error:", err);
            navigation.navigate('PermissionsScreen');
            return;
          }
        }
        
        // 3. Get precise position
        // @ts-ignore
        navigator?.geolocation?.getCurrentPosition(
          (pos: any) => {
            console.log("Location Found:", pos.coords.latitude, pos.coords.longitude);
            setCurrentLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (err: any) => {
            console.log("Location Error:", err);
            // @ts-ignore
            navigator?.geolocation?.getCurrentPosition(
              (secondPos: any) => {
                setCurrentLocation({
                  latitude: secondPos.coords.latitude,
                  longitude: secondPos.coords.longitude,
                });
              },
              (secondErr: any) => console.log("Final Location Error:", secondErr),
              { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
            );
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      };

      checkLocationAndFetch();
    }, [onRefresh, navigation])
  );

  const activeColor = punchType === "IN" ? "#10B981" : "#EF4444";
  const isPending = isCheckingIn || isCheckingOut;

  const handlePunch = async () => {
    // Get latest state from store to avoid any closure issues
    const currentEmployee = useEmployeeAuthStore.getState().employee;
    
    if (!currentEmployee) {
      Alert.alert("Error", "User details not found. Please log in again.");
      return;
    }

    // Check if location is available
    if (!currentLocation) {
      Alert.alert(
        "Location Not Found", 
        "We haven't received your precise location yet. Please wait a moment until the GPS coordinates appear at the bottom, or refresh.",
        [{ text: "Try Again", onPress: onRefresh }]
      );
      return;
    }

    const payload = {
      employeeId: currentEmployee.id,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      remarks: punchType === "IN" ? "Reached office on time" : "Leaving for the day",
    };

    if (punchType === "IN") {
      checkIn(payload, {
        onSuccess: (res: any) => {
          Alert.alert("Success", res.message || "Checked-in successfully");
          onRefresh();
        },
        onError: (err: any) => {
          Alert.alert("Unauthorized", err?.response?.data?.message || "Outside Geofence or Check-in failed");
        },
      });
    } else {
      checkOut(payload, {
        onSuccess: (res: any) => {
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>
            Hello, {hookEmployee ? `${hookEmployee.firstname} ${hookEmployee.lastname}` : "Employee"}
          </Text>
          <Text style={styles.subText}>Mark your attendance</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <RefreshCw size={20} color="#1E293B" />
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
          {currentLocation 
            ? `Current Location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
            : "Fetching precise location... Please wait."}
        </Text>
      </View>

      {/* Hidden Location Provider */}
      <View style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          onUserLocationChange={(e) => {
            const coord = e.nativeEvent.coordinate;
            if (coord) {
              setCurrentLocation({
                latitude: coord.latitude,
                longitude: coord.longitude,
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PunchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: { color: "#1E293B", fontSize: 24, fontWeight: "800" },
  subText: { color: "#64748B", fontSize: 14, marginTop: 4, fontWeight: "500" },
  refreshBtn: { padding: 10, backgroundColor: "#fff", borderRadius: 50, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },

  scannerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerCircle: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  visualHint: {
    color: "#1E293B",
    marginTop: 18,
    fontWeight: "800",
    fontSize: 18,
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
  punchLabel: { color: "#64748B", fontWeight: "600", fontSize: 14 },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    padding: 4,
  },
  switchBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  switchText: {
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 13,
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
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 10,
    textAlign: "center",
  },
});