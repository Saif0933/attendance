
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DARK_BLUE = '#0A2540';
const WHITE = '#FFFFFF';
const ORANGE = '#FF9500';
const LIGHT_GRAY = '#B0B3B8';
const LIGHT_BLACK = '#060505ff';

const WorkScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Visits' | 'Clients'>('Tasks');
  const scrollViewRef = useRef<ScrollView>(null);

  // Tab Order Definition
  const tabs: ('Tasks' | 'Visits' | 'Clients')[] = ['Tasks', 'Visits', 'Clients'];

  // Handle Tab Press - Switch tabs locally
  const handleTabPress = (tab: 'Tasks' | 'Visits' | 'Clients') => {
    setActiveTab(tab);
    const index = tabs.indexOf(tab);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  // Sync Active Tab on Swipe
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    const newTab = tabs[slide];
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  // Reusable Content Component
  const renderPlaceholderContent = (title: string) => (
    <View style={[styles.contentPage, { width: width }]}>
      <Text style={styles.contentTextGray}>
        Your firm has not enabled {title}
      </Text>
      <Text style={styles.contentTextGray}>Management.</Text>
      <Text style={styles.contentTextGray}>
        Please contact your administrator.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.containerDark}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BLUE} />

      {/* Header */}
      <View style={styles.headerDark}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.titleWhite}>Work Dashboard</Text>
          <Text style={styles.orangeDot}>•</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainerDark}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.8}
            style={styles.tabWrapper}
          >
            <Text
              style={[
                styles.tabWhite,
                activeTab === tab && styles.activeTabWhite,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Horizontal ScrollView for Swiping */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.contentContainer}
      >
        {/* Content for Tasks */}
        {renderPlaceholderContent('Task')}

        {/* Content for Visits */}
        {renderPlaceholderContent('Visit')}

        {/* Content for Clients */}
        {renderPlaceholderContent('Client')}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: DARK_BLUE,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: DARK_BLUE,
  },
  titleWhite: {
    fontSize: 25,
    fontWeight: '800',
    padding: 5,
    color: WHITE,
  },
  orangeDot: {
    fontSize: 34,
    color: ORANGE,
    marginLeft: 4,
  },
  tabContainerDark: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: DARK_BLUE,
    borderBottomWidth: 1,
    borderBottomColor: '#1B3555',
  },
  tabWrapper: {
    alignItems: 'center',
  },
  tabWhite: {
    fontSize: 17,
    fontWeight: '400',
    color: LIGHT_GRAY,
  },
  activeTabWhite: {
    color: WHITE,
    fontWeight: '600',
  },
  activeLine: {
    marginTop: 4,
    height: 3,
    width: 40,
    backgroundColor: ORANGE,
    borderRadius: 2,
  },
  // New container style for the scroll view area
  contentContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  // Style for individual pages inside the scroll view
  contentPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: WHITE,
  },
  contentTextGray: {
    fontSize: 15,
    color: LIGHT_BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export { WorkScreen };



// import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Added useFocusEffect
// import React, { useCallback, useState } from 'react'; // Added useCallback
// import {
//   Dimensions,
//   Image,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');

// // --- COLORS ---
// const COLORS = {
//   bg: '#FFFFFF',
//   bgLight: '#F5F7FA',
//   primary: '#2096C9',
//   textDark: '#101828',
//   textGrey: '#667085',
//   border: '#EAECF0',
//   red: '#F04438',
//   redBg: '#FEF3F2',
//   greenBg: '#ECFDF3',
//   greenText: '#027A48',
//   blueBg: '#E0F2FE',
//   blueText: '#026AA2',
//   orange: '#FF9500',
// };

// const WorkScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState<'Tasks' | 'Visits' | 'Clients'>('Tasks');

//   const tabs: ('Tasks' | 'Visits' | 'Clients')[] = ['Tasks', 'Visits', 'Clients'];

//   // Reset to 'Tasks' when coming back to this screen
//   useFocusEffect(
//     useCallback(() => {
//       setActiveTab('Tasks');
//     }, [])
//   );

//   // Handle Tab Press - Navigate to respective screen
//   const handleTabPress = (tab: 'Tasks' | 'Visits' | 'Clients') => {
//     setActiveTab(tab);

//     // Navigate to respective screen
//     if (tab === 'Visits') {
//       setTimeout(() => navigation.navigate('VisitsScreen' as never), 50);
//     } else if (tab === 'Clients') {
//       setTimeout(() => navigation.navigate('ClientsScreen' as never), 50);
//     }
//     // Tasks tab stays on current screen (no navigation needed)
//   };

//   // --- RENDER TASKS CONTENT ---
//   const renderTasksContent = () => (
//     <ScrollView 
//       style={{ flex: 1, backgroundColor: COLORS.bgLight }}
//       contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
//       showsVerticalScrollIndicator={false}
//     >
      
//       {/* High Priority Header */}
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>High Priority</Text>
//         <View style={styles.actionBadge}>
//           <Text style={styles.actionBadgeText}>2 ACTIONS REQUIRED</Text>
//         </View>
//       </View>

//       {/* --- CARD 1: Critical Deadline --- */}
//       <View style={styles.card}>
//         <View style={styles.cardHeaderRow}>
//           <Text style={styles.tagRed}>CRITICAL DEADLINE</Text>
//           <TouchableOpacity>
//              <Icon name="ellipsis-vertical" size={20} color={COLORS.textGrey} />
//           </TouchableOpacity>
//         </View>
        
//         <Text style={styles.cardTitle}>Finalize Q4 Strategy Presentation</Text>
        
//         <View style={styles.metaRow}>
//           <Icon name="calendar-outline" size={16} color={COLORS.textGrey} />
//           <Text style={styles.metaText}>Due Today, 5:00 PM</Text>
//         </View>

//         {/* Progress Bar */}
//         <View style={styles.progressContainer}>
//           <View style={styles.progressLabelRow}>
//              <Text style={styles.progressLabel}>In Progress</Text>
//              <Text style={styles.progressPercent}>85%</Text>
//           </View>
//           <View style={styles.progressBarBg}>
//              <View style={[styles.progressBarFill, { width: '85%', backgroundColor: COLORS.primary }]} />
//           </View>
//         </View>

//         {/* Footer: Avatars + Button */}
//         <View style={styles.cardFooter}>
//            <View style={styles.avatarGroup}>
//               <Image source={{uri: 'https://randomuser.me/api/portraits/women/44.jpg'}} style={styles.avatar} />
//               <Image source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} style={[styles.avatar, {marginLeft: -10}]} />
//            </View>
//            <TouchableOpacity style={styles.viewBtn}>
//               <Text style={styles.viewBtnText}>View Task</Text>
//            </TouchableOpacity>
//         </View>
//       </View>

//       {/* --- CARD 2: Approval Needed --- */}
//       <View style={styles.card}>
//         <View style={styles.cardHeaderRow}>
//           <Text style={styles.tagOrange}>APPROVAL NEEDED</Text>
//         </View>
        
//         <Text style={styles.cardTitle}>Client Budget Review: TechNova</Text>
        
//         <View style={styles.metaRow}>
//           <Icon name="time-outline" size={16} color={COLORS.textGrey} />
//           <Text style={styles.metaText}>Overdue by 2 hours</Text>
//         </View>

//         {/* Red Progress Bar */}
//         <View style={styles.progressContainer}>
//           <View style={styles.progressLabelRow}>
//              <Text style={[styles.progressLabel, {color: COLORS.red}]}>Pending Approval</Text>
//              <Text style={styles.progressPercent}>40%</Text>
//           </View>
//           <View style={styles.progressBarBg}>
//              <View style={[styles.progressBarFill, { width: '40%', backgroundColor: COLORS.red }]} />
//           </View>
//         </View>
//       </View>

//       {/* Recent Activity Section */}
//       <View style={[styles.sectionHeader, {marginTop: 25}]}>
//         <Text style={styles.sectionTitle}>Recent Activity</Text>
//         <TouchableOpacity>
//            <Text style={styles.seeAllText}>SEE ALL</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Activity List */}
//       <View style={styles.activityCard}>
//          <View style={styles.activityIconBoxBlue}>
//             <Icon name="document-text" size={20} color={COLORS.primary} />
//          </View>
//          <View style={styles.activityInfo}>
//             <Text style={styles.activityTitle}>Draft Sales Contract - Zenit...</Text>
//             <Text style={styles.activitySub}>Modified 20m ago</Text>
//          </View>
//          <View style={styles.statusPillGrey}>
//             <Text style={styles.statusPillTextGrey}>DRAFT</Text>
//          </View>
//       </View>

//       <View style={styles.activityCard}>
//          <View style={styles.activityIconBoxGreen}>
//             <Icon name="checkmark-circle" size={20} color={COLORS.greenText} />
//          </View>
//          <View style={styles.activityInfo}>
//             <Text style={styles.activityTitle}>Update CRM: Monthly Report</Text>
//             <Text style={styles.activitySub}>Completed 1h ago</Text>
//          </View>
//          <View style={styles.statusPillGreen}>
//             <Text style={styles.statusPillTextGreen}>DONE</Text>
//          </View>
//       </View>

//       <View style={styles.activityCard}>
//          <View style={styles.activityIconBoxLightBlue}>
//             <Icon name="person-add" size={20} color={COLORS.blueText} />
//          </View>
//          <View style={styles.activityInfo}>
//             <Text style={styles.activityTitle}>Onboard New Client: Align...</Text>
//             <Text style={styles.activitySub}>Due in 3 days</Text>
//          </View>
//          <View style={styles.statusPillBlue}>
//             <Text style={styles.statusPillTextBlue}>WAITING</Text>
//          </View>
//       </View>

//     </ScrollView>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <View style={styles.logoBox}>
//             <Icon name="grid" size={20} color={COLORS.primary} />
//           </View>
//           <Text style={styles.headerTitle}>Work Tasks</Text>
//         </View>
//         <View style={styles.headerRight}>
//            <TouchableOpacity style={{marginRight: 15}}>
//              <Icon name="search" size={24} color={COLORS.textDark} />
//            </TouchableOpacity>
//            <TouchableOpacity>
//              <Icon name="notifications" size={24} color={COLORS.textDark} />
//            </TouchableOpacity>
//         </View>
//       </View>

//       {/* Custom Tab Switcher */}
//       <View style={styles.tabContainer}>
//         <View style={styles.tabBackground}>
//           {tabs.map((tab) => {
//              const isActive = activeTab === tab;
//              return (
//               <TouchableOpacity
//                 key={tab}
//                 onPress={() => handleTabPress(tab)}
//                 style={[styles.tabBtn, isActive && styles.tabBtnActive]}
//                 activeOpacity={0.8}
//               >
//                 <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//              );
//           })}
//         </View>
//       </View>

//       {/* Main Content - Tasks Content Only (no swipe) */}
//       {renderTasksContent()}

//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFF' },
//   /* HEADER */
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF' },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   logoBox: { width: 36, height: 36, backgroundColor: '#E0F2FE', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
//   headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textDark },
//   headerRight: { flexDirection: 'row', alignItems: 'center' },
//   /* TABS */
//   tabContainer: { paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#FFF' },
//   tabBackground: { flexDirection: 'row', backgroundColor: '#F2F4F7', borderRadius: 12, padding: 4 },
//   tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
//   tabBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
//   tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textGrey },
//   tabTextActive: { color: COLORS.primary },
//   /* SECTIONS */
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
//   sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
//   actionBadge: { backgroundColor: '#FEF3F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   actionBadgeText: { color: COLORS.red, fontSize: 10, fontWeight: '700' },
//   seeAllText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
//   /* CARDS */
//   card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#101828', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
//   cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   tagRed: { color: COLORS.red, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
//   tagOrange: { color: COLORS.orange, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
//   cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
//   metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
//   metaText: { fontSize: 13, color: COLORS.textGrey, marginLeft: 6 },
//   /* Progress */
//   progressContainer: { marginBottom: 16 },
//   progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
//   progressLabel: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
//   progressPercent: { fontSize: 12, color: COLORS.textDark, fontWeight: '600' },
//   progressBarBg: { height: 6, backgroundColor: '#F2F4F7', borderRadius: 3 },
//   progressBarFill: { height: 6, borderRadius: 3 },
//   /* Footer */
//   cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F2F4F7', paddingTop: 12 },
//   avatarGroup: { flexDirection: 'row' },
//   avatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#FFF' },
//   viewBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
//   viewBtnText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
//   /* Activity */
//   activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
//   activityIconBoxBlue: { width: 40, height: 40, backgroundColor: '#E0F2FE', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   activityIconBoxGreen: { width: 40, height: 40, backgroundColor: '#ECFDF3', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   activityIconBoxLightBlue: { width: 40, height: 40, backgroundColor: '#F0F9FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   activityInfo: { flex: 1 },
//   activityTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
//   activitySub: { fontSize: 12, color: COLORS.textGrey, marginTop: 2 },
//   statusPillGrey: { backgroundColor: '#F2F4F7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
//   statusPillTextGrey: { fontSize: 10, fontWeight: '700', color: '#344054' },
//   statusPillGreen: { backgroundColor: '#ECFDF3', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
//   statusPillTextGreen: { fontSize: 10, fontWeight: '700', color: COLORS.greenText },
//   statusPillBlue: { backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
//   statusPillTextBlue: { fontSize: 10, fontWeight: '700', color: COLORS.blueText },
// });

// export { WorkScreen };
