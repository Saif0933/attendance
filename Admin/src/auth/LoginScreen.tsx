import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Building2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
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
import { useRequestOtp } from '../../../api/hook/company/auth/useAuth';
import { RootStackParamList } from '../../../src/navigation/Stack';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { mutate: requestOtp, isPending } = useRequestOtp();

  // Animation values (Native performance, high framerate)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // GSAP-style staggered entrance
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.poly(4)),
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 10,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Infinite 'Breathing' float animation for background
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  const handleGetOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    requestOtp(
      { mobile: phoneNumber },
      {
        onSuccess: (data: any) => {
          navigation.navigate('VerificationScreen', { mobile: phoneNumber });
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || 'Verification failed';
          Alert.alert('Error', errorMessage);
        },
      }
    );
  };

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Dynamic Background Elements */}
      <Animated.View style={[styles.bgCircle, { transform: [{ translateY }] }]} />
      <Animated.View style={[styles.bgCircleSmall, { transform: [{ translateY: Animated.multiply(translateY, -1.5) }] }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Minimal Navigation Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.backFab} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.mainLayout}>
            {/* Pulsing Logo Header */}
            <Animated.View style={[styles.brandingSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
              <View style={styles.glassLogo}>
                <LinearGradient
                  colors={['#2FAED7', '#10B981', '#059669']}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Building2 size={45} color="#FFF" />
                </LinearGradient>
              </View>
              <Text style={[styles.headline, { textAlign: 'center', marginTop: 15 }]}>Company Login</Text>
            </Animated.View>

            {/* Form Section */}
            <Animated.View style={[styles.contentArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={[styles.subheadline, { textAlign: 'center', marginTop: -20 }]}>Authorized personnel only. Access requires two-factor authentication.</Text>

              {/* Ultra-Clean Input Field */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputOverline, { textAlign: 'center', marginLeft: 0 }]}>Mobile Gateway</Text>
                <View style={styles.pillInput}>
                  <View style={styles.identityBadge}>
                    <Text style={styles.countryCode}>+1</Text>
                    <Ionicons name="caret-down" size={12} color="#94A3B8" style={{marginLeft: 6}} />
                  </View>
                  <View style={styles.verticalSep} />
                  <TextInput
                    style={styles.phoneField}
                    placeholder="Enter phone number"
                    placeholderTextColor="#CBD5E1"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    selectionColor="#2FAED7"
                  />
                </View>
              </View>

              {/* Bold Action Button */}
              <TouchableOpacity 
                style={[styles.actionBtn, isPending && styles.btnDimmed]} 
                onPress={handleGetOtp}
                disabled={isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8563e3ff', '#3206a9ff']}
                  style={styles.btnGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  {isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.btnLabel}>Request Access</Text>
                      <View style={styles.btnIconOrb}>
                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                      </View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Minimalist Footer */}
          <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
            <View style={styles.divider} />
            <Text style={styles.copyright}>
              Powered by <Text style={{fontWeight: '700', color: '#1E293B'}}>Symbosys</Text> • v2.4.0
            </Text>
          </Animated.View>
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
  bgCircle: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#F1F5F9',
    opacity: 0.6,
  },
  bgCircleSmall: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EEF2FF',
    opacity: 0.4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingHorizontal: 25,
    height: 110,
  },
  backFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainLayout: {
    flex: 1,
    paddingHorizontal: 30,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 45,
  },
  glassLogo: {
    width: 100,
    height: 100,
    borderRadius: 35,
    padding: 3,
    backgroundColor: '#FFF',
    shadowColor: '#2FAED7',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 20,
  },
  logoGradient: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 6,
    textAlign: 'center',
  },
  contentArea: {
    width: '100%',
  },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
    letterSpacing: -1,
  },
  subheadline: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 25,
    fontWeight: '400',
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 35,
  },
  inputOverline: {
    fontSize: 12,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    marginLeft: 5,
  },
  pillInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    paddingHorizontal: 25,
  },
  identityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  verticalSep: {
    width: 2,
    height: 25,
    backgroundColor: '#E2E8F0',
    marginRight: 20,
  },
  phoneField: {
    flex: 1,
    fontSize: 19,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 1,
  },
  tickBox: {
    paddingLeft: 10,
  },
  actionBtn: {
    height: 68,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnIconOrb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  btnDimmed: {
    opacity: 0.75,
  },
  biometricLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
  },
  biometricLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#94A3B8',
    marginLeft: 12,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  copyright: {
    fontSize: 13,
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },
});

export default LoginScreen;