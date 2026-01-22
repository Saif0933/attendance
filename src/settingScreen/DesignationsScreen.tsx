import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/Stack';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DesignationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Status Bar --- */}
      <StatusBar barStyle="light-content" backgroundColor="#0284C7" />

      {/* --- Header Section --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Designations</Text>
      </View>

      {/* --- Main Content (Empty State) --- */}
      <View style={styles.contentContainer}>
        
        {/* Circle Illustration */}
        <View style={styles.circleIllustration} />

        {/* Empty State Text */}
        <Text style={styles.emptyTitle}>No Designations Found</Text>
        <Text style={styles.emptySubtitle}>
          Create your first designation to get started
        </Text>

        {/* Middle Pill Button */}
        <TouchableOpacity 
          style={styles.middleButton} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddDesignationsScreen')}
        >
          <Text style={styles.middleButtonText}>+ Add First Designation</Text>
        </TouchableOpacity>

      </View>

      {/* --- Bottom Action Button --- */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.bottomButton} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddDesignationsScreen')}
        >
            <Ionicons name="add" size={24} color="#FFF" style={styles.btnIcon} />
            <Text style={styles.bottomButtonText}>Add Designation</Text>
        </TouchableOpacity>
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
    backgroundColor: '#0284C7', // Bright Blue Header (Matches Image)
    height: Platform.OS === 'android' ? 60 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // No top padding needed here as SafeAreaView handles it
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },

  // --- Content Styles ---
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -50, // Slightly offset up to match visual balance
  },
  circleIllustration: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1E293B', // Darker Blue/Slate Circle
    marginBottom: 30,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#CBD5E1', // Light Grey Text
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  
  // --- Middle Button (White Pill) ---
  middleButton: {
    backgroundColor: '#E0F2FE', // Very Light Blue / White
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  middleButtonText: {
    color: '#0284C7', // Blue Text
    fontSize: 14,
    fontWeight: '600',
  },

  // --- Bottom Button Section ---
  footerContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  bottomButton: {
    backgroundColor: '#0284C7', // Matches Header Blue
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  btnIcon: {
      marginRight: 8,
  },
  bottomButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DesignationsScreen;