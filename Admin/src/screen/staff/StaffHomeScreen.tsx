
// import React, { useState } from 'react';
// import {
//   Dimensions,
//   Image,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AddStaffScreen from './AddStaffScreen';
// import NewCategoryScreen from './NewCategoryScreen';
// import SearchStaff from './SearchStaff';
// import TodaysAbsentScreen from './TodaysAbsentScreen';

// const { width } = Dimensions.get('window');

// /* ===================== MOCK DATA ===================== */

// type Employee = {
//   id: string;
//   name: string;
//   role: string;
//   status: 'IN' | 'Not marked';
//   time: string;
//   flag: string;
//   avatar: string;
//   isImage: boolean;
// };

// // DATA EXTENDED TO FORCE SCROLLING
// const EMPLOYEES: Employee[] = [
//   {
//     id: '1',
//     name: 'Md. Saif',
//     role: 'Full Stack Developer',
//     status: 'IN',
//     time: '9:11 AM',
//     flag: 'L',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     isImage: true,
//   },
//   {
//     id: '2',
//     name: 'Puja Staff',
//     role: 'Human Resource',
//     status: 'Not marked',
//     time: '',
//     flag: '',
//     avatar: 'P',
//     isImage: false,
//   },
//   {
//     id: '3',
//     name: 'Roshni Parween',
//     role: 'Full Stack Developer',
//     status: 'Not marked',
//     time: '',
//     flag: '',
//     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     isImage: true,
//   },
//   {
//     id: '4',
//     name: 'Amit Sharma',
//     role: 'Backend Developer',
//     status: 'IN',
//     time: '9:05 AM',
//     flag: '',
//     avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
//     isImage: true,
//   },
//   {
//     id: '5',
//     name: 'Sarah Jenkins',
//     role: 'UI/UX Designer',
//     status: 'IN',
//     time: '9:30 AM',
//     flag: 'L',
//     avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
//     isImage: true,
//   },
//   {
//     id: '6',
//     name: 'Rahul Verma',
//     role: 'QA Engineer',
//     status: 'Not marked',
//     time: '',
//     flag: '',
//     avatar: 'R',
//     isImage: false,
//   },
//   {
//     id: '7',
//     name: 'John Doe',
//     role: 'Product Manager',
//     status: 'IN',
//     time: '8:55 AM',
//     flag: '',
//     avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
//     isImage: true,
//   },
//   {
//     id: '8',
//     name: 'Emily Davis',
//     role: 'Marketing Lead',
//     status: 'IN',
//     time: '9:15 AM',
//     flag: 'L',
//     avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
//     isImage: true,
//   },
//   {
//     id: '9',
//     name: 'Vikram Singh',
//     role: 'DevOps Engineer',
//     status: 'Not marked',
//     time: '',
//     flag: '',
//     avatar: 'V',
//     isImage: false,
//   },
// ];

// /* ===================== SCREEN ===================== */

// const StaffHomeScreen: React.FC = () => {
//   const [calendarVisible, setCalendarVisible] = useState(false);
//   const [categoryModalVisible, setCategoryModalVisible] = useState(false);
//   const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
//   const [todaysAbsentModalVisible, setTodaysAbsentModalVisible] = useState(false);
//   const [searchStaffModalVisible, setSearchStaffModalVisible] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

//       <View style={styles.backgroundLayer} />

//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.greetingText}>Good morning.</Text>
//           <View style={styles.headerDot} />
//         </View>

//         {/* Stats Card */}
//         <View style={styles.statsCard}>
//           <View style={styles.statsHeader}>
//             <View>
//               <Text style={styles.statsTitle}>Attendance Statistics</Text>
//               <Text style={styles.statsSubtitle}>Based on Jan 21, 2026</Text>
//             </View>

//             <TouchableOpacity
//               style={styles.dateButton}
//               onPress={() => setCalendarVisible(true)}
//             >
//               <Ionicons name="calendar-outline" size={18} color="#fff" />
//               <Text style={styles.dateButtonText}>Today</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Stat items - All open TodaysAbsentScreen */}
//           <View style={styles.statsGrid}>
//             <View style={styles.statRow}>
//               <StatItem 
//                 label="Staff Heads" 
//                 value="9" 
//                 color="#4FC3F7" 
//                 onPress={() => setTodaysAbsentModalVisible(true)} 
//               />
//               <StatItem 
//                 label="Staff Present" 
//                 value="5" 
//                 color="#66BB6A" 
//                 onPress={() => setTodaysAbsentModalVisible(true)} 
//               />
//               <StatItem 
//                 label="Staff Absence" 
//                 value="4" 
//                 color="#FF7043" 
//                 onPress={() => setTodaysAbsentModalVisible(true)} 
//               />
//             </View>
//             <View style={styles.statRow}>
//               <StatItem 
//                 label="Staff Late" 
//                 value="3" 
//                 color="#FFCA28" 
//                 onPress={() => setTodaysAbsentModalVisible(true)} 
//               />
//               <StatItem 
//                 label="Leave" 
//                 value="0" 
//                 color="#AB47BC" 
//                 onPress={() => setTodaysAbsentModalVisible(true)} 
//               />
//               <StatItem 
//                 label="Early" 
//                 value="0" 
//                 color="#FFA726" 
//                 onPress={() => setTodaysAbsentModalVisible(true)} 
//               />
//             </View>
//           </View>
//         </View>

