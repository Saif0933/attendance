import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const GeoFencingScreen: React.FC = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  // Initial Region (Focused on Ranchi/Kadru area as per your image)
  const [region, setRegion] = useState({
    latitude: 23.3601, // Approx location near Astha Hospital/Susi Pizza
    longitude: 85.3250,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  });

  // Zoom In Function
  const handleZoomIn = () => {
    mapRef.current?.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  // Zoom Out Function
  const handleZoomOut = () => {
    mapRef.current?.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
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
          provider={PROVIDER_GOOGLE} // Uses Google Maps
          style={styles.map}
          region={region}
          onRegionChangeComplete={(r) => setRegion(r)}
          showsUserLocation={true}
          showsMyLocationButton={false} // Hiding default button to use custom UI
        >
          {/* Example Marker (Center of map) */}
          <Marker coordinate={region} />
        </MapView>

        {/* Zoom Controls Overlay */}
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
          
          {/* Text Info */}
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>N/A</Text>
            <Text style={styles.itemSubtitle}>Radius: 20 meters</Text>
          </View>

          {/* Action Buttons */}
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
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
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
  
  // Map Styles
  mapContainer: {
    height: height * 0.55, // Takes up about 55% of the screen height
    width: '100%',
    position: 'relative',
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

  // List Item Styles
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
    // Optional: Border bottom if you plan to have multiple items
    // borderBottomWidth: 1,
    // borderBottomColor: '#f0f0f0',
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