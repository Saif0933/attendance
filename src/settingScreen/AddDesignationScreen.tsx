import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/Stack';
import { useTheme } from '../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddDesignationScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [designationName, setDesignationName] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* --- Status Bar --- */}
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />

      {/* --- Header Section --- */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Designations</Text>

        {/* Save Button (Header Action) */}
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* --- Main Content Form --- */}
      <View style={styles.contentContainer}>
        
        {/* Designation Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Designation Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={designationName}
            onChangeText={setDesignationName}
            placeholder="Enter designation name" 
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.primary}
          />
        </View>

        {/* Permissions Section */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Permissions</Text>
          
          {/* Add Permission Button */}
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: isDark ? colors.surface : '#F1F5F9', borderColor: colors.border, borderWidth: 1 }]} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PopUpDesignationScreen')}
          >
            <Text style={[styles.permissionButtonText, { color: colors.primary }]}>Add Permission +</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // --- Header Styles ---
  header: {
    height: Platform.OS === 'android' ? 70 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginLeft: 16,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // --- Content Styles ---
  contentContainer: {
    padding: 20,
    paddingTop: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  // --- Permission Button Styles ---
  permissionButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddDesignationScreen;