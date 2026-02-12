import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCreateGeofence, useGetGeofenceById, useUpdateGeofence } from '../../../api/hook/company/deofence/useGeofence';
import { Geofence } from '../../../api/hook/type/geofence';
import { useGetAllEmployees } from '../../employee/hook/useEmployee';
import { EmployeeListItem } from '../../employee/type/employee';

const { width, height } = Dimensions.get('window');

const AddGeofenceScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const editingGeofence = (route.params as { geofence?: Geofence })?.geofence;
  
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Mutations
  const { mutate: createGeofence, isPending: isCreating } = useCreateGeofence();
  const { mutate: updateGeofence, isPending: isUpdating } = useUpdateGeofence();

  // Fetch Employees
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetAllEmployees();

  // State for Radius (in meters)
  const [radius, setRadius] = useState(editingGeofence?.radius || 100);
  
  // State for Map Region
  const [region, setRegion] = useState({
    latitude: editingGeofence?.latitude || 23.3441,
    longitude: editingGeofence?.longitude || 85.3096,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // State for User's live location (Blue dot)
  const [userLocation, setUserLocation] = useState<any>(null);

  // State for Form Inputs
  const [address, setAddress] = useState(editingGeofence?.name || '');
  
  // Fetch current Geofence Details if editing
  const { data: geofenceDetailsResponse } = useGetGeofenceById(editingGeofence?.id || "");
  const geofenceDetails = geofenceDetailsResponse?.data;

  // State for Employee Selection
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  
  // Update state when geofence details are loaded
  useEffect(() => {
    if (geofenceDetails?.employees) {
      setSelectedEmployeeIds(geofenceDetails.employees.map((emp: any) => emp.id));
    } else if (editingGeofence?.employees) {
       setSelectedEmployeeIds(editingGeofence.employees.map((emp: any) => emp.id));
    }
  }, [geofenceDetails, editingGeofence]);

  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  
  const [refreshing, setRefreshing] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    requestPermission();
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
  };

  const increaseRadius = () => setRadius(prev => prev + 10);
  const decreaseRadius = () => setRadius(prev => (prev > 10 ? prev - 10 : prev));

  const onRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
  };

  const onUserLocationChange = (e: any) => {
    setUserLocation(e.nativeEvent.coordinate);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'AttendanceApp/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      Alert.alert("Geocoding Error", "Could not get address for this location.");
      setAddress(`Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleCurrentLocation = () => {
    if (userLocation) {
      const newRegion = {
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      reverseGeocode(userLocation.latitude, userLocation.longitude);
    } else {
      Alert.alert("Error", "Unable to get current location. Please ensure location services are on.");
    }
  };

  useEffect(() => {
    if (userLocation && !hasCentered && !editingGeofence) {
      const newRegion = {
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      reverseGeocode(userLocation.latitude, userLocation.longitude);
      setHasCentered(true);
    }
  }, [userLocation, hasCentered, editingGeofence]);

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAllEmployees = () => {
    if (employeesData?.data?.employees) {
      const allIds = employeesData.data.employees.map((emp) => emp.id);
      setSelectedEmployeeIds(allIds);
    }
  };

  const handleClearAllEmployees = () => {
    setSelectedEmployeeIds([]);
  };

  const handleConfirm = () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please provide a geofence name/address.");
      return;
    }

    const payload = {
      name: address,
      latitude: region.latitude,
      longitude: region.longitude,
      radius: radius,
      employeeIds: selectedEmployeeIds,
    };

    if (editingGeofence) {
      updateGeofence(
        { id: editingGeofence.id, payload },
        {
          onSuccess: (response) => {
            Alert.alert("Success", response.message || "Geofence updated successfully");
            navigation.goBack();
          },
          onError: (error: any) => {
            Alert.alert("Error", error?.response?.data?.message || "Failed to update geofence");
          },
        }
      );
    } else {
      createGeofence(payload, {
        onSuccess: (response) => {
          Alert.alert("Success", response.message || "Geofence created successfully");
          navigation.goBack();
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.message || "Failed to create geofence");
        },
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const isLoading = isCreating || isUpdating;

  const renderEmployeeItem = ({ item }: { item: EmployeeListItem }) => {
    const isSelected = selectedEmployeeIds.includes(item.id);
    return (
      <TouchableOpacity 
        style={[styles.employeeItem, isSelected && styles.selectedEmployeeItem]} 
        onPress={() => toggleEmployeeSelection(item.id)}
      >
        <Image 
          source={{ uri: item.profilePicture?.url || 'https://via.placeholder.com/50' }} 
          style={styles.employeeImage} 
        />
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.firstname} {item.lastname}</Text>
          <Text style={styles.employeeDesignation}>{item.designation || 'No Designation'}</Text>
        </View>
        {isSelected && (
          <Icon name="checkmark-circle" size={24} color="#FF7F50" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* 1. MAP SECTION */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          onUserLocationChange={onUserLocationChange}
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

        <View style={styles.searchBar}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.searchText}>Search location</Text>
          <Icon name="location-sharp" size={24} color="#999" />
        </View>

        <TouchableOpacity 
          style={styles.currentLocationBtn} 
          onPress={handleCurrentLocation}
        >
          <MaterialIcons name="my-location" size={20} color="#FF7F50" />
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>
      </View>

      {/* 2. FORM SECTION */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
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
            
            <View style={styles.infoRow}>
              <Icon name="location-sharp" size={24} color="#FF7F50" style={styles.iconWidth} />
              <View>
                <Text style={styles.labelTitle}>Selected Location</Text>
                <Text style={styles.coordinateText}>
                  {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MaterialIcons name="radio-button-checked" size={20} color="#FF7F50" style={styles.iconWidth} />
                <Text style={styles.labelTitle}>Geo-fence Radius (meters)</Text>
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
                    onChangeText={(text) => setRadius(Number(text) || 0)}
                  />
                </View>

                <TouchableOpacity onPress={increaseRadius} style={styles.radiusBtn}>
                  <Text style={styles.radiusBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.radiusUnitText}>{radius} meters</Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MaterialIcons name="edit-location" size={20} color="#FF7F50" style={styles.iconWidth} />
                <Text style={styles.labelTitle}>Geofence Name / Address</Text>
              </View>
              <View style={[styles.addressContainer, isReverseGeocoding && { opacity: 0.6 }]}>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Enter geofence name or address"
                  placeholderTextColor="#999"
                  multiline
                  value={address}
                  onChangeText={setAddress}
                  textAlignVertical="top"
                />
                {isReverseGeocoding && (
                  <ActivityIndicator size="small" color="#FF7F50" style={styles.loaderInside} />
                )}
              </View>
            </View>

            {/* Employee Selection Section */}
            <View style={styles.inputGroup}>
              <TouchableOpacity 
                style={styles.employeeSelectorBtn} 
                onPress={() => setIsEmployeeModalVisible(true)}
              >
                <View style={styles.labelRow}>
                  <MaterialIcons name="people" size={20} color="#FF7F50" style={styles.iconWidth} />
                  <Text style={styles.labelTitle}>Assigned Employees</Text>
                </View>
                <View style={styles.employeeCountBadge}>
                  <Text style={styles.employeeCountText}>{selectedEmployeeIds.length} Selected</Text>
                  <Icon name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.confirmButton, isLoading && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  {editingGeofence ? "Update Geofence" : "Save Geofence"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ height: 20 }} /> 
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Employee Selection Modal */}
      <Modal
        visible={isEmployeeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEmployeeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Employees</Text>
              <TouchableOpacity onPress={() => setIsEmployeeModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleSelectAllEmployees} style={styles.actionLink}>
                <Text style={styles.actionLinkText}>Select All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearAllEmployees} style={styles.actionLink}>
                <Text style={styles.actionLinkText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {isLoadingEmployees ? (
              <ActivityIndicator size="large" color="#FF7F50" style={styles.loader} />
            ) : (
              <FlatList
                data={employeesData?.data?.employees || []}
                keyExtractor={(item) => item.id}
                renderItem={renderEmployeeItem}
                contentContainerStyle={styles.employeeList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No employees found</Text>
                }
              />
            )}
            
            <TouchableOpacity 
              style={styles.modalConfirmBtn} 
              onPress={() => setIsEmployeeModalVisible(false)}
            >
              <Text style={styles.modalConfirmBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    minHeight: 80,
    marginBottom: 25,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'top',
    minHeight: 60,
    paddingTop: 10,
  },
  loaderInside: {
    marginTop: 15,
    marginLeft: 10,
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

  // Employee Selection Styles
  employeeSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  employeeCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeCountText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    gap: 15,
  },
  actionLink: {
    padding: 5,
  },
  actionLinkText: {
    color: '#FF7F50',
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  employeeList: {
    paddingBottom: 20,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedEmployeeItem: {
    backgroundColor: '#FFF0E6',
  },
  employeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  employeeDesignation: {
    fontSize: 13,
    color: '#777',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
  modalConfirmBtn: {
    backgroundColor: '#FF7F50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalConfirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});