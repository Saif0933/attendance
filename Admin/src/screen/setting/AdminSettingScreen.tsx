

// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Switch,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// // Adjust this import path to point to your actual Stack.tsx file
// import { RootStackParamList } from '../../../../src/navigation/Stack';

// const { height } = Dimensions.get('window');

// // --- Types for Menu Items ---
// type MenuItemType = 'navigation' | 'toggle';

// interface MenuItemProps {
//   id: string;
//   title: string;
//   subtitle?: string; 
//   type: MenuItemType;
//   value?: boolean; // For toggles
//   onToggle?: (val: boolean) => void;
//   onPress?: () => void;
//   icon: string;
//   iconColor: string;
//   rightText?: string; 
// }

// const AdminSettingScreen = () => {
//   // --- Navigation ---
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
//   // --- State for Profile Image ---
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   // --- State for Toggles ---
//   const [toggles, setToggles] = useState({
//     leaveSystem: true,
//     faceAttendance: true,
//     expenseSystem: true,
//     geoFencing: true,
//     customSalary: false,
//     salaryHistory: true,      
//     staffNotification: true,  
//     whatsappReport: true,     
//   });

//   // --- Animation Values ---
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(300)).current;

//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 600,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleToggle = (key: keyof typeof toggles) => {
//     setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleEditProfilePicture = () => {
//     Alert.alert("Change Profile Photo", "Choose an option", [
//         { text: "Camera", onPress: () => console.log("Camera") },
//         { text: "Cancel", style: "cancel" }
//     ]);
//   };

//   // --- Menu Data List ---
//   const menuItems: MenuItemProps[] = [
//     { 
//       id: '1', 
//       title: 'Your Personal Details', 
//       type: 'navigation', 
//       icon: 'person', 
//       iconColor: '#3B82F6' 
//     },
//     { 
//       id: '1.5', 
//       title: 'Company Details', 
//       type: 'navigation', 
//       icon: 'business', 
//       iconColor: '#6366F1' // Indigo
//     },
//     { 
//       id: '2', 
//       title: 'Company Shifts', 
//       type: 'navigation', 
//       icon: 'time', 
//       iconColor: '#F59E0B' 
//     },
//     { 
//       id: '3', 
//       title: 'Payroll Configurations', 
//       type: 'navigation', 
//       icon: 'settings', 
//       iconColor: '#64748B' 
//     },
//     { 
//       id: '3.5', 
//       title: 'Designations & Permissions', 
//       type: 'navigation', 
//       icon: 'shield-checkmark', 
//       iconColor: '#EC4899' // Pink
//     },
//     {
//       id: '4',
//       title: 'Leave System',
//       type: 'toggle',
//       value: toggles.leaveSystem,
//       onToggle: () => handleToggle('leaveSystem'),
//       icon: 'calendar',
//       iconColor: '#EF4444' 
//     },
//     // --- UPDATED: Icon changed back to 'finger-print' ---
//     {
//       id: '5',
//       title: 'Face Attendance',
//       type: 'toggle',
//       value: toggles.faceAttendance,
//       onToggle: () => handleToggle('faceAttendance'),
//       icon: 'finger-print', // Changed from 'scan'
//       iconColor: '#10B981' 
//     },
//     {
//       id: '6',
//       title: 'Expense System',
//       type: 'toggle',
//       value: toggles.expenseSystem,
//       onToggle: () => handleToggle('expenseSystem'),
//       icon: 'wallet',
//       iconColor: '#8B5CF6' 
//     },
//     { 
//       id: '7', 
//       title: 'Expense Types', 
//       type: 'navigation', 
//       icon: 'list', 
//       iconColor: '#D946EF' 
//     },
//     {
//       id: '8',
//       title: 'Geo Fencing',
//       type: 'toggle',
//       value: toggles.geoFencing,
//       onToggle: () => handleToggle('geoFencing'),
//       icon: 'location',
//       iconColor: '#14B8A6' 
//     },
//     { 
//       id: '9', 
//       title: 'Geo Fencing Locations', 
//       type: 'navigation', 
//       icon: 'map', 
//       iconColor: '#06B6D4' 
//     },
//     {
//       id: '10',
//       title: 'Custom Daywise Salary',
//       type: 'toggle',
//       value: toggles.customSalary,
//       onToggle: () => handleToggle('customSalary'),
//       icon: 'cash', 
//       iconColor: '#EAB308' 
//     },
//     {
//         id: '10.5',
//         title: 'Maintain Salary Payment History',
//         type: 'toggle',
//         value: toggles.salaryHistory,
//         onToggle: () => handleToggle('salaryHistory'),
//         icon: 'refresh-circle', 
//         iconColor: '#84CC16' // Lime
//     },
//     { 
//       id: '11', 
//       title: 'Holidays', 
//       type: 'navigation', 
//       icon: 'airplane', 
//       iconColor: '#0EA5E9' 
//     },
//     { 
//         id: '11.5', 
//         title: 'Reports', 
//         type: 'navigation', 
//         icon: 'stats-chart', 
//         iconColor: '#A8A29E' 
//     },
//     {
//         id: '12',
//         title: 'Staff Punch Notification',
//         subtitle: 'Get notified about the in/out of your staff as soon as they punch in/out.',
//         type: 'toggle',
//         value: toggles.staffNotification,
//         onToggle: () => handleToggle('staffNotification'),
//         icon: 'notifications', 
//         iconColor: '#F97316' // Orange
//     },
//     {
//         id: '13',
//         title: 'WhatsApp Report',
//         subtitle: 'Get daily attendance report of your staff on WhatsApp at the end of the day.',
//         rightText: '20:00',
//         type: 'toggle',
//         value: toggles.whatsappReport,
//         onToggle: () => handleToggle('whatsappReport'),
//         icon: 'logo-whatsapp', 
//         iconColor: '#25D366' // WhatsApp Green
//     },
//   ];

