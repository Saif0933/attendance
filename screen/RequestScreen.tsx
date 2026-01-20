

// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// // --- Color Palette ---
// const ORANGE = '#FF9F1C';
// const BLUE = '#3A86FF';
// const DARK_BLUE = '#1D3557';
// const LIGHT_GRAY = '#A8DADC';
// const TEXT_GRAY = '#6C757D';
// const WHITE = '#FFFFFF';
// const BACKGROUND_LIGHT = '#F4F6F9';
// const BORDER_LIGHT = '#EEF1F4';
// const GREEN = '#2EC4B6';
// const YELLOW = '#FFB703';
// const PURPLE = '#7209B7';
// const SOFT_PURPLE_BG = '#F3E5F5';

// type RequestItem = {
//   id: string;
//   category: string;
//   status: 'Approved' | 'Pending' | 'Rejected';
//   description: string;
//   date: string;
//   duration: string;
// };

// type RootStackParamList = {
//   Expenses: undefined;
//   Leaves: undefined;
//   Loans: undefined;
// };

// const RequestScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'Expenses' | 'Leaves' | 'Loans'>('Leaves');
//   const scrollViewRef = useRef<ScrollView>(null);

//   // --- State for New Request Feature ---
//   const [modalVisible, setModalVisible] = useState(false);
//   const [reason, setReason] = useState('');
  
//   // --- Initial Dummy Data ---
//   const [requests, setRequests] = useState<RequestItem[]>([
//     {
//       id: '1',
//       category: 'Family Emergency',
//       status: 'Approved',
//       description: 'I need to take a leave of absence for 1 day to assist my father at a medical appointment.',
//       date: 'Oct 11, 2025',
//       duration: '1 Day',
//     },
//   ]);

//   const tabs: ('Expenses' | 'Leaves' | 'Loans')[] = ['Expenses', 'Leaves', 'Loans'];

//   const handleTabPress = (tab: 'Expenses' | 'Leaves' | 'Loans') => {
//     setActiveTab(tab);
//     const index = tabs.indexOf(tab);
//     scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
//   };

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const slide = Math.round(event.nativeEvent.contentOffset.x / width);
//     const newTab = tabs[slide];
//     if (newTab && newTab !== activeTab) {
//       setActiveTab(newTab);
//     }
//   };

//   // --- Handle New Request Submission ---
//   const handleSubmitRequest = () => {
//     if (reason.trim() === '') {
//       Alert.alert('Required', 'Please enter a reason for your leave.');
//       return;
//     }

//     const newRequest: RequestItem = {
//       id: Date.now().toString(),
//       category: 'Casual Leave',
//       status: 'Pending',
//       description: reason,
//       date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       duration: '1 Day',
//     };

//     // Add new request to the TOP of the list
//     setRequests([newRequest, ...requests]);
//     setReason('');
//     setModalVisible(false);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Approved': return GREEN;
//       case 'Pending': return ORANGE;
//       case 'Rejected': return '#EF5350';
//       default: return TEXT_GRAY;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Approved': return 'checkmark-circle';
//       case 'Pending': return 'time'; // Clock icon
//       case 'Rejected': return 'close-circle';
//       default: return 'help-circle';
//     }
//   };

//   // --- RENDER SECTIONS ---

//   const renderExpensesContent = () => (
//     <View style={[styles.contentLight, { width: width }]}>
//       <Icon name="receipt-outline" size={60} color="#CBD5E1" />
//       <Text style={styles.noExpenseText}>No expenses to display</Text>
//     </View>
//   );

//   const renderLeavesContent = () => (
//     <View style={{ width: width, flex: 1 }}>
//       <ScrollView
//         style={{ flex: 1 }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
//       >
//         {/* Leave Balances Card */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.subHeader}>Leave Balances</Text>
//           <View style={[styles.card, styles.shadowSoft]}>
//             <View style={styles.summaryHeaderRow}>
//                <Text style={styles.summaryHeaderLabel}>Paid</Text>
//                <Text style={styles.summaryHeaderLabel}>Sick</Text>
//                <Text style={styles.summaryHeaderLabel}>Vacation</Text>
//             </View>
//             <View style={styles.summaryValueRow}>
//                <Text style={styles.bigNumber}>0</Text>
//                <View style={styles.verticalDivider} />
//                <Text style={styles.bigNumber}>0</Text>
//                <View style={styles.verticalDivider} />
//                <Text style={styles.bigNumber}>0</Text>
//             </View>
//           </View>

