
// import React, { useState } from 'react';
// import {
//   Dimensions,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');

// interface AddStaffScreenProps {
//   onClose?: () => void;
// }

// const AddStaffScreen: React.FC<AddStaffScreenProps> = ({ onClose }) => {
//   const [extraPayment, setExtraPayment] = useState(false);
//   const [overtime, setOvertime] = useState(false);
//   const [shiftwise, setShiftwise] = useState(false);
//   const [multipleAttendance, setMultipleAttendance] = useState(false);
//   const [liveTracking, setLiveTracking] = useState(false);
//   const [mobileAttendance, setMobileAttendance] = useState(true);
//   const [selfieVerification, setSelfieVerification] = useState(false);
//   const [customSalary, setCustomSalary] = useState(false);
//   const [viewSelfSalary, setViewSelfSalary] = useState(false);
//   const [odometer, setOdometer] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
//       <View style={styles.backgroundLayer} />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={onClose}>
//           <Ionicons name="close-outline" size={26} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add New Staff Member</Text>
//         <TouchableOpacity>
//           <Text style={styles.saveText}>Save</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* Avatar */}
//         <View style={styles.avatarSection}>
//           <View style={styles.avatarPlaceholder}>
//             <Ionicons name="person-outline" size={60} color="#94A3B8" />
//             <View style={styles.cameraIconBadge}>
//               <Ionicons name="camera-outline" size={16} color="#fff" />
//             </View>
//           </View>
//         </View>

//         {/* Basic Info */}
//         <View style={styles.row}>
//           <View style={[styles.inputContainer, styles.halfInput, styles.outlinedInput]}>
//             <Text style={styles.floatingLabel}>First Name</Text>
//             <TextInput style={styles.input} placeholderTextColor="#888" />
//             <View style={styles.cursor} />
//           </View>
//           <View style={[styles.inputContainer, styles.halfInput]}>
//             <Text style={styles.label}>Last Name</Text>
//             <TextInput style={styles.inputUnderline} placeholderTextColor="#888" />
//           </View>
//         </View>

//         <InputItem label="Password" />
//         <InputItem label="Employee Code" />
//         <InputItem label="Designation" />

//         {/* Phone */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Phone Number</Text>
//           <View style={styles.iconInputRow}>
//             <TextInput style={[styles.inputUnderline, { flex: 1 }]} placeholderTextColor="#888" />
//             <Ionicons name="call-outline" size={22} color="#94A3B8" />
//           </View>
//         </View>

//         <DropdownItem label="Select Country" />

//         {/* Salary */}
//         <View style={styles.row}>
//           <View style={[styles.inputContainer, styles.halfInput]}>
//             <Text style={styles.label}>Monthly</Text>
//             <Ionicons
//               name="chevron-down-outline"
//               size={20}
//               color="#fff"
//               style={styles.dropdownIconAbsolute}
//             />
//             <View style={styles.separatorLine} />
//           </View>
//           <View style={[styles.inputContainer, styles.halfInput]}>
//             <Text style={styles.label}>Monthly Salary</Text>
//             <TextInput style={styles.inputUnderline} placeholderTextColor="#888" />
//           </View>
//         </View>

//         {/* Toggles */}
//         <ToggleItem label="Week Off Extra Payment" subLabel="Enable extra payment for weekly off days" value={extraPayment} onValueChange={setExtraPayment} />

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Week Off Day</Text>
//           <View style={styles.dropdownBox}>
//             <Text style={styles.dropdownText}>None</Text>
//             <Ionicons name="chevron-down-outline" size={20} color="#fff" />
//           </View>
//           <Text style={styles.helperText}>Select the day of the week for employee's day off</Text>
//         </View>

//         <ToggleItem label="Applicable to Overtime" subLabel="Enable overtime calculation for this employee" value={overtime} onValueChange={setOvertime} />
//         <ToggleItem label="Shiftwise Attendance" subLabel="Enable shift assignment for this employee" value={shiftwise} onValueChange={setShiftwise} />

