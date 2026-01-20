
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
// Changed to FontAwesome5 for more attractive icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddPayrollHead = ({ navigation }: any) => {
  const [entryType, setEntryType] = useState('Deduction');
  const [valueType, setValueType] = useState('Fixed Amount');
  const [attendanceType, setAttendanceType] = useState('On Attendance');
  const [amount, setAmount] = useState('5000');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payroll Head</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Entry Type */}
        <Text style={styles.label}>Entry Type</Text>
        <View style={styles.entryTypeContainer}>
          <TouchableOpacity 
            style={[styles.entryTypeBtn, entryType === 'Benefit' && styles.entryTypeBtnActive]}
            onPress={() => setEntryType('Benefit')}
          >
            {/* Attractive Plus Icon */}
            <FontAwesome5 
              name="plus-circle" 
              size={18} 
              color={entryType === 'Benefit' ? '#000' : '#64748B'} 
            />
            <Text style={[styles.entryTypeText, entryType === 'Benefit' && styles.entryTypeTextActive]}> Benefit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.entryTypeBtn, entryType === 'Deduction' && styles.entryTypeBtnActiveDeduction]}
            onPress={() => setEntryType('Deduction')}
          >
            {/* Attractive Check Icon */}
             <FontAwesome5 
              name="check-circle" 
              size={18} 
              color={entryType === 'Deduction' ? '#000' : '#64748B'} 
              style={{marginRight: 6}}
            />
            <Text style={[styles.entryTypeText, entryType === 'Deduction' && styles.entryTypeTextActive]}>Deduction</Text>
          </TouchableOpacity>
        </View>

        {/* Deduction Name */}
        <Text style={styles.label}>Deduction Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Professional Tax"
          placeholderTextColor="#9CA3AF"
        />

        {/* Value Type - Custom Buttons */}
        <Text style={styles.label}>Value Type</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.optionBtn, valueType === 'Fixed Amount' ? styles.optionBtnSelected : styles.optionBtnUnselected]}
            onPress={() => setValueType('Fixed Amount')}
          >
            {/* Show dot only if selected */}
            <View style={valueType === 'Fixed Amount' ? styles.dotSelected : styles.dotUnselected} />
            <Text style={[styles.optionText, valueType === 'Fixed Amount' && styles.optionTextSelected]}>Fixed Amount</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionBtn, valueType === 'Percentage' ? styles.optionBtnSelected : styles.optionBtnUnselected]}
            onPress={() => setValueType('Percentage')}
          >
             <View style={valueType === 'Percentage' ? styles.dotSelected : styles.dotUnselected} />
            <Text style={styles.optionText}>Percentage</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.currencyInputContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput 
            style={styles.currencyInput} 
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Attendance Type - Grey Chips */}
        <Text style={styles.label}>Attendance Type</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.chipBtn, attendanceType === 'On Attendance' ? styles.chipBtnSelected : styles.chipBtnUnselected]}
            onPress={() => setAttendanceType('On Attendance')}
          >
             <View style={styles.radioCircleUnselected} />
            <Text style={styles.chipText}>On Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chipBtn, attendanceType === 'Flat rate' ? styles.chipBtnSelected : styles.chipBtnUnselected]}
            onPress={() => setAttendanceType('Flat rate')}
          >
            <View style={styles.radioCircleUnselected} />
            <Text style={styles.chipText}>Flat rate</Text>
          </TouchableOpacity>
        </View>

        {/* Applicable Months */}
        <Text style={styles.label}>Applicable Months</Text>
        <TouchableOpacity style={styles.dropdownInput}>
          <Text style={styles.dropdownPlaceholder}>Select the months and years</Text>
          {/* Replaced generic plus with attractive Calendar-Plus icon */}
          <FontAwesome5 name="calendar-plus" size={20} color="#335C8D" />
        </TouchableOpacity>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Deduction</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    backgroundColor: '#E8F1FC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    fontWeight: '500',
  },
  
  // Entry Type Toggle
  entryTypeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 8,
    marginBottom: 24,
    height: 48,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  entryTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  entryTypeBtnActive: {
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderColor: '#94A3B8',
  },
  entryTypeBtnActiveDeduction: {
    backgroundColor: '#DCE7FA',
    borderLeftWidth: 1,
    borderColor: '#94A3B8',
  },
  entryTypeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 8, // Increased margin for new icon
  },
  entryTypeTextActive: {
    color: '#000',
    fontWeight: '600',
  },

  // Inputs
  input: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    fontSize: 16,
    color: '#000',
  },

  // Custom Option Buttons (Value Type)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionBtnSelected: {
    backgroundColor: '#DCE7FA',
    borderColor: '#335C8D',
  },
  optionBtnUnselected: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  dotSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginRight: 8,
  },
  dotUnselected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  optionTextSelected: {
    color: '#000',
    fontWeight: '600',
  },

  // Amount
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#4B5563',
    marginRight: 10,
  },
  currencyInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },

  // Attendance Chips
  chipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  chipBtnSelected: {
     backgroundColor: '#E5E7EB',
  },
  chipBtnUnselected: {
    backgroundColor: '#E5E7EB',
  },
  radioCircleUnselected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    marginRight: 8,
  },
  chipText: {
    color: '#4B5563',
    fontSize: 14,
  },

  // Dropdown
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  dropdownPlaceholder: {
    color: '#4B5563',
    fontSize: 16,
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: '#F8F9FB',
  },
  addButton: {
    backgroundColor: '#335C8D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddPayrollHead;