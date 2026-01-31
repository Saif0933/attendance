import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/Stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SelectRoleScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleEmployeePress = () => {
    navigation.navigate('EmployeeLoginScreen');
  };

  const handleOwnerPress = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Branding Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="fingerprint" size={50} color="#FFF" />
          </View>
          <Text style={styles.brandTitle}>TimeTracker</Text>
          <Text style={styles.brandSubtitle}>
            Select your role to continue
          </Text>
        </View>

        {/* Role Selection Buttons */}
        <View style={styles.roleContainer}>
          
          {/* Employee Button */}
          <TouchableOpacity 
            style={styles.roleCard}
            onPress={handleEmployeePress}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconContainer}>
              <Ionicons name="person-outline" size={32} color="#2995C0" />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>I am an Employee</Text>
              <Text style={styles.roleDescription}>
                Login to track your attendance and view your work schedule
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
          </TouchableOpacity>

          {/* Company Owner Button */}
          <TouchableOpacity 
            style={styles.roleCard}
            onPress={handleOwnerPress}
            activeOpacity={0.8}
          >
            <View style={[styles.roleIconContainer, styles.ownerIconContainer]}>
              <Ionicons name="business-outline" size={32} color="#FFF" />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>I am a Company Owner</Text>
              <Text style={styles.roleDescription}>
                Manage your team, track attendance and handle payroll
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? <Text style={styles.linkText}>Contact Support</Text>
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  
  // Branding
  brandSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  logoBox: {
    width: 90,
    height: 90,
    backgroundColor: '#2995C0',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2995C0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#5F738C',
    fontWeight: '400',
  },

  // Role Cards
  roleContainer: {
    gap: 20,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#E1F4F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ownerIconContainer: {
    backgroundColor: '#2995C0',
  },
  roleTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 13,
    color: '#7D8A99',
    lineHeight: 18,
  },

  // Footer
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#7D8A99',
  },
  linkText: {
    color: '#2995C0',
    fontWeight: '600',
  },
});

export default SelectRoleScreen;
