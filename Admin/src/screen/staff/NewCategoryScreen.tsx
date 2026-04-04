
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCreateCategory, useUpdateCategory } from '../../../../src/employee/hook/useCategory';
import { useGetAllEmployees } from '../../../../src/employee/hook/useEmployee';
import { Category } from '../../../../src/employee/type/category';
import { EmployeeListItem } from '../../../../src/employee/type/employee';
import { useTheme } from '../../../../src/theme/ThemeContext';
import { showError, showSuccess } from '../../../../src/utils/meesage';

interface NewCategoryScreenProps {
  onClose?: () => void;
  isEditing?: boolean;
  initialData?: Category | null;
}

const NewCategoryScreen = ({ onClose, isEditing, initialData }: NewCategoryScreenProps) => {
  const { colors, isDark } = useTheme();
  const [categoryName, setCategoryName] = useState(initialData?.name || '');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    initialData?.employees?.map(emp => emp.id) || []
  );
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);

  // --- Hooks ---
  const { data: employeeData, isLoading: isLoadingEmployees } = useGetAllEmployees();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const employees: EmployeeListItem[] = employeeData?.data?.employees || [];

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      showError(new Error('Please enter a category name'));
      return;
    }

    if (isEditing && initialData) {
      updateCategoryMutation.mutate(
        {
          id: initialData.id,
          payload: {
            name: categoryName,
            employeeIds: selectedEmployeeIds,
          },
        },
        {
          onSuccess: () => {
            showSuccess('Category updated successfully');
            onClose?.();
          },
          onError: (error: any) => showError(error),
        }
      );
    } else {
      createCategoryMutation.mutate(
        {
          name: categoryName,
          employeeIds: selectedEmployeeIds,
        },
        {
          onSuccess: () => {
            showSuccess('Category created successfully');
            onClose?.();
          },
          onError: (error: any) => showError(error),
        }
      );
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const isPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-outline" size={28} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Edit Category' : 'New Category'}</Text>

        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.doneText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Section 1: Category Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Category name</Text>

          <View style={[styles.glassInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Examples: Sales, Marketing, Development..."
              placeholderTextColor="#94A3B8" 
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </View>

          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Categories help you organize and manage different groups of employees.
          </Text>
        </View>

        {/* Section 2: Add Employees */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Add Employees</Text>

          <TouchableOpacity 
            style={[styles.glassButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setIsEmployeeModalVisible(true)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.buttonText, { color: colors.text }]}>Add employees to category</Text>
              {selectedEmployeeIds.length > 0 && (
                <Text style={styles.selectedCountText}>
                  {selectedEmployeeIds.length} employees selected
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 3: Add Managers */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Add Managers</Text>

          <TouchableOpacity style={[styles.glassButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.buttonText, { color: colors.text }]}>Add managers to category</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Employee Selection Modal */}
      <Modal
        visible={isEmployeeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEmployeeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Employees</Text>
              <TouchableOpacity onPress={() => setIsEmployeeModalVisible(false)}>
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>

            {isLoadingEmployees ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={employees}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.employeeItem, { borderBottomColor: colors.border }]}
                    onPress={() => toggleEmployeeSelection(item.id)}
                  >
                    <View style={styles.employeeInfo}>
                      <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? colors.background : '#E2E8F0' }]}>
                         <Text style={[styles.avatarText, { color: colors.text }]}>{item.firstname ? item.firstname[0] : '?'}</Text>
                      </View>
                      <View>
                        <Text style={[styles.employeeName, { color: colors.text }]}>{item.firstname} {item.lastname}</Text>
                        <Text style={[styles.employeeDesignation, { color: colors.textSecondary }]}>{item.designation || 'Staff'}</Text>
                      </View>
                    </View>
                    <Ionicons 
                      name={selectedEmployeeIds.includes(item.id) ? "checkbox" : "square-outline"} 
                      size={24} 
                      color={selectedEmployeeIds.includes(item.id) ? "#3B82F6" : "#94A3B8"} 
                    />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ color: colors.textSecondary }}>No employees found.</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A', 
    paddingTop: 15,
    paddingBottom: 20,
    flex: 1, 
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', 
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6', 
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },

  glassInputContainer: {
    backgroundColor: '#1E293B', 
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    height: 55,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155', 
  },
  textInput: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  helperText: {
    marginTop: 10,
    color: '#94A3B8', 
    fontSize: 13,
    lineHeight: 18,
  },

  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', 
    borderRadius: 12,
    height: 60,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconCircle: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  selectedCountText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalDoneText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  employeeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  employeeDesignation: {
    color: '#94A3B8',
    fontSize: 12,
  },
});

export default NewCategoryScreen;