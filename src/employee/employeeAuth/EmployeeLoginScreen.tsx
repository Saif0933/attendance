import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

    // Format phone number - add + prefix if not present
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Validate mobile number using Zod
    const validationResult = EmployeeOtpValidator.safeParse({ mobile: formattedPhone });
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || 'Invalid mobile number';
      setError(errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return;
    }

    // Call the API
    requestOtpMutation.mutate(
      { mobile: formattedPhone },
      {
        onSuccess: (data) => {
          console.log('OTP Request Success:', data);
          // Navigate to verification screen with mobile number
          navigation.navigate('EmployeeVerificationScreen', { mobile: formattedPhone });
        },
        onError: (err: any) => {
          console.error('OTP Request Error:', err);
          const errorMsg = err?.response?.data?.message || err?.message || 'Failed to send OTP';
          setError(errorMsg);
          Alert.alert('Error', errorMsg);
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
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Login</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Branding Section */}
          <View style={styles.brandSection}>
            <Text style={styles.brandTitle}>TimeTracker</Text>
            <Text style={styles.brandSubtitle}>
              Enter your mobile number to receive OTP
            </Text>
          </View>

          {/* Mobile Input Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
              <TextInput
                style={styles.textInput}
                placeholder="+919876543200"
                placeholderTextColor="#A0AEC0"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setError('');
                }}
                editable={!requestOtpMutation.isPending}
              />
              <TouchableOpacity style={styles.inputIcon}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#2FAED7" />
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Biometric Section */}
          <View style={styles.biometricContainer}>
            <TouchableOpacity style={styles.biometricCircle}>
              <Ionicons name="finger-print-outline" size={36} color="#2FAED7" />
            </TouchableOpacity>
            <Text style={styles.biometricText}>Use Biometric Sign In</Text>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.signInButton, requestOtpMutation.isPending && styles.signInButtonDisabled]} 
            activeOpacity={0.8}
            onPress={handleSignIn}
            disabled={requestOtpMutation.isPending}
          >
            {requestOtpMutation.isPending ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.linkText}>Contact Support</Text>
            </Text>
          </View>

        </ScrollView>
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
    paddingBottom: 30,
    paddingHorizontal: 25,
  },
  
  // Branding
  brandSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#5F738C', // Specific slate blue/grey
    fontWeight: '400',
  },

  // Input
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    height: '100%',
  },
  inputIcon: {
    padding: 5,
  },

  // Biometric
  biometricContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  biometricCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    // Soft shadow for the floating effect
    shadowColor: '#2FAED7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  biometricText: {
    fontSize: 14,
    color: '#366986', // Muted blue text
    fontWeight: '500',
  },

  // Sign In Button
  signInButton: {
    backgroundColor: '#2995C0',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#2995C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7D8A99',
  },
  linkText: {
    color: '#2995C0',
    fontWeight: '600',
  },
  // Error styles
  inputError: {
    borderColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
});

export default EmployeeLoginScreen;