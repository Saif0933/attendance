
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
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
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetAllShifts } from '../../../../api/hook/company/shift/useShift';
import { useOnboardEmployee } from '../../../../src/employee/hook/useEmployee';
import { useUploadProfilePicture } from '../../../../src/employee/hook/useProfilePicture';
import { BloodGroup, EmployeePayload, Gender, PunchFromGeofence } from '../../../../src/employee/validator/employee.validator';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useTheme } from '../../../../src/theme/ThemeContext';

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

// --- DATE PICKER CONSTANTS ---
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS = [
  { label: 'Jan', value: '01' }, { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' },
  { label: 'Apr', value: '04' }, { label: 'May', value: '05' }, { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' }, { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' },
  { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => (CURRENT_YEAR + 5 - i).toString());

interface AddStaffScreenProps {
  onClose?: () => void;
}

const AddStaffScreen: React.FC<AddStaffScreenProps> = ({ onClose }) => {
  const { colors, isDark } = useTheme();
  // --- 2. STATE MANAGEMENT ---
  
  // TanStack Query Hook for employee onboarding
  const { mutate: onboardEmployee, isPending } = useOnboardEmployee();
  const { mutate: uploadProfilePicture, isPending: isUploadingImage } = useUploadProfilePicture();
  const { data: shiftsData } = useGetAllShifts();
  const shifts = (shiftsData as any)?.data || [];

  // Profile Picture State
  const [profileImage, setProfileImage] = useState<any>(null);

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
    shiftId: '', shiftName: '',
  });

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectionField, setCurrentSelectionField] = useState<keyof typeof formData | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDateField, setPickerDateField] = useState<'dateOfJoining'|'birthDate' | null>(null);
  const [tempDay, setTempDay] = useState('01');
  const [tempMonth, setTempMonth] = useState('01');
  const [tempYear, setTempYear] = useState(CURRENT_YEAR.toString());

  // Refs for Date Picker Wheels
  const dayListRef = React.useRef<FlatList>(null);
  const monthListRef = React.useRef<FlatList>(null);
  const yearListRef = React.useRef<FlatList>(null);

  // Auto-scroll to center on mount/open
  React.useEffect(() => {
    if (showDatePicker) {
      // Small timeout to ensure FlatList is rendered
      const timer = setTimeout(() => {
        const dIdx = DAYS.indexOf(tempDay);
        const mIdx = MONTHS.findIndex(m => m.value === tempMonth);
        const yIdx = YEARS.indexOf(tempYear);
        
        if (dIdx !== -1) dayListRef.current?.scrollToOffset({ offset: dIdx * 50, animated: false });
        if (mIdx !== -1) monthListRef.current?.scrollToOffset({ offset: mIdx * 50, animated: false });
        if (yIdx !== -1) yearListRef.current?.scrollToOffset({ offset: yIdx * 50, animated: false });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showDatePicker]);

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
    } else if (field === 'shiftId') {
      setCurrentSelectionField('shiftId' as any);
      setCurrentOptions(shifts.map((s: any) => `${s.name} (${s.startTime} - ${s.endTime})`));
      setModalTitle(title);
      setModalVisible(true);
    }
  };

  const openDatePicker = (field: 'dateOfJoining' | 'birthDate') => {
    setPickerDateField(field);
    const currentDate = formData[field];
    if (currentDate && currentDate.includes('/')) {
      const [d, m, y] = currentDate.split('/');
      setTempDay(d || '01');
      setTempMonth(m || '01');
      setTempYear(y || CURRENT_YEAR.toString());
    } else {
      const now = new Date();
      setTempDay(now.getDate().toString().padStart(2, '0'));
      setTempMonth((now.getMonth() + 1).toString().padStart(2, '0'));
      setTempYear(now.getFullYear().toString());
    }
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    if (pickerDateField) {
      const formattedDate = `${tempDay}/${tempMonth}/${tempYear}`;
      handleInputChange(pickerDateField, formattedDate);
    }
    setShowDatePicker(false);
  };

  const handleSelectOption = (item: string) => {
    if (currentSelectionField === 'shiftId') {
      const selectedShift = shifts.find((s: any) => `${s.name} (${s.startTime} - ${s.endTime})` === item);
      if (selectedShift) {
        setFormData(prev => ({ ...prev, shiftId: selectedShift.id, shiftName: item }));
      }
    } else if (currentSelectionField) {
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

  const handleSelectPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setProfileImage({
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || `profile_${Date.now()}.jpg`,
      });
    }
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

  const {company} = useAuthStore()
  console.log(company)

  const handleSave = () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    // Build the payload matching EmployeePayload interface
    const payload: EmployeePayload = {
      companyId: company?.id || '',
      // Basic Information
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim() || undefined,
      password: formData.password || undefined,
      email: formData.email.trim() || null,
      employeeCode: formData.empCode && !isNaN(parseInt(formData.empCode, 10)) ? parseInt(formData.empCode, 10) : undefined,
      designation: formData.designation.trim() || undefined,
      phoneNumber: formData.phone.trim(),
      Country: formData.country || undefined,
      salary: formData.monthlySalary && !isNaN(parseFloat(formData.monthlySalary)) ? parseFloat(formData.monthlySalary) : undefined,
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
      numberOfCasualLeaves: formData.casualLeaves && !isNaN(parseInt(formData.casualLeaves, 10)) ? parseInt(formData.casualLeaves, 10) : 0,
      numberOfSickLeaves: formData.sickLeaves && !isNaN(parseInt(formData.sickLeaves, 10)) ? parseInt(formData.sickLeaves, 10) : 0,
      numberOfPrivilegeLeaves: formData.privilegeLeaves && !isNaN(parseInt(formData.privilegeLeaves, 10)) ? parseInt(formData.privilegeLeaves, 10) : 0,
      numberOfEmergencyLeaves: formData.emergencyLeaves && !isNaN(parseInt(formData.emergencyLeaves, 10)) ? parseInt(formData.emergencyLeaves, 10) : 0,
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
      shiftId: formData.shiftId || undefined,
    };

    console.log('Sending payload:', payload);

    // Call the API mutation
    onboardEmployee(payload, {
      onSuccess: (data: any) => {
        console.log('Employee onboarded successfully:', data);
        const employeeId = data?.data?.id;

        if (employeeId && profileImage) {
          // Upload profile picture if selected
          uploadProfilePicture({
            employeeId,
            file: profileImage
          }, {
            onSuccess: () => {
              Alert.alert(
                'Success',
                'Staff member added and profile picture uploaded successfully!',
                [{ text: 'OK', onPress: () => onClose && onClose() }]
              );
            },
            onError: (err: any) => {
              console.error('Error uploading profile picture:', err);
              Alert.alert(
                'Partial Success',
                'Staff member added, but profile picture upload failed.',
                [{ text: 'OK', onPress: () => onClose && onClose() }]
              );
            }
          });
        } else {
          Alert.alert(
            'Success',
            'Staff member has been added successfully!',
            [{ text: 'OK', onPress: () => onClose && onClose() }]
          );
        }
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add New Staff</Text>
        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={[styles.avatarPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]} 
            onPress={handleSelectPhoto}
            activeOpacity={0.8}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={styles.avatarImagePreview} />
            ) : (
              <Ionicons name="person" size={50} color={colors.textSecondary} />
            )}
            <View style={[styles.cameraIconBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.uploadText, { color: colors.textSecondary }]}>{profileImage ? 'Change Photo' : 'Upload Photo'}</Text>
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
          <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput 
              style={[styles.input, { color: colors.text }]} 
              placeholder="Enter phone number" 
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
            <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
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
          label="Assigned Shift" 
          value={formData.shiftName} 
          placeholder="Select Shift"
          onPress={() => openSelector('shiftId' as any, 'Select Shift')} 
        />

        <DropdownItem 
          label="Week Off Day" 
          value={formData.weekOff} 
          placeholder="Select Day"
          onPress={() => openSelector('weekOff', 'Select Weekly Off')} 
        />

        <ToggleItem label="Overtime Applicable" subLabel="Calculate overtime for this staff" value={overtime} onValueChange={setOvertime} />
        <ToggleItem label="Shiftwise Attendance" subLabel="Assign specific shifts" value={shiftwise} onValueChange={setShiftwise} />

        {/* Leaves */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Leave Balance</Text>
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
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>

        <TouchableOpacity onPress={() => openDatePicker('dateOfJoining')} activeOpacity={0.7}>
          <View pointerEvents="none">
            <InputItem 
              label="Date of Joining" 
              placeholder="DD/MM/YYYY" 
              value={formData.dateOfJoining} 
              onChange={() => {}} 
            />
          </View>
        </TouchableOpacity>

        <View style={styles.row}>
          <DropdownItem label="Gender" isHalf value={formData.gender} placeholder="Select" onPress={() => openSelector('gender', 'Select Gender')} />
          <DropdownItem label="Employee" isHalf value={formData.employeeType} placeholder="Select" onPress={() => openSelector('employeeType', 'Employee Type')} />
        </View>

        <DropdownItem label="Category" value={formData.category} placeholder="Select Category" onPress={() => openSelector('category', 'Select Category')} />

        <InputItem label="Email Address" keyboardType="email-address" value={formData.email} onChange={(text: string) => handleInputChange('email', text)} />
        
        {/* Banking */}
        <View style={styles.sectionHeaderRow}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Bank Details</Text>
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
        
        <TouchableOpacity onPress={() => openDatePicker('birthDate')} activeOpacity={0.7}>
          <View pointerEvents="none">
            <InputItem 
              label="Birth Date" 
              placeholder="DD/MM/YYYY" 
              value={formData.birthDate} 
              onChange={() => {}} 
            />
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, {marginTop: 15}]}>Emergency Contact</Text>
        <InputItem label="Contact Name" value={formData.emergencyName} onChange={(text: string) => handleInputChange('emergencyName', text)} />
        <InputItem label="Contact Phone" keyboardType="phone-pad" value={formData.emergencyPhone} onChange={(text: string) => handleInputChange('emergencyPhone', text)} />

        <DropdownItem label="Geofence Rule" value={formData.geofence} placeholder="Select Rule" onPress={() => openSelector('geofence', 'Geofence Rule')} />

        {/* Advanced Toggles */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Advanced Settings</Text>
        
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
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{modalTitle}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={currentOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isShift = currentSelectionField === 'shiftId';
              const parts = isShift ? item.match(/^(.*)\s\((.*)\)$/) : null;
              const displayName = parts ? parts[1] : item;
              const displayTime = parts ? parts[2] : null;
              const isSelected = isShift 
                ? formData.shiftName === item 
                : currentSelectionField && (formData as any)[currentSelectionField] === item;

              return (
                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomColor: colors.border }]} 
                  onPress={() => handleSelectOption(item)}
                >
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 10 }}>
                    <Text style={[
                        styles.modalItemText, 
                        { color: colors.text },
                        isSelected ? { color: colors.primary, fontWeight: 'bold' } : {}
                    ]}>
                      {displayName}
                    </Text>
                    {isShift && displayTime && (
                      <Text style={[styles.modalItemText, { color: colors.textSecondary, fontSize: 13 }]}>
                        {displayTime}
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                   <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>

      {/* --- MODAL FOR DATE PICKER (PROFESSIONAL WHEEL STYLE) --- */}
      <Modal animationType="slide" transparent={true} visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.datePickerOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.datePickerBottomContent, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {/* Sheet Handle */}
          <View style={[styles.sheetHandle, { backgroundColor: isDark ? colors.border : '#E2E8F0' }]} />

          <View style={styles.datePickerHeader}>
            <View>
               <Text style={[styles.datePickerTitle, { color: colors.text }]}>
                 {pickerDateField === 'dateOfJoining' ? 'Joining Date' : 'Birth Date'}
               </Text>
               <Text style={[styles.datePickerSubTitle, { color: colors.textSecondary }]}>Scroll to select the date</Text>
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(false)} style={[styles.closeBtnCircle, { borderColor: colors.border }]}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.wheelLabelRow}>
            <Text style={[styles.wheelColumnLabel, { color: colors.primary }]}>DAY</Text>
            <Text style={[styles.wheelColumnLabel, { color: colors.primary }]}>MONTH</Text>
            <Text style={[styles.wheelColumnLabel, { color: colors.primary }]}>YEAR</Text>
          </View>

          <View style={[styles.wheelMainContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.wheelRow}>
              {/* Day Wheel */}
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={dayListRef}
                  data={DAYS}
                  keyExtractor={(item) => `day-${item}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.wheelItem}
                      onPress={() => {
                        dayListRef.current?.scrollToOffset({ offset: index * 50, animated: true });
                        setTempDay(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.wheelText, { color: colors.textSecondary }, tempDay === item && [styles.wheelTextSelected, { color: colors.text }]]}>
                        {item}
                      </Text>
                      {tempDay === item && <View style={[styles.wheelUnderline, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  scrollEventThrottle={16}
                  initialScrollIndex={Math.max(0, DAYS.indexOf(tempDay))}
                  getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
                  contentContainerStyle={{ paddingVertical: 100 }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 50);
                    if (DAYS[index]) setTempDay(DAYS[index]);
                  }}
                  onScrollToIndexFailed={() => {}}
                />
              </View>

              {/* Month Wheel */}
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={monthListRef}
                  data={MONTHS}
                  keyExtractor={(item) => `month-${item.value}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.wheelItem}
                      onPress={() => {
                        monthListRef.current?.scrollToOffset({ offset: index * 50, animated: true });
                        setTempMonth(item.value);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.wheelText, { color: colors.textSecondary }, tempMonth === item.value && [styles.wheelTextSelected, { color: colors.text }]]}>
                        {item.label}
                      </Text>
                      {tempMonth === item.value && <View style={[styles.wheelUnderline, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  scrollEventThrottle={16}
                  initialScrollIndex={Math.max(0, MONTHS.findIndex(m => m.value === tempMonth))}
                  getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
                  contentContainerStyle={{ paddingVertical: 100 }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 50);
                    if (MONTHS[index]) setTempMonth(MONTHS[index].value);
                  }}
                  onScrollToIndexFailed={() => {}}
                />
              </View>

              {/* Year Wheel */}
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={yearListRef}
                  data={YEARS}
                  keyExtractor={(item) => `year-${item}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.wheelItem}
                      onPress={() => {
                        yearListRef.current?.scrollToOffset({ offset: index * 50, animated: true });
                        setTempYear(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.wheelText, { color: colors.textSecondary }, tempYear === item && [styles.wheelTextSelected, { color: colors.text }]]}>
                        {item}
                      </Text>
                      {tempYear === item && <View style={[styles.wheelUnderline, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  scrollEventThrottle={16}
                  initialScrollIndex={Math.max(0, YEARS.indexOf(tempYear))}
                  getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
                  contentContainerStyle={{ paddingVertical: 100 }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 50);
                    if (YEARS[index]) setTempYear(YEARS[index]);
                  }}
                  onScrollToIndexFailed={() => {}}
                />
              </View>
            </View>

            {/* Premium Wheel Vignette (Fade Gradient) */}
            <LinearGradient colors={[colors.background, isDark ? 'rgba(15,23,42,0)' : 'rgba(255,255,255,0)']} style={styles.wheelVignetteTop} pointerEvents="none" />
            <LinearGradient colors={[isDark ? 'rgba(15,23,42,0)' : 'rgba(255,255,255,0)', colors.background]} style={styles.wheelVignetteBottom} pointerEvents="none" />
          </View>

          <View style={styles.wheelActionRow}>
             <TouchableOpacity style={[styles.wheelCancelBtn, { borderColor: colors.border }]} onPress={() => setShowDatePicker(false)}>
               <Text style={[styles.wheelCancelText, { color: colors.textSecondary }]}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.wheelConfirmBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={confirmDate}>
               <Text style={styles.wheelConfirmText}>Confirm Selection</Text>
             </TouchableOpacity>
          </View>
          <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
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

const InputItem: React.FC<InputItemProps> = ({ label, placeholder, value, onChange, isHalf, isPassword, keyboardType }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.inputContainer, isHalf && styles.halfInput]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder || `Enter ${label}`}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    </View>
  );
};

interface DropdownItemProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  isHalf?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, isHalf, placeholder, value, onPress }) => {
  const { colors } = useTheme();
  const parts = value ? value.match(/^(.*)\s\((.*)\)$/) : null;
  const mainValue = parts ? parts[1] : value;
  const subValue = parts ? parts[2] : null;

  return (
    <View style={[styles.inputContainer, isHalf && styles.halfInput]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity style={[styles.dropdownBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 10 }}>
          <Text style={[styles.dropdownText, { color: colors.text }, !value && { color: colors.textSecondary }]}>
            {mainValue || placeholder}
          </Text>
          {subValue && (
            <Text style={[styles.dropdownText, { color: colors.textSecondary, fontSize: 13 }]}>
              {subValue}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

interface ToggleItemProps {
  label: string;
  subLabel: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, subLabel, value, onValueChange }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.toggleContainer, { borderBottomColor: colors.border }]}>
      <View style={styles.toggleTextContainer}>
        <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.toggleSubLabel, { color: colors.textSecondary }]}>{subLabel}</Text>
      </View>
      <Switch
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? '#fff' : '#CBD5E1'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 10, paddingHorizontal: 20, paddingBottom: 15, zIndex: 10,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  iconButton: { padding: 5 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  saveText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  avatarSection: { alignItems: 'center', marginVertical: 25 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2,
  },
  cameraIconBadge: {
    position: 'absolute', bottom: 0, right: 0,
    padding: 8, borderRadius: 20, borderWidth: 2,
  },
  uploadText: { marginTop: 10, fontWeight: '600' },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputContainer: { marginBottom: 20, width: '100%' },
  halfInput: { width: '48%' },
  
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 },
  
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 15, height: 50,
  },
  input: { flex: 1, fontSize: 15 },

  dropdownBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 15, height: 50,
  },
  dropdownText: { fontSize: 15, fontWeight: '500' },

  toggleContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1,
  },
  toggleTextContainer: { flex: 1, paddingRight: 15 },
  toggleLabel: { fontSize: 16, fontWeight: '600' },
  toggleSubLabel: { fontSize: 12, marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  divider: { height: 1, marginVertical: 25 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    borderTopLeftRadius: 25, borderTopRightRadius: 25,
    maxHeight: height * 0.7, padding: 20, position: 'absolute', bottom: 0, width: '100%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalItem: {
    paddingVertical: 16, borderBottomWidth: 1,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  modalItemText: { fontSize: 16 },
  avatarImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },

  // Date Picker Styles
  datePickerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)'
  },
  datePickerBottomContent: {
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingHorizontal: 28, paddingVertical: 24, position: 'absolute', bottom: 0, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -15 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 30,
    borderTopWidth: 1.5,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 10, alignSelf: 'center', marginBottom: 20
  },
  datePickerHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 
  },
  datePickerTitle: {
    fontSize: 26, fontWeight: '900', letterSpacing: -0.5
  },
  datePickerSubTitle: {
    fontSize: 14, fontWeight: '500', marginTop: 4
  },
  closeBtnCircle: {
     padding: 8, borderRadius: 25, borderWidth: 1,
  },
  wheelMainContainer: {
    height: 250, justifyContent: 'center', borderRadius: 32,
    overflow: 'hidden', borderWidth: 1,
  },
  wheelSelectionBar: {
    position: 'absolute', top: '50%', left: 12, right: 12, height: 60,
    marginTop: -30, borderRadius: 20, borderWidth: 1.5,
  },
  wheelRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'
  },
  wheelColumn: {
    flex: 1, height: '100%', alignItems: 'center'
  },
  wheelLabelRow: {
    flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 12, paddingHorizontal: 12
  },
  wheelColumnLabel: {
    flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '900', letterSpacing: 2.5
  },
  wheelItem: {
    height: 50, width: '100%', justifyContent: 'center', alignItems: 'center'
  },
  wheelText: {
    fontSize: 18, fontWeight: '600'
  },
  wheelTextSelected: {
    fontWeight: '900', fontSize: 24
  },
  wheelUnderline: {
    height: 3, width: 28, borderRadius: 2,
    position: 'absolute', bottom: 6,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5
  },
  wheelVignetteTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 90
  },
  wheelVignetteBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 90
  },
  wheelActionRow: {
     flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 30
  },
  wheelCancelBtn: {
    flex: 1, paddingVertical: 18, borderRadius: 22, alignItems: 'center', borderWidth: 1.5,
  },
  wheelCancelText: {
    fontSize: 16, fontWeight: '700'
  },
  wheelConfirmBtn: {
    flex: 2, paddingVertical: 18, borderRadius: 22, alignItems: 'center',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 12
  },
  wheelConfirmText: {
    color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.8
  },
});

export default AddStaffScreen;