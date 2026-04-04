import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

const ReportsScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  // Reusable List Item Component
  const ReportListItem = ({ title, description, onPress }: { title: string, description: string, onPress?: () => void }) => (
    <TouchableOpacity 
      style={[styles.listItem, { backgroundColor: colors.surface }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />

      {/* --- Header Section --- */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Reports.</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>All your reports in one place</Text>
        </View>
      </View>

      {/* --- List Content --- */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}>
        <ReportListItem
          title="Monthly Salary Summary Sheet"
          description="View and generate monthly salary summary reports for your employees"
          onPress={() => console.log('Monthly Salary Summary Sheet Pressed')}
        />
        
        {/* Separator Line */}
        <View style={[styles.separator, { backgroundColor: colors.border }]} />

        <ReportListItem
          title="Daily Reports"
          description="View daily business reports and performance summaries"
          onPress={() => console.log('Daily Reports Pressed')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- Header Styles ---
  header: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: -2,
  },
  // --- List Content Styles ---
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 1, // subtle gap
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    marginHorizontal: 0,
  },
});

export default ReportsScreen;