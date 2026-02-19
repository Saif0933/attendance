
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

const ReportsScreen = () => {
  const navigation = useNavigation();

  // Reusable List Item Component
  const ReportListItem = ({ title, description, onPress }: { title: string, description: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#475569" />
    </TouchableOpacity>
  );

  return (
    // Replaced View with SafeAreaView
    <SafeAreaView style={styles.container}>
      {/* --- Status Bar: Light Content for Dark Background --- */}
      <StatusBar barStyle="light-content" backgroundColor="#0A2540" />

      {/* --- Header Section --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Reports.</Text>
          <Text style={styles.headerSubtitle}>All your reports in one place</Text>
        </View>
      </View>

      {/* --- List Content --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ReportListItem
          title="Monthly Salary Summary Sheet"
          description="View and generate monthly salary summary reports for your employees"
          onPress={() => console.log('Monthly Salary Summary Sheet Pressed')}
        />
        
        {/* Separator Line */}
        <View style={styles.separator} />

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
    backgroundColor: '#0A2540',
  },
  // --- Header Styles ---
  header: {
    backgroundColor: '#0A2540',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginTop: -2,
  },
  // --- List Content Styles ---
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F4F7FA',
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 1, // subtle gap
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 0,
  },
});

export default ReportsScreen;