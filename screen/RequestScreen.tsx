

import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApplyLeave, useDeleteLeave, useGetLeaves } from '../api/hook/leaves/hook/useLeave';
import { LeaveType } from '../api/hook/leaves/type';
import { useGetEmployeeById } from '../src/employee/hook/useEmployee';
import { useEmployeeAuthStore } from '../src/store/useEmployeeAuthStore';
import { useTheme } from '../src/theme/ThemeContext';

const { width } = Dimensions.get('window');

// --- Color Palette ---
const ORANGE = '#FF9F1C';
const BLUE = '#4b43f0';
const DARK_BLUE = '#1D3557';
const LIGHT_GRAY = '#A8DADC';
const TEXT_GRAY = '#6C757D';
const WHITE = '#FFFFFF';
const BACKGROUND_LIGHT = '#F4F6F9';
const BORDER_LIGHT = '#EEF1F4';
const GREEN = '#2EC4B6';
const YELLOW = '#FFB703';
const PURPLE = '#7209B7';
const SOFT_PURPLE_BG = '#F3E5F5';

const RequestScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'Expenses' | 'Leaves' | 'Loans'>('Leaves');
  const scrollViewRef = useRef<ScrollView>(null);
  const { employee } = useEmployeeAuthStore();
  const employeeId = employee?.id || null;

  // Fetch Data
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>('CASUAL');

  // Fetch Data
  const { data: employeeDetails, isLoading: isEmpLoading, refetch: refetchEmp } = useGetEmployeeById(employeeId || '');
  const { data: leavesResponse, isLoading: isLeavesLoading, refetch: refetchLeaves } = useGetLeaves({ employeeId: employeeId || undefined });
  const applyLeaveMutation = useApplyLeave();
  const deleteLeaveMutation = useDeleteLeave();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchEmp(), refetchLeaves()]);
    setRefreshing(false);
  };

  const requests = leavesResponse?.data || [];
  const settings = employeeDetails?.data?.settings;

  const tabs: ('Expenses' | 'Leaves' | 'Loans')[] = ['Expenses', 'Leaves', 'Loans'];

  const handleTabPress = (tab: 'Expenses' | 'Leaves' | 'Loans') => {
    setActiveTab(tab);
    const index = tabs.indexOf(tab);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    const newTab = tabs[slide];
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  // --- Handle Delete Request ---
  const handleDeleteLeave = (id: string) => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this leave request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteLeaveMutation.mutate(id, {
              onSuccess: () => {
                Alert.alert('Success', 'Leave request deleted successfully');
              },
              onError: (error: any) => {
                Alert.alert('Error', error?.response?.data?.message || 'Failed to delete leave request');
              }
            });
          }
        },
      ]
    );
  };

  // --- Handle New Request Submission ---
  const handleSubmitRequest = () => {
    if (reason.trim() === '') {
      Alert.alert('Required', 'Please enter a reason for your leave.');
      return;
    }

    const today = new Date().toISOString();

    applyLeaveMutation.mutate({
      type: selectedLeaveType,
      startDate: today,
      endDate: today, // Default to 1 day for now
      reason: reason,
    }, {
      onSuccess: () => {
        Alert.alert('Success', 'Leave request submitted successfully');
        setReason('');
        setModalVisible(false);
      },
      onError: (error: any) => {
        Alert.alert('Error', error?.response?.data?.message || 'Failed to submit leave request');
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return GREEN;
      case 'PENDING': return ORANGE;
      case 'REJECTED': return '#EF5350';
      default: return TEXT_GRAY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'checkmark-circle';
      case 'PENDING': return 'time';
      case 'REJECTED': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatLeaveType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + ' Leave';
  };

  // --- RENDER SECTIONS ---

  const renderExpensesContent = () => (
    <View style={[styles.contentLight, { width: width, backgroundColor: colors.background }]}>
      <Icon name="receipt-outline" size={60} color={isDark ? colors.border : "#CBD5E1"} />
      <Text style={[styles.noExpenseText, { color: colors.textSecondary }]}>No expenses to display</Text>
    </View>
  );

  const renderLeavesContent = () => {
    if (isEmpLoading || isLeavesLoading) {
      return (
        <View style={[styles.contentLight, { width: width }]}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      );
    }

    const {
      numberOfCasualLeaves = 0,
      numberOfSickLeaves = 0,
      numberOfPrivilegeLeaves = 0,
      numberOfEmergencyLeaves = 0
    } = settings || {};

    const casualUsed = requests.filter((r: any) => r.type === 'CASUAL' && r.status === 'APPROVED').length;
    const casualPercent = numberOfCasualLeaves > 0 ? (casualUsed / numberOfCasualLeaves) * 100 : 0;

    return (
      <View style={{ width: width, flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]} // Android
              tintColor={colors.primary} // iOS
            />
          }
        >
          {/* Leave Balances Card */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.subHeader, { color: colors.text }]}>Leave Balances</Text>
            <View style={[styles.card, styles.shadowSoft, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.summaryHeaderRow}>
                 <Text style={[styles.summaryHeaderLabel, { color: colors.textSecondary }]}>Privilege</Text>
                 <Text style={[styles.summaryHeaderLabel, { color: colors.textSecondary }]}>Sick</Text>
                 <Text style={[styles.summaryHeaderLabel, { color: colors.textSecondary }]}>Emergency</Text>
              </View>
              <View style={styles.summaryValueRow}>
                 <Text style={[styles.bigNumber, { color: colors.text }]}>{numberOfPrivilegeLeaves}</Text>
                 <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
                 <Text style={[styles.bigNumber, { color: colors.text }]}>{numberOfSickLeaves}</Text>
                 <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
                 <Text style={[styles.bigNumber, { color: colors.text }]}>{numberOfEmergencyLeaves}</Text>
              </View>
            </View>

            {/* Casual Leave Progress */}
            <View style={[styles.card, styles.shadowSoft, { marginTop: 15, backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.casualHeader}>
                  <View style={styles.casualTitleRow}>
                      <View style={[styles.circleIcon, { backgroundColor: isDark ? colors.background : SOFT_PURPLE_BG }]}>
                          <Icon name="briefcase-outline" size={18} color={PURPLE} />
                      </View>
                      <View>
                          <Text style={[styles.cardTitle, { color: colors.text }]}>Casual Leave</Text>
                          <Text style={[styles.subText, { color: colors.textSecondary }]}>Yearly Quota</Text>
                      </View>
                  </View>
                  <Text style={styles.percentText}>{Math.round(casualPercent)}%</Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressBarFill, { width: `${Math.min(100, casualPercent)}%` }]} />
              </View>
              <View style={[styles.statsContainer, { backgroundColor: isDark ? colors.background : '#FAFAFA' }]}>
                   <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Used</Text>
                      <Text style={[styles.statValue, { color: colors.text }]}>{casualUsed}</Text>
                   </View>
                   <View style={[styles.statBox, styles.statBoxActive, { borderColor: colors.border }]}>
                      <Text style={[styles.statLabel, {color: colors.primary}]}>Available</Text>
                      <Text style={[styles.statValue, {color: colors.primary}]}>{numberOfCasualLeaves - casualUsed}</Text>
                   </View>
                   <View style={styles.statBox}>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
                      <Text style={[styles.statValue, { color: colors.text }]}>{numberOfCasualLeaves}</Text>
                   </View>
              </View>
            </View>
          </View>

          {/* New Request Button */}
          <TouchableOpacity style={styles.fabButton} onPress={() => setModalVisible(true)}>
            <Icon name="add-circle" size={24} color={WHITE} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>New Leave Request</Text>
          </TouchableOpacity>

          {/* Active Requests List (Scrollable) */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.subHeader, { color: colors.text }]}>Active Requests ({requests.length})</Text>
            
            {requests.map((req: any) => (
              <View key={req.id} style={[styles.card, styles.shadowSoft, { marginBottom: 15, backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.requestHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: isDark ? colors.background : '#E3F2FD' }]}>
                     <Text style={[styles.categoryText, { color: colors.primary }]}>{formatLeaveType(req.type)}</Text>
                  </View>
                  <View style={styles.requestHeaderRight}>
                    <View style={[styles.statusPill, { backgroundColor: getStatusColor(req.status) }]}>
                      <Icon name={getStatusIcon(req.status)} size={14} color={WHITE} style={{marginRight: 4}} />
                      <Text style={styles.statusText}>{req.status}</Text>
                    </View>
                    {req.status.toUpperCase() === 'PENDING' && (
                      <TouchableOpacity 
                        style={styles.deleteIconBtn} 
                        onPress={() => handleDeleteLeave(req.id)}
                        disabled={deleteLeaveMutation.isPending}
                      >
                        {deleteLeaveMutation.isPending ? (
                          <ActivityIndicator size="small" color="#EF5350" />
                        ) : (
                          <Icon name="trash-outline" size={20} color="#EF5350" />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <Text style={[styles.description, { color: colors.text }]}>{req.reason || 'No reason provided'}</Text>

                <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Icon name="calendar-clear-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      {Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} Day(s)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            
            {requests.length === 0 && (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 10 }}>
                No requests found.
              </Text>
            )}
          </View>

          {/* Holidays Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.subHeader, { color: colors.text }]}>Holidays</Text>
            <View style={[styles.card, styles.shadowSoft, styles.emptyStateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.calendarIconBg, { backgroundColor: isDark ? colors.background : '#E3F2FD' }]}>
                <Icon name="calendar" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.noHolidaysText, { color: colors.text }]}>No holidays this month</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderLoansContent = () => (
    <View style={[styles.contentLight, { width: width, backgroundColor: colors.background }]}>
      <Icon name="wallet-outline" size={60} color={isDark ? colors.border : "#CBD5E1"} />
      <Text style={[styles.noExpenseText, { color: colors.textSecondary }]}>No loans to display</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.containerLight, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.headerLight, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Requests</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
             <Icon name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs - WITH GAP */}
      <View style={[styles.tabContainerLight, { backgroundColor: colors.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabWrapper}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tab, { color: colors.textSecondary }, activeTab === tab && [styles.activeTabLight, { color: colors.primary }]]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeTabLine, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content Swipe View */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentOffset={{ x: width, y: 0 }}
        style={[styles.scrollView, { backgroundColor: colors.background }]}
      >
        {renderExpensesContent()}
        {renderLeavesContent()}
        {renderLoansContent()}
      </ScrollView>

      {/* --- NEW REQUEST MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Leave Request</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Leave Type</Text>
            <View style={styles.typeSelector}>
              {(['CASUAL', 'SICK', 'PRIVILEGE', 'EMERGENCY'] as LeaveType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeBtn, { backgroundColor: isDark ? colors.background : '#F0F0F0', borderColor: colors.border }, selectedLeaveType === type && [styles.typeBtnActive, { backgroundColor: colors.primary, borderColor: colors.primary }]]}
                  onPress={() => setSelectedLeaveType(type)}
                >
                  <Text style={[styles.typeBtnText, { color: colors.textSecondary }, selectedLeaveType === type && [styles.typeBtnTextActive, { color: WHITE }]]}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Reason / Description</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? colors.background : '#FAFAFA', borderColor: colors.border, color: colors.text }]}
              placeholder="Why are you taking leave?"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
            />

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.primary }, applyLeaveMutation.isPending && { opacity: 0.7 }]} 
              onPress={handleSubmitRequest}
              disabled={applyLeaveMutation.isPending}
            >
              {applyLeaveMutation.isPending ? (
                <ActivityIndicator color={WHITE} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  containerLight: { flex: 1, backgroundColor: BACKGROUND_LIGHT },

  headerLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: BACKGROUND_LIGHT,
  },
  title: { fontSize: 28, fontWeight: '800', color: DARK_BLUE, letterSpacing: -0.5 },
  iconButton: { padding: 8, backgroundColor: WHITE, borderRadius: 12 },

  // Tabs - UPDATED FOR SPACING/GAPS
  tabContainerLight: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spreads tabs out evenly to create gaps
    paddingHorizontal: 30, // Adds side padding so tabs aren't on the edge
    paddingBottom: 10,
    backgroundColor: BACKGROUND_LIGHT,
  },
  tabWrapper: { 
    // Removed fixed marginRight to allow justify-content to handle spacing
    alignItems: 'center', 
    paddingVertical: 8,
    minWidth: 80, // Ensures tabs have a minimum clickable area
  },
  tab: { fontSize: 16, fontWeight: '500', color: TEXT_GRAY },
  activeTabLight: { fontWeight: '700', color: BLUE },
  activeTabLine: {
    marginTop: 4,
    height: 3,
    width: 20,
    backgroundColor: BLUE,
    borderRadius: 2,
  },

  scrollView: { flex: 1 },
  contentLight: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noExpenseText: { fontSize: 16, color: TEXT_GRAY, marginTop: 16, fontWeight: '500' },

  // Section Headers
  sectionContainer: { paddingHorizontal: 20, marginBottom: 24 },
  subHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_BLUE,
    marginBottom: 12,
  },

  // Cards
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: WHITE,
  },
  shadowSoft: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },

  // Leave Summary
  summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryHeaderLabel: { width: '33%', textAlign: 'center', color: TEXT_GRAY, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  bigNumber: { width: '33%', textAlign: 'center', fontSize: 28, fontWeight: '800', color: DARK_BLUE },
  verticalDivider: { width: 1, height: 30, backgroundColor: BORDER_LIGHT },

  // Casual Leave
  casualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  casualTitleRow: { flexDirection: 'row', alignItems: 'center' },
  circleIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: DARK_BLUE },
  subText: { fontSize: 12, color: TEXT_GRAY },
  percentText: { fontSize: 16, fontWeight: '700', color: PURPLE },
  progressBarBg: { height: 6, backgroundColor: BORDER_LIGHT, borderRadius: 3, marginBottom: 15 },
  progressBarFill: { height: 6, backgroundColor: PURPLE, borderRadius: 3 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12 },
  statBox: { alignItems: 'center', flex: 1 },
  statBoxActive: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' },
  statLabel: { fontSize: 11, color: TEXT_GRAY, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: DARK_BLUE },

  // FAB Button
  fabButton: {
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: YELLOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: WHITE },

  // Active Requests
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 12, fontWeight: '700', color: BLUE },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700', color: WHITE },
  description: { fontSize: 14, color: DARK_BLUE, lineHeight: 22, marginBottom: 15 },
  cardDivider: { height: 1, backgroundColor: BORDER_LIGHT, marginBottom: 15 },
  detailsRow: { flexDirection: 'row', gap: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: TEXT_GRAY, fontWeight: '500' },

  // Holidays
  emptyStateCard: { alignItems: 'center', paddingVertical: 30 },
  calendarIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  noHolidaysText: { fontSize: 16, fontWeight: '600', color: DARK_BLUE },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    minHeight: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: DARK_BLUE,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_BLUE,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: DARK_BLUE,
    height: 120,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeBtnActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  typeBtnText: {
    fontSize: 14,
    color: TEXT_GRAY,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: WHITE,
  },
  requestHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteIconBtn: {
    padding: 4,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
});

export { RequestScreen };

