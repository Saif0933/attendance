
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PermissionsAndroid, // Import for permissions
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const GeoFencingScreen: React.FC = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  // User ki current location store karne ke liye state
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 23.3601, // Default fallback
    longitude: 85.3250,
  });

  // Zoom level maintain karne ke liye
  const [deltas, setDeltas] = useState({
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  });

  // 1. App start hote hi Permission maangna zaroori hai
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "App needs access to your location to show it on the map.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "Location tracking won't work without permission.");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();
  }, []);

  // 2. Zoom In Function
  const handleZoomIn = () => {
    const newDeltas = {
      latitudeDelta: deltas.latitudeDelta / 2,
      longitudeDelta: deltas.longitudeDelta / 2,
    };
    setDeltas(newDeltas);
    mapRef.current?.animateToRegion({
      ...currentLocation,
      ...newDeltas,
    });
  };

  // 3. Zoom Out Function
  const handleZoomOut = () => {
    const newDeltas = {
      latitudeDelta: deltas.latitudeDelta * 2,
      longitudeDelta: deltas.longitudeDelta * 2,
    };
    setDeltas(newDeltas);
    mapRef.current?.animateToRegion({
      ...currentLocation,
      ...newDeltas,
    });
  };

  // 4. Jab user ki location change ho (sabse important function)
  const onUserLocationChange = (e: any) => {
    const { coordinate } = e.nativeEvent;
    if (coordinate) {
      setCurrentLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      // Map ko smoothly wahan le jao (Lock effect)
      mapRef.current?.animateToRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: deltas.latitudeDelta,
        longitudeDelta: deltas.longitudeDelta,
      }, 500); // 500ms animation speed
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          Geo Fencing Locations
        </Text>
        
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AddGeofenceScreen' as never)}>
          <Icon name="add" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* MAP SECTION */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          
          // User Location Settings
          showsUserLocation={true} // Blue dot dikhata hai
          showsMyLocationButton={true} // My Location button wapas laya hu debug ke liye
          followsUserLocation={true} // iOS ke liye helper
          
          // Event Listener: Jab user move karega
          onUserLocationChange={onUserLocationChange}
          
          // Initial Region (Bas shuruat ke liye)
          initialRegion={{
            ...currentLocation,
            ...deltas
          }}
        >
          {/* MARKER: Ab yeh "currentLocation" state se juda hai.
             Jaise hi onUserLocationChange chalega, state badlegi aur marker move karega.
          */}
          <Marker 
            coordinate={currentLocation} 
            title={"You are here"}
          />
        </MapView>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
            <Icon name="add" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
            <Icon name="remove" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST ITEM SECTION */}
      <View style={styles.listContainer}>
        <View style={styles.listItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Current Location</Text>
            <Text style={styles.itemSubtitle}>
              Lat: {currentLocation.latitude.toFixed(4)}, Lng: {currentLocation.longitude.toFixed(4)}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddGeofenceScreen' as never)}>
              <MaterialIcons name="edit" size={22} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]}>
              <MaterialIcons name="delete" size={22} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default GeoFencingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginLeft: 15,
  },
  iconButton: {
    padding: 5,
  },
  mapContainer: {
    height: height * 0.55,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  zoomBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#eee',
    width: '80%',
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 10,
  },
  deleteBtn: {
    marginLeft: 5,
  },
});