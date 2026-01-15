
// import React from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   FlatList,
//   Dimensions,
//   SafeAreaView,
// } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width } = Dimensions.get('window');

// const AttendanceDashboardScreen: React.FC = () => {
//   // --- Data Matching the Video ---
//   const previousMonths = [
//     {
//       id: '1',
//       month: 'December',
//       year: '2025',
//       icon: 'pine-tree', // Christmas Tree representation
//       color: '#81C784', // Greenish
//       bg: '#E8F5E9',
//       iconColor: '#2E7D32',
//     },
//     {
//       id: '2',
//       month: 'November',
//       year: '2025',
//       icon: 'food-apple', // Fruit representation
//       color: '#FFAB91', // Peach/Pink
//       bg: '#FBE9E7',
//       iconColor: '#D84315',
//     },
//     {
//       id: '3',
//       month: 'October',
//       year: '2025',
//       icon: 'halloween', // Pumpkin representation
//       color: '#B39DDB', // Purple
//       bg: '#EDE7F6',
//       iconColor: '#512DA8',
//     },
//   ];

//   const attendanceData = [
//     {
//       day: 'Wednesday',
//       date: 'Jan 14, 2026',
//       type: 'present',
//       inTime: '9:06 AM',
//       outTime: null, // Current day, no out time yet
//       isLate: true,
//     },
//     {
//       day: 'Tuesday',
//       date: 'Jan 13, 2026',
//       type: 'present',
//       inTime: '8:56 AM',
//       outTime: '11:59 PM',
//     },
//     {
//       day: 'Monday',
//       date: 'Jan 12, 2026',
//       type: 'present',
//       inTime: '9:05 AM',
//       outTime: '5:49 PM',
//     },
//     {
//       day: 'Sunday',
//       date: 'Jan 11, 2026',
//       type: 'holiday', // Dashes in video
//     },
//     {
//       day: 'Saturday',
//       date: 'Jan 10, 2026',
//       type: 'present',
//       inTime: '9:04 AM',
//       outTime: '5:08 PM',
//     },
//     {
//       day: 'Friday',
//       date: 'Jan 9, 2026',
//       type: 'present',
//       inTime: '9:01 AM',
//       outTime: '5:09 PM',
//     },
//     {
//       day: 'Thursday',
//       date: 'Jan 8, 2026',
//       type: 'present',
//       inTime: '9:01 AM',
//       outTime: '5:35 PM',
//     },
//     {
//       day: 'Wednesday',
//       date: 'Jan 7, 2026',
//       type: 'present',
//       inTime: '9:00 AM',
//       outTime: '5:01 PM',
//     },
//     {
//       day: 'Tuesday',
//       date: 'Jan 6, 2026',
//       type: 'present',
//       inTime: '9:04 AM',
//       outTime: '5:03 PM',
//     },
//     {
//       day: 'Monday',
//       date: 'Jan 5, 2026',
//       type: 'present',
//       inTime: '9:00 AM',
//       outTime: '11:59 PM',
//     },
//     {
//       day: 'Sunday',
//       date: 'Jan 4, 2026',
//       type: 'holiday',
//     },
//     {
//       day: 'Saturday',
//       date: 'Jan 3, 2026',
//       type: 'absent',
//     },
//     {
//       day: 'Friday',
//       date: 'Jan 2, 2026',
//       type: 'absent',
//     },
//     {
//       day: 'Thursday',
//       date: 'Jan 1, 2026',
//       type: 'absent',
//     },
//   ];

//   // --- Render Functions ---

//   const renderBanner = ({ item }: { item: any }) => (
//     <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
//       {/* Background Icon Illustration */}
//       <View style={styles.bannerIconContainer}>
//          <MaterialCommunityIcons name={item.icon} size={80} color="rgba(255,255,255,0.3)" />
//       </View>
      
