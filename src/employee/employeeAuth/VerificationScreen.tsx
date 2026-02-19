import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/Stack';
import { useEmployeeAuthStore } from '../../store/useEmployeeAuthStore';
import { useEmployeeRequestOtp, useEmployeeVerifyOtp } from '../hook/useEmployeeAuth';
import { EmployeeLoginValidator } from '../validator/auth.validator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type VerificationRouteProp = RouteProp<RootStackParamList, 'EmployeeVerificationScreen'>;

const VerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerificationRouteProp>();
  const { mobile } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  const verifyOtpMutation = useEmployeeVerifyOtp();
  const requestOtpMutation = useEmployeeRequestOtp();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    setError('');
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleVerify = async () => {
    setError('');
    const otpString = otp.join('');

    const validationResult = EmployeeLoginValidator.safeParse({ mobile, otp: otpString });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message || 'Invalid OTP');
      return;
    }

    verifyOtpMutation.mutate(
      { mobile, otp: otpString },
      {
        onSuccess: async (data: any) => {
          const responseData = data.data || data;
          const { token, employee, company } = responseData;
          
          if (token && employee && company) {
            useEmployeeAuthStore.getState().setEmployeeAuth(token, employee, company);
            Alert.alert('Success', 'Login successful!', [
              { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'EmployeeBottomTab' }] }) }
            ]);
          }
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || err?.message || 'Invalid OTP');
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    requestOtpMutation.mutate({ mobile }, {
      onSuccess: () => {
        Alert.alert('Success', 'OTP resent!');
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '']);
        setFocusedIndex(0);
        inputRefs.current[0]?.focus();
      },
    });
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const maskedMobile = mobile.startsWith('+') 
    ? mobile.replace(/(\+\d{2})(\d+)(\d{4})/, '$1 XXX-XXX-$3')
    : mobile.replace(/(\d{3})(\d+)(\d{4})/, '$1-XXX-$3');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.mainContent}>
            <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Ionicons name="shield-checkmark" size={40} color="#4b43f0" />
                </View>
              </View>
              <Text style={styles.heroTitle}>Verification Code</Text>
              <Text style={styles.heroSubtitle}>We've sent a unique 4-digit code to {maskedMobile}</Text>
            </Animated.View>

            <Animated.View style={[styles.formArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.otpGrid}>
                {otp.map((digit, index) => (
                  <View key={index} style={[styles.otpSlot, focusedIndex === index && styles.otpSlotFocused, error && styles.otpSlotError]}>
                    <TextInput
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                    />
                  </View>
                ))}
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.timerWrapper}>
                <View style={styles.timerBadge}>
                  <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </View>
                <TouchableOpacity onPress={handleResendOtp} disabled={!canResend}>
                  <Text style={[styles.resendAction, canResend && styles.resendActionActive]}>Resend Code</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleVerify} disabled={verifyOtpMutation.isPending}>
                <LinearGradient colors={['#4b43f0', '#3a34c9']} style={styles.buttonGradient}>
                  {verifyOtpMutation.isPending ? <ActivityIndicator color="#FFF" /> : (
                    <>
                      <Text style={styles.buttonLabel}>Verify Identity</Text>
                      <View style={styles.buttonArrow}><Ionicons name="arrow-forward" size={16} color="#FFF" /></View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1 },
  backButton: { paddingTop: Platform.OS === 'ios' ? 20 : 40, paddingHorizontal: 24, paddingBottom: 10 },
  mainContent: { flex: 1, paddingHorizontal: 30, paddingTop: 20 },
  heroSection: { alignItems: 'center', marginBottom: 40 },
  logoRing: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', marginBottom: 24,
    shadowColor: '#4b43f0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5
  },
  logoInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
  heroSubtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  formArea: { width: '100%' },
  otpGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  otpSlot: {
    width: 64, height: 64, borderRadius: 16, backgroundColor: '#F8FAFC',
    borderWidth: 1.5, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center'
  },
  otpSlotFocused: { borderColor: '#4b43f0', backgroundColor: '#FFFFFF' },
  otpSlotError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  otpInput: { fontSize: 24, fontWeight: '800', color: '#0F172A', textAlign: 'center', width: '100%' },
  errorText: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  timerWrapper: { alignItems: 'center', marginBottom: 30 },
  timerBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#EEF2FF', marginBottom: 12 },
  timerText: { fontSize: 14, fontWeight: '700', color: '#4b43f0' },
  resendAction: { fontSize: 14, color: '#94A3B8', fontWeight: '700' },
  resendActionActive: { color: '#4b43f0', textDecorationLine: 'underline' },
  primaryButton: { height: 64, borderRadius: 20, overflow: 'hidden' },
  buttonGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  buttonLabel: { color: '#FFF', fontSize: 17, fontWeight: '800', marginRight: 12 },
  buttonArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});

export default VerificationScreen;