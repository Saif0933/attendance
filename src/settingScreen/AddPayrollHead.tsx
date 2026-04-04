
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
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
import { useTheme } from '../theme/ThemeContext';

const AddPayrollHead = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const [entryType, setEntryType] = useState('Deduction');
  const [valueType, setValueType] = useState('Fixed Amount');
  const [attendanceType, setAttendanceType] = useState('On Attendance');
  const [amount, setAmount] = useState('5000');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Payroll Head</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
        
        {/* Entry Type */}
        <Text style={[styles.label, { color: colors.text }]}>Entry Type</Text>
        <View style={[styles.entryTypeContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.entryTypeBtn, 
              { backgroundColor: colors.surface },
              entryType === 'Benefit' && [styles.entryTypeBtnActive, { backgroundColor: isDark ? 'rgba(0, 122, 255, 0.15)' : '#E0F2FE' }]
            ]}
            onPress={() => setEntryType('Benefit')}
          >
            {/* Attractive Plus Icon */}
            <FontAwesome5 
              name="plus-circle" 
              size={18} 
              color={entryType === 'Benefit' ? (isDark ? colors.primary : '#000') : colors.textSecondary} 
            />
            <Text style={[
              styles.entryTypeText, 
              { color: colors.textSecondary },
              entryType === 'Benefit' && [styles.entryTypeTextActive, { color: colors.text }]
            ]}> Benefit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.entryTypeBtn, 
              { backgroundColor: colors.surface },
              entryType === 'Deduction' && [styles.entryTypeBtnActiveDeduction, { backgroundColor: isDark ? 'rgba(255, 149, 0, 0.15)' : '#FEF3C7' }]
            ]}
            onPress={() => setEntryType('Deduction')}
          >
            {/* Attractive Check Icon */}
             <FontAwesome5 
              name="check-circle" 
              size={18} 
              color={entryType === 'Deduction' ? (isDark ? '#FF9500' : '#000') : colors.textSecondary} 
              style={{marginRight: 6}}
            />
            <Text style={[
              styles.entryTypeText, 
              { color: colors.textSecondary },
              entryType === 'Deduction' && [styles.entryTypeTextActive, { color: colors.text }]
            ]}>Deduction</Text>
          </TouchableOpacity>
        </View>

        {/* Deduction Name */}
        <Text style={[styles.label, { color: colors.text }]}>Deduction Name</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
          placeholder="e.g., Professional Tax"
          placeholderTextColor={colors.textSecondary}
        />

        {/* Value Type - Custom Buttons */}
        <Text style={[styles.label, { color: colors.text }]}>Value Type</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[
              styles.optionBtn, 
              { borderColor: colors.border },
              valueType === 'Fixed Amount' ? [styles.optionBtnSelected, { backgroundColor: colors.primary, borderColor: colors.primary }] : [styles.optionBtnUnselected, { backgroundColor: colors.surface }]
            ]}
            onPress={() => setValueType('Fixed Amount')}
          >
            {/* Show dot only if selected */}
            <View style={valueType === 'Fixed Amount' ? styles.dotSelected : [styles.dotUnselected, { borderColor: colors.textSecondary }]} />
            <Text style={[
              styles.optionText, 
              { color: colors.textSecondary },
              valueType === 'Fixed Amount' && [styles.optionTextSelected, { color: '#FFFFFF' }]
            ]}>Fixed Amount</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionBtn, 
              { borderColor: colors.border },
              valueType === 'Percentage' ? [styles.optionBtnSelected, { backgroundColor: colors.primary, borderColor: colors.primary }] : [styles.optionBtnUnselected, { backgroundColor: colors.surface }]
            ]}
            onPress={() => setValueType('Percentage')}
          >
             <View style={valueType === 'Percentage' ? styles.dotSelected : [styles.dotUnselected, { borderColor: colors.textSecondary }]} />
            <Text style={[
              styles.optionText, 
              { color: colors.textSecondary },
              valueType === 'Percentage' && [styles.optionTextSelected, { color: '#FFFFFF' }]
            ]}>Percentage</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
        <View style={[styles.currencyInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.currencySymbol, { color: colors.text }]}>₹</Text>
          <TextInput 
            style={[styles.currencyInput, { color: colors.text }]} 
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Attendance Type - Grey Chips */}
        <Text style={[styles.label, { color: colors.text }]}>Attendance Type</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[
              styles.chipBtn, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              attendanceType === 'On Attendance' && [styles.chipBtnSelected, { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(0, 122, 255, 0.1)' : 'rgba(255, 149, 0, 0.05)' }]
            ]}
            onPress={() => setAttendanceType('On Attendance')}
          >
             <View style={[styles.radioCircleUnselected, { borderColor: colors.border }]} />
            <Text style={[styles.chipText, { color: colors.textSecondary }, attendanceType === 'On Attendance' && { color: colors.text }]}>On Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.chipBtn, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              attendanceType === 'Flat rate' && [styles.chipBtnSelected, { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(0, 122, 255, 0.1)' : 'rgba(255, 149, 0, 0.05)' }]
            ]}
            onPress={() => setAttendanceType('Flat rate')}
          >
            <View style={[styles.radioCircleUnselected, { borderColor: colors.border }]} />
            <Text style={[styles.chipText, { color: colors.textSecondary }, attendanceType === 'Flat rate' && { color: colors.text }]}>Flat rate</Text>
          </TouchableOpacity>
        </View>

        {/* Applicable Months */}
        <Text style={[styles.label, { color: colors.text }]}>Applicable Months</Text>
        <TouchableOpacity style={[styles.dropdownInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.dropdownPlaceholder, { color: colors.textSecondary }]}>Select the months and years</Text>
          {/* Replaced generic plus with attractive Calendar-Plus icon */}
          <FontAwesome5 name="calendar-plus" size={20} color={colors.primary} />
        </TouchableOpacity>

      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <Text style={styles.addButtonText}>Add Deduction</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    padding: 24,
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  entryTypeContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1.5,
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
    borderRightWidth: 1.5,
  },
  entryTypeBtnActiveDeduction: {
    borderLeftWidth: 1.5,
  },
  entryTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 10,
  },
  entryTypeTextActive: {
    fontWeight: '800',
  },

  input: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    fontSize: 16,
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
  },
  optionBtnUnselected: {
  },
  dotSelected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
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
    fontWeight: '700',
  },

  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  currencyInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 18,
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
  },
  chipBtnUnselected: {
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
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    fontWeight: '500',
  },

  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
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