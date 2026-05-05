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
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const AddShiftScreen = () => {
  const { colors, isDark, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
  const navigation = useNavigation();
  const route = useRoute();
  
  // Check if we are editing
  const editingShift = (route.params as { shift?: Shift })?.shift;

  // Hooks
  const { mutate: createShift, isPending: isCreating } = useCreateShift();
  const { mutate: updateShift, isPending: isUpdating } = useUpdateShift();

  // Core State (Backend Fields)
  const [name, setName] = useState(editingShift?.name || (editingShift as any)?.shiftName || '');
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

    const payload: any = {
      name,
      shiftName: name, // Added for compatibility with different backend fields
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Time Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>Select {pickerType === 'start' ? 'Start' : 'End'} Time</Text>
            
            <View style={styles.pickerRow}>
              {/* Hours Column */}
              <View style={styles.columnWrapper}>
                <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Hour</Text>
                <FlatList
                  data={hours}
                  keyExtractor={(item) => `hour-${item}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.timeItem, tempHour === item && [styles.selectedTimeItem, { backgroundColor: isDark ? colors.background : colors.primary + '10' }]]}
                      onPress={() => setTempHour(item)}
                    >
                      <Text style={[styles.timeText, { color: colors.text }, tempHour === item && [styles.selectedTimeText, { color: colors.primary }]]}>{item}</Text>
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
                <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Minute</Text>
                <FlatList
                  data={minutes}
                  keyExtractor={(item) => `min-${item}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.timeItem, tempMinute === item && [styles.selectedTimeItem, { backgroundColor: isDark ? colors.background : colors.primary + '10' }]]}
                      onPress={() => setTempMinute(item)}
                    >
                      <Text style={[styles.timeText, { color: colors.text }, tempMinute === item && [styles.selectedTimeText, { color: colors.primary }]]}>{item}</Text>
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
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowPicker(false)}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={confirmTime}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{editingShift ? "Edit Shift" : "Add Shift"}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]} 
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

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
        {/* Shift Name */}
        <View style={styles.section}>
          <Text style={[styles.labelBold, { color: colors.text }]}>Shift Name</Text>
          <TextInput 
            style={[styles.standardInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning Shift"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Shift Start Time */}
        <View style={styles.section}>
          <Text style={[styles.labelBold, { color: colors.text }]}>Shift Start Time</Text>
          <TouchableOpacity style={[styles.timeSelectorInput, { borderColor: colors.border }]} onPress={() => openPicker('start')}>
            <Text style={[styles.selectTimeText, { color: colors.primary }]}>{startTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Shift End Time */}
        <View style={styles.section}>
          <Text style={[styles.labelBold, { color: colors.text }]}>Shift End Time</Text>
          <TouchableOpacity style={[styles.timeSelectorInput, { borderColor: colors.border }]} onPress={() => openPicker('end')}>
            <Text style={[styles.selectTimeText, { color: colors.primary }]}>{endTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Late Cut Off Section -> Mapped to latePunchInLimit */}
        <View style={styles.section}>
          <Text style={[styles.labelBold, { color: colors.text }]}>Late Cut Off (Minutes)</Text>
          <View style={[styles.reddishContainer, { backgroundColor: isDark ? colors.surface : colors.primary + '10' }]}>
            <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Allowed late minutes before marked as Half Day:</Text>
            <TextInput
              style={[styles.standardInput, { backgroundColor: isDark ? colors.background : colors.surface, borderColor: colors.border, color: colors.text }]}
              value={lateLimit}
              onChangeText={setLateLimit}
              keyboardType="numeric"
              placeholder="10"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        <View style={{ height: 40 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any, fonts: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  labelBold: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  standardInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  timeSelectorInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  selectTimeText: {
    fontFamily: fonts.bold,
  },
  reddishContainer: {
    padding: 16,
    borderRadius: 12,
  },
  subLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: fonts.regular,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
    borderWidth: 1,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  selectedTimeText: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  separator: {
    fontSize: 30,
    fontFamily: fonts.bold,
    color: colors.primary,
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
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});

export default AddShiftScreen;