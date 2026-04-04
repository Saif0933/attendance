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
import { useTheme } from '../../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }
];

const GeoFencingScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
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
    <View style={[styles.listItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
          Radius: {item.radius}m | Lat: {item.latitude.toFixed(4)}, Lng: {item.longitude.toFixed(4)}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9' }]} 
          onPress={() => (navigation.navigate as any)('AddGeofenceScreen', { geofence: item })}
        >
          <MaterialIcons name="edit" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}
          onPress={() => handleDelete(item.id)}
        >
          <MaterialIcons name="delete" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Geo Fencing Locations
        </Text>
        
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AddGeofenceScreen' as never)}>
          <Icon name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* MAP SECTION */}
      <View style={[styles.mapContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={isDark ? DARK_MAP_STYLE : []}
          showsUserLocation={true}
          onUserLocationChange={onUserLocationChange}
          loadingEnabled
          loadingIndicatorColor={colors.primary}
          loadingBackgroundColor={isDark ? '#242f3e' : '#FFFFFF'}
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
                strokeColor={colors.primary}
                fillColor={isDark ? `${colors.primary}20` : `${colors.primary}30`}
                strokeWidth={2}
              />
            </React.Fragment>
          ))}
        </MapView>

        {/* Zoom Controls */}
        <View style={[styles.zoomControls, { backgroundColor: colors.surface, borderColor: colors.border, shadowOpacity: isDark ? 0.4 : 0.2 }]}>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
            <Icon name="add" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
            <Icon name="remove" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST SECTION */}
      <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList 
            data={geofences}
            keyExtractor={(item) => item.id}
            renderItem={renderGeofenceItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <MaterialIcons name="location-off" size={60} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, marginTop: 10, fontSize: 16 }}>No Geofences available</Text>
              </View>
            }
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
  },
  zoomBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1.5,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  deleteBtn: {
  },
});