//           {/* Casual Leave Progress */}
//           <View style={[styles.card, styles.shadowSoft, { marginTop: 15 }]}>
//             <View style={styles.casualHeader}>
//                 <View style={styles.casualTitleRow}>
//                     <View style={[styles.circleIcon, { backgroundColor: SOFT_PURPLE_BG }]}>
//                         <Icon name="briefcase-outline" size={18} color={PURPLE} />
//                     </View>
//                     <View>
//                         <Text style={styles.cardTitle}>Casual Leave</Text>
//                         <Text style={styles.subText}>Yearly Quota</Text>
//                     </View>
//                 </View>
//                 <Text style={styles.percentText}>0%</Text>
//             </View>
//             <View style={styles.progressBarBg}>
//                 <View style={[styles.progressBarFill, { width: '5%' }]} />
//             </View>
//             <View style={styles.statsContainer}>
//                  <View style={styles.statBox}>
//                     <Text style={styles.statLabel}>Used</Text>
//                     <Text style={styles.statValue}>0</Text>
//                  </View>
//                  <View style={[styles.statBox, styles.statBoxActive]}>
//                     <Text style={[styles.statLabel, {color: BLUE}]}>Available</Text>
//                     <Text style={[styles.statValue, {color: BLUE}]}>8</Text>
//                  </View>
//                  <View style={styles.statBox}>
//                     <Text style={styles.statLabel}>Total</Text>
//                     <Text style={styles.statValue}>8</Text>
//                  </View>
//             </View>
//           </View>
//         </View>

//         {/* New Request Button */}
//         <TouchableOpacity style={styles.fabButton} onPress={() => setModalVisible(true)}>
//           <Icon name="add-circle" size={24} color={WHITE} style={{ marginRight: 8 }} />
//           <Text style={styles.buttonText}>New Leave Request</Text>
//         </TouchableOpacity>

//         {/* Active Requests List (Scrollable) */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.subHeader}>Active Requests ({requests.length})</Text>
          
//           {requests.map((req) => (
//             <View key={req.id} style={[styles.card, styles.shadowSoft, { marginBottom: 15 }]}>
//               <View style={styles.requestHeader}>
//                 <View style={styles.categoryBadge}>
//                    <Text style={styles.categoryText}>{req.category}</Text>
//                 </View>
//                 <View style={[styles.statusPill, { backgroundColor: getStatusColor(req.status) }]}>
//                    <Icon name={getStatusIcon(req.status)} size={14} color={WHITE} style={{marginRight: 4}} />
//                    <Text style={styles.statusText}>{req.status}</Text>
//                 </View>
//               </View>
              
//               <Text style={styles.description}>{req.description}</Text>

//               <View style={styles.cardDivider} />

//               <View style={styles.detailsRow}>
//                 <View style={styles.detailItem}>
//                   <Icon name="calendar-clear-outline" size={16} color={TEXT_GRAY} />
//                   <Text style={styles.detailText}>{req.date}</Text>
//                 </View>
//                 <View style={styles.detailItem}>
//                   <Icon name="time-outline" size={16} color={TEXT_GRAY} />
//                   <Text style={styles.detailText}>{req.duration}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
          
//           {requests.length === 0 && (
//             <Text style={{ textAlign: 'center', color: TEXT_GRAY, marginTop: 10 }}>
//               No active requests found.
//             </Text>
//           )}
//         </View>

