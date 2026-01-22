
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const PopUpDesignationScreen = () => {
  const navigation = useNavigation();
  
  // Switch States (All OFF as shown in Image 6)
  const [permissions, setPermissions] = useState({
    add: false,
    view: false,
    edit: false,
    delete: false,
  });

  const toggleSwitch = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      {/* Tappable overlay to close modal */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlayBackground} />
      </TouchableWithoutFeedback>
      
      {/* --- Modal Card Container --- */}
      <View style={styles.modalContainer}>
        
        {/* Close Button (Optional - tap outside also closes) */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color="#94A3B8" />
        </TouchableOpacity>
        
        {/* 1. Dropdown Bar */}
        <TouchableOpacity style={styles.dropdownBar} activeOpacity={0.9}>
          <Text style={styles.dropdownText}>Attendance</Text>
          <Ionicons name="caret-down" size={18} color="#FFF" />
        </TouchableOpacity>

        {/* 2. Toggles Grid */}
        <View style={styles.togglesContainer}>
          {/* Row 1: Add & View */}
          <View style={styles.toggleRow}>
            {/* Add Switch */}
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Add</Text>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={() => toggleSwitch('add')}
                value={permissions.add}
                style={styles.switchScale}
              />
            </View>

            {/* View Switch */}
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>View</Text>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={() => toggleSwitch('view')}
                value={permissions.view}
                style={styles.switchScale}
              />
            </View>
          </View>

          {/* Row 2: Edit & Delete */}
          <View style={styles.toggleRow}>
            {/* Edit Switch */}
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Edit</Text>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={() => toggleSwitch('edit')}
                value={permissions.edit}
                style={styles.switchScale}
              />
            </View>

            {/* Delete Switch */}
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Delete</Text>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={() => toggleSwitch('delete')}
                value={permissions.delete}
                style={styles.switchScale}
              />
            </View>
          </View>
        </View>

        {/* 3. Add Button (Large Pill) */}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={handleClose}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Overlay & Modal ---
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark overlay
  },
  modalContainer: {
    backgroundColor: '#0F172A', // Dark Slate background
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
    // Shadow for elevation effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    // top: 12,
    right: 16,
    padding: 8,
    zIndex: 10,
  },

  // --- Dropdown Style ---
  dropdownBar: {
    backgroundColor: '#94A3B8',
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // --- Toggles Grid ---
  togglesContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '42%',
  },
  toggleLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  switchScale: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },

  // --- Add Button ---
  addButton: {
    backgroundColor: '#1E293B',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PopUpDesignationScreen;