//   // --- Animations Interpolation ---
//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0],
//     extrapolate: 'clamp',
//   });

//   const imageScale = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.6],
//     extrapolate: 'clamp',
//   });

//   const imageTranslateY = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [0, -50],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

//       {/* Background with Overlay */}
//       <View style={styles.backgroundContainer}>
//         <ImageBackground
//           source={require('../../../../src/assets/profile.jpg')} 
//           style={styles.backgroundImage}
//           resizeMode="cover"
//           blurRadius={5} 
//         >
//           <View style={styles.darkOverlay} />
//         </ImageBackground>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//       >
//         {/* --- Header Section (Profile Pic & Title) --- */}
//         <View style={styles.headerContainer}>
//           <Animated.View style={{ opacity: headerOpacity }}>
//             <Text style={styles.headerTitle}>
//               Your Info.
//             </Text>
//           </Animated.View>

//           {/* Profile Picture Container with Animation */}
//           <Animated.View
//             style={[
//               styles.avatarContainer,
//               {
//                 transform: [
//                   { scale: imageScale },
//                   { translateY: imageTranslateY },
//                 ],
//                 opacity: headerOpacity,
//               },
//             ]}
//           >
//             <TouchableOpacity onPress={handleEditProfilePicture} activeOpacity={0.9}>
//               {profileImage ? (
//                 <Image source={{ uri: profileImage }} style={styles.avatarImage} />
//               ) : (
//                 <View style={styles.placeholderAvatar}>
//                   <Text style={styles.placeholderText}>MS</Text>
//                 </View>
//               )}
              
//               <View style={styles.editBadge}>
//                 <Ionicons name="camera" size={14} color="#FFF" />
//               </View>
//             </TouchableOpacity>
//           </Animated.View>
          
//           <Animated.View style={{ opacity: headerOpacity, alignItems: 'center', width: '100%' }}>
//              <Text style={styles.userName}>Md. Saif</Text>
//           </Animated.View>
//         </View>

//         {/* --- SHEET ANIMATION CONTAINER --- */}
//         <Animated.View
//           style={[
//             styles.sheetContainer,
//             { transform: [{ translateY: slideAnim }] },
//           ]}
//         >
//           {/* --- Menu Items List --- */}
//           <View style={styles.menuContainer}>
//             {menuItems.map((item, index) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={[
//                   styles.menuItem,
//                   index === 0 && styles.firstMenuItem,
//                   index === menuItems.length - 1 && styles.lastMenuItem,
//                   index !== menuItems.length - 1 && styles.menuBorder,
//                   // Add height auto if there is a subtitle
//                   item.subtitle ? { height: 'auto', paddingVertical: 15 } : {}
//                 ]}
//                 onPress={() => {
//                   if (item.type === 'navigation') {
//                     // Add your navigation logic here based on new titles
//                     switch(item.title) {
//                         case 'Company Details':
//                             // navigation.navigate('CompanyDetails');
//                             break;
//                         default:
//                             // Existing logic
//                             break;
//                     }
//                   } else {
//                     item.onToggle && item.onToggle(!item.value);
//                   }
//                 }}
//                 activeOpacity={item.type === 'toggle' ? 1 : 0.7}
//               >
//                 {/* --- Icon Wrapper --- */}
//                 <View style={[styles.iconWrapper, { backgroundColor: item.iconColor }]}>
//                   <Ionicons name={item.icon} size={18} color="#FFF" />
//                 </View>

