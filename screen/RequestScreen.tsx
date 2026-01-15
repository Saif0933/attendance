// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
// } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');

// const ORANGE = '#FF9500';
// const BLUE = '#007AFF';
// const DARK_BLUE = '#0A2540';
// const LIGHT_GRAY = '#8E8E93';
// const WHITE = '#FFFFFF';
// const BACKGROUND_LIGHT = '#F8F9FD';
// const BORDER_LIGHT = '#E5E5EA';
// const GREEN = '#34C759';
// const RED = '#FF3B30';
// const PURPLE = '#AF52DE';
// const YELLOW = '#FFB300';

// type RootStackParamList = {
//   Expenses: undefined;
//   Leaves: undefined;
//   Loans: undefined;
// };

// const RequestScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const [activeTab, setActiveTab] = useState<'Expenses' | 'Leaves' | 'Loans'>('Leaves');
//   const scrollViewRef = useRef<ScrollView>(null);

//   // Tab Order definition
//   const tabs: ('Expenses' | 'Leaves' | 'Loans')[] = ['Expenses', 'Leaves', 'Loans'];

//   // Scroll to the correct tab when a tab button is pressed
//   const handleTabPress = (tab: 'Expenses' | 'Leaves' | 'Loans') => {
//     setActiveTab(tab);
//     const index = tabs.indexOf(tab);
//     scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
//     // navigation.navigate(tab as never); // Commented out to allow internal swiping/switching
//   };

//   // Sync Active Tab when user swipes
//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const slide = Math.round(event.nativeEvent.contentOffset.x / width);
//     const newTab = tabs[slide];
//     if (newTab && newTab !== activeTab) {
//       setActiveTab(newTab);
//     }
//   };

//   const renderExpensesContent = () => (
//     <View style={[styles.contentLight, { width: width }]}>
//       <Text style={styles.noExpenseText}>No expenses to display</Text>
//     </View>
//   );

//   const renderLeavesContent = () => (
//     <View style={{ width: width, flex: 1 }}>
//       <ScrollView
//         style={{ flex: 1 }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 30 }}
//       >
//         {/* Leave Summary - ONE CARD */}
//         <View style={styles.leaveBalancesSection}>
//           <Text style={styles.subHeader}>Leave Summary</Text>
//           <View style={[styles.leaveSummaryCard, styles.shadowSoft]}>
//             <View style={styles.leaveSummaryRow}>
//               <Text style={styles.leaveSummaryTitle}>Paid Leave</Text>
//               <Text style={styles.leaveSummaryTitle}>Sick Leave</Text>
//               <Text style={styles.leaveSummaryTitle}>Vacation</Text>
//             </View>
//             <View style={styles.leaveSummaryRow}>
//               <Text style={styles.leaveSummaryValue}>0 day</Text>
//               <Text style={styles.leaveSummaryValue}>0 day</Text>
//               <Text style={styles.leaveSummaryValue}>0 day</Text>
//             </View>
//             <View style={styles.leaveSummaryRow}>
//               <Text style={styles.leaveSummaryPending}>0 pending</Text>
//               <Text style={styles.leaveSummaryPending}>0 pending</Text>
//               <Text style={styles.leaveSummaryPending}>0 pending</Text>
//             </View>
//           </View>

//           {/* Casual Leave Card */}
//           <View style={[styles.casualCard, styles.shadowSoft]}>
//             <View style={[styles.circle, { backgroundColor: PURPLE }]} />
//             <View style={{ flex: 1 }}>
//               <View style={styles.casualHeader}>
//                 <Text style={styles.leaveTitle}>Casual Leave</Text>
//                 <Text style={styles.percentUsed}>0% used</Text>
//               </View>
//               <Text style={styles.remainingText}>8 days remaining</Text>
//               <View style={styles.leaveStatsRow}>
//                 <View style={styles.statBlock}>
//                   <Text style={styles.label}>Used</Text>
//                   <Text style={styles.value}>0 day</Text>
//                 </View>
//                 <View style={styles.statBlock}>
//                   <Text style={styles.label}>Available</Text>
//                   <Text style={styles.value}>8 day</Text>
//                 </View>
//                 <View style={styles.statBlock}>
//                   <Text style={styles.label}>Total</Text>
//                   <Text style={styles.value}>8 day</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Button */}
//         <TouchableOpacity style={[styles.button, { backgroundColor: YELLOW }]}>
//           <Text style={styles.buttonText}>+ New Leave Request</Text>
//         </TouchableOpacity>

