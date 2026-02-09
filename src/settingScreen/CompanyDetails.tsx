// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // Custom Component for the "Label on Border" Input style
// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChangeText?: (text: string) => void;
//   multiline?: boolean;
//   keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
// }

// const OutlinedInput = ({ label, value, onChangeText, multiline = false, keyboardType = 'default' }: OutlinedInputProps) => {
//   return (
//     <View style={[styles.inputContainer, multiline && { height: 100 }]}>
//       <View style={[styles.inputBorder, multiline && { height: 100, alignItems: 'flex-start' }]}>
//         <TextInput
//           style={[styles.textInput, multiline && { textAlignVertical: 'top', paddingTop: 15 }]}
//           value={value}
//           onChangeText={onChangeText}
//           placeholderTextColor="#64748B"
//           multiline={multiline}
//           keyboardType={keyboardType}
//         />
//       </View>
//       {/* The Label sits on top of the border */}
//       <View style={styles.labelContainer}>
//         <Text style={styles.labelText}>{label}</Text>
//       </View>
//     </View>
//   );
// };

// const CompanyDetails = () => {
//   const navigation = useNavigation();

//   // Form State
//   const [formData, setFormData] = useState({
//     companyName: 'Symbosys',
//     gstin: '',
//     address: '',
//     phone: '917992202650',
//     email: '',
//   });

//   const handleChange = (key: string, val: string) => {
//     setFormData({ ...formData, [key]: val });
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

//       {/* --- Header --- */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>
        
//         <Text style={styles.headerTitle}>Company Details</Text>

//         <TouchableOpacity onPress={() => console.log('Update Pressed')}>
//           <Text style={styles.updateText}>Update</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
        
//         {/* Company Name */}
//         <OutlinedInput 
//           label="Company Name" 
//           value={formData.companyName} 
//           onChangeText={(t) => handleChange('companyName', t)}
//         />

//         {/* GSTIN */}
//         <OutlinedInput 
//           label="GSTIN" 
//           value={formData.gstin} 
//           onChangeText={(t) => handleChange('gstin', t)}
//         />

//         {/* Address (Multiline) */}
//         <OutlinedInput 
//           label="Address" 
//           value={formData.address} 
//           onChangeText={(t) => handleChange('address', t)}
//           multiline={true}
//         />

//         {/* Phone Number */}
//         <OutlinedInput 
//           label="Phone Number" 
//           value={formData.phone} 
//           onChangeText={(t) => handleChange('phone', t)}
//           keyboardType="phone-pad"
//         />

//         {/* Email */}
//         <OutlinedInput 
//           label="Email" 
//           value={formData.email} 
//           onChangeText={(t) => handleChange('email', t)}
//           keyboardType="email-address"
//         />

//         {/* --- Pay Period Section --- */}
//         <View style={styles.payPeriodContainer}>
//           <Text style={styles.sectionLabel}>Pay Period</Text>
          
//           {/* Dropdown Box */}
//           <TouchableOpacity style={styles.dropdownBox} activeOpacity={0.8}>
//             <Text style={styles.dropdownText}>Calendar Days (Week-offs Paid)</Text>
//             <Ionicons name="caret-down" size={16} color="#FFF" />
//           </TouchableOpacity>

//           {/* Helper Text */}
//           <Text style={styles.helperText}>
//             Daily rate = Monthly salary ÷ Total calendar days.{'\n'}
//             Week-offs are paid (30/31).
//           </Text>
//         </View>