//                 {/* --- Text Container (Title + Subtitle) --- */}
//                 <View style={styles.textContainer}>
//                     <Text style={styles.menuText}>{item.title}</Text>
//                     {item.subtitle && (
//                         <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
//                     )}
//                 </View>

//                 {/* --- Right Actions (Toggle/Arrow + Optional Text) --- */}
//                 <View style={styles.rightAction}>
//                   {item.rightText && (
//                     <Text style={styles.rightInfoText}>{item.rightText}</Text>
//                   )}

//                   {item.type === 'toggle' ? (
//                     <Switch
//                       trackColor={{ false: '#334155', true: '#3B82F6' }}
//                       thumbColor={'#FFFFFF'}
//                       ios_backgroundColor="#334155"
//                       onValueChange={item.onToggle}
//                       value={item.value}
//                       style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], marginLeft: 8 }}
//                     />
//                   ) : (
//                     <Ionicons
//                       name="chevron-forward"
//                       size={20}
//                       color="#64748B"
//                     />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>

//             {/* --- NEW: INVITE EMPLOYEES SECTION --- */}
//             <View style={styles.inviteSection}>
//                 <Text style={styles.inviteHeader}>Invite Employees</Text>
//                 <View style={styles.inviteCard}>
//                     <View>
//                         <Text style={styles.inviteLabel}>Company Code</Text>
//                         <Text style={styles.inviteCode}>5ZUFU</Text>
//                     </View>
//                     <View style={styles.inviteActions}>
//                         <TouchableOpacity style={styles.iconButton}>
//                             <Ionicons name="copy-outline" size={20} color="#fff" />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.iconButton}>
//                             <Ionicons name="share-social-outline" size={20} color="#fff" />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>

//           {/* --- Logout Button --- */}
//           <TouchableOpacity
//             style={styles.logoutButton}
//             onPress={() => Alert.alert('Logout', 'Logging out...')}
//           >
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           {/* --- Footer Info --- */}
//           <View style={styles.footerContainer}>
//             <Text style={styles.versionText}>Version 0.0.80 PATCH 1</Text>
//             <Text style={styles.companyText}>
//               A cloud product of SYMBOSYS PVT LTD
//             </Text>
//           </View>

//           {/* Extra bottom padding */}
//           <View style={{ height: 40 }} />
//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0F172A',
//   },
//   backgroundContainer: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: -1,
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   darkOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(15, 23, 42, 0.9)',
//   },
//   scrollContent: {
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   // --- Header ---
//   headerContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center', 
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#fff',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   avatarContainer: {
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   avatarImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#1E293B',
//   },
//   placeholderAvatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#334155',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#1E293B',
//   },
//   placeholderText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   editBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#3B82F6',
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#1E293B',
//   },
//   userName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#fff',
//     marginTop: 3,
//     textAlign: 'center', 
//   },

