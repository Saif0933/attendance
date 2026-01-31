
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardTypeOptions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useOnboardEmployee } from '../../../../src/employee/hook/useEmployee';
import { BloodGroup, EmployeePayload, Gender, PunchFromGeofence } from '../../../../src/employee/validator/employee.validator';

const { width, height } = Dimensions.get('window');

// --- 1. TYPED DATA LISTS ---
const DROPDOWN_OPTIONS: Record<string, string[]> = {
  country: ['India', 'USA', 'UAE', 'UK', 'Canada', 'Australia'],
  salaryType: ['Monthly', 'Daily', 'Hourly', 'Weekly'],
  weekOff: ['None', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  gender: ['Male', 'Female', 'Other'],
  employeeType: ['Employee', 'Admin', 'Manager'],
  category: ['General', 'Technical', 'Support', 'Management'],
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'],
  geofence: ['PUNCH_FROM_ANYWHERE', 'PUNCH_FROM_GEOFENCE'],
};

interface AddStaffScreenProps {
  onClose?: () => void;
}

const AddStaffScreen: React.FC<AddStaffScreenProps> = ({ onClose }) => {
  // --- 2. STATE MANAGEMENT ---
  
  // TanStack Query Hook for employee onboarding
  const { mutate: onboardEmployee, isPending } = useOnboardEmployee();

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

  // Form Data
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', password: '', empCode: '', designation: '', phone: '',
    country: '', monthlySalary: '', salaryType: 'Monthly', weekOff: 'None',
    casualLeaves: '', sickLeaves: '', privilegeLeaves: '', emergencyLeaves: '',
    dateOfJoining: '', gender: '', employeeType: '', category: '',
    email: '', pan: '', bankAcc: '', ifsc: '', bankName: '', branch: '', holderName: '',
    bloodGroup: '', maritalStatus: '', birthDate: '',
    emergencyName: '', emergencyPhone: '', geofence: '', address: '',
  });

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectionField, setCurrentSelectionField] = useState<keyof typeof formData | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  // --- 3. HELPER FUNCTIONS ---

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openSelector = (field: keyof typeof formData, title: string) => {
    // We cast field to string to check against DROPDOWN_OPTIONS keys
    if (DROPDOWN_OPTIONS[field as string]) {
      setCurrentSelectionField(field);
      setCurrentOptions(DROPDOWN_OPTIONS[field as string]);
      setModalTitle(title);
      setModalVisible(true);
    }
  };

  const handleSelectOption = (item: string) => {
    if (currentSelectionField) {
      setFormData(prev => ({ ...prev, [currentSelectionField]: item }));
    }
    setModalVisible(false);
  };

  // Map UI gender value to API Gender type
  const mapGender = (gender: string): Gender | null => {
    const genderMap: Record<string, Gender> = {
      'Male': 'MALE',
      'Female': 'FEMALE',
      'Other': 'OTHER',
    };
    return genderMap[gender] || null;
  };

  // Map UI blood group value to API BloodGroup type
  const mapBloodGroup = (bloodGroup: string): BloodGroup | null => {
    const bloodGroupMap: Record<string, BloodGroup> = {
      'A+': 'A_POSITIVE',
      'A-': 'A_NEGATIVE',
      'B+': 'B_POSITIVE',
      'B-': 'B_NEGATIVE',
      'O+': 'O_POSITIVE',
      'O-': 'O_NEGATIVE',
      'AB+': 'AB_POSITIVE',
      'AB-': 'AB_NEGATIVE',
    };
    return bloodGroupMap[bloodGroup] || null;
  };

  // Map UI geofence value to API PunchFromGeofence type
  const mapGeofence = (geofence: string): PunchFromGeofence => {
    if (geofence === 'Anywhere') {
      return 'PUNCH_FROM_ANYWHERE';
    }
    return 'PUNCH_FROM_GEOFENCE';
  };

  // Parse date string (DD/MM/YYYY) to Date object
  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date();
  };

  // Validate required fields before saving
  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }
    if (!formData.pan.trim()) {
      Alert.alert('Validation Error', 'PAN number is required');
      return false;
    }
    if (!formData.bankAcc.trim()) {
      Alert.alert('Validation Error', 'Bank account number is required');
      return false;
    }
    if (!formData.ifsc.trim()) {
      Alert.alert('Validation Error', 'IFSC code is required');
      return false;
    }
    if (!formData.bankName.trim()) {
      Alert.alert('Validation Error', 'Bank name is required');
      return false;
    }
    if (!formData.branch.trim()) {
      Alert.alert('Validation Error', 'Bank branch is required');
      return false;
    }
    if (!formData.holderName.trim()) {
      Alert.alert('Validation Error', 'Account holder name is required');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    // Build the payload matching EmployeePayload interface
    const payload: EmployeePayload = {
      // Basic Information
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim() || undefined,
      password: formData.password || undefined,
      email: formData.email.trim() || null,
      employeeCode: formData.empCode ? parseInt(formData.empCode, 10) : undefined,
      designation: formData.designation.trim() || undefined,
      phoneNumber: formData.phone.trim(),
      Country: formData.country || undefined,
      salary: formData.monthlySalary ? parseFloat(formData.monthlySalary) : undefined,
      birthDate: formData.birthDate ? parseDate(formData.birthDate) : undefined,
      emergencyContactPhone: formData.emergencyPhone.trim() || null,
      emergencyContactName: formData.emergencyName.trim() || null,
      gender: mapGender(formData.gender),
      bloodGroup: mapBloodGroup(formData.bloodGroup),

      // Settings
      weekOffExtraPayment: extraPayment,
      weekOffDay: formData.weekOff !== 'None' ? formData.weekOff : null,
      applicableToOvertime: overtime,
      shiftwiseAttendance: shiftwise,
      payrollConfiguration: formData.salaryType,
      numberOfCasualLeaves: formData.casualLeaves ? parseInt(formData.casualLeaves, 10) : 0,
      numberOfSickLeaves: formData.sickLeaves ? parseInt(formData.sickLeaves, 10) : 0,
      numberOfPrivilegeLeaves: formData.privilegeLeaves ? parseInt(formData.privilegeLeaves, 10) : 0,
      numberOfEmergencyLeaves: formData.emergencyLeaves ? parseInt(formData.emergencyLeaves, 10) : 0,
      multipleAttendance: multipleAttendance,
      liveTracking: liveTracking,
      mobileAttendance: mobileAttendance,
      aiFingerprintVerification: selfieVerification,
      selfCustomDaywiseSalary: customSalary,
      viewSelfSalary: viewSelfSalary,
      selfOdometerReading: odometer,
      dateOfJoining: parseDate(formData.dateOfJoining),
      punchFromGeofence: mapGeofence(formData.geofence),

      // Bank Details
      panNumber: formData.pan.trim(),
      bankAccountNumber: formData.bankAcc.trim(),
      bankIfscCode: formData.ifsc.trim().toUpperCase(),
      bankName: formData.bankName.trim(),
      bankBranchName: formData.branch.trim(),
      accountHolderName: formData.holderName.trim(),
      address: formData.address.trim(),
    };

    console.log('Sending payload:', payload);

    // Call the API mutation
    onboardEmployee(payload, {
      onSuccess: (data: any) => {
        console.log('Employee onboarded successfully:', data);
        Alert.alert(
          'Success',
          'Staff member has been added successfully!',
          [{ text: 'OK', onPress: () => onClose && onClose() }]
        );
      },
      onError: (error: any) => {
        console.error('Error onboarding employee:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add staff member. Please try again.';
        Alert.alert('Error', errorMessage);
      },
    });
  };

  // --- 4. RENDER UI ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Staff</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={50} color="#64748B" />
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </View>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </View>

        {/* Basic Info */}
        <View style={styles.row}>
          <InputItem 
            label="First Name" 
            value={formData.firstName} 
            onChange={(text: string) => handleInputChange('firstName', text)} 
            isHalf 
          />
          <InputItem 
            label="Last Name" 
            value={formData.lastName} 
            onChange={(text: string) => handleInputChange('lastName', text)} 
            isHalf 
          />
        </View>

        <InputItem label="Password" isPassword value={formData.password} onChange={(text: string) => handleInputChange('password', text)} />
        <InputItem label="Employee Code" value={formData.empCode} onChange={(text: string) => handleInputChange('empCode', text)} />
        <InputItem label="Designation" value={formData.designation} onChange={(text: string) => handleInputChange('designation', text)} />

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter phone number" 
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
            <Ionicons name="call-outline" size={20} color="#64748B" />
          </View>
        </View>

        <DropdownItem 
          label="Country" 
          value={formData.country} 
          placeholder="Select Country"
          onPress={() => openSelector('country', 'Select Country')} 
        />

        {/* Salary */}
        <View style={styles.row}>
          <DropdownItem 
            label="Type" 
            placeholder="Select Salary Type"
            value={formData.salaryType} 
            isHalf 
            onPress={() => openSelector('salaryType', 'Salary Type')}
          />
          <InputItem 
            label="Amount" 
            value={formData.monthlySalary} 
            onChange={(text: string) => handleInputChange('monthlySalary', text)}
            placeholder="0.00"
            keyboardType="numeric"
            isHalf 
          />
        </View>

        {/* Toggles & Shift */}
        <ToggleItem label="Week Off Extra Payment" subLabel="Extra pay for working on off days" value={extraPayment} onValueChange={setExtraPayment} />

        <DropdownItem 
          label="Week Off Day" 
          value={formData.weekOff} 
          placeholder="Select Day"
          onPress={() => openSelector('weekOff', 'Select Weekly Off')} 
        />

        <ToggleItem label="Overtime Applicable" subLabel="Calculate overtime for this staff" value={overtime} onValueChange={setOvertime} />
        <ToggleItem label="Shiftwise Attendance" subLabel="Assign specific shifts" value={shiftwise} onValueChange={setShiftwise} />

        {/* Leaves */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Leave Balance</Text>
        </View>
        <View style={styles.row}>
          <InputItem label="Casual" placeholder="0" isHalf value={formData.casualLeaves} onChange={(text: string) => handleInputChange('casualLeaves', text)} keyboardType="numeric" />
          <InputItem label="Sick" placeholder="0" isHalf value={formData.sickLeaves} onChange={(text: string) => handleInputChange('sickLeaves', text)} keyboardType="numeric" />
        </View>
        <View style={styles.row}>
          <InputItem label="Privilege" placeholder="0" isHalf value={formData.privilegeLeaves} onChange={(text: string) => handleInputChange('privilegeLeaves', text)} keyboardType="numeric" />
          <InputItem label="Emergency" placeholder="0" isHalf value={formData.emergencyLeaves} onChange={(text: string) => handleInputChange('emergencyLeaves', text)} keyboardType="numeric" />
        </View>

        {/* Personal Details */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <InputItem label="Date of Joining" placeholder="DD/MM/YYYY" value={formData.dateOfJoining} onChange={(text: string) => handleInputChange('dateOfJoining', text)} />

        <View style={styles.row}>
          <DropdownItem label="Gender" isHalf value={formData.gender} placeholder="Select" onPress={() => openSelector('gender', 'Select Gender')} />
          <DropdownItem label="Employee" isHalf value={formData.employeeType} placeholder="Select" onPress={() => openSelector('employeeType', 'Employee Type')} />
        </View>

        <DropdownItem label="Category" value={formData.category} placeholder="Select Category" onPress={() => openSelector('category', 'Select Category')} />

        <InputItem label="Email Address" keyboardType="email-address" value={formData.email} onChange={(text: string) => handleInputChange('email', text)} />
        
        {/* Banking */}
        <View style={styles.sectionHeaderRow}>
           <Text style={styles.sectionTitle}>Bank Details</Text>
        </View>
        <InputItem label="PAN Number" value={formData.pan} onChange={(text: string) => handleInputChange('pan', text)} />
        <InputItem label="Account Number" keyboardType="numeric" value={formData.bankAcc} onChange={(text: string) => handleInputChange('bankAcc', text)} />
        <InputItem label="IFSC Code" value={formData.ifsc} onChange={(text: string) => handleInputChange('ifsc', text)} />
        <View style={styles.row}>
             <InputItem label="Bank Name" isHalf value={formData.bankName} onChange={(text: string) => handleInputChange('bankName', text)} />
             <InputItem label="Branch" isHalf value={formData.branch} onChange={(text: string) => handleInputChange('branch', text)} />
        </View>
        <InputItem label="Account Holder" value={formData.holderName} onChange={(text: string) => handleInputChange('holderName', text)} />
        <InputItem label="Address" value={formData.address} onChange={(text: string) => handleInputChange('address', text)} placeholder="Enter full address" />

        {/* More Personal */}
        <View style={styles.row}>
            <DropdownItem label="Blood Group" isHalf value={formData.bloodGroup} placeholder="Select" onPress={() => openSelector('bloodGroup', 'Blood Group')} />
            <DropdownItem label="Marital Status" isHalf value={formData.maritalStatus} placeholder="Select" onPress={() => openSelector('maritalStatus', 'Marital Status')} />
        </View>
        <InputItem label="Birth Date" placeholder="DD/MM/YYYY" value={formData.birthDate} onChange={(text: string) => handleInputChange('birthDate', text)} />

        <Text style={[styles.sectionTitle, {marginTop: 15}]}>Emergency Contact</Text>
        <InputItem label="Contact Name" value={formData.emergencyName} onChange={(text: string) => handleInputChange('emergencyName', text)} />
        <InputItem label="Contact Phone" keyboardType="phone-pad" value={formData.emergencyPhone} onChange={(text: string) => handleInputChange('emergencyPhone', text)} />

        <DropdownItem label="Geofence Rule" value={formData.geofence} placeholder="Select Rule" onPress={() => openSelector('geofence', 'Geofence Rule')} />

        {/* Advanced Toggles */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Advanced Settings</Text>
        
        <ToggleItem label="Multiple Attendance" subLabel="Allow multiple punch-ins per day" value={multipleAttendance} onValueChange={setMultipleAttendance} />
        <ToggleItem label="Live Tracking" subLabel="Track location during shift" value={liveTracking} onValueChange={setLiveTracking} />
        <ToggleItem label="Mobile Attendance" subLabel="Allow app based attendance" value={mobileAttendance} onValueChange={setMobileAttendance} />
        <ToggleItem label="AI Selfie Verification" subLabel="Verify face matches profile" value={selfieVerification} onValueChange={setSelfieVerification} />
        <ToggleItem label="Custom Daily Salary" subLabel="Employee can set daily rates" value={customSalary} onValueChange={setCustomSalary} />
        <ToggleItem label="View Self Salary" subLabel="Employee can see payslips" value={viewSelfSalary} onValueChange={setViewSelfSalary} />
        <ToggleItem label="Odometer Reading" subLabel="Input start/end km readings" value={odometer} onValueChange={setOdometer} />

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* --- MODAL FOR DROPDOWNS --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={currentOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectOption(item)}>
                <Text style={[
                    styles.modalItemText, 
                    currentSelectionField && formData[currentSelectionField] === item ? { color: '#3B82F6', fontWeight: 'bold' } : {}
                ]}>
                  {item}
                </Text>
                {currentSelectionField && formData[currentSelectionField] === item && (
                   <Ionicons name="checkmark" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

    </SafeAreaView>
  );
};

/* --- 5. REUSABLE COMPONENTS WITH PROPER TYPES --- */

interface InputItemProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  isHalf?: boolean;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const InputItem: React.FC<InputItemProps> = ({ label, placeholder, value, onChange, isHalf, isPassword, keyboardType }) => (
  <View style={[styles.inputContainer, isHalf && styles.halfInput]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor="#555"
        secureTextEntry={isPassword}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  </View>
);

interface DropdownItemProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  isHalf?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, isHalf, placeholder, value, onPress }) => (
  <View style={[styles.inputContainer, isHalf && styles.halfInput]}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.dropdownBox} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.dropdownText, !value && { color: '#555' }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={18} color="#94A3B8" />
    </TouchableOpacity>
  </View>
);

interface ToggleItemProps {
  label: string;
  subLabel: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, subLabel, value, onValueChange }) => (
  <View style={styles.toggleContainer}>
    <View style={styles.toggleTextContainer}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleSubLabel}>{subLabel}</Text>
    </View>
    <Switch
      trackColor={{ false: '#334155', true: '#3B82F6' }}
      thumbColor={value ? '#fff' : '#CBD5E1'}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 10, paddingHorizontal: 20, paddingBottom: 15,
    backgroundColor: '#0F172A', zIndex: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  iconButton: { padding: 5 },
  saveBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  saveText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  avatarSection: { alignItems: 'center', marginVertical: 25 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#334155'
  },
  cameraIconBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3B82F6',
    padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#0F172A'
  },
  uploadText: { color: '#3B82F6', marginTop: 10, fontWeight: '600' },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputContainer: { marginBottom: 20, width: '100%' },
  halfInput: { width: '48%' },
  
  label: { fontSize: 13, fontWeight: '600', color: '#94A3B8', marginBottom: 8, letterSpacing: 0.5 },
  
  inputBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B',
    borderRadius: 12, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 15, height: 50,
  },
  input: { flex: 1, color: '#fff', fontSize: 15 },

  dropdownBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1E293B', borderRadius: 12, borderWidth: 1, borderColor: '#334155',
    paddingHorizontal: 15, height: 50,
  },
  dropdownText: { color: '#fff', fontSize: 15, fontWeight: '500' },

  toggleContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E293B',
  },
  toggleTextContainer: { flex: 1, paddingRight: 15 },
  toggleLabel: { fontSize: 16, fontWeight: '600', color: '#E2E8F0' },
  toggleSubLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 25 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    backgroundColor: '#1E293B', borderTopLeftRadius: 25, borderTopRightRadius: 25,
    maxHeight: height * 0.7, padding: 20, position: 'absolute', bottom: 0, width: '100%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  modalItem: {
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  modalItemText: { fontSize: 16, color: '#CBD5E1' },
});

export default AddStaffScreen;