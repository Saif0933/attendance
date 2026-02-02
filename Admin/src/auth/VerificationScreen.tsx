import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator, Alert,
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
import { useVerifyOtp } from '../../../api/hook/company/auth/useAuth';
import { RootStackParamList } from '../../../src/navigation/Stack';

const VerificationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'VerificationScreen'>>();
  const { mobile } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputs = useRef<Array<TextInput | null>>([]);

  const { mutate: verifyOtp, isPending } = useVerifyOtp();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      Alert.alert('Error', 'Please enter a 4-digit OTP');
      return;
    }

    verifyOtp(
      { mobile, otp: otpValue },
      {
        onSuccess: async (data) => {
          console.log('OTP verified successfully:', data);
          
          let isRegistered = false;
          // Check if business is already registered (if name exists)
          if (data.data?.company?.name) {
            isRegistered = true;
          }

          try {
            await AsyncStorage.setItem('adminIsLoggedIn', 'true');
            if (isRegistered) {
              await AsyncStorage.setItem('adminIsBusinessRegistered', 'true');
            }
            if (data.data?.token) {
              await AsyncStorage.setItem('adminToken', data.data.token);
            }
          } catch (error) {
            console.error('Error saving admin login state', error);
          }

          navigation.reset({
            index: 0,
            routes: [{ 
              name: isRegistered ? 'AdminBottomTabNavigation' : 'RegisterBusinessScreen' 
            }],
          });
        },
        onError: (error: any) => {
          console.error('Failed to verify OTP:', error);
          Alert.alert('Error', error?.response?.data?.message || 'Invalid OTP. Please try again.');
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 26 }} /> {/* Spacer for balance */}
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
            <Text style={styles.phoneNumber}>{mobile}</Text>
          </View>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View 
                key={index}
                style={[
                  styles.otpBox,
                  focusedIndex === index && styles.otpBoxFocused
                ]}
              >
                <TextInput
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onFocus={() => setFocusedIndex(index)}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  showSoftInputOnFocus={true}
                />
                 {/* Visual Cursor Simulation for the screenshot look */}
                {focusedIndex === index && digit === '' && (
                   <View style={styles.fakeCursor} />
                )}
              </View>
            ))}
          </View>

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
                  <Text style={styles.timeText}>00</Text>
                </View>
                <Text style={styles.timeUnit}>MIN</Text>
              </View>

              <Text style={styles.colon}>:</Text>

              {/* Seconds */}
              <View style={styles.timeBoxGroup}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>30</Text>
                </View>
                <Text style={styles.timeUnit}>SEC</Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Bottom Section (Button & Footer) */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.buttonWrapper} 
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={isPending}
          >
            <LinearGradient
               colors={['#2D9CDB', '#2D9CDB', '#56CCF2']}
               start={{x: 0, y: 0}} 
               end={{x: 1, y: 0}}
              style={styles.gradientButton}
            >
              {isPending ? (
                <ActivityIndicator color="#FFF" />
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
    fontWeight: '700', // Bold but not heavy
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
    color: '#2FAED7', // Bright Blue
    fontWeight: '600',
  },

  // OTP Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15, // Spacing between boxes
    marginBottom: 40,
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
    borderWidth: 2.5, // Thicker border for focus
    shadowColor: '#2FAED7',
    shadowOpacity: 0.2,
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
    alignItems: 'flex-start', // Align tops of boxes
    marginBottom: 20,
  },
  timeBoxGroup: {
    alignItems: 'center',
  },
  timeBox: {
    width: 50,
    height: 50,
    backgroundColor: '#E1F4F9', // Light Cyan/Blue bg for timer
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
    color: '#8FBAD6', // Lighter blue to look disabled or secondary
    fontSize: 16,
    fontWeight: '500',
  },

  // Bottom Section
  bottomContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    marginTop: 'auto', // Pushes to bottom
  },
  buttonWrapper: {
    marginBottom: 25,
    shadowColor: '#2FAED7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
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