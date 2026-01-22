
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportsScreen = () => {
  const navigation = useNavigation();

  // Reusable List Item Component
  const ReportListItem = ({ title, description, onPress }: { title: string, description: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    // Replaced View with SafeAreaView
    <SafeAreaView style={styles.container}>
      {/* --- Status Bar: Dark Content for Yellow Background --- */}
      <StatusBar barStyle="dark-content" backgroundColor="#FACC15" />

      {/* --- Header Section --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
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
    backgroundColor: '#0F172A', // Dark Blue Background
  },
  // --- Header Styles ---
  header: {
    backgroundColor: '#FACC15', // Yellow Header
    // SafeAreaView handles top padding on iOS, so we reduce it here to avoid double padding
    paddingTop: Platform.OS === 'android' ? 40 : 10, 
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A', // Dark Text on Yellow
    marginBottom: 4,
    marginTop: -15,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  // --- List Content Styles ---
  scrollContent: {
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF', // White Title
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#CBD5E1', // Lighter White/Grey for Description
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#1E293B', // Darker separator line
    marginHorizontal: 20,
  },
});

export default ReportsScreen;