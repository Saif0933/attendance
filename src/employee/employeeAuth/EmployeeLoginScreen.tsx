import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/Stack';
import { useEmployeeRequestOtp } from '../hook/useEmployeeAuth';
import { EmployeeOtpValidator } from '../validator/auth.validator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmployeeLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  // TanStack Query mutation for requesting OTP
  const requestOtpMutation = useEmployeeRequestOtp();

  const handleSignIn = async () => {
    setError('');

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit number');
      return;
    }

    const formattedPhone = phoneNumber;

    // Validate mobile number using Zod
    const validationResult = EmployeeOtpValidator.safeParse({ mobile: formattedPhone });
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || 'Invalid mobile number';
      setError(errorMessage);
      return;
    }

    // Call the API
    requestOtpMutation.mutate(
      { mobile: formattedPhone },
      {
        onSuccess: (data) => {
          navigation.navigate('EmployeeVerificationScreen', { mobile: formattedPhone });
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || err?.message || 'Failed to send OTP';
          setError(errorMsg);
          Alert.alert('Error', errorMsg);
        },
      }
    );
  };

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Actions */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backIconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            {/* Animated Branding Section */}
            <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Ionicons name="person" size={40} color="#4b43f0" />
                </View>
              </View>
              <Text style={styles.heroTitle}>Employee Login</Text>
              <Text style={styles.heroSubtitle}>Please confirm your identity to manage your attendance and tasks.</Text>
            </Animated.View>

            {/* Animated Form Section */}
            <Animated.View style={[styles.formArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.inputWrapper}>
                <Text style={styles.overline}>Mobile Identity</Text>
                <View style={[styles.modernInput, error ? styles.modernInputError : null]}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="98765 43210"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setPhoneNumber(cleaned);
                      if (error) setError('');
                    }}
                    editable={!requestOtpMutation.isPending}
                  />
                </View>
                {error && (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />
                    <Text style={styles.errorBannerText}>{error}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.primaryButton, requestOtpMutation.isPending && styles.buttonDisabled]} 
                activeOpacity={0.9}
                onPress={handleSignIn}
                disabled={requestOtpMutation.isPending}
              >
                <LinearGradient
                  colors={['#8f8aebff', '#0e08b2ff']}
                  style={styles.buttonGradient}
                >
                  {requestOtpMutation.isPending ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.buttonLabel}>Request Access Code</Text>
                      <View style={styles.buttonArrow}>
                        <Ionicons name="arrow-forward" size={16} color="#FFF" />
                      </View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[styles.supportArea, { opacity: fadeAnim }]}>
              <Text style={styles.supportLabel}>Having trouble logging in?</Text>
              <TouchableOpacity activeOpacity={1}>
                <Text style={styles.supportAction}>Contact System Administrator</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingHorizontal: 24,
  },
  backIconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    shadowColor: '#4b43f0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formArea: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 32,
  },
  overline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  modernInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    paddingHorizontal: 20,
  },
  modernInputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  prefixBox: {
    marginRight: 16,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 4,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButton: {
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4b43f0',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonLabel: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    marginRight: 12,
  },
  buttonArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  supportArea: {
    marginTop: 50,
    alignItems: 'center',
  },
  supportLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 6,
  },
  supportAction: {
    fontSize: 15,
    color: '#4b43f0',
    fontWeight: '800',
  },
});

export default EmployeeLoginScreen;