//       {/* Month Text */}
//       <View style={styles.bannerTextContainer}>
//         <Text style={styles.bannerMonth}>
//           {item.month} <Text style={styles.bannerYear}>• {item.year}</Text>
//         </Text>
//       </View>
//     </View>
//   );

//   const renderAttendanceItem = (item: any, index: number) => {
//     return (
//       <View key={index} style={styles.rowContainer}>
//         {/* Left: Date Info */}
//         <View style={styles.dateColumn}>
//           <Text style={styles.dayText}>{item.day}</Text>
//           <Text style={styles.dateText}>{item.date}</Text>
//         </View>

//         {/* Right: Status Info */}
//         <View style={styles.statusContainer}>
//           {item.type === 'present' ? (
//             <>
//               {/* IN Column */}
//               <View style={styles.timeColumn}>
//                 <Text style={styles.labelIn}>IN</Text>
//                 <View style={styles.timeRow}>
//                   <Text style={styles.timeText}>{item.inTime}</Text>
//                   {item.isLate && <Text style={styles.lateTag}> L</Text>}
//                 </View>
//               </View>

//               {/* OUT Column */}
//               <View style={styles.timeColumn}>
//                 <Text style={styles.labelOut}>OUT</Text>
//                 <Text style={styles.timeText}>
//                     {item.outTime ? item.outTime : '-'}
//                 </Text>
//               </View>
//             </>
//           ) : item.type === 'absent' ? (
//             <View style={styles.absentContainer}>
//                 <Text style={styles.absentText}>ABSENT</Text>
//             </View>
//           ) : (
//             // Holiday / Empty
//              <View style={styles.holidayContainer}>
//                 <Text style={styles.dashText}>—</Text>
//                 <Text style={styles.dashText}>—</Text>
//              </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* --- Header --- */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Attendance Dashboard</Text>
//         </View>

//         {/* --- Previous Reports Section --- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Previous Reports</Text>
//           <Text style={styles.sectionSubtitle}>View your last 3 sessions</Text>
          
//           <FlatList
//             data={previousMonths}
//             renderItem={renderBanner}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.bannerList}
//           />
//         </View>

//         {/* --- Current Analytics Section --- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Your current analytics</Text>
//           <Text style={styles.sectionSubtitle}>Based on your current monthly data</Text>
          
//           <View style={styles.listContainer}>
//             {attendanceData.map((item, index) => renderAttendanceItem(item, index))}
//           </View>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AttendanceDashboardScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
  
