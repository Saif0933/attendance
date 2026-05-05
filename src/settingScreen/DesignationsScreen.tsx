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
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DesignationsScreen = () => {
  const { colors, isDark, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* --- Status Bar --- */}
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />

      {/* --- Header Section --- */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Designations</Text>
      </View>

      {/* --- Main Content (Empty State) --- */}
      <View style={styles.contentContainer}>
        
        {/* Circle Illustration */}
        <View style={[styles.circleIllustration, { backgroundColor: colors.surface }]} />

        {/* Empty State Text */}
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Designations Found</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Create your first designation to get started
        </Text>

        {/* Middle Pill Button */}
        <TouchableOpacity 
          style={[styles.middleButton, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddDesignationsScreen')}
        >
          <Text style={[styles.middleButtonText, { color: colors.primary }]}>+ Add First Designation</Text>
        </TouchableOpacity>

      </View>

      {/* --- Bottom Action Button --- */}
      <View style={[styles.footerContainer, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
        <TouchableOpacity 
          style={[styles.bottomButton, { backgroundColor: colors.primary }]} 
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

const createStyles = (colors: any, fonts: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // --- Header Styles ---
  header: {
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
    fontFamily: fonts.bold,
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
    marginBottom: 30,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: fonts.medium,
  },
  
  // --- Middle Button (White Pill) ---
  middleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  middleButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  // --- Bottom Button Section ---
  footerContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  bottomButton: {
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
    fontFamily: fonts.bold,
  },
});

export default DesignationsScreen;