//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0F172A', // Dark Slate Background
//   },
//   // --- Header Styles ---
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E293B',
//     marginTop: Platform.OS === 'android' ? 20 : 0,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#FFF',
//     flex: 1,
//     marginLeft: 16,
//   },
//   updateText: {
//     color: '#3B82F6', // Blue color
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   content: {
//     padding: 20,
//     paddingTop: 30,
//   },

//   // --- Outlined Input Styles ---
//   inputContainer: {
//     marginBottom: 25,
//     height: 56,
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   inputBorder: {
//     borderWidth: 1.5,
//     borderColor: '#94A3B8', // Slate 400
//     borderRadius: 8,
//     height: '100%',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//   },
//   textInput: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//     padding: 0, // Removes default Android padding
//   },
//   labelContainer: {
//     position: 'absolute',
//     top: -10,
//     left: 12,
//     backgroundColor: '#0F172A', // Matches background to hide border
//     paddingHorizontal: 4,
//     zIndex: 1,
//   },
//   labelText: {
//     color: '#FFF', // White label
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   // --- Pay Period Section Styles ---
//   payPeriodContainer: {
//     marginTop: 10,
//   },
//   sectionLabel: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFF',
//     marginBottom: 12,
//   },
//   dropdownBox: {
//     borderWidth: 1.5,
//     borderColor: '#FFF',
//     borderRadius: 8,
//     height: 56,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     backgroundColor: 'transparent',
//   },
//   dropdownText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   helperText: {
//     marginTop: 12,
//     color: '#94A3B8', // Grey text
//     fontSize: 13,
//     lineHeight: 20,
//     fontWeight: '500',
//     fontStyle: 'italic', // Matches the slight italic look in image
//   },
// });

// export default CompanyDetails;



import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetCompanyById, useOnboardCompany } from '../../api/hook/company/onBoarding/useCompany';
import { useAuthStore } from '../store/useAuthStore';
import { showSuccess } from '../utils/meesage';

// Custom Component for the "Label on Border" Input style
interface OutlinedInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  editable?: boolean;
}

