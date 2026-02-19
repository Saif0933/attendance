
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// Changed to FontAwesome5 for more attractive icons
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          <Ionicons name="arrow-back" size={24} color="#FFF" />
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
    backgroundColor: '#0A2540',
  },
  header: {
    backgroundColor: '#0A2540',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#F4F7FA',
    padding: 24,
  },
  label: {
    fontSize: 15,
    color: '#1A202C',
    marginBottom: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  entryTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    height: 52,
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
    backgroundColor: '#E0F2FE',
    borderRightWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  entryTypeBtnActiveDeduction: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  entryTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 10,
  },
  entryTypeTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },

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
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionBtnSelected: {
    backgroundColor: '#0A2540',
    borderColor: '#0A2540',
  },
  optionBtnUnselected: {
    backgroundColor: '#FFF',
    borderColor: '#E2E8F0',
  },
  dotSelected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
    marginRight: 10,
  },
  dotUnselected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '700',
    marginRight: 12,
  },
  currencyInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '800',
  },

  chipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  chipBtnSelected: {
    borderColor: '#FF9500',
    backgroundColor: 'rgba(255, 149, 0, 0.05)',
  },
  chipBtnUnselected: {
    borderColor: '#E2E8F0',
  },
  radioCircleUnselected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 10,
  },
  chipText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },

  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
  },
  dropdownPlaceholder: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },

  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addButton: {
    backgroundColor: '#0A2540',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    shadowColor: "#0A2540",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default AddPayrollHead;