//         {/* Payroll */}
//         <View style={styles.sectionHeaderRow}>
//           <Text style={styles.sectionTitle}>Payroll Configuration</Text>
//           <TouchableOpacity style={styles.smallBtn}>
//             <Text style={styles.smallBtnText}>Add Config</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.infoBox}>
//           <Text style={styles.infoBoxText}>
//             No payroll heads available. Create benefits and deductions in Settings Payroll Configuration.
//           </Text>
//         </View>

//         {/* Leaves */}
//         <InputItem label="Number of Casual Leaves" />
//         <InputItem label="Number of Sick Leaves" />
//         <InputItem label="Number of Privilege Leaves" />
//         <InputItem label="Number of Emergency Leaves" />

//         {/* Documents */}
//         <View style={styles.sectionHeaderRow}>
//           <Text style={styles.sectionTitle}>Add Documents</Text>
//           <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#3B82F6' }]}>
//             <Ionicons name="document-text-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
//             <Text style={[styles.smallBtnText, { color: '#fff' }]}>Add</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={[styles.infoBox, styles.documentBox]}>
//           <Text style={[styles.infoBoxText, { color: '#F87171' }]}>
//             No documents added yet. Please add documents.
//           </Text>
//         </View>

//         {/* Advanced */}
//         <ToggleItem label="Multiple Attendance" subLabel="Allow marking attendance multiple times per day" value={multipleAttendance} onValueChange={setMultipleAttendance} />
//         <ToggleItem label="Live Tracking" subLabel="Enable live location tracking" value={liveTracking} onValueChange={setLiveTracking} />
//         <ToggleItem label="Mobile Attendance" subLabel="Allow attendance marking from mobile" value={mobileAttendance} onValueChange={setMobileAttendance} />
//         <ToggleItem label="Ai Selfie Verification" subLabel="Enable AI-based selfie verification for attendance" value={selfieVerification} onValueChange={setSelfieVerification} />
//         <ToggleItem label="Self Custom Daywise Salary" subLabel="Allow employee to set their own daily salary" value={customSalary} onValueChange={setCustomSalary} />
//         <ToggleItem label="View Self Salary" subLabel="Allow employee to view their own salary details" value={viewSelfSalary} onValueChange={setViewSelfSalary} />
//         <ToggleItem label="Self Odometer Reading" subLabel="Allow employee to enter their own odometer readings" value={odometer} onValueChange={setOdometer} />

//         <View style={{ height: 50 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// /* Reusable Components */

// const InputItem = ({ label, isPlaceholder }: { label: string; isPlaceholder?: boolean }) => (
//   <View style={styles.inputContainer}>
//     {!isPlaceholder && <Text style={styles.label}>{label}</Text>}
//     <TextInput
//       style={styles.inputUnderline}
//       placeholder={isPlaceholder ? label : ''}
//       placeholderTextColor="#888"
//       editable={!isPlaceholder}
//     />
//   </View>
// );

// const DropdownItem = ({ label, isHalf }: { label: string; isHalf?: boolean }) => (
//   <View style={[styles.inputContainer, isHalf && styles.halfInput]}>
//     <Text style={styles.label}>{label}</Text>
//     <View style={styles.dropdownRow}>
//       <View style={styles.separatorLine} />
//       <Ionicons name="chevron-down-outline" size={20} color="#fff" style={styles.dropdownIcon} />
//     </View>
//   </View>
// );

// const ToggleItem = ({ label, subLabel, value, onValueChange }: any) => (
//   <View style={styles.toggleContainer}>
//     <View style={styles.toggleTextContainer}>
//       <Text style={styles.toggleLabel}>{label}</Text>
//       <Text style={styles.toggleSubLabel}>{subLabel}</Text>
//     </View>
//     <Switch
//       trackColor={{ false: '#334155', true: '#3B82F6' }}
//       thumbColor={value ? '#fff' : '#94A3B8'}
//       onValueChange={onValueChange}
//       value={value}
//     />
//   </View>
// );

