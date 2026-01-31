import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
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
import { useRequestOtp } from '../../../api/hook/company/auth/useAuth';
import { RootStackParamList } from '../../../src/navigation/Stack';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { mutate: requestOtp, isPending } = useRequestOtp();

  const handleGetOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    requestOtp(
      { mobile: phoneNumber },
      {
        onSuccess: (data) => {
          console.log('OTP requested successfully:', data);
          navigation.navigate('VerificationScreen', { mobile: phoneNumber });
        },
        onError: (error: any) => {
          console.error('Failed to request OTP:', error);
          const errorMessage = error?.response?.data?.message || error.message || 'Network Error. Check your server connection.';
          Alert.alert('Error', errorMessage);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Login</Text>
        <View style={{ width: 24 }} /> {/* Spacer to balance header */}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="fingerprint" size={40} color="#FFF" />
          </View>
          <Text style={styles.appName}>WorkFlow Pro</Text>
          <Text style={styles.tagline}>Biometric Work Management</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your mobile number to receive a verification code.
          </Text>
        </View>

        {/* Input Forms */}
        <View style={styles.inputContainer}>
          
          {/* Country Code Input */}
          <View style={styles.inputWrapperCode}>
            <Text style={styles.label}>Code</Text>
            <TouchableOpacity style={styles.countrySelector}>
              <Image 
                source={{ uri: 'https://cdn.britannica.com/33/4833-004-828A9A84/Flag-United-States-of-America.jpg' }} 
                style={styles.flagIcon} 
              />
              <Text style={styles.countryCodeText}>+1</Text>
              <Ionicons name="chevron-down" size={16} color="#7D8A99" />
            </TouchableOpacity>
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputWrapperPhone}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="000-000-0000"
                placeholderTextColor="#C5CEE0"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
        </View>

        {/* Get OTP Button */}
        <TouchableOpacity 
          style={styles.buttonContainer} 
          activeOpacity={0.8}
          onPress={handleGetOtp}
          disabled={isPending}
        >
          <LinearGradient
            colors={['#2D9CDB', '#2D9CDB', '#56CCF2']} // Gradient simulation
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}}
            style={styles.gradientButton}
          >
            {isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Get OTP</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR LOGIN WITH</Text>
          <View style={styles.line} />
        </View>

        {/* Biometric Login */}
        <TouchableOpacity style={styles.biometricContainer}>
          <View style={styles.biometricCircle}>
            <Ionicons name="finger-print-outline" size={32} color="#45B6D6" />
          </View>
          <Text style={styles.biometricText}>Use Fingerprint</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // Very light grey/blue background
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  // Logo Styles
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#2FAED7', // The specific blue from the logo
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2FAED7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#7D8A99', // Slate gray
    marginTop: 5,
    fontWeight: '400',
  },
  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#7D8A99',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Inputs
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapperCode: {
    width: '30%',
  },
  inputWrapperPhone: {
    width: '65%',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    paddingHorizontal: 10,
  },
  flagIcon: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  phoneInputBox: {
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  textInput: {
    fontSize: 16,
    color: '#111',
    letterSpacing: 1,
  },
  // Button
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  gradientButton: {
    height: 58,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2FAED7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginTop: 2, // optical alignment
  },
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E9F2',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#7D8A99',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Biometric
  biometricContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  biometricCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 1.5,
    borderColor: '#D0D9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8F9FB',
  },
  biometricText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
  // Footer
  footer: {
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 13,
    color: '#7D8A99',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#2FAED7',
    fontWeight: '600',
  },
});

export default LoginScreen;