//         {/* Active Requests */}
//         <View style={[styles.section, styles.shadowSoft]}>
//           <Text style={styles.sectionTitle}>Current Active Requests</Text>
//           <View style={styles.requestCard}>
//             <View style={styles.requestHeader}>
//               <Text style={styles.category}>Family Emergency</Text>
//               <View style={[styles.statusBadge, { backgroundColor: GREEN }]}>
//                 <Text style={styles.statusText}>Approved</Text>
//               </View>
//             </View>
//             <Text style={styles.description}>
//               I need to take a leave of absence for 1 day to assist my father at a medical
//               appointment.
//             </Text>

//             <View style={styles.detailsRow}>
//               <View style={styles.detailItem}>
//                 <Icon name="calendar-outline" size={16} color={BLUE} />
//                 <Text style={styles.detailText}>11 October 2025</Text>
//               </View>
//               <View style={styles.divider} />
//               <View style={styles.detailItem}>
//                 <Icon name="time-outline" size={16} color={BLUE} />
//                 <Text style={styles.detailText}>1 day</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Company Holidays */}
//         <View style={[styles.section, styles.shadowSoft]}>
//           <View style={styles.holidaysHeaderRow}>
//             <Text style={styles.holidaysTitle}>Company Holidays</Text>
//             <TouchableOpacity style={styles.refreshButton}>
//               <Icon name="refresh-outline" size={22} color={BLUE} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.calendarContainer}>
//             <View style={styles.calendarCircle}>
//               <Icon name="calendar-outline" size={60} color={LIGHT_GRAY} />
//             </View>
//             <Text style={styles.noHolidaysText}>No holidays this month</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   const renderLoansContent = () => (
//     <View style={[styles.contentLight, { width: width }]}>
//       <Text style={styles.noExpenseText}>No loans to display</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.containerLight}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" />
//       <View style={styles.headerLight}>
//         <Text style={styles.title}>Requests Dashboard</Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainerLight}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={styles.tabWrapper}
//             onPress={() => handleTabPress(tab)}
//             activeOpacity={0.8}
//           >
//             <Text style={[styles.tab, activeTab === tab && styles.activeTabLight]}>
//               {tab}
//             </Text>
//             {activeTab === tab && <View style={styles.activeTabLine} />}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Horizontal ScrollView for Swiping */}
//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={handleScroll}
//         // Initialize at index 1 (Leaves) since it's the default
//         contentOffset={{ x: width, y: 0 }}
//       >
//         {renderExpensesContent()}
//         {renderLeavesContent()}
//         {renderLoansContent()}
//       </ScrollView>

//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   containerLight: { flex: 1, backgroundColor: BACKGROUND_LIGHT },

//   headerLight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 22,
//     paddingVertical: 18,
//     backgroundColor: WHITE,
//     elevation: 3,
//   },

//   title: { fontSize: 20, fontWeight: '800', color: DARK_BLUE },

//   tabContainerLight: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     backgroundColor: WHITE,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_LIGHT,
//   },

//   tabWrapper: { flex: 1, alignItems: 'center', paddingVertical: 10 },
//   tab: { fontSize: 14, fontWeight: '400', color: LIGHT_GRAY },
//   activeTabLight: { fontWeight: '400', color: BLUE },
//   activeTabLine: {
//     marginTop: 6,
//     height: 3,
//     width: 60,
//     backgroundColor: BLUE,
//     borderRadius: 3,
//   },

//   contentLight: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   noExpenseText: { fontSize: 17, color: LIGHT_GRAY },

//   subHeader: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: DARK_BLUE,
//     marginBottom: 12,
//   },

//   leaveBalancesSection: {
//     padding: 16,
//     marginHorizontal: 16,
//     marginTop: 12,
//     backgroundColor: WHITE,
//     borderRadius: 16,
//   },

//   leaveSummaryCard: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 14,
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//   },
//   leaveSummaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//   },
//   leaveSummaryTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: DARK_BLUE,
//     width: '33%',
//     textAlign: 'center',
//   },
//   leaveSummaryValue: {
//     fontSize: 14,
//     color: DARK_BLUE,
//     width: '33%',
//     textAlign: 'center',
//   },
//   leaveSummaryPending: {
//     fontSize: 13,
//     color: LIGHT_GRAY,
//     width: '33%',
//     textAlign: 'center',
//   },

//   casualCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 16,
//     padding: 14,
//     backgroundColor: '#F5EEFF',
//     marginTop: 16,
//   },

