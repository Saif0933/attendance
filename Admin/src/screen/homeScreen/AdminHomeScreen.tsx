
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import popup screens
import AdminPunching from './AdminPunching';
import Others from './Others';

const { width, height } = Dimensions.get('window');

const AdminHomeScreen = () => {
  const [othersModalVisible, setOthersModalVisible] = useState(false);
  const [punchingModalVisible, setPunchingModalVisible] = useState(false);
  const navigation = useNavigation<any>();

  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [hasCentered, setHasCentered] = useState(false);

  const onUserLocationChange = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setUserLocation(coordinate);
  };

  const handleRecenter = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }, 1000);
    }
  };

  useEffect(() => {
    if (userLocation && !hasCentered && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }, 1000);
      setHasCentered(true);
    }
  }, [userLocation, hasCentered]);

  const handlePunchPress = async () => {
    try {
      // 1. Check Location Permission
      const permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      
      if (permission !== RESULTS.GRANTED) {
        navigation.navigate('PermissionsScreen');
        return;
      }

      // 2. Check if Location (GPS) is Enabled
      const status = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
      });

      if (status === 'already-enabled' || status === 'enabled') {
        setPunchingModalVisible(true);
      } else {
        navigation.navigate('PermissionsScreen');
      }
    } catch (error) {
      console.log('Location enable error:', error);
      // If user cancels or error occurs, show permissions screen
      navigation.navigate('PermissionsScreen');
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1, position: 'relative' }}>
        {/* MAP */}
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 23.3441,
            longitude: 85.3096,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onUserLocationChange={onUserLocationChange}
        >
          <Marker coordinate={userLocation || { latitude: 23.3441, longitude: 85.3096 }} />
        </MapView>

        {/* ROUTINE */}
        <View style={styles.topLeftContainer}>
          <TouchableOpacity style={styles.starterCard}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#333"
              style={styles.cardIcon}
            />
            <Text style={styles.starterText}>Routine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topRightContainer}>
          <TouchableOpacity 
            style={[styles.circleButton, styles.navButton]}
            onPress={handleRecenter}
          >
            <Ionicons
              name="navigate-outline"
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* OTHERS */}
        <View style={styles.bottomLeftContainer}>
          <TouchableOpacity
            style={styles.othersCard}
            onPress={() => setOthersModalVisible(true)}
          >
            <Ionicons
              name="people-outline"
              size={20}
              color="#333"
            />
            <Text style={styles.othersText}>Others</Text>
          </TouchableOpacity>
        </View>

        {/* PUNCH */}
        <View style={styles.bottomRightContainer}>
          <TouchableOpacity
            style={styles.handButton}
            onPress={handlePunchPress}
          >
            <Ionicons
              name="finger-print"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* OTHERS MODAL */}
      <Modal transparent visible={othersModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Others onClose={() => setOthersModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* PUNCH MODAL */}
      <Modal transparent visible={punchingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentDark}>
            <TouchableOpacity
              style={styles.modalCloseButtonDark}
              onPress={() => setPunchingModalVisible(false)}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <AdminPunching />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { ...StyleSheet.absoluteFillObject },

  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(66,133,244,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#fff',
  },

  topLeftContainer: { position: 'absolute', top: 60, left: 20 },
  starterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 6,
  },
  cardIcon: { marginRight: 6 },
  starterText: { fontSize: 16, fontWeight: '700', color: '#333' },

  topRightContainer: { position: 'absolute', top: 60, right: 20 },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  navButton: { backgroundColor: '#1A1A1A' },

  bottomLeftContainer: { position: 'absolute', bottom: 40, left: 20 },
  othersCard: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  othersText: { fontSize: 11, fontWeight: '700', marginTop: 4 },

  bottomRightContainer: { position: 'absolute', bottom: 40, right: 20 },
  handButton: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#E67E22',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '100%',
  },
  modalContentDark: {
    backgroundColor: '#000',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseButtonDark: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#333',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default AdminHomeScreen;
