
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  RefreshControl,
  Animated,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // Added Import

const { width, height } = Dimensions.get('window');

const AddGeofenceScreen: React.FC = () => {
  const navigation = useNavigation(); // Added Hook
  const mapRef = useRef<MapView>(null);
  // Animation Value for Bottom Sheet (Slide Up)
  const slideAnim = useRef(new Animated.Value(300)).current;

  // State for Radius (in meters)
  const [radius, setRadius] = useState(100);
  
  // State for Map Region (Focus on Ranchi)
  const [region, setRegion] = useState({
    latitude: 23.357389,
    longitude: 85.311457,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // State for Form Inputs
  const [category, setCategory] = useState('');
  const [employee, setEmployee] = useState('');
  const [address, setAddress] = useState('');
  
  // State for Refreshing
  const [refreshing, setRefreshing] = useState(false);

  // 1. Bottom Sheet Entrance Animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Radius Handlers
  const increaseRadius = () => setRadius(prev => prev + 10);
  const decreaseRadius = () => setRadius(prev => (prev > 10 ? prev - 10 : prev));

  // Handle Region Change
  const onRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
  };

  // 2. Handle "Use Current Location" & Refresh
  const handleCurrentLocation = () => {
    setRefreshing(true);
    
    // Simulate fetching location (In real app, use Geolocation.getCurrentPosition)
    setTimeout(() => {
      const currentLat = 23.3441; // Example: New Ranchi Coords
      const currentLong = 85.3096;
      
      const newRegion = {
        ...region,
        latitude: currentLat,
        longitude: currentLong,
      };

      setRegion(newRegion);
      
      // Animate Map to new location
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      setRefreshing(false);
      Alert.alert("Location Updated", "Map moved to current location.");
    }, 1500);
  };

  // Pull-to-Refresh Handler
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate reloading data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* 1. MAP SECTION (Top Half) */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
        >
          <Marker coordinate={region} />
          <Circle 
            center={region}
            radius={radius}
            strokeColor="rgba(255, 127, 80, 0.8)"
            fillColor="rgba(255, 127, 80, 0.2)"
            strokeWidth={2}
          />
        </MapView>

        {/* Floating Search Bar */}
        <View style={styles.searchBar}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()} // Added onPress handler
          >
            <Icon name="arrow-back" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.searchText}>Search location</Text>
          <Icon name="location-sharp" size={24} color="#999" />
        </View>

        {/* Floating "Use current location" Button */}
        <TouchableOpacity 
          style={styles.currentLocationBtn} 
          onPress={handleCurrentLocation}
        >
          <MaterialIcons name="my-location" size={20} color="#FF7F50" />
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>
      </View>

      {/* 2. FORM SECTION (Bottom Sheet) */}
      {/* 3. KeyboardAvoidingView added to fix typing issue */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        {/* 4. Animated.View for Slide Up Animation */}
        <Animated.View 
          style={[
            styles.bottomSheetContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF7F50']} />
            }
          >
            
            {/* Selected Location Info */}
            <View style={styles.infoRow}>
              <Icon name="location-sharp" size={24} color="#FF7F50" style={styles.iconWidth} />
              <View>
                <Text style={styles.labelTitle}>Selected Location</Text>
                <Text style={styles.coordinateText}>
                  {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            {/* Employee Category */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MaterialIcons name="category" size={20} color="#FF7F50" style={styles.iconWidth} />
                <Text style={styles.labelTitle}>Employee Category</Text>
              </View>
              <TouchableOpacity style={styles.inputBox}>
                <Text style={category ? styles.inputText : styles.placeholderText}>
                  {category || 'Select Category'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Select Employees */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <FontAwesome5 name="users" size={18} color="#FF7F50" style={styles.iconWidth} />
                <Text style={styles.labelTitle}>Select Employees</Text>
              </View>
              <TouchableOpacity style={styles.inputBox}>
                <Text style={employee ? styles.inputText : styles.placeholderText}>
                  {employee || 'Select Employees'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Geo-fence Radius Control */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MaterialIcons name="radio-button-checked" size={20} color="#FF7F50" style={styles.iconWidth} />
                <Text style={styles.labelTitle}>Geo-fence Radius</Text>
              </View>
              
              <View style={styles.radiusControlContainer}>
                <TouchableOpacity onPress={decreaseRadius} style={styles.radiusBtn}>
                  <Text style={styles.radiusBtnText}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.radiusDisplay}>
                  <TextInput 
                    style={styles.radiusInput} 
                    value={radius.toString()} 
                    keyboardType="numeric"
                    editable={false} 
                  />
                </View>

                <TouchableOpacity onPress={increaseRadius} style={styles.radiusBtn}>
                  <Text style={styles.radiusBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.radiusUnitText}>{radius} meters</Text>
            </View>

            {/* Geofence Address Input - Fixed visibility */}
            <View style={styles.addressContainer}>
              <TextInput
                style={styles.addressInput}
                placeholder="Geofence Address"
                placeholderTextColor="#999"
                multiline
                value={address}
                onChangeText={setAddress}
                textAlignVertical="top" // Android fix for multiline
              />
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>

            {/* Extra padding for scrolling when keyboard is open */}
            <View style={{ height: 20 }} /> 
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddGeofenceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // MAP STYLES
  mapContainer: {
    height: height * 0.45,
    width: '100%',
    position: 'relative',
    zIndex: 1, // Ensure map stays behind sheet visually if needed
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  backBtn: {
    marginRight: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  currentLocationBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  currentLocationText: {
    color: '#FF7F50',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },

  // KEYBOARD & SHEET CONTAINER
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 25,
    elevation: 10, // Added shadow for better separation
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  iconWidth: {
    width: 30,
    textAlign: 'center',
    marginRight: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  coordinateText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  
  // Input Groups
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
  },
  inputText: {
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },

  // Radius Control
  radiusControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  radiusBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusBtnText: {
    fontSize: 24,
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  radiusDisplay: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  radiusInput: {
    fontSize: 16,
    color: '#FF7F50',
    fontWeight: 'bold',
    padding: 0,
    textAlign: 'center',
  },
  radiusUnitText: {
    textAlign: 'center',
    color: '#FF7F50',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },

  // Address Input
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    minHeight: 80, // Changed to minHeight for better expansion
    marginBottom: 25,
    backgroundColor: '#fff',
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'top', // Crucial for Android text area
    minHeight: 60,
  },

  // Confirm Button
  confirmButton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});