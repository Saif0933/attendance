import { useNavigation } from '@react-navigation/native';
import { Check, ChevronLeft, LocateFixed, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import LinearGradient from 'react-native-linear-gradient';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface PermissionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'granted' | 'pending';
  onPress?: () => void;
}

const PermissionsScreen = () => {
  const navigation = useNavigation();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'pending'>('pending');
  const [locationService, setLocationService] = useState<'granted' | 'pending'>('pending');

  useEffect(() => {
    const checkStatus = async () => {
      await checkPermissions();
      // Also check if location services are already enabled
      // Note: checkPermissions already checks the ANDROID permission
    };
    
    // Initial check
    checkStatus();

    // If both are already granted, we might want to navigate immediately,
    // but usually user is here because one was missing.
  }, []);

  const checkPermissions = async () => {
    const locResult = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    const isGranted = locResult === RESULTS.GRANTED;
    setLocationPermission(isGranted ? 'granted' : 'pending');
    
    // We don't have a direct "poll" for location service without prompting, 
    // but if we are here we want to monitor.
  };

  const handleAllowLocation = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      setLocationPermission('granted');
      if (locationService === 'granted') {
        navigation.goBack();
      }
    }
  };

  const handleEnableGPS = async () => {
    try {
      const result = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
      });
      if (result === 'already-enabled' || result === 'enabled') {
        setLocationService('granted');
        const locResult = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (locResult === RESULTS.GRANTED) {
           navigation.goBack();
        } else {
           // Still need permission
           handleAllowLocation();
        }
      }
    } catch (error) {
      console.log('GPS Enabler error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        // User's preferred blue palette
        colors={['#323bf0ff', '#667ff0ff', '#a9c2f2ff']}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Permissions</Text>
            <View style={{ width: 40 }} /> {/* Spacer for balance */}
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <ShieldCheck size={64} color="#FFF" strokeWidth={1.5} />
            </View>
            <Text style={styles.heroTitle}>Service Access</Text>
            <Text style={styles.heroSubtitle}>
              Please enable the following services to ensure accurate attendance tracking.
            </Text>
          </View>

          {/* White Bottom Sheet Content */}
          <View style={styles.bottomSheet}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionTitle}>Required Permissions</Text>

              <PermissionItem
                icon={<LocateFixed size={24} color="#323bf0" />}
                title="Location Services"
                description="Required to enable GPS tracking"
                status={locationService}
                onPress={handleEnableGPS}
              />

              <PermissionItem
                icon={<ShieldCheck size={24} color="#323bf0" />}
                title="Location Permission"
                description="Required to access device coordinates"
                status={locationPermission}
                onPress={handleAllowLocation}
              />

              {/* Add more items here if needed in the future */}

            </ScrollView>
          </View>

        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const PermissionItem: React.FC<PermissionItemProps> = ({ 
  icon, 
  title, 
  description, 
  status,
  onPress
}) => {
  const isGranted = status === 'granted';

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.itemIconBox, isGranted && styles.itemIconBoxActive]}>
        {isGranted ? <Check size={24} color="#FFF" /> : icon}
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>

      {!isGranted && (
        <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Enable</Text>
        </TouchableOpacity>
      )}
      
      {isGranted && (
         <View style={styles.statusLabel}>
            <Text style={styles.statusText}>Active</Text>
         </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  
  // Hero
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Bottom Sheet
  bottomSheet: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 20,
    marginLeft: 5,
  },

  // Item Styles
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemIconBoxActive: {
    backgroundColor: '#4CAF50',
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#323bf0',
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statusLabel: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PermissionsScreen;