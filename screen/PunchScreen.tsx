// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   LayoutAnimation,
//   UIManager,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// // CHANGED: Using Ionicons for a cleaner, more "iOS-style" premium look
// import Icon from 'react-native-vector-icons/Ionicons'; 

// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const { width } = Dimensions.get('window');

// const LoginScreen = () => {
//   const navigation = useNavigation<any>();

//   // State Management
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  
//   // UI States for Focus Animation
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);

//   // Mock: Handle Sending OTP
//   const handleSendOtp = () => {
//     if (phoneNumber.length < 10) {
//       Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
//       return;
//     }
//     // Animate the layout change
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setIsOtpSent(true);
//   };

//   // Mock: Handle Verifying OTP & Navigation
//   const handleVerifyOtp = () => {
//     if (otp.length !== 4) {
//       Alert.alert('Invalid OTP', 'Please enter the 4-digit code.');
//       return;
//     }
//     if (role === 'ADMIN') {
//       navigation.replace('Admin');
//     } else {
//       navigation.replace('Employee');
//     }
//   };

//   const handleEditNumber = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setIsOtpSent(false);
//     setOtp('');
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
//       {/* Decorative Background Shapes */}
//       <View style={styles.bgHeader} />
//       <View style={styles.bgCircle} />

//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView 
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.keyboardView}
//         >
          
//           {/* Header Section */}
//           <View style={styles.headerContainer}>
//             <View style={styles.logoPlaceholder}>
//                 {/* CHANGED: Modern abstract icon */}
//                 <Icon name="layers-outline" size={40} color="#FFF" />
//             </View>
//             <Text style={styles.welcomeText}>Welcome Back</Text>
//             <Text style={styles.subText}>Sign in to manage your workspace</Text>
//           </View>

//           {/* Main Card */}
//           <View style={styles.card}>
            
//             {/* Role Selector */}
//             <View style={styles.roleSelectorContainer}>
//               {['EMPLOYEE', 'ADMIN'].map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   style={[styles.roleButton, role === item && styles.activeRoleButton]}
//                   onPress={() => {
//                     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//                     setRole(item as any);
//                   }}
//                   activeOpacity={0.9}
//                 >
//                   {/* CHANGED: Dynamic Outline/Filled icons based on selection */}
//                   <Icon 
//                     name={
//                         item === 'EMPLOYEE' 
//                         ? (role === 'EMPLOYEE' ? "person" : "person-outline")
//                         : (role === 'ADMIN' ? "shield-checkmark" : "shield-checkmark-outline")
//                     } 
//                     size={20} 
//                     color={role === item ? '#2563EB' : '#9CA3AF'} 
//                   />
//                   <Text style={[styles.roleText, role === item && styles.activeRoleText]}>
//                     {item === 'EMPLOYEE' ? 'Employee' : 'Administrator'}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* Form Content */}
//             {!isOtpSent ? (
//               // STATE 1: PHONE INPUT
//               <View>
//                 <Text style={styles.label}>Mobile Number</Text>
//                 <View style={[
//                   styles.inputContainer, 
//                   focusedInput === 'phone' && styles.inputFocused
//                 ]}>
//                   {/* CHANGED: Phone Icon */}
//                   <Icon name="call-outline" size={20} color={focusedInput === 'phone' ? "#2563EB" : "#9CA3AF"} style={styles.inputIcon} />
//                   <TextInput
//                     placeholder="Enter 10 digit number"
//                     value={phoneNumber}
//                     onChangeText={setPhoneNumber}
//                     onFocus={() => setFocusedInput('phone')}
//                     onBlur={() => setFocusedInput(null)}
//                     style={styles.input}
//                     keyboardType="phone-pad"
//                     maxLength={10}
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>

//                 <TouchableOpacity 
//                   style={styles.primaryButton} 
//                   onPress={handleSendOtp}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.primaryButtonText}>Get OTP</Text>
//                   {/* CHANGED: Arrow Icon */}
//                   <Icon name="arrow-forward" size={20} color="#FFF" />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               // STATE 2: OTP INPUT
//               <View>
//                  <View style={styles.otpHeader}>
//                     <Text style={styles.label}>Enter Verification Code</Text>
//                  </View>
                 
