
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDeleteGeofence, useGetAllGeofences } from '../../../api/hook/company/deofence/useGeofence';
import { Geofence } from '../../../api/hook/type/geofence';

const { width, height } = Dimensions.get('window');

const GeoFencingScreen: React.FC = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  // Queries & Mutations
  const { data: geofencesData, isLoading, refetch } = useGetAllGeofences();
  const { mutate: deleteGeofence } = useDeleteGeofence();

  const geofences: Geofence[] = geofencesData?.data || [];

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 23.3601,
    longitude: 85.3250,
  });

  const [deltas, setDeltas] = useState({
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  });

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

  // Function to focus the map based on data or current location
  const focusMap = useCallback(() => {
    if (!mapRef.current) return;

    if (geofences.length > 0) {
      if (geofences.length === 1) {
        // Center on the single geofence
        mapRef.current.animateToRegion({
          latitude: geofences[0].latitude,
          longitude: geofences[0].longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }, 1000);
      } else {
        // Fit all geofences into view
        const coordinates = geofences.map(gf => ({
          latitude: gf.latitude,
          longitude: gf.longitude,
        }));
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }
    } else if (currentLocation) {
      // Fallback to current location if no geofences
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      }, 1000);
    }
  }, [geofences, currentLocation]);

  // Focus map when geofences data changes (refetch/reload)
  useEffect(() => {
    if (!isLoading) {
      focusMap();
    }
  }, [geofences, isLoading]);

  // Focus map when screen comes into focus (back navigation)
  useFocusEffect(
    useCallback(() => {
      focusMap();
    }, [focusMap])
  );

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

  const onUserLocationChange = (e: any) => {
    const { coordinate } = e.nativeEvent;
    if (coordinate) {
      setCurrentLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Geofence",
      "Are you sure you want to delete this geofence?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteGeofence(id, {
              onSuccess: (res) => {
                Alert.alert("Success", res.message || "Geofence deleted");
              },
              onError: (err: any) => {
                Alert.alert("Error", err?.response?.data?.message || "Delete failed");
              }
            });
          }
        }
      ]
    );
  };

  const renderGeofenceItem = ({ item }: { item: Geofence }) => (
    <View style={styles.listItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>
          Radius: {item.radius}m | Lat: {item.latitude.toFixed(4)}, Lng: {item.longitude.toFixed(4)}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => (navigation.navigate as any)('AddGeofenceScreen', { geofence: item })}
        >
          <MaterialIcons name="edit" size={22} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <MaterialIcons name="delete" size={22} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          showsUserLocation={true}
          onUserLocationChange={onUserLocationChange}
          initialRegion={{
            ...currentLocation,
            ...deltas
          }}
        >
          {geofences.map((gf) => (
            <React.Fragment key={gf.id}>
              <Marker 
                coordinate={{ latitude: gf.latitude, longitude: gf.longitude }}
                title={gf.name}
              />
              <Circle 
                center={{ latitude: gf.latitude, longitude: gf.longitude }}
                radius={gf.radius}
                strokeColor="rgba(255, 127, 80, 0.8)"
                fillColor="rgba(255, 127, 80, 0.2)"
                strokeWidth={2}
              />
            </React.Fragment>
          ))}
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
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF7F50" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={geofences}
            keyExtractor={(item) => item.id}
            renderItem={renderGeofenceItem}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
                No geofences found.
              </Text>
            }
            refreshing={isLoading}
            onRefresh={refetch}
          />
        )}
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