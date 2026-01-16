

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
// Changed Icon package to FontAwesome5 for better visuals
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PayrollConfiguration = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Benefits' | 'Deductions'>('Benefits');
  
  // Ref to control the horizontal scroll view
  const scrollViewRef = useRef<ScrollView>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Function to handle Tab Clicks (Syncs Tab -> Scroll)
  const handleTabPress = (tabName: 'Benefits' | 'Deductions') => {
    setActiveTab(tabName);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: tabName === 'Benefits' ? 0 : width,
        animated: true,
      });
    }
  };

  // Function to handle Swipe (Syncs Scroll -> Tab)
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    // Calculate current page index (0 or 1)
    const index = Math.round(scrollX / width);
    const newTab = index === 0 ? 'Benefits' : 'Deductions';
    
    if (activeTab !== newTab) {
      setActiveTab(newTab);
    }
  };

  // Render the Empty State Content (Reusable)
  const renderEmptyState = (type: 'Benefits' | 'Deductions') => {
    const isBenefit = type === 'Benefits';
    return (
      <View style={styles.pageContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.emptyStateContainer}>
            {/* Attractive Circular Icon Background */}
            <View style={[styles.iconCircle, isBenefit ? styles.iconBgBlue : styles.iconBgOrange]}>
              <Icon 
                // Using different icons for better context
                name={isBenefit ? "hand-holding-usd" : "file-invoice-dollar"} 
                size={50} 
                color={isBenefit ? "#335C8D" : "#D97706"} 
              />
            </View>
            
            <Text style={styles.emptyTitle}>
              {isBenefit ? 'No Benefits Added' : 'No Deductions Added'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isBenefit 
                ? 'Add employee benefits like allowances, bonuses, and other perks to manage salary structure.'
                : 'Add standard deductions like taxes, insurance, and provident funds.'}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payroll Configuration</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Benefits' && styles.activeTab]}
          onPress={() => handleTabPress('Benefits')}
        >
          <Text style={[styles.tabText, activeTab === 'Benefits' && styles.activeTabText]}>Benefits</Text>
          {activeTab === 'Benefits' && <View style={styles.activeLine} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Deductions' && styles.activeTab]}
          onPress={() => handleTabPress('Deductions')}
        >
          <Text style={[styles.tabText, activeTab === 'Deductions' && styles.activeTabText]}>Deductions</Text>
          {activeTab === 'Deductions' && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>

      {/* Horizontal ScrollView for Swiping */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll} // Detects swipe finish
        scrollEventThrottle={16}
        contentContainerStyle={{ width: width * 2 }} // Ensure width fits 2 screens
      >
        {/* Screen 1: Benefits */}
        {renderEmptyState('Benefits')}

        {/* Screen 2: Deductions */}
        {renderEmptyState('Deductions')}
      </ScrollView>

      {/* Footer Button - Dynamic Text */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPayrollHead', { type: activeTab })}
        >
          <Icon name="plus" size={16} color="#FFF" />
          <Text style={styles.addButtonText}>
            Add {activeTab === 'Benefits' ? 'Benefit' : 'Deduction'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#E6F0FF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6F0FF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent', 
  },
  tabText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  // Container for each page in the horizontal scroll
  pageContainer: {
    width: width, // Takes full screen width
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -50,
  },
  // New Icon Styles for "Attractive" look
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Add subtle shadow/elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBgBlue: {
    backgroundColor: '#E0F2FE', // Light Blue background for Benefits
  },
  iconBgOrange: {
    backgroundColor: '#FEF3C7', // Light Amber background for Deductions
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addButton: {
    backgroundColor: '#335C8D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12, // Slightly more rounded
    shadowColor: "#335C8D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default PayrollConfiguration;