//   // --- Header ---
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   headerTitle: {
//     fontSize: 26, // Large bold title
//     fontWeight: 'bold',
//     color: '#000',
//   },

//   // --- Section Styles ---
//   section: {
//     marginTop: 25,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#000',
//     paddingHorizontal: 20,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#9E9E9E', // Grey subtitle
//     paddingHorizontal: 20,
//     marginTop: 4,
//     marginBottom: 15,
//   },

//   // --- Banners ---
//   bannerList: {
//     paddingHorizontal: 20,
//   },
//   bannerCard: {
//     width: 180,
//     height: 110,
//     borderRadius: 16,
//     marginRight: 15,
//     padding: 15,
//     justifyContent: 'flex-end',
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   bannerIconContainer: {
//     position: 'absolute',
//     top: -10,
//     right: -10,
//     transform: [{ rotate: '-10deg' }],
//   },
//   bannerTextContainer: {
//     zIndex: 1,
//   },
//   bannerMonth: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     textShadowColor: 'rgba(0,0,0,0.1)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   bannerYear: {
//     fontSize: 14,
//     fontWeight: 'normal',
//     color: '#f0f0f0',
//   },

//   // --- List Row Styles ---
//   listContainer: {
//     marginTop: 5,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F5F5F5', // Very light divider
//   },
  
//   // Left Side
//   dateColumn: {
//     flex: 1,
//   },
//   dayText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 2,
//   },
//   dateText: {
//     fontSize: 13,
//     color: '#9E9E9E',
//   },

//   // Right Side
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     minWidth: 140, // Ensure consistent alignment for time columns
//     justifyContent: 'flex-end',
//   },
  
//   // Time Columns
//   timeColumn: {
//     alignItems: 'center', // Center align label and time
//     marginLeft: 20,
//     minWidth: 55,
//   },
//   labelIn: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#4CAF50', // Green
//     marginBottom: 2,
//   },
//   labelOut: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFA726', // Orange
//     marginBottom: 2,
//   },
//   timeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   timeText: {
//     fontSize: 13,
//     color: '#757575',
//     fontWeight: '500',
//   },
//   lateTag: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#F44336', // Red L
//   },

//   // Special Statuses
//   absentContainer: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   absentText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#FF5252', // Red
//   },
//   holidayContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     width: 130, // Match width of time columns roughly
//   },
//   dashText: {
//     fontSize: 20,
//     color: '#E0E0E0',
//     marginLeft: 30,
//     fontWeight: '300',
//   },
// });


import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LottieView from 'lottie-react-native'; // Make sure to install lottie-react-native

const { width } = Dimensions.get('window');

const AttendanceDashboardScreen: React.FC = () => {
  // --- Data Matching the Video with Animation Placeholders ---
  const previousMonths = [
    {
      id: '1',
      month: 'December',
      year: '2025',
      // Replace with your local Lottie file: require('../assets/christmas.json')
      // Using a remote URI for demonstration purposes if you don't have local files yet
      animation: require('../src/assets/Fun Christmas tree.json'), 
      color: '#81C784', // Greenish
      bg: '#E8F5E9',
    },
    {
      id: '2',
      month: 'November',
      year: '2025',
      // Replace with: require('../assets/autumn_fruit.json')
      animation: require('../src/assets/fall.json'),
      color: '#FFAB91', // Peach/Pink
      bg: '#FBE9E7',
    },
    {
      id: '3',
      month: 'October',
      year: '2025',
      // Replace with: require('../assets/halloween.json')
      animation: require('../src/assets/Halloween.json'),
      color: '#B39DDB', // Purple
      bg: '#EDE7F6',
    },
  ];

  const attendanceData = [
    {
      day: 'Wednesday',
      date: 'Jan 14, 2026',
      type: 'present',
      inTime: '9:06 AM',
      outTime: null,
      isLate: true,
    },
    {
      day: 'Tuesday',
      date: 'Jan 13, 2026',
      type: 'present',
      inTime: '8:56 AM',
      outTime: '11:59 PM',
    },
    {
      day: 'Monday',
      date: 'Jan 12, 2026',
      type: 'present',
      inTime: '9:05 AM',
      outTime: '5:49 PM',
    },
    {
      day: 'Sunday',
      date: 'Jan 11, 2026',
      type: 'holiday',
    },
    {
      day: 'Saturday',
      date: 'Jan 10, 2026',
      type: 'present',
      inTime: '9:04 AM',
      outTime: '5:08 PM',
    },
    {
      day: 'Friday',
      date: 'Jan 9, 2026',
      type: 'present',
      inTime: '9:01 AM',
      outTime: '5:09 PM',
    },
    {
      day: 'Thursday',
      date: 'Jan 8, 2026',
      type: 'present',
      inTime: '9:01 AM',
      outTime: '5:35 PM',
    },
    {
      day: 'Wednesday',
      date: 'Jan 7, 2026',
      type: 'present',
      inTime: '9:00 AM',
      outTime: '5:01 PM',
    },
    {
      day: 'Tuesday',
      date: 'Jan 6, 2026',
      type: 'present',
      inTime: '9:04 AM',
      outTime: '5:03 PM',
    },
    {
      day: 'Monday',
      date: 'Jan 5, 2026',
      type: 'present',
      inTime: '9:00 AM',
      outTime: '11:59 PM',
    },
    {
      day: 'Sunday',
      date: 'Jan 4, 2026',
      type: 'holiday',
    },
    {
      day: 'Saturday',
      date: 'Jan 3, 2026',
      type: 'absent',
    },
    {
      day: 'Friday',
      date: 'Jan 2, 2026',
      type: 'absent',
    },
    {
      day: 'Thursday',
      date: 'Jan 1, 2026',
      type: 'absent',
    },
  ];

  // --- Render Functions ---

  const renderBanner = ({ item }: { item: any }) => (
    <View style={styles.bannerWrapper}>
      {/* The Animated Card */}
      <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
         <LottieView 
            source={item.animation} 
            autoPlay 
            loop 
            style={styles.lottieAnimation}
            resizeMode="cover"
         />
      </View>
      
      {/* Month Text Below Card */}
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerMonth}>
          {item.month} <Text style={styles.bannerYear}>• {item.year}</Text>
        </Text>
      </View>
    </View>
  );

  const renderAttendanceItem = (item: any, index: number) => {
    return (
      <View key={index} style={styles.rowContainer}>
        {/* Left: Date Info */}
        <View style={styles.dateColumn}>
          <Text style={styles.dayText}>{item.day}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* Right: Status Info */}
        <View style={styles.statusContainer}>
          {item.type === 'present' ? (
            <>
              {/* IN Column */}
              <View style={styles.timeColumn}>
                <Text style={styles.labelIn}>IN</Text>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{item.inTime}</Text>
                  {item.isLate && <Text style={styles.lateTag}> L</Text>}
                </View>
              </View>

              {/* OUT Column */}
              <View style={styles.timeColumn}>
                <Text style={styles.labelOut}>OUT</Text>
                <Text style={styles.timeText}>
                    {item.outTime ? item.outTime : '-'}
                </Text>
              </View>
            </>
          ) : item.type === 'absent' ? (
            <View style={styles.absentContainer}>
                <Text style={styles.absentText}>ABSENT</Text>
            </View>
          ) : (
            // Holiday / Empty
             <View style={styles.holidayContainer}>
                <Text style={styles.dashText}>—</Text>
                <Text style={styles.dashText}>—</Text>
             </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Header --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance Dashboard</Text>
        </View>

        {/* --- Previous Reports Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Reports</Text>
          <Text style={styles.sectionSubtitle}>View your last 3 sessions</Text>
          
          <FlatList
            data={previousMonths}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerList}
            snapToInterval={335} // card width + margin
            decelerationRate="fast"
          />
        </View>

        {/* --- Current Analytics Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your current analytics</Text>
          <Text style={styles.sectionSubtitle}>Based on your current monthly data</Text>
          
          <View style={styles.listContainer}>
            {attendanceData.map((item, index) => renderAttendanceItem(item, index))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AttendanceDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // --- Header ---
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26, 
    fontWeight: 'bold',
    color: '#000',
  },

  // --- Section Styles ---
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#9E9E9E', 
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 15,
  },

  // --- Banners ---
  bannerList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  bannerWrapper: {
    marginRight: 15,
  },
  bannerCard: {
    width: 320,  // Increased Width
    height: 200, // Increased Height
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  bannerTextContainer: {
    marginTop: 8,
    marginLeft: 4,
  },
  bannerMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Black text below card
  },
  bannerYear: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFA726', // Orange highlight for year
  },

  // --- List Row Styles ---
  listContainer: {
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5', 
  },
  
  // Left Side
  dateColumn: {
    flex: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#9E9E9E',
  },

  // Right Side
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140, 
    justifyContent: 'flex-end',
  },
  
  // Time Columns
  timeColumn: {
    alignItems: 'center', 
    marginLeft: 20,
    minWidth: 55,
  },
  labelIn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50', // Green
    marginBottom: 2,
  },
  labelOut: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFA726', // Orange
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  lateTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F44336', // Red L
  },

  // Special Statuses
  absentContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  absentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5252', // Red
  },
  holidayContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 130, 
  },
  dashText: {
    fontSize: 20,
    color: '#E0E0E0',
    marginLeft: 30,
    fontWeight: '300',
  },
});