//         {/* Search - Opens SearchStaff popup */}
//         <TouchableOpacity 
//           style={styles.searchContainer}
//           onPress={() => setSearchStaffModalVisible(true)}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="search-outline" size={22} color="#fff" />
//           <Text style={styles.searchPlaceholder}>Search</Text>
//           <Ionicons name="filter-outline" size={22} color="#fff" />
//         </TouchableOpacity>

//         {/* Filter + Add */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity style={styles.filterPillActive}>
//             <Text style={styles.filterPillTextActive}>All</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.addButtonSmall}
//             onPress={() => setCategoryModalVisible(true)}
//           >
//             <Ionicons name="add-circle-outline" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Employees */}
//         <View style={styles.listHeader}>
//           <Text style={styles.listTitle}>Employees</Text>
//           <Text style={styles.listSubtitle}>Current Company Staff</Text>
//         </View>

//         {EMPLOYEES.map(emp => (
//           <View key={emp.id} style={styles.employeeCard}>
//             <View style={styles.avatarContainer}>
//               {emp.isImage ? (
//                 <Image source={{ uri: emp.avatar }} style={styles.avatarImage} />
//               ) : (
//                 <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
//                   <Text style={styles.avatarText}>{emp.avatar}</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.employeeInfo}>
//               <Text style={styles.employeeName}>{emp.name}</Text>
//               <Text style={styles.employeeRole}>{emp.role}</Text>
//             </View>

//             <View style={styles.statusContainer}>
//               {emp.status === 'IN' ? (
//                 <>
//                   <Text style={styles.statusInText}>IN</Text>
//                   <Text style={styles.timeText}>
//                     {emp.time}{' '}
//                     <Text style={styles.lateFlag}>{emp.flag}</Text>
//                   </Text>
//                 </>
//               ) : (
//                 <Text style={styles.statusNotMarked}>Not marked</Text>
//               )}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* FAB */}
//       <TouchableOpacity style={styles.fab} onPress={() => setAddStaffModalVisible(true)}>
//         <Ionicons name="add-outline" size={28} color="#333" />
//       </TouchableOpacity>

//       {/* Calendar Modal */}
//       <Modal transparent visible={calendarVisible}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.calendarContainer}>
//             <Text style={styles.calendarTitle}>Select Date</Text>
//             <TouchableOpacity onPress={() => setCalendarVisible(false)}>
//               <Ionicons name="close-circle-outline" size={26} color="#333" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Category Modal */}
//       <Modal transparent visible={categoryModalVisible}>
//         <View style={styles.categoryModalOverlay}>
//           <View style={styles.categoryModalContainer}>
//             <NewCategoryScreen onClose={() => setCategoryModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>

//       {/* Add Staff Modal */}
//       <Modal
//         transparent
//         visible={addStaffModalVisible}
//         animationType="slide"
//         onRequestClose={() => setAddStaffModalVisible(false)}
//       >
//         <View style={styles.addStaffModalOverlay}>
//           <View style={styles.addStaffModalContainer}>
//             <AddStaffScreen onClose={() => setAddStaffModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>

//       {/* Todays Absent Modal */}
//       <Modal
//         transparent
//         visible={todaysAbsentModalVisible}
//         animationType="slide"
//         onRequestClose={() => setTodaysAbsentModalVisible(false)}
//       >
//         <View style={styles.todaysAbsentModalOverlay}>
//           <View style={styles.todaysAbsentModalContainer}>
//             <TodaysAbsentScreen onClose={() => setTodaysAbsentModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>

//       {/* Search Staff Modal */}
//       <Modal
//         transparent
//         visible={searchStaffModalVisible}
//         animationType="slide"
//         onRequestClose={() => setSearchStaffModalVisible(false)}
//       >
//         <View style={styles.searchStaffModalOverlay}>
//           <View style={styles.searchStaffModalContainer}>
//             <SearchStaff onClose={() => setSearchStaffModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// /* ===================== STAT ITEM ===================== */