//   // --- SHEET STYLES ---
//   sheetContainer: {
//     backgroundColor: '#0F172A',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingTop: 25,
//     minHeight: height * 0.7,
//   },
//   menuContainer: {
//     marginHorizontal: 16,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center', 
//     backgroundColor: '#1E293B',
//     paddingHorizontal: 20,
//     paddingVertical: 18,
//     minHeight: 60,
//   },
//   firstMenuItem: {
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   lastMenuItem: {
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   menuBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#334155',
//   },
//   iconWrapper: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   textContainer: {
//       flex: 1,
//       justifyContent: 'center',
//   },
//   menuText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   menuSubtitle: {
//       fontSize: 12,
//       color: '#94A3B8', 
//       marginTop: 4,
//       lineHeight: 16,
//   },
//   rightAction: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   rightInfoText: {
//       color: '#3B82F6', 
//       fontSize: 14,
//       fontWeight: '600',
//       marginRight: 4,
//   },

//   // --- Invite Section Styles ---
//   inviteSection: {
//       marginTop: 25,
//       marginHorizontal: 16,
//   },
//   inviteHeader: {
//       color: '#fff',
//       fontSize: 16,
//       fontWeight: '700',
//       marginBottom: 10,
//       marginLeft: 4,
//   },
//   inviteCard: {
//       backgroundColor: '#1E293B',
//       borderRadius: 16,
//       padding: 20,
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//   },
//   inviteLabel: {
//       color: '#94A3B8',
//       fontSize: 12,
//       marginBottom: 4,
//   },
//   inviteCode: {
//       color: '#fff',
//       fontSize: 20,
//       fontWeight: 'bold',
//       letterSpacing: 1,
//   },
//   inviteActions: {
//       flexDirection: 'row',
//   },
//   iconButton: {
//       marginLeft: 15,
//       padding: 5,
//   },

//   // --- Logout Button ---
//   logoutButton: {
//     marginTop: 30,
//     marginHorizontal: 16,
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: 16,
//     paddingVertical: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(239, 68, 68, 0.3)',
//   },
//   logoutText: {
//     color: '#EF4444',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   footerContainer: {
//     marginTop: 25,
//     alignItems: 'center',
//   },
//   versionText: {
//     fontSize: 12,
//     color: '#64748B',
//     marginBottom: 4,
//   },
//   companyText: {
//     fontSize: 12,
//     color: '#64748B',
//   },
// });

// export default AdminSettingScreen;


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
  View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IMAGE_BASE_URL } from '../../../../api/api';
import { useGetCompanyById, useOnboardCompany } from '../../../../api/hook/company/onBoarding/useCompany';
import { RootStackParamList } from '../../../../src/navigation/Stack';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { showError, showSuccess } from '../../../../src/utils/meesage';

const { height } = Dimensions.get('window');

// --- Types for Menu Items ---
type MenuItemType = 'navigation' | 'toggle';

interface MenuItemProps {
  id: string;
  title: string;
  subtitle?: string; 
  type: MenuItemType;
  value?: boolean; // For toggles
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  icon: string;
  iconColor: string;
  rightText?: string; 
}

