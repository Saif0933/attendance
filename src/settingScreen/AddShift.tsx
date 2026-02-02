import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCreateShift, useUpdateShift } from '../../api/hook/company/shift/useShift';
import { Shift } from '../../api/hook/type/shift';

const { width, height } = Dimensions.get('window');

const AddShiftScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Check if we are editing
  const editingShift = (route.params as { shift?: Shift })?.shift;

  // Hooks
  const { mutate: createShift, isPending: isCreating } = useCreateShift();
  const { mutate: updateShift, isPending: isUpdating } = useUpdateShift();

  // Core State (Backend Fields)
  const [name, setName] = useState(editingShift?.name || '');
  const [startTime, setStartTime] = useState(editingShift?.startTime || '09:00');
  const [endTime, setEndTime] = useState(editingShift?.endTime || '18:00');
  const [lateLimit, setLateLimit] = useState(editingShift?.latePunchInLimit?.toString() || '0');

  // Time Picker State
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<'start' | 'end'>('start');
  const [tempHour, setTempHour] = useState('09');
  const [tempMinute, setTempMinute] = useState('00');

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a shift name");
      return;
    }

    const payload = {
      name,
      startTime,
      endTime,
      latePunchInLimit: parseInt(lateLimit) || 0,
    };

    if (editingShift) {
      updateShift(
        { id: editingShift.id, payload },
        {
          onSuccess: (res) => {
            Alert.alert("Success", res.message || "Shift updated successfully");
            navigation.goBack();
          },
          onError: (err: any) => {
            Alert.alert("Error", err?.response?.data?.message || "Failed to update shift");
          },
        }
      );
    } else {
      createShift(payload, {
        onSuccess: (res) => {
          Alert.alert("Success", res.message || "Shift created successfully");
          navigation.goBack();
        },
        onError: (err: any) => {
          Alert.alert("Error", err?.response?.data?.message || "Failed to create shift");
        },
      });
    }
  };

  const openPicker = (type: 'start' | 'end') => {
    const currentTime = type === 'start' ? startTime : endTime;
    const [h, m] = currentTime.split(':');
    setTempHour(h);
    setTempMinute(m);
    setPickerType(type);
    setShowPicker(true);
  };

  const confirmTime = () => {
    const newTime = `${tempHour}:${tempMinute}`;
    if (pickerType === 'start') setStartTime(newTime);
    else setEndTime(newTime);
    setShowPicker(false);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Time Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Select {pickerType === 'start' ? 'Start' : 'End'} Time</Text>
            
            <View style={styles.pickerRow}>
              {/* Hours Column */}
              <View style={styles.columnWrapper}>
                <Text style={styles.columnLabel}>Hour</Text>
                <FlatList
                  data={hours}
                  keyExtractor={(item) => `hour-${item}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.timeItem, tempHour === item && styles.selectedTimeItem]}
                      onPress={() => setTempHour(item)}
                    >
                      <Text style={[styles.timeText, tempHour === item && styles.selectedTimeText]}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                  initialScrollIndex={parseInt(tempHour)}
                  style={styles.timeList}
                />
              </View>

              <Text style={styles.separator}>:</Text>

              {/* Minutes Column */}
              <View style={styles.columnWrapper}>
                <Text style={styles.columnLabel}>Minute</Text>
                <FlatList
                  data={minutes}
                  keyExtractor={(item) => `min-${item}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.timeItem, tempMinute === item && styles.selectedTimeItem]}
                      onPress={() => setTempMinute(item)}
                    >
                      <Text style={[styles.timeText, tempMinute === item && styles.selectedTimeText]}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                  initialScrollIndex={parseInt(tempMinute)}
                  style={styles.timeList}
                />
              </View>
            </View>

            <View style={styles.pickerFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPicker(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmTime}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editingShift ? "Edit Shift" : "Add Shift"}</Text>
        <TouchableOpacity 
          style={[styles.addButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>{editingShift ? "Update" : "Add"}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Shift Name */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Shift Name</Text>
          <TextInput 
            style={styles.standardInput} 
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning Shift"
          />
        </View>

        {/* Shift Start Time */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Shift Start Time</Text>
          <TouchableOpacity style={styles.timeSelectorInput} onPress={() => openPicker('start')}>
            <Text style={styles.selectTimeText}>{startTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Shift End Time */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Shift End Time</Text>
          <TouchableOpacity style={styles.timeSelectorInput} onPress={() => openPicker('end')}>
            <Text style={styles.selectTimeText}>{endTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Late Cut Off Section -> Mapped to latePunchInLimit */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Late Cut Off (Minutes)</Text>
          <View style={styles.reddishContainer}>
            <Text style={styles.subLabel}>Allowed late minutes before marked as Half Day:</Text>
            <TextInput
              style={styles.standardInput}
              value={lateLimit}
              onChangeText={setLateLimit}
              keyboardType="numeric"
              placeholder="10"
            />
          </View>
        </View>
        
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
    minWidth: 70,
    alignItems: 'center',
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
    backgroundColor: '#fff',
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
    color: '#FF6B6B',
    fontWeight: '600',
  },
  reddishContainer: {
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 12,
  },
  subLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  columnLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 10,
  },
  timeList: {
    flex: 1,
    width: '100%',
  },
  timeItem: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedTimeItem: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FF7F50',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeText: {
    color: '#FF7F50',
    fontWeight: 'bold',
    fontSize: 18,
  },
  separator: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF7F50',
    marginHorizontal: 10,
    marginTop: 25,
  },
  pickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#FF7F50',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default AddShiftScreen;