//   circle: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
//   casualHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   leaveTitle: { fontSize: 14, fontWeight: '600', color: DARK_BLUE },
//   percentUsed: { fontSize: 14, fontWeight: '600', color: DARK_BLUE },
//   remainingText: { fontSize: 13, fontWeight: '600', color: ORANGE, marginBottom: 8 },

//   leaveStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   statBlock: { alignItems: 'center', flex: 1 },
//   label: { fontSize: 12, color: LIGHT_GRAY },
//   value: { fontSize: 15, fontWeight: '600', color: DARK_BLUE },

//   button: {
//     borderRadius: 12,
//     paddingHorizontal: 28,
//     paddingVertical: 12,
//     alignSelf: 'center',
//     marginVertical: 16,
//     elevation: 3,
//   },

//   buttonText: { fontSize: 17, fontWeight: '600', color: WHITE },

//   section: {
//     backgroundColor: WHITE,
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 16,
//   },

//   sectionTitle: { fontSize: 17, fontWeight: '700', color: DARK_BLUE, marginBottom: 12 },

//   requestCard: {
//     backgroundColor: '#FDFDFD',
//     borderRadius: 12,
//     padding: 16,
//   },

//   requestHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },

//   category: { fontSize: 15, fontWeight: '600', color: DARK_BLUE },
//   statusBadge: {
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },
//   statusText: { fontSize: 13, color: WHITE, fontWeight: '500' },

//   description: { fontSize: 15, color: DARK_BLUE, lineHeight: 20, marginBottom: 12 },

//   detailsRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: BORDER_LIGHT,
//     paddingTop: 10,
//   },

//   detailItem: { flexDirection: 'row', alignItems: 'center' },
//   detailText: { fontSize: 14, color: DARK_BLUE, marginLeft: 6 },
//   divider: {
//     width: 1,
//     height: 18,
//     backgroundColor: BORDER_LIGHT,
//     marginHorizontal: 20,
//   },

//   holidaysHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   holidaysTitle: { fontSize: 17, fontWeight: '700', color: DARK_BLUE },
//   refreshButton: { padding: 6 },

//   calendarContainer: { alignItems: 'center', marginTop: 16 },
//   calendarCircle: {
//     borderWidth: 1,
//     borderColor: BORDER_LIGHT,
//     borderRadius: 60,
//     padding: 20,
//   },
//   noHolidaysText: { fontSize: 16, color: LIGHT_GRAY, marginTop: 10 },

//   shadowSoft: {
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 5,
//     elevation: 3,
//   },
// });

// export { RequestScreen };


import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// --- Color Palette ---
const ORANGE = '#FF9F1C';
const BLUE = '#3A86FF';
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

type RequestItem = {
  id: string;
  category: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  description: string;
  date: string;
  duration: string;
};

type RootStackParamList = {
  Expenses: undefined;
  Leaves: undefined;
  Loans: undefined;
};

const RequestScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Expenses' | 'Leaves' | 'Loans'>('Leaves');
  const scrollViewRef = useRef<ScrollView>(null);

  // --- State for New Request Feature ---
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  
  // --- Initial Dummy Data ---
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: '1',
      category: 'Family Emergency',
      status: 'Approved',
      description: 'I need to take a leave of absence for 1 day to assist my father at a medical appointment.',
      date: 'Oct 11, 2025',
      duration: '1 Day',
    },
  ]);

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

  // --- Handle New Request Submission ---
  const handleSubmitRequest = () => {
    if (reason.trim() === '') {
      Alert.alert('Required', 'Please enter a reason for your leave.');
      return;
    }

    const newRequest: RequestItem = {
      id: Date.now().toString(),
      category: 'Casual Leave',
      status: 'Pending',
      description: reason,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      duration: '1 Day',
    };

    // Add new request to the TOP of the list
    setRequests([newRequest, ...requests]);
    setReason('');
    setModalVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return GREEN;
      case 'Pending': return ORANGE;
      case 'Rejected': return '#EF5350';
      default: return TEXT_GRAY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return 'checkmark-circle';
      case 'Pending': return 'time'; // Clock icon
      case 'Rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  // --- RENDER SECTIONS ---

  const renderExpensesContent = () => (
    <View style={[styles.contentLight, { width: width }]}>
      <Icon name="receipt-outline" size={60} color="#CBD5E1" />
      <Text style={styles.noExpenseText}>No expenses to display</Text>
    </View>
  );

  const renderLeavesContent = () => (
    <View style={{ width: width, flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      >
        {/* Leave Balances Card */}
        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>Leave Balances</Text>
          <View style={[styles.card, styles.shadowSoft]}>
            <View style={styles.summaryHeaderRow}>
               <Text style={styles.summaryHeaderLabel}>Paid</Text>
               <Text style={styles.summaryHeaderLabel}>Sick</Text>
               <Text style={styles.summaryHeaderLabel}>Vacation</Text>
            </View>
            <View style={styles.summaryValueRow}>
               <Text style={styles.bigNumber}>0</Text>
               <View style={styles.verticalDivider} />
               <Text style={styles.bigNumber}>0</Text>
               <View style={styles.verticalDivider} />
               <Text style={styles.bigNumber}>0</Text>
            </View>
          </View>

          {/* Casual Leave Progress */}
          <View style={[styles.card, styles.shadowSoft, { marginTop: 15 }]}>
            <View style={styles.casualHeader}>
                <View style={styles.casualTitleRow}>
                    <View style={[styles.circleIcon, { backgroundColor: SOFT_PURPLE_BG }]}>
                        <Icon name="briefcase-outline" size={18} color={PURPLE} />
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>Casual Leave</Text>
                        <Text style={styles.subText}>Yearly Quota</Text>
                    </View>
                </View>
                <Text style={styles.percentText}>0%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '5%' }]} />
            </View>
            <View style={styles.statsContainer}>
                 <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Used</Text>
                    <Text style={styles.statValue}>0</Text>
                 </View>
                 <View style={[styles.statBox, styles.statBoxActive]}>
                    <Text style={[styles.statLabel, {color: BLUE}]}>Available</Text>
                    <Text style={[styles.statValue, {color: BLUE}]}>8</Text>
                 </View>
                 <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text style={styles.statValue}>8</Text>
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
          <Text style={styles.subHeader}>Active Requests ({requests.length})</Text>
          
          {requests.map((req) => (
            <View key={req.id} style={[styles.card, styles.shadowSoft, { marginBottom: 15 }]}>
              <View style={styles.requestHeader}>
                <View style={styles.categoryBadge}>
                   <Text style={styles.categoryText}>{req.category}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: getStatusColor(req.status) }]}>
                   <Icon name={getStatusIcon(req.status)} size={14} color={WHITE} style={{marginRight: 4}} />
                   <Text style={styles.statusText}>{req.status}</Text>
                </View>
              </View>
              
              <Text style={styles.description}>{req.description}</Text>

              <View style={styles.cardDivider} />

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Icon name="calendar-clear-outline" size={16} color={TEXT_GRAY} />
                  <Text style={styles.detailText}>{req.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="time-outline" size={16} color={TEXT_GRAY} />
                  <Text style={styles.detailText}>{req.duration}</Text>
                </View>
              </View>
            </View>
          ))}
          
          {requests.length === 0 && (
            <Text style={{ textAlign: 'center', color: TEXT_GRAY, marginTop: 10 }}>
              No active requests found.
            </Text>
          )}
        </View>

        {/* Holidays Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.subHeader}>Holidays</Text>
          <View style={[styles.card, styles.shadowSoft, styles.emptyStateCard]}>
            <View style={styles.calendarIconBg}>
              <Icon name="calendar" size={32} color={BLUE} />
            </View>
            <Text style={styles.noHolidaysText}>No holidays this month</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderLoansContent = () => (
    <View style={[styles.contentLight, { width: width }]}>
      <Icon name="wallet-outline" size={60} color="#CBD5E1" />
      <Text style={styles.noExpenseText}>No loans to display</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.containerLight}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      
      {/* Header */}
      <View style={styles.headerLight}>
        <Text style={styles.title}>Requests</Text>
        <TouchableOpacity style={styles.iconButton}>
             <Icon name="notifications-outline" size={24} color={DARK_BLUE} />
        </TouchableOpacity>
      </View>

      {/* Tabs - WITH GAP */}
      <View style={styles.tabContainerLight}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabWrapper}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tab, activeTab === tab && styles.activeTabLight]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeTabLine} />}
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
        style={styles.scrollView}
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Leave Request</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={TEXT_GRAY} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Reason / Description</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Why are you taking leave? (e.g. Sick, Personal...)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest}>
              <Text style={styles.submitButtonText}>Submit Request</Text>
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
    backgroundColor: YELLOW,
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
});

export { RequestScreen };