
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
// Standard UI Icons
import Ionicons from 'react-native-vector-icons/Ionicons'; 
// New "Attractive" Icon Package
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const App = ({ navigation }: any) => { // Assuming navigation is passed
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* --- Main Screen Header with Back Button --- */}
      <View style={styles.mainHeader}>
        <TouchableOpacity 
          style={styles.mainBackButton} 
          onPress={() => navigation?.goBack()} // Functional Back Button
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Expense Types</Text>
      </View>

      {/* --- Attractive Background Watermark Icon --- */}
      <View style={styles.backgroundIconContainer}>
        <FontAwesome5 
          name="file-invoice-dollar" 
          size={180} 
          color="#E5E5EA" // Very subtle gray
          style={{ opacity: 0.5 }}
        />
      </View>

      {/* Floating Action Button (FAB) + */}
      <TouchableOpacity 
        style={styles.fab} 
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
        <View style={styles.modalContainer}>
          {/* Header: Back Arrow | Title | Save Button */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeAddSheet} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Add Expense Type</Text>

            <TouchableOpacity style={styles.saveButton} onPress={closeAddSheet}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Form Content - New Attractive Input */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>New Category Name</Text>
            
            <View style={[
              styles.inputWrapper, 
              isFocused && styles.inputWrapperFocused // Change style when clicked
            ]}>
              {/* Icon inside Input */}
              <FontAwesome5 name="tag" size={18} color={isFocused ? "#007AFF" : "#8E8E93"} style={styles.inputIcon} />
              
              <TextInput
                style={styles.input}
                placeholder="e.g. Travel, Food"
                placeholderTextColor="#C7C7CC"
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
    backgroundColor: '#F2F2F7', 
  },
  // --- New Main Header Styles ---
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F2F2F7',
    zIndex: 10, // Ensure header is above background icon
  },
  mainBackButton: {
    paddingRight: 15,
  },
  headerTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
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
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
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
    color: '#000',
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
    color: '#6e6e6e',
    marginBottom: 10,
    marginLeft: 4,
  },
  // The Container for the Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4, // Padding for the View, TextInput has its own padding
    borderWidth: 1.5,
    borderColor: '#E5E5EA', // Default Light Border
    // Shadow for attractiveness
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  // Focused state for the input container
  inputWrapperFocused: {
    borderColor: '#007AFF', // Blue border when active
    backgroundColor: '#F0F8FF', // Very light blue tint
    shadowOpacity: 0.1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 12,
    color: '#000',
  },
});

export default App;