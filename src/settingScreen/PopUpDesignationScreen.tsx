
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

import { useTheme } from '../theme/ThemeContext';

const PopUpDesignationScreen = () => {
  const { colors, isDark, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
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
      <View style={[styles.modalContainer, { backgroundColor: isDark ? '#0F172A' : colors.background }]}>
        
        {/* Close Button (Optional - tap outside also closes) */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        
        {/* 1. Dropdown Bar */}
        <TouchableOpacity style={[styles.dropdownBar, { backgroundColor: colors.surface }]} activeOpacity={0.9}>
          <Text style={[styles.dropdownText, { color: colors.text }]}>Attendance</Text>
          <Ionicons name="caret-down" size={18} color={colors.text} />
        </TouchableOpacity>

        {/* 2. Toggles Grid */}
        <View style={styles.togglesContainer}>
          {/* Row 1: Add & View */}
          <View style={styles.toggleRow}>
            {/* Add Switch */}
            <View style={styles.toggleItem}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Add</Text>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor={colors.border}
                onValueChange={() => toggleSwitch('add')}
                value={permissions.add}
                style={styles.switchScale}
              />
            </View>

            {/* View Switch */}
            <View style={styles.toggleItem}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>View</Text>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor={colors.border}
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
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Edit</Text>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor={colors.border}
                onValueChange={() => toggleSwitch('edit')}
                value={permissions.edit}
                style={styles.switchScale}
              />
            </View>

            {/* Delete Switch */}
            <View style={styles.toggleItem}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Delete</Text>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor={colors.border}
                onValueChange={() => toggleSwitch('delete')}
                value={permissions.delete}
                style={styles.switchScale}
              />
            </View>
          </View>
        </View>

        {/* 3. Add Button (Large Pill) */}
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} activeOpacity={0.8} onPress={handleClose}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const createStyles = (colors: any, fonts: any) => StyleSheet.create({
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
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  dropdownText: {
    fontSize: 18,
    fontFamily: fonts.bold,
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
    fontSize: 18,
    fontFamily: fonts.medium,
  },
  switchScale: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },

  // --- Add Button ---
  addButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});

export default PopUpDesignationScreen;