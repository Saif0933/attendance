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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddDesignationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [designationName, setDesignationName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Status Bar --- */}
      <StatusBar barStyle="light-content" backgroundColor="#0284C7" />

      {/* --- Header Section --- */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>Add Designations</Text>

        {/* Save Button (Header Action) */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* --- Main Content Form --- */}
      <View style={styles.contentContainer}>
        
        {/* Designation Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Designation Name</Text>
          <TextInput
            style={styles.input}
            value={designationName}
            onChangeText={setDesignationName}
            placeholder="" 
            placeholderTextColor="#64748B"
            selectionColor="#0284C7"
          />
        </View>

        {/* Permissions Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Permissions</Text>
          
          {/* Add Permission Button */}
          <TouchableOpacity 
            style={styles.permissionButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PopUpDesignationScreen')}
          >
            <Text style={styles.permissionButtonText}>Add Permission +</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark Slate Background
  },
  
  // --- Header Styles ---
  header: {
    backgroundColor: '#0284C7', // Sky Blue Header
    height: Platform.OS === 'android' ? 60 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Spreads items out
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    flex: 1, // Takes up remaining space
    marginLeft: 16, // Spacing from back arrow
  },
  saveButton: {
    backgroundColor: '#1E293B', // Dark Slate Button Background
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20, // Pill Shape
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
    fontWeight: '800', // Bold Label
    color: '#FFF',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#475569', // Slate 600 Border
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#FFF',
    fontSize: 16,
    backgroundColor: 'transparent', // Matches UI box
  },

  // --- Permission Button Styles ---
  permissionButton: {
    backgroundColor: '#334155', // Slate 700 (Lighter than BG)
    height: 50,
    borderRadius: 25, // Fully rounded pill shape
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700', // Bold Text
  },
});

export default AddDesignationScreen;