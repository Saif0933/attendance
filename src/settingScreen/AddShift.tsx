import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddShiftScreen = () => {
  const navigation = useNavigation();
  
  // State placeholders to manage UI selections (toggles, radios)
  const [punchInType, setPunchInType] = useState<'anytime' | 'limit'>('anytime');
  const [punchOutType, setPunchOutType] = useState<'anytime' | 'limit'>('anytime');
  const [isOvernight, setIsOvernight] = useState(false);
  const [autoPunchOut, setAutoPunchOut] = useState(false);
  const [minWorkingHour, setMinWorkingHour] = useState(false);

  // Helper Component for Custom Radio Option
  const RadioOption = ({ label, selected, onSelect }: any) => (
    <TouchableOpacity
      style={[
        styles.radioOptionContainer,
        selected ? styles.radioSelected : styles.radioUnselected,
      ]}
      onPress={onSelect}
      activeOpacity={0.8}>
      <Icon
        name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={24}
        color={selected ? '#FF7F50' : '#9E9E9E'} // Coral orange vs Grey
      />
      <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Helper for the Time Input blocks (Hours/Minutes)
  const TimeBlockInput = ({ label, unit, placeholder }: any) => (
    <View style={styles.timeBlockContainer}>
      <Text style={styles.timeBlockLabel}>{label}</Text>
      <View style={styles.timeBlockInputWrapper}>
        <TextInput
          style={styles.timeBlockInput}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#000"
        />
        <Text style={styles.timeBlockUnit}>{unit}</Text>
      </View>
    </View>
  );

  // Helper for the bottom complex numeric inputs
  const ComplexNumericInput = ({ label, placeholder, helperText }: any) => (
    <View style={styles.complexInputSection}>
      <Text style={styles.labelBold}>{label}</Text>
      <View style={styles.complexInputContainer}>
        <Text style={styles.complexInputInternalLabel}>{placeholder}</Text>
        <TextInput
          style={styles.standardInputWhite}
          placeholder={placeholder === "Number of Lates" ? "" : "0"} // Adjusting based on image
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.helperText}>{helperText}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Shift</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Shift Name */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Shift Name</Text>
          <TextInput style={styles.standardInput} />
        </View>

        {/* Shift Start Time */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Shift Start Time</Text>
          <TouchableOpacity style={styles.timeSelectorInput}>
            <Text style={styles.selectTimeText}>Select Time</Text>
          </TouchableOpacity>
        </View>

        {/* Can Punch In -> Radio Group */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Can Punch In</Text>
          <View style={styles.rowSplit}>
            <RadioOption
              label="Anytime"
              selected={punchInType === 'anytime'}
              onSelect={() => setPunchInType('anytime')}
            />
            <View style={styles.spacerX} />
            <RadioOption
              label="Add Limit"
              selected={punchInType === 'limit'}
              onSelect={() => setPunchInType('limit')}
            />
          </View>
        </View>

        {/* Shift End Time */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Shift End Time</Text>
          <TouchableOpacity style={styles.timeSelectorInput}>
            <Text style={styles.selectTimeText}>Select Time</Text>
          </TouchableOpacity>
        </View>

        {/* Late Cut Off Section */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Late Cut Off</Text>
          <View style={styles.reddishContainer}>
            <Text style={styles.subLabel}>Late Cut Off Time:</Text>
            <View style={styles.rowSplit}>
              <TimeBlockInput label="Hours" unit="hr" placeholder="0" />
              <View style={styles.spacerXWide} />
              <TimeBlockInput label="Minutes" unit="min" placeholder="0" />
            </View>
          </View>
        </View>

        {/* Can Punch Out -> Radio Group */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Can Punch Out</Text>
          <View style={styles.rowSplit}>
            <RadioOption
              label="Anytime"
              selected={punchOutType === 'anytime'}
              onSelect={() => setPunchOutType('anytime')}
            />
            <View style={styles.spacerX} />
            <RadioOption
              label="Add Limit"
              selected={punchOutType === 'limit'}
              onSelect={() => setPunchOutType('limit')}
            />
          </View>
        </View>

        {/* Early Cut Off Section */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Early Cut Off</Text>
          <View style={styles.reddishContainer}>
            <Text style={styles.subLabel}>Early Cut Off Time:</Text>
            <View style={styles.rowSplit}>
              <TimeBlockInput label="Hours" unit="hr" placeholder="0" />
              <View style={styles.spacerXWide} />
              <TimeBlockInput label="Minutes" unit="min" placeholder="0" />
            </View>
          </View>
        </View>

        {/* Toggles Section */}
        <View style={styles.toggleSection}>
          <Text style={styles.toggleLabel}>Applicable for Overnight</Text>
          <Switch
            value={isOvernight}
            onValueChange={setIsOvernight}
            trackColor={{ false: '#D3D3D3', true: '#FF7F50' }}
            thumbColor={Platform.OS === 'android' ? '#fff' : ''}
          />
        </View>

        <View style={styles.toggleSection}>
          <Text style={styles.toggleLabel}>Auto Punch Out</Text>
          <Switch
            value={autoPunchOut}
            onValueChange={setAutoPunchOut}
            trackColor={{ false: '#D3D3D3', true: '#FF7F50' }}
             thumbColor={Platform.OS === 'android' ? '#fff' : ''}
          />
        </View>

        <View style={styles.toggleSection}>
          <Text style={styles.toggleLabel}>Minimum working hour</Text>
          <Switch
            value={minWorkingHour}
            onValueChange={setMinWorkingHour}
            trackColor={{ false: '#D3D3D3', true: '#FF7F50' }}
             thumbColor={Platform.OS === 'android' ? '#fff' : ''}
          />
        </View>
        
        {/* Numeric Inputs Section */}
        <ComplexNumericInput 
            label="Number of Lates Counted as Half Day"
            placeholder="Number of Lates"
            helperText="Enter 0 to disable this feature"
        />
         <ComplexNumericInput 
            label="Number of Early Departures Counted as Half Day"
            placeholder="Number of Early Departures"
            helperText="Enter 0 to disable this feature"
        />
         <ComplexNumericInput 
            label="Number of Lates Counted as Absent"
            placeholder="Number of Lates"
            helperText="Enter 0 to disable this feature"
        />
         <ComplexNumericInput 
            label="Number of Early Departures Counted as Absent"
            placeholder="Number of Early Departures"
            helperText="Enter 0 to disable this feature"
        />

        <View style={{ height: 40 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  labelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  standardInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  timeSelectorInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  selectTimeText: {
    color: '#FF6B6B', // Salmon/Red color
    fontWeight: '600',
  },
  rowSplit: {
    flexDirection: 'row',
    flex: 1,
  },
  spacerX: {
    width: 15,
  },
  spacerXWide: {
    width: 25,
  },
  // Radio Button Styles
  radioOptionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  radioSelected: {
    borderColor: '#FF7F50',
    backgroundColor: '#FFF5F0',
  },
  radioUnselected: {
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  radioLabelSelected: {
    color: '#000',
  },
  // Reddish container sections
  reddishContainer: {
    backgroundColor: '#FFF0F0', // Very light red background
    padding: 16,
    borderRadius: 12,
  },
  subLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  // Time Block Inputs (Hours/Minutes)
  timeBlockContainer: {
    flex: 1,
  },
  timeBlockLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
    marginLeft: 4,
  },
  timeBlockInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  timeBlockInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  timeBlockUnit: {
    color: '#999',
    fontSize: 14,
  },
  // Toggles
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  // Complex Numeric Inputs at bottom
  complexInputSection: {
    marginBottom: 20,
  },
  complexInputContainer: {
     backgroundColor: '#FFF0F0', // The slightly reddish background
     padding: 10,
     borderRadius: 8,
     borderWidth: 1,
     borderColor: '#F5E6E6'
  },
  complexInputInternalLabel: {
      fontSize: 12,
      color: '#888',
      marginBottom: 4,
  },
  standardInputWhite: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontSize: 16,
      color: '#000',
  },
  helperText: {
      marginTop: 6,
      fontSize: 12,
      color: '#888',
      marginLeft: 4,
  }
});

export default AddShiftScreen;