//         {/* Holidays Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.subHeader}>Holidays</Text>
//           <View style={[styles.card, styles.shadowSoft, styles.emptyStateCard]}>
//             <View style={styles.calendarIconBg}>
//               <Icon name="calendar" size={32} color={BLUE} />
//             </View>
//             <Text style={styles.noHolidaysText}>No holidays this month</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   const renderLoansContent = () => (
//     <View style={[styles.contentLight, { width: width }]}>
//       <Icon name="wallet-outline" size={60} color="#CBD5E1" />
//       <Text style={styles.noExpenseText}>No loans to display</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.containerLight}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      
//       {/* Header */}
//       <View style={styles.headerLight}>
//         <Text style={styles.title}>Requests</Text>
//         <TouchableOpacity style={styles.iconButton}>
//              <Icon name="notifications-outline" size={24} color={DARK_BLUE} />
//         </TouchableOpacity>
//       </View>

//       {/* Tabs - WITH GAP */}
//       <View style={styles.tabContainerLight}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={styles.tabWrapper}
//             onPress={() => handleTabPress(tab)}
//             activeOpacity={0.7}
//           >
//             <Text style={[styles.tab, activeTab === tab && styles.activeTabLight]}>
//               {tab}
//             </Text>
//             {activeTab === tab && <View style={styles.activeTabLine} />}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Main Content Swipe View */}
//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={handleScroll}
//         contentOffset={{ x: width, y: 0 }}
//         style={styles.scrollView}
//       >
//         {renderExpensesContent()}
//         {renderLeavesContent()}
//         {renderLoansContent()}
//       </ScrollView>

//       {/* --- NEW REQUEST MODAL --- */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <KeyboardAvoidingView 
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>New Leave Request</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Icon name="close" size={24} color={TEXT_GRAY} />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.inputLabel}>Reason / Description</Text>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Why are you taking leave? (e.g. Sick, Personal...)"
//               placeholderTextColor="#999"
//               multiline
//               numberOfLines={4}
//               value={reason}
//               onChangeText={setReason}
//               textAlignVertical="top"
//             />

//             <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest}>
//               <Text style={styles.submitButtonText}>Submit Request</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   containerLight: { flex: 1, backgroundColor: BACKGROUND_LIGHT },

//   headerLight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     backgroundColor: BACKGROUND_LIGHT,
//   },
//   title: { fontSize: 28, fontWeight: '800', color: DARK_BLUE, letterSpacing: -0.5 },
//   iconButton: { padding: 8, backgroundColor: WHITE, borderRadius: 12 },

//   // Tabs - UPDATED FOR SPACING/GAPS
//   tabContainerLight: {
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Spreads tabs out evenly to create gaps
//     paddingHorizontal: 30, // Adds side padding so tabs aren't on the edge
//     paddingBottom: 10,
//     backgroundColor: BACKGROUND_LIGHT,
//   },
//   tabWrapper: { 
//     // Removed fixed marginRight to allow justify-content to handle spacing
//     alignItems: 'center', 
//     paddingVertical: 8,
//     minWidth: 80, // Ensures tabs have a minimum clickable area
//   },
//   tab: { fontSize: 16, fontWeight: '500', color: TEXT_GRAY },
//   activeTabLight: { fontWeight: '700', color: BLUE },
//   activeTabLine: {
//     marginTop: 4,
//     height: 3,
//     width: 20,
//     backgroundColor: BLUE,
//     borderRadius: 2,
//   },

//   scrollView: { flex: 1 },
//   contentLight: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   noExpenseText: { fontSize: 16, color: TEXT_GRAY, marginTop: 16, fontWeight: '500' },

//   // Section Headers
//   sectionContainer: { paddingHorizontal: 20, marginBottom: 24 },
//   subHeader: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: DARK_BLUE,
//     marginBottom: 12,
//   },

//   // Cards
//   card: {
//     backgroundColor: WHITE,
//     borderRadius: 20,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: WHITE,
//   },
//   shadowSoft: {
//     shadowColor: '#2C3E50',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.05,
//     shadowRadius: 15,
//     elevation: 3,
//   },

//   // Leave Summary
//   summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
//   summaryHeaderLabel: { width: '33%', textAlign: 'center', color: TEXT_GRAY, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
//   summaryValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
//   bigNumber: { width: '33%', textAlign: 'center', fontSize: 28, fontWeight: '800', color: DARK_BLUE },
//   verticalDivider: { width: 1, height: 30, backgroundColor: BORDER_LIGHT },

