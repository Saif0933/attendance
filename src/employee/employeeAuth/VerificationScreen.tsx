import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/Stack';
import { useEmployeeRequestOtp, useEmployeeVerifyOtp } from '../hook/useEmployeeAuth';
import { EmployeeLoginValidator } from '../validator/auth.validator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type VerificationRouteProp = RouteProp<RootStackParamList, 'EmployeeVerificationScreen'>;

const VerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerificationRouteProp>();
  const { mobile } = route.params;

  // OTP input state - 4 digits
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState('');

  // Timer state
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Input refs for auto-focus
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // TanStack Query mutations
  const verifyOtpMutation = useEmployeeVerifyOtp();
  const requestOtpMutation = useEmployeeRequestOtp();

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const time = formatTime(timer);

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    setError('');
    
    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  // Handle verify button press
  const handleVerify = async () => {
    setError('');
    const otpString = otp.join('');

    // Validate OTP
    const validationResult = EmployeeLoginValidator.safeParse({
      mobile: mobile,
      otp: otpString,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || 'Invalid OTP';
      setError(errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return;
    }

    // Call verify OTP API
    verifyOtpMutation.mutate(
      { mobile: mobile, otp: otpString },
      {
        onSuccess: async (data) => {
          console.log('OTP Verification Success:', data);
          
          // Store the token in AsyncStorage
          if (data.token) {
            await AsyncStorage.setItem('employeeToken', data.token);
            await AsyncStorage.setItem('employeeData', JSON.stringify(data.employee));
          }

          Alert.alert('Success', data.message || 'Login successful!', [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to employee bottom tab navigation
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'EmployeeBottomTab' }],
                });
              },
            },
          ]);
        },
        onError: (err: any) => {
          console.error('OTP Verification Error:', err);
          const errorMsg = err?.response?.data?.message || err?.message || 'Invalid OTP';
          setError(errorMsg);
          Alert.alert('Error', errorMsg);
        },
      }
    );
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;

    requestOtpMutation.mutate(
      { mobile: mobile },
      {
        onSuccess: (data) => {
          console.log('OTP Resent:', data);
          Alert.alert('Success', 'OTP has been resent to your mobile number');
          setTimer(30);
          setCanResend(false);
          setOtp(['', '', '', '']);
          setFocusedIndex(0);
          inputRefs.current[0]?.focus();
        },
        onError: (err: any) => {
          console.error('Resend OTP Error:', err);
          const errorMsg = err?.response?.data?.message || err?.message || 'Failed to resend OTP';
          Alert.alert('Error', errorMsg);
        },
      }
    );
  };

  // Mask mobile number for display
  const maskedMobile = mobile.replace(/(\+\d{2})(\d+)(\d{4})/, '$1 XXX-XXX-$3');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              We have sent a 4-digit code to
            </Text>
            <Text style={styles.phoneNumber}>{maskedMobile}</Text>
          </View>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View 
                key={index}
                style={[
                  styles.otpBox,
                  focusedIndex === index && styles.otpBoxFocused,
                  error && styles.otpBoxError
                ]}
              >
                <TextInput
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  editable={!verifyOtpMutation.isPending}
                />
                {focusedIndex === index && digit === '' && (
                   <View style={styles.fakeCursor} />
                )}
              </View>
            ))}
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Timer Section */}
          <View style={styles.timerContainer}>
            <View style={styles.timerLabelRow}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#7D8A99" />
              <Text style={styles.timerLabelText}>Resend code in</Text>
            </View>

            <View style={styles.timerClockRow}>
              {/* Minutes */}
              <View style={styles.timeBoxGroup}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{time.minutes}</Text>
                </View>
                <Text style={styles.timeUnit}>MIN</Text>
              </View>

              <Text style={styles.colon}>:</Text>

              {/* Seconds */}
              <View style={styles.timeBoxGroup}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{time.seconds}</Text>
                </View>
                <Text style={styles.timeUnit}>SEC</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleResendOtp} 
              disabled={!canResend || requestOtpMutation.isPending}
            >
              <Text style={[
                styles.resendLink, 
                canResend && styles.resendLinkActive
              ]}>
                {requestOtpMutation.isPending ? 'Resending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Bottom Section (Button & Footer) */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.buttonWrapper, verifyOtpMutation.isPending && styles.buttonDisabled]} 
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={verifyOtpMutation.isPending || otp.some(d => d === '')}
          >
            <LinearGradient
               colors={['#2D9CDB', '#2D9CDB', '#56CCF2']}
               start={{x: 0, y: 0}} 
               end={{x: 1, y: 0}}
              style={styles.gradientButton}
            >
              {verifyOtpMutation.isPending ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Verify & Proceed</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy for biometric time tracking.
          </Text>
          
          {/* Bottom Handle Simulation (iOS style) */}
          <View style={styles.bottomHandle} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 5,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  
  // Title Styles
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#111',
    fontWeight: '400',
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#2FAED7',
    fontWeight: '600',
  },

  // OTP Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  otpBox: {
    width: 65,
    height: 65,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  otpBoxFocused: {
    borderColor: '#2FAED7',
    borderWidth: 2.5,
    shadowColor: '#2FAED7',
    shadowOpacity: 0.2,
  },
  otpBoxError: {
    borderColor: '#E53E3E',
  },
  otpInput: {
    fontSize: 24,
    color: '#111',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  fakeCursor: {
    position: 'absolute',
    width: 1.5,
    height: 24,
    backgroundColor: '#111',
  },

  // Error Styles
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Timer Styles
  timerContainer: {
    alignItems: 'center',
  },
  timerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timerLabelText: {
    color: '#7D8A99',
    marginLeft: 6,
    fontSize: 15,
  },
  timerClockRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timeBoxGroup: {
    alignItems: 'center',
  },
  timeBox: {
    width: 50,
    height: 50,
    backgroundColor: '#E1F4F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2FAED7',
  },
  timeUnit: {
    fontSize: 10,
    color: '#7D8A99',
    fontWeight: '600',
  },
  colon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2FAED7',
    marginHorizontal: 10,
    marginTop: 8,
  },
  resendLink: {
    color: '#8FBAD6',
    fontSize: 16,
    fontWeight: '500',
  },
  resendLinkActive: {
    color: '#2995C0',
  },

  // Bottom Section
  bottomContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    marginTop: 'auto',
  },
  buttonWrapper: {
    marginBottom: 25,
    shadowColor: '#2FAED7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    height: 56,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  footerText: {
    textAlign: 'center',
    color: '#9AA5B1',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  bottomHandle: {
    alignSelf: 'center',
    width: 130,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 10,
    marginTop: 20,
  },
});

export default VerificationScreen;