// const styles = StyleSheet.create({
//   // UPDATED: Modern Dark Blue Background to match HomeScreen
//   container: { flex: 1, backgroundColor: '#0F172A' }, // Slate 900
//   backgroundLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1E293B', opacity: 0.5 },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   saveText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' }, // Blue accent for Save

//   scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

//   avatarSection: { alignItems: 'center', marginBottom: 30 },
//   avatarPlaceholder: {
//     width: 100, height: 100, borderRadius: 50,
//     backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center',
//   },
//   cameraIconBadge: {
//     position: 'absolute', bottom: 0, right: 5,
//     backgroundColor: '#3B82F6', padding: 8, borderRadius: 20,
//   },

//   inputContainer: { marginBottom: 25 },
//   row: { flexDirection: 'row', justifyContent: 'space-between' },
//   halfInput: { width: '48%' },

//   label: { fontSize: 14, fontWeight: '600', color: '#94A3B8', marginBottom: 8 },
//   floatingLabel: {
//     position: 'absolute', top: -10, left: 10,
//     backgroundColor: '#0F172A', // Matches container bg to hide border
//     paddingHorizontal: 4,
//     color: '#3B82F6', fontWeight: 'bold', fontSize: 12,
//   },

//   input: { color: '#fff', fontSize: 16, paddingVertical: 8 },
//   inputUnderline: {
//     borderBottomWidth: 1, borderBottomColor: '#334155',
//     color: '#fff', fontSize: 16, paddingVertical: 8,
//   },
//   outlinedInput: {
//     borderWidth: 1, borderColor: '#3B82F6', borderRadius: 12,
//     paddingHorizontal: 12, height: 50, justifyContent: 'center',
//   },
//   cursor: { position: 'absolute', left: 15, top: 15, width: 2, height: 20, backgroundColor: '#3B82F6' },

//   iconInputRow: { flexDirection: 'row', alignItems: 'center' },

//   dropdownRow: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     borderBottomWidth: 1, borderBottomColor: '#334155', height: 40,
//   },
//   separatorLine: { flex: 1 },
//   dropdownIcon: { opacity: 0.7 },
//   dropdownIconAbsolute: { position: 'absolute', right: 0, bottom: 10 },

//   dropdownBox: {
//     borderWidth: 1, borderColor: '#334155', borderRadius: 12,
//     paddingHorizontal: 15, height: 50,
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     backgroundColor: '#1E293B',
//   },
//   dropdownText: { color: '#fff', fontWeight: 'bold' },
//   helperText: { fontSize: 11, color: '#64748B', marginTop: 6 },

//   toggleContainer: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     alignItems: 'center', marginBottom: 25,
//   },
//   toggleTextContainer: { flex: 1, paddingRight: 10 },
//   toggleLabel: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
//   toggleSubLabel: { fontSize: 12, color: '#94A3B8' },

//   sectionHeaderRow: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     alignItems: 'center', marginBottom: 15, marginTop: 10,
//   },
//   sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff' },

//   smallBtn: {
//     backgroundColor: '#1E293B',
//     paddingHorizontal: 12, paddingVertical: 8,
//     borderRadius: 8, flexDirection: 'row', alignItems: 'center',
//     borderWidth: 1, borderColor: '#334155',
//   },
//   smallBtnText: { color: '#3B82F6', fontSize: 12, fontWeight: 'bold' },

//   infoBox: {
//     borderWidth: 1, borderColor: '#334155',
//     borderRadius: 12, padding: 20, marginBottom: 25,
//     backgroundColor: '#1E293B',
//   },
//   documentBox: {
//     borderStyle: 'dashed',
//     justifyContent: 'center', alignItems: 'center', height: 120,
//     borderColor: '#475569',
//   },
//   infoBoxText: {
//     color: '#94A3B8', fontSize: 13, lineHeight: 20,
//     textAlign: 'center',
//   },
// });

// export default AddStaffScreen;

import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

const { width, height } = Dimensions.get('window');

// Colors Palette (Slate Dark Theme)
const COLORS = {
  bg: '#0F172A',         // Slate 900
  card: '#1E293B',       // Slate 800
  input: '#334155',      // Slate 700
  primary: '#3B82F6',    // Blue 500
  text: '#F8FAFC',       // Slate 50
  subText: '#94A3B8',    // Slate 400
  border: '#334155',     // Slate 700
  danger: '#EF4444',     // Red 500
  success: '#10B981',    // Emerald 500
  modalOverlay: 'rgba(0,0,0,0.7)',
};

// --- Data Lists ---
const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia", "UAE", "Germany", "Japan"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December", "Monthly"
];

interface AddStaffScreenProps {
  onClose?: () => void;
}

const AddStaffScreen: React.FC<AddStaffScreenProps> = ({ onClose }) => {
  // --- Form State (Fully Functional) ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  
  // Dropdown States
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedSalaryType, setSelectedSalaryType] = useState('Monthly');
  const [selectedWeekOff, setSelectedWeekOff] = useState('Sunday');

  // Modal Control
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [currentSelectionField, setCurrentSelectionField] = useState<'country' | 'salary' | 'weekoff' | null>(null);

  // Document State
  const [selectedDoc, setSelectedDoc] = useState<DocumentPickerResponse | null>(null);

  // Leave States
  const [casualLeave, setCasualLeave] = useState('');
  const [sickLeave, setSickLeave] = useState('');
  const [privilegeLeave, setPrivilegeLeave] = useState('');
  const [emergencyLeave, setEmergencyLeave] = useState('');

  // Toggles
  const [extraPayment, setExtraPayment] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [shiftwise, setShiftwise] = useState(false);
  const [multipleAttendance, setMultipleAttendance] = useState(false);
  const [liveTracking, setLiveTracking] = useState(false);
  const [mobileAttendance, setMobileAttendance] = useState(true);
  const [selfieVerification, setSelfieVerification] = useState(false);
  const [customSalary, setCustomSalary] = useState(false);
  const [viewSelfSalary, setViewSelfSalary] = useState(false);
  const [odometer, setOdometer] = useState(false);

  // --- Handlers ---

  const openModal = (type: 'country' | 'salary' | 'weekoff') => {
    setCurrentSelectionField(type);
    setModalVisible(true);
    if (type === 'country') {
      setModalData(COUNTRIES);
      setModalTitle('Select Country');
    } else if (type === 'salary') {
      setModalData(MONTHS);
      setModalTitle('Select Type/Month');
    } else if (type === 'weekoff') {
      setModalData(DAYS);
      setModalTitle('Select Weekly Off');
    }
  };

  const handleSelection = (item: string) => {
    if (currentSelectionField === 'country') setSelectedCountry(item);
    if (currentSelectionField === 'salary') setSelectedSalaryType(item);
    if (currentSelectionField === 'weekoff') setSelectedWeekOff(item);
    setModalVisible(false);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Can specify types like images, pdfs
      });
      setSelectedDoc(result[0]);
      Alert.alert("Success", `File Selected: ${result[0].name}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Unknown Error: ' + JSON.stringify(err));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <Ionicons name="close-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Staff</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color={COLORS.subText} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHelperText}>Upload Profile Picture</Text>
          </View>

          {/* Basic Info Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Personal Details</Text>
            
            <View style={styles.row}>
              <ModernInput 
                label="First Name" 
                value={firstName} 
                onChangeText={setFirstName} 
                containerStyle={styles.halfInput} 
                icon="person-outline"
              />
              <ModernInput 
                label="Last Name" 
                value={lastName} 
                onChangeText={setLastName} 
                containerStyle={styles.halfInput} 
              />
            </View>

            <ModernInput label="Mobile Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
            <ModernInput label="Password" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" />
            
            <View style={styles.row}>
              <ModernInput label="Emp Code" value={empCode} onChangeText={setEmpCode} containerStyle={styles.halfInput} icon="id-card-outline" />
              <ModernInput label="Designation" value={designation} onChangeText={setDesignation} containerStyle={styles.halfInput} icon="briefcase-outline" />
            </View>

            {/* Country Dropdown */}
            <DropdownButton 
              label="Select Country" 
              value={selectedCountry} 
              icon="flag-outline" 
              onPress={() => openModal('country')}
            />
          </View>

          {/* Salary Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Compensation</Text>
            <View style={styles.row}>
              <DropdownButton 
                label="Type" 
                value={selectedSalaryType} 
                isHalf 
                onPress={() => openModal('salary')}
              />
              <ModernInput 
                label="Salary Amount" 
                value={monthlySalary} 
                onChangeText={setMonthlySalary} 
                keyboardType="numeric" 
                containerStyle={styles.halfInput} 
                icon="cash-outline"
              />
            </View>
          </View>

          {/* Work Schedule Card */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Work Schedule & Overtime</Text>
            
            <ToggleRow label="Week Off Extra Payment" value={extraPayment} onValueChange={setExtraPayment} />
            
            <View style={styles.divider} />
            
            <View style={styles.pickerRow}>
              <View>
                 <Text style={styles.pickerLabel}>Weekly Off Day</Text>
                 <Text style={styles.pickerSubLabel}>Select day off</Text>
              </View>
              <TouchableOpacity style={styles.miniDropdown} onPress={() => openModal('weekoff')}>
                <Text style={styles.miniDropdownText}>{selectedWeekOff}</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.subText} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />
            <ToggleRow label="Applicable to Overtime" value={overtime} onValueChange={setOvertime} />
            <View style={styles.divider} />
            <ToggleRow label="Shiftwise Attendance" value={shiftwise} onValueChange={setShiftwise} />
          </View>

          {/* Payroll Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionHeader}>Payroll Configuration</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>+ Add Config</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emptyStateBox}>
              <Ionicons name="wallet-outline" size={24} color={COLORS.subText} />
              <Text style={styles.emptyStateText}>No payroll heads configured yet.</Text>
            </View>
          </View>

          {/* Leaves Grid */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Leave Balance</Text>
            <View style={styles.gridContainer}>
              <MiniInput label="Casual" value={casualLeave} onChangeText={setCasualLeave} />
              <MiniInput label="Sick" value={sickLeave} onChangeText={setSickLeave} />
              <MiniInput label="Privilege" value={privilegeLeave} onChangeText={setPrivilegeLeave} />
              <MiniInput label="Emergency" value={emergencyLeave} onChangeText={setEmergencyLeave} />
            </View>
          </View>

          {/* Documents */}
          <View style={styles.sectionContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionHeader}>Documents</Text>
            </View>
            <TouchableOpacity style={styles.uploadBox} onPress={handleDocumentPick}>
              <View style={styles.uploadIconCircle}>
                 <Ionicons name={selectedDoc ? "document-text-outline" : "cloud-upload-outline"} size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.uploadText}>{selectedDoc ? selectedDoc.name : "Tap to upload documents"}</Text>
              <Text style={styles.uploadSubText}>{selectedDoc ? "Tap to change" : "ID Proof, Address Proof, etc."}</Text>
            </TouchableOpacity>
          </View>

          {/* Advanced Permissions Card */}
          <View style={[styles.cardContainer, { marginBottom: 40 }]}>
            <Text style={styles.cardTitle}>App Permissions</Text>
            
            <ToggleRow label="Mobile Attendance" subLabel="Allow marking from app" value={mobileAttendance} onValueChange={setMobileAttendance} />
            <View style={styles.divider} />
            <ToggleRow label="Live Tracking" subLabel="Track location during shifts" value={liveTracking} onValueChange={setLiveTracking} />
            <View style={styles.divider} />
            <ToggleRow label="Selfie Verification" value={selfieVerification} onValueChange={setSelfieVerification} />
            <View style={styles.divider} />
            <ToggleRow label="Multiple Attendance" value={multipleAttendance} onValueChange={setMultipleAttendance} />
            <View style={styles.divider} />
            <ToggleRow label="View Self Salary" value={viewSelfSalary} onValueChange={setViewSelfSalary} />
            <View style={styles.divider} />
            <ToggleRow label="Odometer Reading" value={odometer} onValueChange={setOdometer} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Reusable Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => handleSelection(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {((currentSelectionField === 'country' && item === selectedCountry) || 
                    (currentSelectionField === 'salary' && item === selectedSalaryType) || 
                    (currentSelectionField === 'weekoff' && item === selectedWeekOff)) && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={{ maxHeight: height * 0.5 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

/* --- Reusable Components --- */

const ModernInput = ({ label, value, onChangeText, containerStyle, secureTextEntry, keyboardType, icon }: any) => (
  <View style={[styles.inputWrapper, containerStyle]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputFieldContainer}>
      {icon && <Ionicons name={icon} size={20} color={COLORS.subText} style={styles.inputIcon} />}
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor={COLORS.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const MiniInput = ({ label, value, onChangeText }: any) => (
  <View style={styles.miniInputWrapper}>
    <Text style={styles.miniInputLabel}>{label}</Text>
    <TextInput
      style={styles.miniTextInput}
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
      placeholder="0"
      placeholderTextColor={COLORS.subText}
    />
  </View>
);

const DropdownButton = ({ label, value, isHalf, icon, onPress }: any) => (
  <TouchableOpacity style={[styles.inputWrapper, isHalf && styles.halfInput]} onPress={onPress}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.dropdownContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.subText} style={{ marginRight: 10 }} />}
        <Text style={styles.dropdownValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-down" size={20} color={COLORS.subText} />
    </View>
  </TouchableOpacity>
);

const ToggleRow = ({ label, subLabel, value, onValueChange }: any) => (
  <View style={styles.toggleRow}>
    <View style={{ flex: 1, paddingRight: 10 }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {subLabel && <Text style={styles.toggleSubLabel}>{subLabel}</Text>}
    </View>
    <Switch
      trackColor={{ false: COLORS.input, true: COLORS.primary }}
      thumbColor={'#fff'}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  iconButton: { padding: 5 },
  saveButton: { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  saveText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },

  scrollContent: { padding: 20 },

  /* Avatar */
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarContainer: { position: 'relative' },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.card,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.border,
  },
  cameraButton: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.primary,
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.bg,
  },
  avatarHelperText: { marginTop: 10, color: COLORS.primary, fontSize: 14, fontWeight: '500' },

  /* Inputs */
  sectionContainer: { marginBottom: 25 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 15, letterSpacing: 0.5 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  
  halfInput: { width: '48%' },
  
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: COLORS.subText, marginBottom: 6, textTransform: 'uppercase' },
  inputFieldContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    height: 50, paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, color: COLORS.text, fontSize: 15, height: '100%' },

  dropdownContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    height: 50, paddingHorizontal: 15,
  },
  dropdownValue: { color: COLORS.text, fontSize: 15, fontWeight: '500' },

  /* Cards (For Toggles) */
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 15 },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  toggleLabel: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  toggleSubLabel: { fontSize: 12, color: COLORS.subText, marginTop: 2 },
  
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  pickerLabel: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  pickerSubLabel: { fontSize: 12, color: COLORS.subText },
  miniDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  miniDropdownText: { color: COLORS.text, fontSize: 13, marginRight: 5 },

  divider: { height: 1, backgroundColor: COLORS.border, opacity: 0.5 },

  /* Empty States */
  linkText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  emptyStateBox: {
    backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed',
    borderRadius: 12, padding: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyStateText: { color: COLORS.subText, fontSize: 13, marginTop: 8 },

  /* Leaves Grid */
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  miniInputWrapper: { width: '48%', backgroundColor: COLORS.card, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  miniInputLabel: { fontSize: 12, color: COLORS.subText, marginBottom: 5 },
  miniTextInput: { fontSize: 18, fontWeight: '700', color: COLORS.text, padding: 0 },

  /* Upload */
  uploadBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed',
    borderRadius: 12, height: 120,
    alignItems: 'center', justifyContent: 'center',
  },
  uploadIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  uploadText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  uploadSubText: { color: COLORS.subText, fontSize: 12, marginTop: 4 },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default AddStaffScreen;