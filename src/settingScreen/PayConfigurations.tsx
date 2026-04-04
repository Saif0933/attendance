

import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Changed Icon package to FontAwesome5 for better visuals
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

const PayrollConfiguration = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
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
            <View style={[
              styles.iconCircle, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              isBenefit ? { shadowColor: colors.primary } : { shadowColor: '#D97706' }
            ]}>
              <Icon 
                // Using different icons for better context
                name={isBenefit ? "hand-holding-usd" : "file-invoice-dollar"} 
                size={50} 
                color={isBenefit ? colors.primary : "#D97706"} 
              />
            </View>
            
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {isBenefit ? 'No Benefits Added' : 'No Deductions Added'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payroll Configuration</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Benefits' && styles.activeTab]}
          onPress={() => handleTabPress('Benefits')}
        >
          <Text style={[
            styles.tabText, 
            { color: colors.textSecondary },
            activeTab === 'Benefits' && [styles.activeTabText, { color: colors.primary }]
          ]}>Benefits</Text>
          {activeTab === 'Benefits' && <View style={[styles.activeLine, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Deductions' && styles.activeTab]}
          onPress={() => handleTabPress('Deductions')}
        >
          <Text style={[
            styles.tabText, 
            { color: colors.textSecondary },
            activeTab === 'Deductions' && [styles.activeTabText, { color: colors.primary }]
          ]}>Deductions</Text>
          {activeTab === 'Deductions' && <View style={[styles.activeLine, { backgroundColor: colors.primary }]} />}
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
        <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
          {renderEmptyState('Benefits')}
        </View>

        {/* Screen 2: Deductions */}
        <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
          {renderEmptyState('Deductions')}
        </View>
      </ScrollView>

      {/* Footer Button - Dynamic Text */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
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
  },
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
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: 'row',
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
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeTabText: {
    fontWeight: '800',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  pageContainer: {
    width: width,
    flex: 1,
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1.5,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
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