//   // Casual Leave
//   casualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
//   casualTitleRow: { flexDirection: 'row', alignItems: 'center' },
//   circleIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   cardTitle: { fontSize: 16, fontWeight: '700', color: DARK_BLUE },
//   subText: { fontSize: 12, color: TEXT_GRAY },
//   percentText: { fontSize: 16, fontWeight: '700', color: PURPLE },
//   progressBarBg: { height: 6, backgroundColor: BORDER_LIGHT, borderRadius: 3, marginBottom: 15 },
//   progressBarFill: { height: 6, backgroundColor: PURPLE, borderRadius: 3 },
//   statsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12 },
//   statBox: { alignItems: 'center', flex: 1 },
//   statBoxActive: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' },
//   statLabel: { fontSize: 11, color: TEXT_GRAY, marginBottom: 4 },
//   statValue: { fontSize: 16, fontWeight: '700', color: DARK_BLUE },

//   // FAB Button
//   fabButton: {
//     backgroundColor: YELLOW,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 20,
//     marginBottom: 20,
//     paddingVertical: 16,
//     borderRadius: 16,
//     shadowColor: YELLOW,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonText: { fontSize: 16, fontWeight: '700', color: WHITE },

//   // Active Requests
//   requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   categoryBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
//   categoryText: { fontSize: 12, fontWeight: '700', color: BLUE },
//   statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   statusText: { fontSize: 11, fontWeight: '700', color: WHITE },
//   description: { fontSize: 14, color: DARK_BLUE, lineHeight: 22, marginBottom: 15 },
//   cardDivider: { height: 1, backgroundColor: BORDER_LIGHT, marginBottom: 15 },
//   detailsRow: { flexDirection: 'row', gap: 20 },
//   detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   detailText: { fontSize: 13, color: TEXT_GRAY, fontWeight: '500' },

//   // Holidays
//   emptyStateCard: { alignItems: 'center', paddingVertical: 30 },
//   calendarIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
//   noHolidaysText: { fontSize: 16, fontWeight: '600', color: DARK_BLUE },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: WHITE,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     padding: 24,
//     minHeight: 350,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: DARK_BLUE,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: DARK_BLUE,
//     marginBottom: 8,
//   },
//   textInput: {
//     backgroundColor: '#FAFAFA',
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: DARK_BLUE,
//     height: 120,
//     marginBottom: 20,
//   },
//   submitButton: {
//     backgroundColor: BLUE,
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: BLUE,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   submitButtonText: {
//     color: WHITE,
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });

// export { RequestScreen };


import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Updated Color Palette (Matches Screenshots) ---
const BLUE_BTN = '#2096C9'; // The blue color from screenshots
const BG_LIGHT = '#F8F9FD';
const TEXT_DARK = '#101828';
const TEXT_GREY = '#667085';
const GREEN_PILL_BG = '#ECFDF3';
const GREEN_PILL_TEXT = '#027A48';
const YELLOW_PILL_BG = '#FFFAEB';
const YELLOW_PILL_TEXT = '#B54708';
const LOAN_CARD_TEAL = '#2E6F75'; // Approximate teal from loan card
const LOAN_CARD_BEIGE = '#D8C6A8'; // Approximate beige from loan card

// Existing Colors (for Leaves tab consistency)
const ORANGE = '#FF9F1C';
const BLUE = '#3A86FF';
const DARK_BLUE = '#1D3557';
const LIGHT_GRAY = '#A8DADC';
const WHITE = '#FFFFFF';
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

const RequestScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Expenses' | 'Leaves' | 'Loans'>('Leaves');
  const scrollViewRef = useRef<ScrollView>(null);

  // --- State for Leaves (Existing) ---
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');
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

  // --- Sub-Tabs for Loans ---
  const [loanSubTab, setLoanSubTab] = useState('Active');

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

  // Leaves Logic (Existing)
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
    setRequests([newRequest, ...requests]);
    setReason('');
    setModalVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return GREEN;
      case 'Pending': return ORANGE;
      case 'Rejected': return '#EF5350';
      default: return TEXT_GREY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return 'checkmark-circle';
      case 'Pending': return 'time';
      case 'Rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  // --- NEW: RENDER EXPENSES (Matches Screenshot 2) ---
  const renderExpensesContent = () => (
    <View style={{ width: width, flex: 1, backgroundColor: WHITE }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Date Filter */}
        <View style={styles.expDateFilterContainer}>
          <TouchableOpacity style={styles.expDateBtn}>
            <Icon name="calendar-outline" size={18} color={BLUE_BTN} />
            <Text style={styles.expDateText}>1 Jan - 20 Jan</Text>
            <Icon name="chevron-down" size={16} color={TEXT_GREY} />
          </TouchableOpacity>
        </View>

        {/* Recent Claims Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Claims</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>3 total</Text>
          </View>
        </View>

        {/* Claim Items */}
        {/* Item 1 */}
        <View style={styles.claimCard}>
          <View style={styles.claimIconBox}>
             <Icon name="file-tray-full-outline" size={24} color={BLUE_BTN} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.claimTitle}>Office Supplies</Text>
              <Text style={styles.claimAmount}>$45.00</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 4}}>
              <Text style={styles.claimSub}>12 Jan 2024 • Operations</Text>
              <View style={[styles.statusTag, {backgroundColor: GREEN_PILL_BG}]}>
                <View style={[styles.dot, {backgroundColor: GREEN_PILL_TEXT}]} />
                <Text style={[styles.statusTagText, {color: GREEN_PILL_TEXT}]}>APPROVED</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Item 2 */}
        <View style={styles.claimCard}>
          <View style={[styles.claimIconBox, {backgroundColor: '#FFF4E5'}]}>
             <MaterialIcons name="restaurant" size={24} color={ORANGE} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.claimTitle}>Client Dinner</Text>
              <Text style={styles.claimAmount}>$120.50</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 4}}>
              <Text style={styles.claimSub}>15 Jan 2024 • Sales Team</Text>
              <View style={[styles.statusTag, {backgroundColor: YELLOW_PILL_BG}]}>
                <View style={[styles.dot, {backgroundColor: YELLOW_PILL_TEXT}]} />
                <Text style={[styles.statusTagText, {color: YELLOW_PILL_TEXT}]}>PENDING</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Item 3 */}
        <View style={styles.claimCard}>
          <View style={[styles.claimIconBox, {backgroundColor: '#E8F0FE'}]}>
             <Icon name="airplane" size={24} color={BLUE} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.claimTitle}>Travel Reimbursement</Text>
              <Text style={styles.claimAmount}>$350.00</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 4}}>
              <Text style={styles.claimSub}>18 Jan 2024 • Project Alpha</Text>
              <View style={[styles.statusTag, {backgroundColor: YELLOW_PILL_BG}]}>
                <View style={[styles.dot, {backgroundColor: YELLOW_PILL_TEXT}]} />
                <Text style={[styles.statusTagText, {color: YELLOW_PILL_TEXT}]}>PENDING</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Info */}
        <View style={styles.expFooter}>
          <Icon name="refresh" size={24} color="#CBD5E1" />
          <Text style={styles.expFooterTitle}>END OF CURRENT PERIOD</Text>
          <Text style={styles.expFooterSub}>Next auto-sync in 2 hours</Text>
        </View>

      </ScrollView>

       {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabSimple}>
        <Icon name="add" size={30} color={WHITE} />
      </TouchableOpacity>
    </View>
  );

  // --- EXISTING: RENDER LEAVES (Kept exactly same) ---
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
                  <Icon name="calendar-clear-outline" size={16} color={TEXT_GREY} />
                  <Text style={styles.detailText}>{req.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="time-outline" size={16} color={TEXT_GREY} />
                  <Text style={styles.detailText}>{req.duration}</Text>
                </View>
              </View>
            </View>
          ))}
          
          {requests.length === 0 && (
            <Text style={{ textAlign: 'center', color: TEXT_GREY, marginTop: 10 }}>
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

  // --- NEW: RENDER LOANS (Matches Screenshot 1) ---
  const renderLoansContent = () => (
    <View style={{ width: width, flex: 1, backgroundColor: WHITE }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Top Summary Cards */}
        <View style={styles.loanSummaryContainer}>
          <View style={styles.loanSummaryCard}>
            <Text style={styles.loanSummaryLabel}>ACTIVE BALANCE</Text>
            <Text style={styles.loanSummaryValue}>$2,450.00</Text>
          </View>
          <View style={styles.loanSummaryCard}>
            <Text style={styles.loanSummaryLabel}>MONTHLY{'\n'}DEDUCTION</Text>
            <Text style={styles.loanSummaryValue}>$350.00</Text>
          </View>
        </View>

        {/* Secure Banner */}
        <View style={styles.secureBanner}>
          <Icon name="shield-checkmark" size={14} color={TEXT_GREY} style={{marginRight: 6}} />
          <Text style={styles.secureText}>SECURE & ENCRYPTED REPAYMENTS</Text>
        </View>

        {/* Loan Tabs */}
        <View style={styles.loanTabContainer}>
          {['Active', 'Pending', 'History'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setLoanSubTab(tab)}
              style={[styles.loanTabBtn, loanSubTab === tab && styles.loanTabBtnActive]}
            >
              <Text style={[styles.loanTabText, loanSubTab === tab && styles.loanTabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Loans Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Current Loans</Text>
          <View style={[styles.badgeContainer, {backgroundColor: '#E0F2F1'}]}>
            <Text style={[styles.badgeText, {color: '#00695C'}]}>2 Active</Text>
          </View>
        </View>

        {/* Loan Card 1 (Teal) */}
        <View style={styles.loanCard}>
          {/* Card Graphic Header */}
          <View style={[styles.loanCardHeader, {backgroundColor: LOAN_CARD_TEAL}]}>
             {/* Abstract Circles Simulation */}
             <View style={{position:'absolute', right:-20, top:-20, width:100, height:100, borderRadius:50, backgroundColor:'rgba(255,255,255,0.1)'}} />
             <View style={{position:'absolute', left:-30, bottom:-30, width:120, height:120, borderRadius:60, backgroundColor:'rgba(255,255,255,0.1)'}} />
             <View style={styles.loanActiveTag}>
               <Text style={styles.loanActiveText}>ACTIVE</Text>
             </View>
          </View>
          
          <View style={styles.loanCardBody}>
            <Text style={styles.loanBenefitText}>EMPLOYEE BENEFIT</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
               <Text style={styles.loanTitle}>Emergency Personal Loan</Text>
               <Text style={styles.loanAmount}>$1,800.00</Text>
            </View>

            {/* Progress */}
            <View style={styles.repaymentRow}>
              <Text style={styles.repaymentLabel}>Repayment Progress</Text>
              <Text style={styles.repaymentLabel}>60%</Text>
            </View>
            <View style={styles.loanProgressBg}>
              <View style={[styles.loanProgressFill, {width: '60%'}]} />
            </View>

            {/* Footer */}
            <View style={styles.loanFooter}>
              <View>
                <Text style={styles.loanFooterLabel}>Approved: Oct 12, 2023</Text>
                <Text style={styles.loanFooterValue}>Next: $150.00 on Nov 1st</Text>
              </View>
              <TouchableOpacity style={styles.loanDetailsBtn}>
                <Text style={styles.loanDetailsText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Loan Card 2 (Beige/Brown) */}
        <View style={styles.loanCard}>
          {/* Card Graphic Header */}
          <View style={[styles.loanCardHeader, {backgroundColor: LOAN_CARD_BEIGE}]}>
             <View style={styles.loanActiveTag}>
               <Text style={styles.loanActiveText}>ACTIVE</Text>
             </View>
          </View>
          
          <View style={styles.loanCardBody}>
            <Text style={styles.loanBenefitText}>ANNUAL LOAN</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
               <Text style={styles.loanTitle}>Home Renovation</Text>
               <Text style={styles.loanAmount}>$650.00</Text>
            </View>

            {/* Progress */}
            <View style={styles.repaymentRow}>
              <Text style={styles.repaymentLabel}>Repayment Progress</Text>
              <Text style={styles.repaymentLabel}>15%</Text>
            </View>
            <View style={styles.loanProgressBg}>
              <View style={[styles.loanProgressFill, {width: '15%'}]} />
            </View>

            {/* Footer */}
            <View style={styles.loanFooter}>
              <View>
                <Text style={styles.loanFooterLabel}>Approved: Sep 05, 2023</Text>
                <Text style={styles.loanFooterValue}>Next: $200.00 on Nov 1st</Text>
              </View>
              <TouchableOpacity style={styles.loanDetailsBtn}>
                <Text style={styles.loanDetailsText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabSimple}>
        <Icon name="add" size={30} color={WHITE} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.containerLight}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      
      {/* Header (Dynamic Titles based on tab) */}
      <View style={styles.headerLight}>
        <TouchableOpacity style={{padding: 4}}>
           <Icon name="chevron-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {activeTab === 'Loans' ? 'Loan Requests' : activeTab === 'Expenses' ? 'Expenses Requests' : 'Requests'}
        </Text>
        <View style={{width: 24}} /> 
      </View>

      {/* Tabs */}
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
        contentOffset={{ x: width, y: 0 }} // Start at Leaves
        style={styles.scrollView}
      >
        {renderExpensesContent()}
        {renderLeavesContent()}
        {renderLoansContent()}
      </ScrollView>

      {/* --- LEAVE MODAL (Existing) --- */}
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
                <Icon name="close" size={24} color={TEXT_GREY} />
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
  containerLight: { flex: 1, backgroundColor: WHITE },

  headerLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  title: { fontSize: 20, fontWeight: '700', color: TEXT_DARK },

  // Tabs
  tabContainerLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 0,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  tabWrapper: { 
    alignItems: 'center', 
    paddingVertical: 12,
    minWidth: 80,
  },
  tab: { fontSize: 16, fontWeight: '500', color: TEXT_GREY },
  activeTabLight: { fontWeight: '700', color: BLUE_BTN },
  activeTabLine: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: BLUE_BTN,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  scrollView: { flex: 1 },
  
  // --- EXPENSES STYLES ---
  expDateFilterContainer: { padding: 16, alignItems:'center' },
  expDateBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F7FA', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  expDateText: { marginHorizontal: 8, fontSize: 14, fontWeight: '600', color: TEXT_DARK },
  sectionHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    marginBottom: 12 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  badgeContainer: { backgroundColor: '#F0F9FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 12, color: BLUE_BTN, fontWeight: '600' },
  
  claimCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  claimIconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 8, 
    backgroundColor: '#E0F2FE', 
    justifyContent:'center', 
    alignItems:'center' 
  },
  claimTitle: { fontSize: 16, fontWeight: '600', color: TEXT_DARK },
  claimAmount: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  claimSub: { fontSize: 12, color: TEXT_GREY },
  statusTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusTagText: { fontSize: 10, fontWeight: '700' },
  
  expFooter: { alignItems: 'center', marginTop: 40, opacity: 0.6 },
  expFooterTitle: { fontSize: 12, fontWeight: '700', color: TEXT_GREY, marginTop: 10, letterSpacing: 1 },
  expFooterSub: { fontSize: 12, color: TEXT_GREY, marginTop: 4 },

  // --- LOANS STYLES ---
  loanSummaryContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  loanSummaryCard: { 
    flex: 1, 
    backgroundColor: '#E9F4F6', // Light teal bg
    padding: 16, 
    borderRadius: 12,
    justifyContent: 'center'
  },
  loanSummaryLabel: { fontSize: 11, fontWeight: '700', color: '#546E7A', letterSpacing: 0.5, marginBottom: 4 },
  loanSummaryValue: { fontSize: 20, fontWeight: '700', color: TEXT_DARK },
  secureBanner: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  secureText: { fontSize: 10, color: TEXT_GREY, letterSpacing: 1, fontWeight: '600' },
  
  loanTabContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20 },
  loanTabBtn: { marginRight: 24, paddingBottom: 8 },
  loanTabBtnActive: { borderBottomWidth: 2, borderBottomColor: BLUE_BTN },
  loanTabText: { fontSize: 16, fontWeight: '600', color: TEXT_GREY },
  loanTabTextActive: { color: BLUE_BTN },

  loanCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAECF0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loanCardHeader: { height: 80, position: 'relative' },
  loanActiveTag: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    backgroundColor: WHITE, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  loanActiveText: { fontSize: 10, fontWeight: '700', color: BLUE_BTN, letterSpacing: 0.5 },
  loanCardBody: { padding: 16 },
  loanBenefitText: { fontSize: 10, fontWeight: '700', color: BLUE_BTN, textTransform: 'uppercase', marginBottom: 4 },
  loanTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK, maxWidth: '70%' },
  loanAmount: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  repaymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 },
  repaymentLabel: { fontSize: 12, color: '#546E7A', fontWeight: '600' },
  loanProgressBg: { height: 6, backgroundColor: '#EAECF0', borderRadius: 3, marginBottom: 16 },
  loanProgressFill: { height: 6, backgroundColor: BLUE_BTN, borderRadius: 3 },
  loanFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  loanFooterLabel: { fontSize: 12, color: '#667085' },
  loanFooterValue: { fontSize: 12, color: TEXT_DARK, fontWeight: '700', marginTop: 2 },
  loanDetailsBtn: { backgroundColor: BLUE_BTN, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  loanDetailsText: { color: WHITE, fontSize: 12, fontWeight: '600' },

  // --- COMMON & LEAVES STYLES ---
  sectionContainer: { paddingHorizontal: 20, marginBottom: 24 },
  subHeader: { fontSize: 18, fontWeight: '700', color: DARK_BLUE, marginBottom: 12 },
  card: { backgroundColor: WHITE, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: WHITE },
  shadowSoft: { shadowColor: '#2C3E50', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
  
  // Leaves Specific
  summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryHeaderLabel: { width: '33%', textAlign: 'center', color: TEXT_GREY, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  bigNumber: { width: '33%', textAlign: 'center', fontSize: 28, fontWeight: '800', color: DARK_BLUE },
  verticalDivider: { width: 1, height: 30, backgroundColor: BORDER_LIGHT },
  casualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  casualTitleRow: { flexDirection: 'row', alignItems: 'center' },
  circleIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: DARK_BLUE },
  subText: { fontSize: 12, color: TEXT_GREY },
  percentText: { fontSize: 16, fontWeight: '700', color: PURPLE },
  progressBarBg: { height: 6, backgroundColor: BORDER_LIGHT, borderRadius: 3, marginBottom: 15 },
  progressBarFill: { height: 6, backgroundColor: PURPLE, borderRadius: 3 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12 },
  statBox: { alignItems: 'center', flex: 1 },
  statBoxActive: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' },
  statLabel: { fontSize: 11, color: TEXT_GREY, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: DARK_BLUE },
  
  fabButton: { backgroundColor: YELLOW, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginBottom: 20, paddingVertical: 16, borderRadius: 16, shadowColor: YELLOW, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  buttonText: { fontSize: 16, fontWeight: '700', color: WHITE },
  
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 12, fontWeight: '700', color: BLUE },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700', color: WHITE },
  description: { fontSize: 14, color: DARK_BLUE, lineHeight: 22, marginBottom: 15 },
  cardDivider: { height: 1, backgroundColor: BORDER_LIGHT, marginBottom: 15 },
  detailsRow: { flexDirection: 'row', gap: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: TEXT_GREY, fontWeight: '500' },
  
  emptyStateCard: { alignItems: 'center', paddingVertical: 30 },
  calendarIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  noHolidaysText: { fontSize: 16, fontWeight: '600', color: DARK_BLUE },

  // New Simple FAB for Loans/Expenses
  fabSimple: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE_BTN,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: BLUE_BTN,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: WHITE, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 24, minHeight: 350 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: DARK_BLUE },
  inputLabel: { fontSize: 14, fontWeight: '600', color: DARK_BLUE, marginBottom: 8 },
  textInput: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 12, padding: 16, fontSize: 16, color: DARK_BLUE, height: 120, marginBottom: 20 },
  submitButton: { backgroundColor: BLUE, paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitButtonText: { color: WHITE, fontSize: 16, fontWeight: '700' },
});

export { RequestScreen };