const AdminSettingScreen = () => {
  // --- Navigation ---
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { company } = useAuthStore();
  const { data } = useGetCompanyById(company?.id || '');
  const { mutate: onboardCompany } = useOnboardCompany();
  
  const companyInfo = data?.company || data?.data || (data?.id ? data : null);

  const getLogoUrl = () => {
    if (!companyInfo?.logo) return null;
    
    let logoPath = '';
    if (typeof companyInfo.logo === 'string') {
      logoPath = companyInfo.logo;
    } else {
      // Check for secure_url (Cloudinary) or url or path
      logoPath = companyInfo.logo.secure_url || companyInfo.logo.url || companyInfo.logo.path || '';
    }

    if (!logoPath) return null;

    // Handle full URLs
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    
    // Use IMAGE_BASE_URL from api.ts
    const baseUrl = IMAGE_BASE_URL || 'http://192.168.1.7:5000';
    
    // Ensure no double slashes if IMAGE_BASE_URL ends with / and logoPath starts with /
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
    
    return `${cleanBase}${cleanPath}`;
  };
  
  // --- State for Profile Image ---
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // --- State for Toggles ---
  const [toggles, setToggles] = useState({
    leaveSystem: true,
    faceAttendance: true,
    expenseSystem: true,
    geoFencing: true,
    customSalary: false,
    salaryHistory: true,      
    staffNotification: true,  
    whatsappReport: true,     
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
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        showError(new Error(response.errorMessage));
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        
        const logoFile = {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `logo_${Date.now()}.jpg`,
        };

        // Merge existing data to ensure update is complete
        const currentData = companyInfo || {};
        const payload = {
          ...currentData,
          logo: logoFile,
        };

        onboardCompany(payload, {
          onSuccess: () => {
            showSuccess("Logo updated successfully");
          }
        });
      }
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
             try {
                // Logout from Zustand store (which clears persisted AsyncStorage)
                useAuthStore.getState().logout();

                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SelectRoleScreen' }],
                });
             } catch (error) {
                console.error('Error during logout:', error);
             }
          }
        }
      ]
    );
  };

  // --- Menu Data List ---
  const menuItems: MenuItemProps[] = [
    // { 
    //   id: '1', 
    //   title: 'Your Personal Details', 
    //   type: 'navigation', 
    //   icon: 'person', 
    //   iconColor: '#3B82F6' 
    // },
    { 
      id: '1.5', 
      title: 'Company Details', 
      type: 'navigation', 
      icon: 'business', 
      iconColor: '#6366F1' // Indigo
    },
    { 
      id: '2', 
      title: 'Company Shifts', 
      type: 'navigation', 
      icon: 'time', 
      iconColor: '#F59E0B' 
    },
    { 
      id: '3', 
      title: 'Payroll Configurations', 
      type: 'navigation', 
      icon: 'settings', 
      iconColor: '#64748B' 
    },
    { 
      id: '3.5', 
      title: 'Designations & Permissions', 
      type: 'navigation', 
      icon: 'shield-checkmark', 
      iconColor: '#EC4899' // Pink
    },
    // {
    //   id: '4',
    //   title: 'Leave System',
    //   type: 'toggle',
    //   value: toggles.leaveSystem,
    //   onToggle: () => handleToggle('leaveSystem'),
    //   icon: 'calendar',
    //   iconColor: '#EF4444' 
    // },
    // // --- UPDATED: Icon changed back to 'finger-print' ---
    // {
    //   id: '5',
    //   title: 'Face Attendance',
    //   type: 'toggle',
    //   value: toggles.faceAttendance,
    //   onToggle: () => handleToggle('faceAttendance'),
    //   icon: 'finger-print', // Changed from 'scan'
    //   iconColor: '#10B981' 
    // },
    // {
    //   id: '6',
    //   title: 'Expense System',
    //   type: 'toggle',
    //   value: toggles.expenseSystem,
    //   onToggle: () => handleToggle('expenseSystem'),
    //   icon: 'wallet',
    //   iconColor: '#8B5CF6' 
    // },
    // { 
    //   id: '7', 
    //   title: 'Expense Types', 
    //   type: 'navigation', 
    //   icon: 'list', 
    //   iconColor: '#D946EF' 
    // },
    {
      id: '8',
      title: 'Geo Fencing',
      type: 'toggle',
      value: toggles.geoFencing,
      onToggle: () => handleToggle('geoFencing'),
      icon: 'location',
      iconColor: '#14B8A6' 
    },
    { 
      id: '9', 
      title: 'Geo Fencing Locations', 
      type: 'navigation', 
      icon: 'map', 
      iconColor: '#06B6D4' 
    },
    {
      id: '10',
      title: 'Custom Daywise Salary',
      type: 'toggle',
      value: toggles.customSalary,
      onToggle: () => handleToggle('customSalary'),
      icon: 'cash', 
      iconColor: '#EAB308' 
    },
    // {
    //     id: '10.5',
    //     title: 'Maintain Salary Payment History',
    //     type: 'toggle',
    //     value: toggles.salaryHistory,
    //     onToggle: () => handleToggle('salaryHistory'),
    //     icon: 'refresh-circle', 
    //     iconColor: '#84CC16' // Lime
    // },
    { 
      id: '11', 
      title: 'Holidays', 
      type: 'navigation', 
      icon: 'airplane', 
      iconColor: '#0EA5E9' 
    },
    { 
        id: '11.5', 
        title: 'Reports', 
        type: 'navigation', 
        icon: 'stats-chart', 
        iconColor: '#A8A29E' 
    },
    {
        id: '12',
        title: 'Staff Punch Notification',
        subtitle: 'Get notified about the in/out of your staff as soon as they punch in/out.',
        type: 'toggle',
        value: toggles.staffNotification,
        onToggle: () => handleToggle('staffNotification'),
        icon: 'notifications', 
        iconColor: '#F97316' // Orange
    },
    // {
    //     id: '13',
    //     title: 'WhatsApp Report',
    //     subtitle: 'Get daily attendance report of your staff on WhatsApp at the end of the day.',
    //     rightText: '20:00',
    //     type: 'toggle',
    //     value: toggles.whatsappReport,
    //     onToggle: () => handleToggle('whatsappReport'),
    //     icon: 'logo-whatsapp', 
    //     iconColor: '#25D366' // WhatsApp Green
    // },
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background with Overlay */}
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../../../../src/assets/profile.jpg')} 
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={5} 
        >
          <View style={styles.darkOverlay} />
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
              {getLogoUrl() ? (
                <Image 
                  key={getLogoUrl()} // Force refresh when URL changes
                  source={{ uri: getLogoUrl() as string }} 
                  style={styles.avatarImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.placeholderText}>
                    {companyInfo?.name ? companyInfo.name.slice(0, 2).toUpperCase() : 'CO'}
                  </Text>
                </View>
              )}
              
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ opacity: headerOpacity, alignItems: 'center', width: '100%' }}>
             <Text style={styles.userName}>{companyInfo?.name || "Loading..."}</Text>
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
                  // Add height auto if there is a subtitle
                  item.subtitle ? { height: 'auto', paddingVertical: 15 } : {}
                ]}
                activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                // --- HERE IS THE UPDATED NAVIGATION LOGIC ---
                onPress={() => {
                  if (item.type === 'navigation') {
                    // Readable switch case for navigation
                    switch(item.title) {
                        case 'Your Personal Details':
                            navigation.navigate('PersonalDetails'); // Change 'PersonalDetails' to your actual Stack screen name
                            break;
                        case 'Company Details':
                            navigation.navigate('CompanyDetails');
                            break;
                        case 'Company Shifts':
                            navigation.navigate('ConpanyShifts');
                            break;
                        case 'Payroll Configurations':
                            navigation.navigate('PayConfigurations');
                            break;
                        case 'Designations & Permissions':
                            navigation.navigate('DesignationsScreen');
                            break;
                        case 'Expense Types':
                            navigation.navigate('ExpenseTypes');
                            break;
                        case 'Geo Fencing Locations':
                            navigation.navigate('GeoFencingLocations');
                            break;
                        case 'Holidays':
                            navigation.navigate('AdminHolidaysScreen');
                            break;
                        case 'Reports':
                            navigation.navigate('ReportsScreen');
                            break;
                        default:
                            console.warn(`No route defined for: ${item.title}`);
                            break;
                    }
                  } else {
                    // Handle Toggles
                    item.onToggle && item.onToggle(!item.value);
                  }
                }}
              >
                {/* --- Icon Wrapper --- */}
                <View style={[styles.iconWrapper, { backgroundColor: item.iconColor }]}>
                  <Ionicons name={item.icon} size={18} color="#FFF" />
                </View>

                {/* --- Text Container (Title + Subtitle) --- */}
                <View style={styles.textContainer}>
                    <Text style={styles.menuText}>{item.title}</Text>
                    {item.subtitle && (
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    )}
                </View>

                {/* --- Right Actions (Toggle/Arrow + Optional Text) --- */}
                <View style={styles.rightAction}>
                  {item.rightText && (
                    <Text style={styles.rightInfoText}>{item.rightText}</Text>
                  )}

                  {item.type === 'toggle' ? (
                    <Switch
                      trackColor={{ false: '#334155', true: '#3B82F6' }}
                      thumbColor={'#FFFFFF'}
                      ios_backgroundColor="#334155"
                      onValueChange={item.onToggle}
                      value={item.value}
                      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], marginLeft: 8 }}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#64748B"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

            {/* --- NEW: INVITE EMPLOYEES SECTION --- */}
            <View style={styles.inviteSection}>
                <Text style={styles.inviteHeader}>Invite Employees</Text>
                <View style={styles.inviteCard}>
                    <View>
                        <Text style={styles.inviteLabel}>Company Code</Text>
                        <Text style={styles.inviteCode}>5ZUFU</Text>
                    </View>
                    <View style={styles.inviteActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="copy-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="share-social-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

          {/* --- Logout Button --- */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
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

          {/* Extra bottom padding */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
    justifyContent: 'center', 
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 3,
    textAlign: 'center', 
  },

  // --- SHEET STYLES ---
  sheetContainer: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    minHeight: height * 0.7,
  },
  menuContainer: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 18,
    minHeight: 60,
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
    borderBottomColor: '#334155',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
      flex: 1,
      justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  menuSubtitle: {
      fontSize: 12,
      color: '#94A3B8', 
      marginTop: 4,
      lineHeight: 16,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightInfoText: {
      color: '#3B82F6', 
      fontSize: 14,
      fontWeight: '600',
      marginRight: 4,
  },

  // --- Invite Section Styles ---
  inviteSection: {
      marginTop: 25,
      marginHorizontal: 16,
  },
  inviteHeader: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 10,
      marginLeft: 4,
  },
  inviteCard: {
      backgroundColor: '#1E293B',
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  inviteLabel: {
      color: '#94A3B8',
      fontSize: 12,
      marginBottom: 4,
  },
  inviteCode: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 1,
  },
  inviteActions: {
      flexDirection: 'row',
  },
  iconButton: {
      marginLeft: 15,
      padding: 5,
  },

  // --- Logout Button ---
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  footerContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default AdminSettingScreen;