//                 <Text style={styles.sentToText}>
//                     We sent a code to <Text style={{fontWeight: '700', color: '#1F2937'}}>+91 {phoneNumber}</Text>
//                 </Text>

//                 <View style={[
//                   styles.inputContainer,
//                   focusedInput === 'otp' && styles.inputFocused
//                 ]}>
//                   {/* CHANGED: Keypad Icon */}
//                   <Icon name="keypad-outline" size={20} color={focusedInput === 'otp' ? "#2563EB" : "#9CA3AF"} style={styles.inputIcon} />
//                   <TextInput
//                     placeholder="• • • •"
//                     value={otp}
//                     onChangeText={setOtp}
//                     onFocus={() => setFocusedInput('otp')}
//                     onBlur={() => setFocusedInput(null)}
//                     style={[styles.input, styles.otpInput]}
//                     keyboardType="number-pad"
//                     maxLength={4}
//                     autoFocus
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>

//                 <TouchableOpacity 
//                   style={styles.primaryButton} 
//                   onPress={handleVerifyOtp}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.primaryButtonText}>Verify & Login</Text>
//                 </TouchableOpacity>
                
//                 <View style={styles.footerActions}>
//                     <TouchableOpacity onPress={handleEditNumber}>
//                         <Text style={styles.linkText}>Change Number</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                          <Text style={styles.linkText}>Resend Code</Text>
//                     </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Simple Footer */}
//           <Text style={styles.footerText}>
//             Protected by reCAPTCHA and subject to the Privacy Policy.
//           </Text>

//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   /* Background Decor */
//   bgHeader: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 250,
//     backgroundColor: '#2563EB',
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//   },
//   bgCircle: {
//     position: 'absolute',
//     top: -50,
//     right: -50,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: '#FFFFFF',
//     opacity: 0.1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   keyboardView: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//   },
  
//   /* Header */
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   logoPlaceholder: {
//     width: 80,
//     height: 80,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   welcomeText: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#FFFFFF',
//     marginBottom: 8,
//     letterSpacing: 0.5,
//   },
//   subText: {
//     fontSize: 16,
//     color: '#DBEAFE',
//     textAlign: 'center',
//   },

//   /* Card */
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 32,
//     shadowColor: '#64748B',
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 10,
//   },

//   /* Role Selector */
//   roleSelectorContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#F1F5F9',
//     borderRadius: 16,
//     padding: 4,
//     marginBottom: 28,
//   },
//   roleButton: {
//     flex: 1,
//     flexDirection: 'row',
//     paddingVertical: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     gap: 8,
//   },
//   activeRoleButton: {
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   roleText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#64748B',
//   },
//   activeRoleText: {
//     color: '#2563EB',
//   },

//   /* Inputs */
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#334155',
//     marginBottom: 8,
//     marginLeft: 4,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#E2E8F0',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     marginBottom: 24,
//     backgroundColor: '#F8FAFC',
//     height: 58,
//   },
//   inputFocused: {
//     borderColor: '#2563EB',
//     backgroundColor: '#FFFFFF',
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1E293B',
//     fontWeight: '500',
//   },
//   otpInput: {
//     fontSize: 22,
//     letterSpacing: 6,
//     fontWeight: '700',
//   },

//   /* Buttons */
//   primaryButton: {
//     backgroundColor: '#2563EB',
//     borderRadius: 16,
//     height: 56,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8,
//     shadowColor: '#2563EB',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   primaryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   /* OTP & Footer Specific */
//   otpHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   sentToText: {
//     fontSize: 14,
//     color: '#64748B',
//     marginBottom: 20,
//     marginLeft: 4,
//   },
//   footerActions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       marginTop: 20,
//       paddingHorizontal: 8
//   },
//   linkText: {
//     color: '#2563EB',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   footerText: {
//     textAlign: 'center',
//     marginTop: 40,
//     color: '#94A3B8',
//     fontSize: 12,
//   },
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