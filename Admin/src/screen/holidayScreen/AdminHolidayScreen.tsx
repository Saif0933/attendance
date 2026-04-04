import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useCreateHoliday,
  useDeleteHoliday,
  useGetHolidays,
  useUpdateHoliday
} from "../../../../api/hook/holiday/useHoliday";
import { Holiday } from "../../../../api/hook/type/holiday";
import { useTheme } from "../../../../src/theme/ThemeContext";

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS = [
  { label: 'Jan', value: '01' }, { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' },
  { label: 'Apr', value: '04' }, { label: 'May', value: '05' }, { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' }, { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' },
  { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => (CURRENT_YEAR - 5 + i).toString());

const HolidaysScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Custom Date Picker State
  const [tempDay, setTempDay] = useState("01");
  const [tempMonth, setTempMonth] = useState("01");
  const [tempYear, setTempYear] = useState(CURRENT_YEAR.toString());

  // Fetch Data
  const { data, isLoading, refetch } = useGetHolidays({});
  const createMutation = useCreateHoliday();
  const updateMutation = useUpdateHoliday();
  const deleteMutation = useDeleteHoliday();

  const holidays = data?.holidays || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const resetForm = () => {
    setName("");
    setDate("");
    setDescription("");
    setIsPaid(true);
    setEditingHoliday(null);
  };

  const handleOpenModal = (holiday?: Holiday) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setName(holiday.name);
      setDate(holiday.date.split("T")[0]); // Format date for input
      setDescription(holiday.description || "");
      setIsPaid(holiday.isPaid);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const openDatePicker = () => {
    if (date && date.includes("-")) {
      const [y, m, d] = date.split("-");
      setTempDay(d || "01");
      setTempMonth(m || "01");
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
    setDate(`${tempYear}-${tempMonth}-${tempDay}`);
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    if (!name || !date) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    // Basic date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert("Error", "Please enter date in YYYY-MM-DD format.");
      return;
    }

    const payload = {
      name,
      date,
      description,
      isPaid,
    };

    if (editingHoliday) {
      updateMutation.mutate(
        { id: editingHoliday.id, payload },
        {
          onSuccess: () => {
            Alert.alert("Success", "Holiday updated successfully");
            setModalVisible(false);
            resetForm();
          },
          onError: (err: any) => {
            Alert.alert("Error", err?.response?.data?.message || "Failed to update holiday");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          Alert.alert("Success", "Holiday created successfully");
          setModalVisible(false);
          resetForm();
        },
        onError: (err: any) => {
          Alert.alert("Error", err?.response?.data?.message || "Failed to create holiday");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this holiday?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteMutation.mutate(id, {
              onSuccess: () => {
                Alert.alert("Success", "Holiday deleted successfully");
              },
              onError: (err: any) => {
                Alert.alert("Error", err?.response?.data?.message || "Failed to delete holiday");
              },
            });
          }
        },
      ]
    );
  };

  const renderHolidayItem = ({ item }: { item: Holiday }) => (
    <View style={[styles.holidayCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.holidayHeader}>
        <View>
          <Text style={[styles.holidayName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.holidayDate, { color: colors.textSecondary }]}>
            {new Date(item.date).toLocaleDateString("en-US", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => handleOpenModal(item)} style={[styles.actionButton, { backgroundColor: isDark ? colors.background : '#F5F5F5' }]}>
            <Icon name="pencil" size={20} color="#FF9F1C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionButton, { backgroundColor: isDark ? colors.background : '#F5F5F5' }]}>
            <Icon name="trash-outline" size={20} color="#EF5350" />
          </TouchableOpacity>
        </View>
      </View>
      
      {item.description ? (
        <Text style={[styles.holidayDesc, { color: colors.textSecondary }]}>{item.description}</Text>
      ) : null}
      
      <View style={styles.badgeRow}>
        <View style={[styles.paidBadge, { backgroundColor: item.isPaid ? (isDark ? 'rgba(46, 125, 50, 0.2)' : "#E8F5E9") : (isDark ? 'rgba(198, 40, 40, 0.2)' : "#FFEBEE") }]}>
          <Text style={[styles.paidBadgeText, { color: item.isPaid ? (isDark ? '#81C784' : "#2E7D32") : (isDark ? '#E57373' : "#C62828") }]}>
            {item.isPaid ? "Paid Holiday" : "Unpaid Holiday"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Company Holidays</Text>

        <TouchableOpacity onPress={() => handleOpenModal()}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.flexContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FF8A3D" />
          </View>
        ) : holidays.length === 0 ? (
          <View style={styles.content}>
            <FontAwesome5
              name="umbrella-beach"
              size={80}
              color={isDark ? colors.surface : "#FFCCBC"}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No holidays found</Text>
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => handleOpenModal()}>
              <Text style={styles.addBtnText}>Add Holiday</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={holidays}
            keyExtractor={(item) => item.id}
            renderItem={renderHolidayItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF8A3D"]} />
            }
          />
        )}
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Holiday Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? colors.background : '#F9F9F9', borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. Independence Day"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Date (YYYY-MM-DD) *</Text>
                  <TouchableOpacity 
                    style={[styles.input, { 
                      backgroundColor: isDark ? colors.background : '#F9F9F9', 
                      borderColor: colors.border, 
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }]}
                    onPress={openDatePicker}
                  >
                    <Text style={{ color: date ? colors.text : colors.textSecondary }}>
                      {date || "Select Date"}
                    </Text>
                    <Icon name="calendar-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
              </View>

              {/* Custom Date Picker Modal */}
              <Modal visible={showDatePicker} transparent animationType="fade">
                <View style={styles.pickerModalOverlay}>
                  <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Date</Text>
                    
                    <View style={styles.pickerRow}>
                      {/* Day Column */}
                      <View style={styles.columnWrapper}>
                        <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Day</Text>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.wheelList}>
                          {DAYS.map(d => (
                            <TouchableOpacity key={d} onPress={() => setTempDay(d)} style={[styles.wheelItem, tempDay === d && { backgroundColor: colors.primary + '20', borderRadius: 8 }]}>
                              <Text style={[styles.wheelText, { color: tempDay === d ? colors.primary : colors.text }, tempDay === d && { fontWeight: '700' }]}>{d}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      {/* Month Column */}
                      <View style={styles.columnWrapper}>
                        <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Month</Text>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.wheelList}>
                          {MONTHS.map(m => (
                            <TouchableOpacity key={m.value} onPress={() => setTempMonth(m.value)} style={[styles.wheelItem, tempMonth === m.value && { backgroundColor: colors.primary + '20', borderRadius: 8 }]}>
                              <Text style={[styles.wheelText, { color: tempMonth === m.value ? colors.primary : colors.text }, tempMonth === m.value && { fontWeight: '700' }]}>{m.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      {/* Year Column */}
                      <View style={styles.columnWrapper}>
                        <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Year</Text>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.wheelList}>
                          {YEARS.map(y => (
                            <TouchableOpacity key={y} onPress={() => setTempYear(y)} style={[styles.wheelItem, tempYear === y && { backgroundColor: colors.primary + '20', borderRadius: 8 }]}>
                              <Text style={[styles.wheelText, { color: tempYear === y ? colors.primary : colors.text }, tempYear === y && { fontWeight: '700' }]}>{y}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>

                    <View style={styles.pickerFooter}>
                      <TouchableOpacity style={styles.pickerCancelBtn} onPress={() => setShowDatePicker(false)}>
                        <Text style={[styles.pickerCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.pickerConfirmBtn, { backgroundColor: colors.primary }]} onPress={confirmDate}>
                        <Text style={styles.pickerConfirmText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: isDark ? colors.background : '#F9F9F9', borderColor: colors.border, color: colors.text }]}
                  placeholder="Details about the holiday..."
                  placeholderTextColor={colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={[styles.switchGroup, { backgroundColor: isDark ? colors.background : '#F9F9F9' }]}>
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>Is Paid Holiday?</Text>
                  <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Will be included in monthly pay</Text>
                </View>
                <Switch
                  value={isPaid}
                  onValueChange={setIsPaid}
                  trackColor={{ false: isDark ? colors.border : "#D1D1D1", true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: colors.primary }, (createMutation.isPending || updateMutation.isPending) && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {editingHoliday ? "Update Holiday" : "Create Holiday"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default HolidaysScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  flexContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 56,
    backgroundColor: "#FF8A3D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: "#FF8A3D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  holidayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  holidayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  holidayName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  holidayDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontWeight: "500",
  },
  holidayDesc: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  paidBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
  },
  submitBtn: {
    backgroundColor: "#FF8A3D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Custom Picker Styles
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    height: 200,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  wheelList: {
    flex: 1,
    width: '100%',
  },
  wheelItem: {
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  wheelText: {
    fontSize: 16,
  },
  pickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  pickerCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  pickerCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  pickerConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});