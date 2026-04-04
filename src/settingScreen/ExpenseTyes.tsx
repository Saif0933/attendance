
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// Standard UI Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// New "Attractive" Icon Package
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const App = ({ navigation }: any) => { // Assuming navigation is passed
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseType, setExpenseType] = useState('');
  const [isFocused, setIsFocused] = useState(false); // For attractive input animation

  // Function to handle opening the "Bottom Sheet"
  const openAddSheet = () => {
    setModalVisible(true);
  };

  // Function to close the sheet
  const closeAddSheet = () => {
    setModalVisible(false);
    setIsFocused(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* --- Main Screen Header with Back Button --- */}
      <View style={[styles.mainHeader, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.mainBackButton} 
          onPress={() => navigation?.goBack()} // Functional Back Button
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitleText, { color: colors.text }]}>Expense Types</Text>
      </View>

      {/* --- Attractive Background Watermark Icon --- */}
      <View style={styles.backgroundIconContainer}>
        <FontAwesome5 
          name="file-invoice-dollar" 
          size={180} 
          color={isDark ? colors.surface : "#E5E5EA"} 
          style={{ opacity: isDark ? 0.2 : 0.5 }}
        />
      </View>

      {/* Floating Action Button (FAB) + */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]} 
        onPress={openAddSheet}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* --- Add Expense Type Bottom Sheet (Modal) --- */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet" 
        visible={modalVisible}
        onRequestClose={closeAddSheet} 
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header: Back Arrow | Title | Save Button */}
          <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={closeAddSheet} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Expense Type</Text>

            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={closeAddSheet}>
              <Text style={[styles.saveButtonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Form Content - New Attractive Input */}
          <View style={styles.formContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Category Name</Text>
            
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              isFocused && [styles.inputWrapperFocused, { borderColor: colors.primary, backgroundColor: isDark ? colors.background : '#F0F8FF' }] // Change style when clicked
            ]}>
              {/* Icon inside Input */}
              <FontAwesome5 name="tag" size={18} color={isFocused ? colors.primary : colors.textSecondary} style={styles.inputIcon} />
              
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g. Travel, Food"
                placeholderTextColor={isDark ? "#4B5563" : "#C7C7CC"}
                value={expenseType}
                onChangeText={setExpenseType}
                autoFocus={true} 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- New Main Header Styles ---
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    zIndex: 10, // Ensure header is above background icon
  },
  mainBackButton: {
    paddingRight: 15,
  },
  headerTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  // --- Background Watermark Style ---
  backgroundIconContainer: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Behind everything
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF', 
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  saveButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  
  // --- New Attractive Input Box Styles ---
  formContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 4,
  },
  // The Container for the Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4, // Padding for the View, TextInput has its own padding
    borderWidth: 1.5,
    // Shadow for attractiveness
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  // Focused state for the input container
  inputWrapperFocused: {
    shadowOpacity: 0.1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 12,
  },
});

export default App;