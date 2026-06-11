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
import { useEmployeeLoginWithPassword } from '../hook/useEmployeeAuth';
import { useTheme } from '../../theme/ThemeContext';
import { useEmployeeAuthStore } from '../../store/useEmployeeAuthStore';
import { EmployeePasswordLoginValidator } from '../validator/auth.validator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmployeeLoginScreen = () => {
  const { colors, isDark, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
  const navigation = useNavigation<NavigationProp>();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loginMutation = useEmployeeLoginWithPassword();

  const handleSignIn = () => {
    // Reset errors
    setPhoneError('');
    setPasswordError('');

    // Client-side validation
    const validationResult = EmployeePasswordLoginValidator.safeParse({
      mobile: phoneNumber,
      password,
    });

    if (!validationResult.success) {
      const issues = validationResult.error.issues;
      issues.forEach((issue) => {
        if (issue.path[0] === 'mobile') setPhoneError(issue.message);
        if (issue.path[0] === 'password') setPasswordError(issue.message);
      });
      return;
    }

    loginMutation.mutate(
      { mobile: phoneNumber, password },
      {
        onSuccess: (data: any) => {
          // Handle both `data` and `data.data` response shapes
          const responseData = data?.data || data;
          const { token, employee, company } = responseData;

          if (token && employee && company) {
            useEmployeeAuthStore
              .getState()
              .setEmployeeAuth(token, employee, company);
            navigation.reset({
              index: 0,
              routes: [{ name: 'EmployeeBottomTab' }],
            });
          } else {
            Alert.alert('Login Failed', 'Invalid response from server. Please try again.');
          }
        },
        onError: (err: any) => {
          const errorMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Incorrect phone number or password.';
          setPasswordError(errorMsg);
        },
      }
    );
  };

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(24)).current;

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
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backIconButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Ionicons name="person" size={40} color={colors.primary} />
                </View>
              </View>
              <Text style={styles.heroTitle}>Employee Login</Text>
              <Text style={styles.heroSubtitle}>
                Enter your registered mobile number and the password set by your administrator.
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              style={[
                styles.formArea,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Phone Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.overline}>Mobile Number</Text>
                <View
                  style={[
                    styles.modernInput,
                    phoneError ? styles.modernInputError : null,
                  ]}
                >
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
                      if (phoneError) setPhoneError('');
                    }}
                    editable={!loginMutation.isPending}
                  />
                </View>
                {phoneError ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={15} color="#EF4444" />
                    <Text style={styles.errorBannerText}>{phoneError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.overline}>Password</Text>
                <View
                  style={[
                    styles.modernInput,
                    passwordError ? styles.modernInputError : null,
                  ]}
                >
                  <View style={styles.iconBox}>
                    <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    editable={!loginMutation.isPending}
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={15} color="#EF4444" />
                    <Text style={styles.errorBannerText}>{passwordError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loginMutation.isPending && styles.buttonDisabled,
                ]}
                activeOpacity={0.9}
                onPress={handleSignIn}
                disabled={loginMutation.isPending}
              >
                <LinearGradient
                  colors={['#8f8aebff', '#0e08b2ff']}
                  style={styles.buttonGradient}
                >
                  {loginMutation.isPending ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.buttonLabel}>Sign In</Text>
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
              <Text style={styles.supportLabel}>Forgot your password?</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.supportAction}>Contact System Administrator</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (colors: any, fonts: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      marginBottom: 44,
    },
    logoRing: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
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
      fontFamily: fonts.bold,
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: 15,
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 10,
    },
    formArea: {
      width: '100%',
    },
    inputWrapper: {
      marginBottom: 24,
    },
    overline: {
      fontSize: 12,
      fontFamily: fonts.bold,
      color: colors.textSecondary,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 12,
      marginLeft: 4,
    },
    modernInput: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 64,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: colors.border,
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
      borderRightColor: colors.border,
    },
    prefixText: {
      fontSize: 16,
      fontFamily: fonts.bold,
      color: colors.text,
    },
    iconBox: {
      marginRight: 14,
      paddingRight: 14,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      justifyContent: 'center',
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: fonts.bold,
      color: colors.text,
      letterSpacing: 0.5,
    },
    eyeButton: {
      padding: 4,
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
      fontFamily: fonts.bold,
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
      marginTop: 8,
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
      fontFamily: fonts.bold,
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
      marginTop: 48,
      alignItems: 'center',
    },
    supportLabel: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    supportAction: {
      fontSize: 15,
      color: colors.primary,
      fontFamily: fonts.bold,
    },
  });

export default EmployeeLoginScreen;