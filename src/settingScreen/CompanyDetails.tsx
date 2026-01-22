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
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom Component for the "Label on Border" Input style
interface OutlinedInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const OutlinedInput = ({ label, value, onChangeText, multiline = false, keyboardType = 'default' }: OutlinedInputProps) => {
  return (
    <View style={[styles.inputContainer, multiline && { height: 100 }]}>
      <View style={[styles.inputBorder, multiline && { height: 100, alignItems: 'flex-start' }]}>
        <TextInput
          style={[styles.textInput, multiline && { textAlignVertical: 'top', paddingTop: 15 }]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#64748B"
          multiline={multiline}
          keyboardType={keyboardType}
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

  // Form State
  const [formData, setFormData] = useState({
    companyName: 'Symbosys',
    gstin: '',
    address: '',
    phone: '917992202650',
    email: '',
  });

  const handleChange = (key: string, val: string) => {
    setFormData({ ...formData, [key]: val });
  };

  return (
    // Replaced View with SafeAreaView
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Company Details</Text>

        <TouchableOpacity onPress={() => console.log('Update Pressed')}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Company Name */}
        <OutlinedInput 
          label="Company Name" 
          value={formData.companyName} 
          onChangeText={(t) => handleChange('companyName', t)}
        />

        {/* GSTIN */}
        <OutlinedInput 
          label="GSTIN" 
          value={formData.gstin} 
          onChangeText={(t) => handleChange('gstin', t)}
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
          <TouchableOpacity style={styles.dropdownBox} activeOpacity={0.8}>
            <Text style={styles.dropdownText}>Calendar Days (Week-offs Paid)</Text>
            <Ionicons name="caret-down" size={16} color="#FFF" />
          </TouchableOpacity>

          {/* Helper Text */}
          <Text style={styles.helperText}>
            Daily rate = Monthly salary ÷ Total calendar days.{'\n'}
            Week-offs are paid (30/31).
          </Text>
        </View>

      </ScrollView>
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
});

export default CompanyDetails;