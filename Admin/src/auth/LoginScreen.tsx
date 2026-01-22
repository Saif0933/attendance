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
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to link vector icons

// const LoginScreen = () => {
//   const navigation = useNavigation<any>();

//   // State Management
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');

//   // Mock: Handle Sending OTP
//   const handleSendOtp = () => {
//     if (phoneNumber.length < 10) {
//       Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
//       return;
//     }
//     // TODO: Integrate your Backend API or Firebase Auth here
//     setIsOtpSent(true);
//     Alert.alert('OTP Sent', 'A verification code has been sent to your phone.');
//   };

//   // Mock: Handle Verifying OTP & Navigation
//   const handleVerifyOtp = () => {
//     if (otp.length !== 4) {
//       Alert.alert('Invalid OTP', 'Please enter the 4-digit code.');
//       return;
//     }

//     // TODO: Verify OTP with Backend
//     // On success:
//     if (role === 'ADMIN') {
//       navigation.replace('Admin');
//     } else {
//       navigation.replace('Employee');
//     }
//   };

//   const handleEditNumber = () => {
//     setIsOtpSent(false);
//     setOtp('');
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <View style={styles.headerContainer}>
//           <Text style={styles.welcomeText}>Welcome Back!</Text>
//           <Text style={styles.subText}>Login to manage your attendance</Text>
//         </View>

//         {/* Role Selector */}
//         <View style={styles.roleSelectorContainer}>
//           <TouchableOpacity
//             style={[styles.roleButton, role === 'EMPLOYEE' && styles.activeRoleButton]}
//             onPress={() => setRole('EMPLOYEE')}
//             activeOpacity={0.8}
//           >
//             <Icon 
//               name="account" 
//               size={20} 
//               color={role === 'EMPLOYEE' ? '#FFF' : '#6B7280'} 
//             />
//             <Text style={[styles.roleText, role === 'EMPLOYEE' && styles.activeRoleText]}>
//               Employee
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.roleButton, role === 'ADMIN' && styles.activeRoleButton]}
//             onPress={() => setRole('ADMIN')}
//             activeOpacity={0.8}
//           >
//             <Icon 
//               name="shield-account" 
//               size={20} 
//               color={role === 'ADMIN' ? '#FFF' : '#6B7280'} 
//             />
//             <Text style={[styles.roleText, role === 'ADMIN' && styles.activeRoleText]}>
//               Admin
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Form Card */}
//         <View style={styles.card}>
//           {!isOtpSent ? (
//             // STATE 1: PHONE INPUT
//             <>
//               <Text style={styles.label}>Mobile Number</Text>
//               <View style={styles.inputContainer}>
//                 <Icon name="phone" size={20} color="#9CA3AF" style={styles.inputIcon} />
//                 <TextInput
//                   placeholder="Enter 10 digit number"
//                   value={phoneNumber}
//                   onChangeText={setPhoneNumber}
//                   style={styles.input}
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                   placeholderTextColor="#9CA3AF"
//                 />
//               </View>

//               <TouchableOpacity 
//                 style={styles.actionButton} 
//                 onPress={handleSendOtp}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.actionButtonText}>Get OTP</Text>
//                 <Icon name="arrow-right" size={20} color="#FFF" />
//               </TouchableOpacity>
//             </>
//           ) : (
//             // STATE 2: OTP INPUT
//             <>
//                <View style={styles.otpHeader}>
//                   <Text style={styles.label}>Enter OTP</Text>
//                   <TouchableOpacity onPress={handleEditNumber}>
//                     <Text style={styles.changeNumberText}>Change Number</Text>
//                   </TouchableOpacity>
//                </View>
              
//               <Text style={styles.sentToText}>Sent to +91 {phoneNumber}</Text>

//               <View style={styles.inputContainer}>
//                 <Icon name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
//                 <TextInput
//                   placeholder="X X X X"
//                   value={otp}
//                   onChangeText={setOtp}
//                   style={[styles.input, { letterSpacing: 8, fontSize: 18 }]} // Letter spacing for OTP look
//                   keyboardType="number-pad"
//                   maxLength={4}
//                   autoFocus
//                   placeholderTextColor="#9CA3AF"
//                 />
//               </View>

//               <TouchableOpacity 
//                 style={styles.actionButton} 
//                 onPress={handleVerifyOtp}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.actionButtonText}>Verify & Login</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity style={styles.resendContainer}>
//                  <Text style={styles.resendText}>Didn't receive code? </Text>
//                  <Text style={styles.resendLink}>Resend</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         <Text style={styles.footerText}>
//           By logging in, you agree to our Terms & Privacy Policy
//         </Text>

