
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { SettingsStackParamList } from '../src/navigation/SettingsStackNavigator';

const { height } = Dimensions.get('window');

// --- Types for Menu Items ---
type MenuItemType = 'navigation' | 'toggle';

interface MenuItemProps {
  id: string;
  title: string;
  type: MenuItemType;
  value?: boolean; // For toggles
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  icon: string;      // Added Icon Name
  iconColor: string; // Added Background Color for Icon
}

const ProfileScreen = () => {
  // --- Navigation ---
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  // --- State for Profile Image ---
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // --- State for Toggles ---
  const [toggles, setToggles] = useState({
    leaveSystem: false,
    faceAttendance: false,
    expenseSystem: false,
    geoFencing: false,
    customSalary: false,
  });

  // --- Animation Values ---
  const scrollY = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditProfilePicture = () => {
    Alert.alert(
      "Change Profile Photo",
      "Choose an option to update your profile picture",
      [
        {
          text: "Camera",
          onPress: () => console.log("Launch Camera Logic Here"),
        },
        {
          text: "Choose from Library",
          onPress: () => {
            setProfileImage("https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop");
            Alert.alert("Success", "Profile picture updated!");
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // --- Menu Data List (Added Icons & Colors) ---
  const menuItems: MenuItemProps[] = [
    { 
      id: '1', 
      title: 'Your Personal Details', 
      type: 'navigation', 
      icon: 'person', 
      iconColor: '#007AFF' 
    },
    { 
      id: '2', 
      title: 'Company Shifts', 
      type: 'navigation', 
      icon: 'time', 
      iconColor: '#FF9500' 
    },
    { 
      id: '3', 
      title: 'Payroll Configurations', 
      type: 'navigation', 
      icon: 'settings', 
      iconColor: '#8E8E93' 
    },
    {
      id: '4',
      title: 'Leave System',
      type: 'toggle',
      value: toggles.leaveSystem,
      onToggle: () => handleToggle('leaveSystem'),
      icon: 'calendar',
      iconColor: '#FF3B30'
    },
    {
      id: '5',
      title: 'Fingerprint Attendance',
      type: 'toggle',
      value: toggles.faceAttendance,
      onToggle: () => handleToggle('faceAttendance'),
      icon: 'finger-print', // Changed from 'scan' to 'finger-print'
      iconColor: '#34C759'
    },
    {
      id: '6',
      title: 'Expense System',
      type: 'toggle',
      value: toggles.expenseSystem,
      onToggle: () => handleToggle('expenseSystem'),
      icon: 'wallet',
      iconColor: '#5856D6'
    },
    { 
      id: '7', 
      title: 'Expense Types', 
      type: 'navigation', 
      icon: 'list', 
      iconColor: '#AF52DE' 
    },
    {
      id: '8',
      title: 'Geo Fencing',
      type: 'toggle',
      value: toggles.geoFencing,
      onToggle: () => handleToggle('geoFencing'),
      icon: 'location',
      iconColor: '#00C7BE'
    },
    { 
      id: '9', 
      title: 'Geo Fencing Locations', 
      type: 'navigation', 
      icon: 'map', 
      iconColor: '#30B0C7' 
    },
    {
      id: '10',
      title: 'Custom Daywise Salary',
      type: 'toggle',
      value: toggles.customSalary,
      onToggle: () => handleToggle('customSalary'),
      icon: 'cash', 
      iconColor: '#FFCC00'
    },
    { 
      id: '11', 
      title: 'Holidays', 
      type: 'navigation', 
      icon: 'airplane', 
      iconColor: '#5AC8FA' 
    },
    { 
      id: '12', 
      title: 'Pay Slips', 
      type: 'navigation', 
      icon: 'document-text', 
      iconColor: '#A2845E' 
    },
  ];

  // --- Animations Interpolation ---
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Background with Overlay */}
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../src/assets/profile.jpg')} 
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={3} 
        >
          <View style={styles.whiteOverlay} />
        </ImageBackground>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* --- Header Section (Profile Pic & Title) --- */}
        <View style={styles.headerContainer}>
          <Animated.View style={{ opacity: headerOpacity }}>
            <Text style={styles.headerTitle}>
              Your Info.
            </Text>
          </Animated.View>

          {/* Profile Picture Container with Animation */}
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                transform: [
                  { scale: imageScale },
                  { translateY: imageTranslateY },
                ],
                opacity: headerOpacity,
              },
            ]}
          >
            <TouchableOpacity onPress={handleEditProfilePicture} activeOpacity={0.9}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.placeholderText}>MS</Text>
                </View>
              )}
              
              {/* Camera/Edit Badge */}
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          {/* USER NAME & ROLE - CENTERED */}
          <Animated.View style={{ opacity: headerOpacity, alignItems: 'center', width: '100%' }}>
             <Text style={styles.userName}>Md. Saif</Text>
             {/* <Text style={styles.userRole}>Full Stack Developer</Text> */}
          </Animated.View>
        </View>

        {/* --- SHEET ANIMATION CONTAINER --- */}
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* --- Menu Items List --- */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === 0 && styles.firstMenuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem,
                  index !== menuItems.length - 1 && styles.menuBorder,
                ]}
                onPress={() => {
                  if (item.type === 'navigation') {
                    if (item.title === 'Your Personal Details') {
                      navigation.navigate('PersonalDetails');
                    } else if (item.title === 'Payroll Configurations') {
                      navigation.navigate('PayConfigurations');
                    } else if (item.title === 'Company Shifts') {
                      navigation.navigate('ConpanyShifts');
                    } else if (item.title === 'Holidays') {
                      navigation.navigate('HolidaysScreen');
                    } else if (item.title === 'Pay Slips') {
                      navigation.navigate('PaySlipsScreen');
                    } else if (item.title === 'Expense Types') {
                      navigation.navigate('ExpenseTypes');
                    } else if (item.title === 'Geo Fencing Locations') {
                      navigation.navigate('GeoFencingLocations');
                    } else {
                      Alert.alert('Navigation', `Go to ${item.title}`);
                    }
                  } else {
                    item.onToggle && item.onToggle(!item.value);
                  }
                }}
                activeOpacity={item.type === 'toggle' ? 1 : 0.7}
              >
                {/* --- Added Icon Wrapper --- */}
                <View style={[styles.iconWrapper, { backgroundColor: item.iconColor }]}>
                  <Ionicons name={item.icon} size={18} color="#FFF" />
                </View>

                <Text style={styles.menuText}>{item.title}</Text>

                <View style={styles.rightAction}>
                  {item.type === 'toggle' ? (
                    <Switch
                      trackColor={{ false: '#D1D1D6', true: '#E0E0E0' }}
                      thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                      ios_backgroundColor="#D1D1D6"
                      onValueChange={item.onToggle}
                      value={item.value}
                      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#C7C7CC"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* --- Logout Button --- */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => Alert.alert('Logout', 'Logging out...')}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* --- Footer Info --- */}
          <View style={styles.footerContainer}>
            <Text style={styles.versionText}>Version 0.0.80 PATCH 1</Text>
            <Text style={styles.companyText}>
              A cloud product of SYMBOSYS PVT LTD
            </Text>
          </View>

          {/* Extra bottom padding within the sheet */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  // --- Header ---
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center', // Ensures vertical centering if needed
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // --- Avatar Styling ---
  avatarContainer: {
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#888',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF', // Blue badge
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginTop: 3,
    textAlign: 'center', // Explicit center alignment for text
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center', // Explicit center alignment for text
  },

  // --- SHEET STYLES ---
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    paddingHorizontal: 0,
    minHeight: height * 0.7,
    // elevation: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // marginTop: 10,
  },

  // --- Menu List ---
  menuContainer: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1ff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    height: 60,
  },
  firstMenuItem: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lastMenuItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  // --- New Icon Style ---
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  // --- Logout Button ---
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '700',
  },

  // --- Footer ---
  footerContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen;