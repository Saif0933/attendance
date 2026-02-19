

import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Changed Icon package to FontAwesome5 for better visuals
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          <Ionicons name="arrow-back" size={24} color="#FFF" />
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
    backgroundColor: '#0A2540',
  },
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
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A2540',
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 4,
    backgroundColor: '#FF9500',
    borderRadius: 2,
  },
  pageContainer: {
    width: width,
    flex: 1,
    backgroundColor: '#F4F7FA',
    overflow: 'hidden',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  iconBgBlue: {
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  iconBgOrange: {
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addButton: {
    backgroundColor: '#0A2540',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#0A2540",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});

export default PayrollConfiguration;