// type StatItemProps = {
//   label: string;
//   value: string;
//   color: string;
//   onPress?: () => void; // CHANGED: Added onPress prop
// };

// // CHANGED: Converted View to TouchableOpacity
// const StatItem: React.FC<StatItemProps> = ({ label, value, color, onPress }) => (
//   <TouchableOpacity style={styles.statItem} onPress={onPress} activeOpacity={0.7}>
//     <View style={[styles.statBar, { backgroundColor: color }]} />
//     <View>
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label.replace('Staff ', '')}</Text>
//       {label.includes('Staff') && (
//         <Text style={styles.statLabelSmall}>Staff</Text>
//       )}
//     </View>
//   </TouchableOpacity>
// );

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#2C2B20' },
//   backgroundLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3E3C2E', opacity: 0.8 },
  
//   // CHANGED: Added paddingBottom so the last item isn't hidden by the FAB
//   scrollContent: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 100 },

//   header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   greetingText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
//   headerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#A0A0A0' },

//   statsCard: { backgroundColor: 'rgba(60,50,40,0.6)', borderRadius: 20, padding: 20, marginBottom: 20 },
//   statsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   statsTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   statsSubtitle: { fontSize: 12, color: '#ccc' },

//   dateButton: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', padding: 8, borderRadius: 12 },
//   dateButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },

//   statsGrid: { gap: 20 },
//   statRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   statItem: { flexDirection: 'row', alignItems: 'center', width: '30%' },
//   statBar: { width: 4, height: 35, borderRadius: 2, marginRight: 8 },
//   statValue: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   statLabel: { fontSize: 10, color: '#ccc' },
//   statLabelSmall: { fontSize: 10, color: '#ccc' },

//   searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(60,50,40,0.6)', borderRadius: 16, height: 50, paddingHorizontal: 15, marginBottom: 20 },
//   searchPlaceholder: { flex: 1, color: '#ccc', fontSize: 16, marginLeft: 10 },

//   actionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   filterPillActive: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
//   filterPillTextActive: { fontWeight: 'bold' },
//   addButtonSmall: { marginLeft: 10 },

//   listHeader: { marginBottom: 15 },
//   listTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   listSubtitle: { fontSize: 12, color: '#ccc' },

//   employeeCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   avatarContainer: { marginRight: 15 },
//   avatarImage: { width: 45, height: 45, borderRadius: 22.5 },
//   avatarPlaceholder: { backgroundColor: '#607D8B', justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

//   employeeInfo: { flex: 1 },
//   employeeName: { color: '#fff', fontWeight: 'bold' },
//   employeeRole: { color: '#bbb', fontSize: 12 },

//   statusContainer: { alignItems: 'flex-end' },
//   statusInText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 12 },
//   timeText: { color: '#fff', fontSize: 12 },
//   lateFlag: { color: '#FF5252', fontWeight: 'bold' },
//   statusNotMarked: { color: '#ccc', fontSize: 12 },

//   fab: { position: 'absolute', bottom: 40, right: 20, width: 55, height: 55, borderRadius: 16, backgroundColor: '#D1E8FF', justifyContent: 'center', alignItems: 'center' },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
//   calendarContainer: { width: width * 0.85, backgroundColor: '#fff', borderRadius: 20, padding: 20 },
//   calendarTitle: { fontSize: 18, fontWeight: 'bold' },

//   categoryModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   categoryModalContainer: { backgroundColor: '#383018', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '100%' },

//   addStaffModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   addStaffModalContainer: { backgroundColor: '#383018', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '100%' },

//   todaysAbsentModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   todaysAbsentModalContainer: { backgroundColor: '#383018', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '100%' },

//   searchStaffModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   searchStaffModalContainer: { backgroundColor: '#383018', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '100%' },
// });

// export default StaffHomeScreen;




import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetAllEmployeesWithInfiniteQuery } from '../../../../src/employee/hook/useEmployee';
import AddStaffScreen from './AddStaffScreen';
import NewCategoryScreen from './NewCategoryScreen';
import SearchStaff from './SearchStaff';
import TodaysAbsentScreen from './TodaysAbsentScreen';

const { width } = Dimensions.get('window');

// API Base URL for images
const IMAGE_BASE_URL = "http://192.168.1.10:5000";


/* ===================== SCREEN ===================== */