//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F3F4F6', // Light gray background
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   headerContainer: {
//     marginBottom: 32,
//     alignItems: 'center',
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   subText: {
//     fontSize: 16,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   /* Role Selector Styles */
//   roleSelectorContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 24,
//   },
//   roleButton: {
//     flex: 1,
//     flexDirection: 'row',
//     paddingVertical: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     gap: 8, // Space between icon and text
//   },
//   activeRoleButton: {
//     backgroundColor: '#2563EB', // Main Blue
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   roleText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   activeRoleText: {
//     color: '#FFFFFF',
//   },
//   /* Card & Input Styles */
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 24,
//     elevation: 4, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 20,
//     backgroundColor: '#F9FAFB',
//     height: 56,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     fontWeight: '500',
//   },
//   /* Action Buttons */
//   actionButton: {
//     backgroundColor: '#2563EB',
//     borderRadius: 12,
//     height: 56,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8,
//     elevation: 2,
//   },
//   actionButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   /* OTP Specific Styles */
//   otpHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   changeNumberText: {
//     fontSize: 13,
//     color: '#2563EB',
//     fontWeight: '600',
//   },
//   sentToText: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginBottom: 16,
//   },
//   resendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   resendText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   resendLink: {
//     color: '#2563EB',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   /* Footer */
//   footerText: {
//     textAlign: 'center',
//     marginTop: 32,
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
// });


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  LayoutAnimation,
  UIManager,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  // State Management
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  
  // UI States for Focus Animation
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Mock: Handle Sending OTP
  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    // Animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOtpSent(true);
  };

  // Mock: Handle Verifying OTP & Navigation
  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit code.');
      return;
    }
    if (role === 'ADMIN') {
      navigation.replace('Admin');
    } else {
      navigation.replace('Employee');
    }
  };

  const handleEditNumber = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOtpSent(false);
    setOtp('');
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      {/* Decorative Background Shapes */}
      <View style={styles.bgHeader} />
      <View style={styles.bgCircle} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
                <Icon name="rhombus-split" size={40} color="#FFF" />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subText}>Sign in to manage your workspace</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            
            {/* Role Selector */}
            <View style={styles.roleSelectorContainer}>
              {['EMPLOYEE', 'ADMIN'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.roleButton, role === item && styles.activeRoleButton]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setRole(item as any);
                  }}
                  activeOpacity={0.9}
                >
                  <Icon 
                    name={item === 'EMPLOYEE' ? "account" : "shield-account"} 
                    size={20} 
                    color={role === item ? '#2563EB' : '#9CA3AF'} 
                  />
                  <Text style={[styles.roleText, role === item && styles.activeRoleText]}>
                    {item === 'EMPLOYEE' ? 'Employee' : 'Administrator'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Form Content */}
            {!isOtpSent ? (
              // STATE 1: PHONE INPUT
              <View>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={[
                  styles.inputContainer, 
                  focusedInput === 'phone' && styles.inputFocused
                ]}>
                  <Icon name="phone" size={20} color={focusedInput === 'phone' ? "#2563EB" : "#9CA3AF"} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter 10 digit number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput(null)}
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={handleSendOtp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Get OTP</Text>
                  <Icon name="chevron-right" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              // STATE 2: OTP INPUT
              <View>
                 <View style={styles.otpHeader}>
                    <Text style={styles.label}>Enter Verification Code</Text>
                 </View>
                 
                <Text style={styles.sentToText}>
                    We sent a code to <Text style={{fontWeight: '700', color: '#1F2937'}}>+91 {phoneNumber}</Text>
                </Text>

                <View style={[
                  styles.inputContainer,
                  focusedInput === 'otp' && styles.inputFocused
                ]}>
                  <Icon name="lock-outline" size={20} color={focusedInput === 'otp' ? "#2563EB" : "#9CA3AF"} style={styles.inputIcon} />
                  <TextInput
                    placeholder="• • • •"
                    value={otp}
                    onChangeText={setOtp}
                    onFocus={() => setFocusedInput('otp')}
                    onBlur={() => setFocusedInput(null)}
                    style={[styles.input, styles.otpInput]}
                    keyboardType="number-pad"
                    maxLength={4}
                    autoFocus
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={handleVerifyOtp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Verify & Login</Text>
                </TouchableOpacity>
                
                <View style={styles.footerActions}>
                    <TouchableOpacity onPress={handleEditNumber}>
                        <Text style={styles.linkText}>Change Number</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                         <Text style={styles.linkText}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Simple Footer */}
          <Text style={styles.footerText}>
            Protected by reCAPTCHA and subject to the Privacy Policy.
          </Text>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Very light blue-gray
  },
  /* Background Decor */
  bgHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: '#2563EB', // Primary Blue
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    opacity: 0.1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  
  /* Header */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 16,
    color: '#DBEAFE', // Light blue text
    textAlign: 'center',
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  /* Role Selector */
  roleSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 28,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    gap: 8,
  },
  activeRoleButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeRoleText: {
    color: '#2563EB',
  },

  /* Inputs */
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    height: 58,
  },
  inputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  otpInput: {
    fontSize: 22,
    letterSpacing: 6,
    fontWeight: '700',
  },

  /* Buttons */
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* OTP & Footer Specific */
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentToText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    marginLeft: 4,
  },
  footerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingHorizontal: 8
  },
  linkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94A3B8',
    fontSize: 12,
  },
});