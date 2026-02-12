
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

const HolidaysScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(true);

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
    <View style={styles.holidayCard}>
      <View style={styles.holidayHeader}>
        <View>
          <Text style={styles.holidayName}>{item.name}</Text>
          <Text style={styles.holidayDate}>
            {new Date(item.date).toLocaleDateString("en-US", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.actionButton}>
            <Icon name="pencil" size={20} color="#FF9F1C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
            <Icon name="trash-outline" size={20} color="#EF5350" />
          </TouchableOpacity>
        </View>
      </View>
      
      {item.description ? (
        <Text style={styles.holidayDesc}>{item.description}</Text>
      ) : null}
      
      <View style={styles.badgeRow}>
        <View style={[styles.paidBadge, { backgroundColor: item.isPaid ? "#E8F5E9" : "#FFEBEE" }]}>
          <Text style={[styles.paidBadgeText, { color: item.isPaid ? "#2E7D32" : "#C62828" }]}>
            {item.isPaid ? "Paid Holiday" : "Unpaid Holiday"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8A3D" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
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
              color="#FFCCBC"
            />
            <Text style={styles.emptyText}>No holidays found</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenModal()}>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Holiday Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Independence Day"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2024-01-01"
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Details about the holiday..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.switchGroup}>
                <View>
                  <Text style={styles.label}>Is Paid Holiday?</Text>
                  <Text style={styles.subLabel}>Will be included in monthly pay</Text>
                </View>
                <Switch
                  value={isPaid}
                  onValueChange={setIsPaid}
                  trackColor={{ false: "#D1D1D1", true: "#FF8A3D" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, (createMutation.isPending || updateMutation.isPending) && { opacity: 0.7 }]}
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
});