const StaffHomeScreen: React.FC = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [todaysAbsentModalVisible, setTodaysAbsentModalVisible] = useState(false);
  const [searchStaffModalVisible, setSearchStaffModalVisible] = useState(false);

  // FETCH EMPLOYEES
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useGetAllEmployeesWithInfiniteQuery({ limit: 10 });

  const employees = data?.pages.flatMap(page => page.data.employees) || [];
  const stats = data?.pages[0]?.data.meta || { totalCount: 0 };

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Good morning.</Text>
        <View style={styles.headerDot} />
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View>
            <Text style={styles.statsTitle}>Attendance Statistics</Text>
            <Text style={styles.statsSubtitle}>Based on {new Date().toLocaleDateString()}</Text>
          </View>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setCalendarVisible(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.dateButtonText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Stat items */}
        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <StatItem 
              label="Staff Heads" 
              value={stats.totalCount.toString()} 
              color="#4FC3F7" 
              onPress={() => setTodaysAbsentModalVisible(true)} 
            />
            <StatItem 
              label="Staff Present" 
              value="0" 
              color="#66BB6A" 
              onPress={() => setTodaysAbsentModalVisible(true)} 
            />
            <StatItem 
              label="Staff Absence" 
              value="0" 
              color="#FF7043" 
              onPress={() => setTodaysAbsentModalVisible(true)} 
            />
          </View>
        </View>
      </View>

      {/* Search */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => setSearchStaffModalVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="search-outline" size={22} color="#A0A0A0" />
        <Text style={styles.searchPlaceholder}>Search</Text>
        <Ionicons name="filter-outline" size={22} color="#A0A0A0" />
      </TouchableOpacity>

      {/* Filter + Add */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.filterPillActive}>
          <Text style={styles.filterPillTextActive}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={32} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Employees Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Employees</Text>
        <Text style={styles.listSubtitle}>Current Company Staff</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.backgroundLayer} />

      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderHeader}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={({ item: emp }) => (
          <View style={styles.employeeCard}>
            <View style={styles.avatarContainer}>
              {emp.profilePicture?.url ? (
                <Image 
                  source={{ uri: `${IMAGE_BASE_URL}${emp.profilePicture.url}` }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>
                    {emp.firstname.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{emp.firstname} {emp.lastname}</Text>
              <Text style={styles.employeeRole}>{emp.designation || 'Staff'}</Text>
            </View>

            <View style={styles.statusContainer}>
              {emp.attendances.length > 0 ? (
                <>
                  <Text style={styles.statusInText}>{emp.attendances[0].status}</Text>
                  <Text style={styles.timeText}>
                    {emp.attendances[0].checkIn ? new Date(emp.attendances[0].checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </Text>
                </>
              ) : (
                <Text style={styles.statusNotMarked}>Not marked</Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 20 }} />
          ) : null
        )}
        ListEmptyComponent={() => (
          !isLoading && (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#94A3B8' }}>No employees found</Text>
            </View>
          )
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddStaffModalVisible(true)}>
        <Ionicons name="add-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal transparent visible={calendarVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center', marginBottom: 15}}>
                <Text style={styles.calendarTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>
            <CustomCalendar onSelect={(date) => {
              console.log('Selected date:', date);
              setCalendarVisible(false);
            }} />
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal transparent visible={categoryModalVisible}>
        <View style={styles.categoryModalOverlay}>
          <View style={styles.categoryModalContainer}>
            <NewCategoryScreen onClose={() => setCategoryModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        transparent
        visible={addStaffModalVisible}
        animationType="slide"
        onRequestClose={() => setAddStaffModalVisible(false)}
      >
        <View style={styles.addStaffModalOverlay}>
          <View style={styles.addStaffModalContainer}>
            <AddStaffScreen onClose={() => setAddStaffModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Todays Absent Modal */}
      <Modal
        transparent
        visible={todaysAbsentModalVisible}
        animationType="slide"
        onRequestClose={() => setTodaysAbsentModalVisible(false)}
      >
        <View style={styles.todaysAbsentModalOverlay}>
          <View style={styles.todaysAbsentModalContainer}>
            <TodaysAbsentScreen onClose={() => setTodaysAbsentModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Search Staff Modal */}
      <Modal
        transparent
        visible={searchStaffModalVisible}
        animationType="slide"
        onRequestClose={() => setSearchStaffModalVisible(false)}
      >
        <View style={styles.searchStaffModalOverlay}>
          <View style={styles.searchStaffModalContainer}>
            <SearchStaff onClose={() => setSearchStaffModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* ===================== CUSTOM CALENDAR ===================== */

const CustomCalendar = ({ onSelect }: { onSelect: (date: string) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
  }
  for (let i = 1; i <= totalDays; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    days.push(
      <TouchableOpacity
        key={i}
        style={[styles.calendarDay, isToday && styles.calendarDayToday]}
        onPress={() => onSelect(`${year}-${month + 1}-${i}`)}
      >
        <Text style={[styles.calendarDayText, isToday && styles.calendarDayTextToday]}>{i}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.customCalendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.calendarMonthYear}>{monthNames[month]} {year}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarWeekRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={styles.calendarWeekDayText}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendarDaysGrid}>
        {days}
      </View>
    </View>
  );
};

/* ===================== STAT ITEM ===================== */

type StatItemProps = {
  label: string;
  value: string;
  color: string;
  onPress?: () => void;
};

const StatItem: React.FC<StatItemProps> = ({ label, value, color, onPress }) => (
  <TouchableOpacity style={styles.statItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.statBar, { backgroundColor: color }]} />
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label.replace('Staff ', '')}</Text>
      {label.includes('Staff') && (
        <Text style={styles.statLabelSmall}>Staff</Text>
      )}
    </View>
  </TouchableOpacity>
);

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  // UPDATED: Modern Dark Blue/Black Theme (More attractive & Standard)
  container: { flex: 1, backgroundColor: '#0F172A' }, // Slate 900
  
  // UPDATED: Smoother overlay for depth
  backgroundLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1E293B', opacity: 0.5 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 100 },

  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  greetingText: { fontSize: 28, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  headerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginTop: 10 },

  // UPDATED: Cleaner Stats Card with subtle gradient feel
  statsCard: { 
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statsTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statsSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },

  dateButton: { 
    flexDirection: 'row', 
    gap: 6, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12,
    alignItems: 'center'
  },
  dateButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  statsGrid: { gap: 24 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flexDirection: 'row', alignItems: 'center', width: '30%' },
  statBar: { width: 4, height: 38, borderRadius: 4, marginRight: 10 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  statLabelSmall: { fontSize: 10, color: '#64748B' },

  // UPDATED: Modern Search Bar
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 18, 
    height: 54, 
    paddingHorizontal: 16, 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#334155'
  },
  searchPlaceholder: { flex: 1, color: '#94A3B8', fontSize: 16, marginLeft: 12 },

  actionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' },
  filterPillActive: { backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 30 },
  filterPillTextActive: { fontWeight: '700', color: '#0F172A' },
  addButtonSmall: { padding: 5 },

  listHeader: { marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  listSubtitle: { fontSize: 13, color: '#94A3B8' },

  // UPDATED: Employee Card Design
  employeeCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16, 
    backgroundColor: '#1E293B', 
    padding: 12, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155' // Subtle border
  },
  avatarContainer: { marginRight: 16 },
  avatarImage: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: { backgroundColor: '#475569', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },

  employeeInfo: { flex: 1 },
  employeeName: { color: '#fff', fontWeight: '600', fontSize: 16, marginBottom: 2 },
  employeeRole: { color: '#94A3B8', fontSize: 13 },

  statusContainer: { alignItems: 'flex-end' },
  statusInText: { color: '#4ADE80', fontWeight: '700', fontSize: 13 },
  timeText: { color: '#E2E8F0', fontSize: 13, marginTop: 2 },
  lateFlag: { color: '#F87171', fontWeight: '700' },
  statusNotMarked: { color: '#64748B', fontSize: 13, fontStyle: 'italic' },

  // UPDATED: FAB Color
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 25, 
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    backgroundColor: '#3B82F6', // Standard Blue
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { width: width * 0.9, backgroundColor: '#fff', borderRadius: 24, padding: 24 },
  calendarTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 10 },

  // Calendar Styles
  customCalendarContainer: { marginTop: 10 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  calendarMonthYear: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  calendarWeekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  calendarWeekDayText: { color: '#64748B', fontWeight: '600', width: 30, textAlign: 'center' },
  calendarDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  calendarDayEmpty: { width: '14.28%', aspectRatio: 1 },
  calendarDayToday: { backgroundColor: '#3B82F6' },
  calendarDayText: { color: '#334155', fontSize: 16, fontWeight: '500' },
  calendarDayTextToday: { color: '#fff', fontWeight: 'bold' },

  categoryModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  categoryModalContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '100%' },

  addStaffModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  addStaffModalContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '100%' },

  todaysAbsentModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  todaysAbsentModalContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '100%' },

  searchStaffModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  searchStaffModalContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '100%' },
});

export default StaffHomeScreen;