const OutlinedInput = ({ 
  label, 
  value, 
  onChangeText, 
  multiline = false, 
  keyboardType = 'default',
  editable = true 
}: OutlinedInputProps) => {
  return (
    <View style={[styles.inputContainer, multiline && { height: 100 }]}>
      <View style={[
        styles.inputBorder, 
        multiline && { height: 100, alignItems: 'stretch' }, 
        !editable && { opacity: 0.6 }
      ]}>
        <TextInput
          style={[
            styles.textInput, 
            { flex: 1, width: '100%' },
            multiline && { textAlignVertical: 'top', paddingTop: 12 }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#64748B"
          multiline={multiline}
          keyboardType={keyboardType}
          editable={editable}
          underlineColorAndroid="transparent"
        />
      </View>
      {/* The Label sits on top of the border */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
};

const CompanyDetails = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { company, setAuth, token } = useAuthStore();
  
  // Fetch Company Data
  const { data: companyData, isLoading } = useGetCompanyById(company?.id as string);
  
  // Update Mutation
  const onboardMutation = useOnboardCompany();

  // Pay Period Mapping
  const PAY_PERIOD_MAP: Record<string, string> = {
    '30 days (fixed)': 'FIXED_30_DAYS',
    'calendar (week-offs paid)': 'WEEK_OFF_PAID',
    'calendar (week-offs unpaid)': 'WEEK_OFF_UNPAID',
  };

  const REVERSE_PAY_PERIOD_MAP: Record<string, string> = {
    'FIXED_30_DAYS': '30 days (fixed)',
    'WEEK_OFF_PAID': 'calendar (week-offs paid)',
    'WEEK_OFF_UNPAID': 'calendar (week-offs unpaid)',
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    code: '',
    payPeriod: 'calendar (week-offs paid)',
  });

  // Sync state with fetched data
  useEffect(() => {
    // Backend might return company directly, or inside 'company' or 'data' key
    const c = companyData?.company || companyData?.data || companyData;
    
    if (c && (c.id || c.name)) {
      console.log('Syncing form data with:', c);
      setFormData({
        name: c.name || '',
        gstNumber: c.gstNumber || '',
        address: c.address || '',
        phone: c.phone || '',
        email: c.email || '',
        code: c.code || '',
        payPeriod: REVERSE_PAY_PERIOD_MAP[c.payPeriod] || 'calendar (week-offs paid)',
      });
    }
  }, [companyData]);

  const handleChange = (key: string, val: string) => {
    setFormData({ ...formData, [key]: val });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        payPeriod: PAY_PERIOD_MAP[formData.payPeriod] || formData.payPeriod,
      };

      console.log('Sending Update Payload:', payload);
      
      const response = await onboardMutation.mutateAsync(payload);
      
      if (response?.success && response?.company) {
        // Update both store and query cache for instant reflected changes
        setAuth(token as string, response.company);
        queryClient.setQueryData(['company', company?.id], response);
        showSuccess('Company updated successfully');
      } else {
        // Fallback for different response structures
        const updatedComp = response?.company || response?.data || response;
        if (updatedComp && (updatedComp.id || updatedComp.name)) {
          setAuth(token as string, updatedComp);
          queryClient.setQueryData(['company', company?.id], response);
        }
        showSuccess('Company updated successfully');
        queryClient.invalidateQueries({ queryKey: ['company', company?.id] });
      }
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

  const payPeriodOptions = [
    '30 days (fixed)',
    'calendar (week-offs paid)',
    'calendar (week-offs unpaid)',
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePayPeriodSelect = (option: string) => {
    setFormData({ ...formData, payPeriod: option });
    setIsModalVisible(false);
  };

  const getHelperText = (period: string) => {
    switch (period.toLowerCase()) {
      case '30 days (fixed)':
        return 'Daily rate = Monthly salary ÷ 30 days.\nFixed calculation regardless of month length.';
      case 'calendar (week-offs paid)':
        return 'Daily rate = Monthly salary ÷ Total calendar days.\nWeek-offs are paid (30/31).';
      case 'calendar (week-offs unpaid)':
        return 'Daily rate = Monthly salary ÷ Total calendar days.\nWeek-offs are excluded from pay calculation.';
      default:
        return 'Daily rate calculation based on your selection.';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Company Details</Text>

        <TouchableOpacity 
          onPress={handleUpdate} 
          disabled={onboardMutation.isPending}
        >
          {onboardMutation.isPending ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Text style={styles.updateText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Company Name */}
        <OutlinedInput 
          label="Company Name" 
          value={formData.name} 
          onChangeText={(t) => handleChange('name', t)}
        />

        {/* Company Code (Read-only usually, or as needed) */}
        <OutlinedInput 
          label="Company Code" 
          value={formData.code} 
          onChangeText={(t) => handleChange('code', t)}
          editable={false}
        />

        {/* GSTIN */}
        <OutlinedInput 
          label="GSTIN" 
          value={formData.gstNumber} 
          onChangeText={(t) => handleChange('gstNumber', t)}
        />

        {/* Address (Multiline) */}
        <OutlinedInput 
          label="Address" 
          value={formData.address} 
          onChangeText={(t) => handleChange('address', t)}
          multiline={true}
        />

        {/* Phone Number */}
        <OutlinedInput 
          label="Phone Number" 
          value={formData.phone} 
          onChangeText={(t) => handleChange('phone', t)}
          keyboardType="phone-pad"
        />

        {/* Email */}
        <OutlinedInput 
          label="Email" 
          value={formData.email} 
          onChangeText={(t) => handleChange('email', t)}
          keyboardType="email-address"
        />

        {/* --- Pay Period Section --- */}
        <View style={styles.payPeriodContainer}>
          <Text style={styles.sectionLabel}>Pay Period</Text>
          
          {/* Dropdown Box */}
          <TouchableOpacity 
            style={styles.dropdownBox} 
            activeOpacity={0.7}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.dropdownText}>{formData.payPeriod}</Text>
            <Ionicons name="caret-down" size={16} color="#FFF" />
          </TouchableOpacity>

          {/* Helper Text */}
          <Text style={styles.helperText}>
            {getHelperText(formData.payPeriod)}
          </Text>
        </View>

      </ScrollView>

      {/* Pay Period Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Pay Period</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            {payPeriodOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  formData.payPeriod === option && styles.selectedOption
                ]}
                onPress={() => handlePayPeriodSelect(option)}
              >
                <Text style={[
                  styles.optionText,
                  formData.payPeriod === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                {formData.payPeriod === option && (
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark Slate Background
  },
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    marginLeft: 16,
  },
  updateText: {
    color: '#3B82F6', // Blue color
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },

  // --- Outlined Input Styles ---
  inputContainer: {
    marginBottom: 25,
    height: 56,
    justifyContent: 'center',
    position: 'relative',
  },
  inputBorder: {
    borderWidth: 1.5,
    borderColor: '#94A3B8', // Slate 400
    borderRadius: 8,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  textInput: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    padding: 0, // Removes default Android padding
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#0F172A', // Matches background to hide border
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelText: {
    color: '#FFF', // White label
    fontSize: 14,
    fontWeight: '700',
  },

  // --- Pay Period Section Styles ---
  payPeriodContainer: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  dropdownBox: {
    borderWidth: 1.5,
    borderColor: '#FFF',
    borderRadius: 8,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 12,
    color: '#94A3B8', // Grey text
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    fontStyle: 'italic', // Matches the slight italic look in image
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#0F172A',
  },
  selectedOption: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#FFF',
  },
});

export default CompanyDetails;