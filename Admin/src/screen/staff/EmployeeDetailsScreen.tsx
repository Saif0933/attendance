import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IMAGE_BASE_URL } from '../../../../api/api';
import SalaryScreen from '../../../../screen/SalaryScreen';
import { useGetAttendance } from '../../../../src/employee/hook/useAttendance';
import { useDeleteEmployee, useGetEmployeeById } from '../../../../src/employee/hook/useEmployee';
import { Attendance } from '../../../../src/employee/type/attendance.type';
import { showError, showSuccess } from '../../../../src/utils/meesage';


const { width } = Dimensions.get('window');

// --- Interfaces ---
interface ActionButtonProps {
  icon: string;
  label: string;
  isMaterial?: boolean;
  isIonicons?: boolean;
  onPress?: () => void;
}

interface StatCardProps {
  label: string;
  count: string;
  color: string;
}

interface DateCellProps {
  day: number | string;
  isWeekend?: boolean;
  status?: 'present' | 'absent' | 'halfday' | 'leave' | null;
  isSelected?: boolean;
  onPress?: () => void;
  isEmpty?: boolean;
}

// --- Constants ---
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_OF_WEEK_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/* ===================== MONTH HELPERS ===================== */
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/* ===================== CUSTOM CALENDAR ===================== */
const CustomCalendar = ({ onSelect, onClose }: { onSelect: (date: Date) => void, onClose: () => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();



  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(
      <TouchableOpacity
        key={i}
        style={styles.calendarDay}
        onPress={() => {
          onSelect(new Date(year, month, i));
          onClose();
        }}
      >
        <Text style={styles.calendarDayText}>{i}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.customCalendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.calendarMonthYear}>{monthNames[month]} {year}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarWeekRow}>
        {DAYS_OF_WEEK_SHORT.map((day, index) => (
          <Text key={index} style={styles.calendarWeekDayText}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendarDaysGrid}>
        {days}
      </View>
    </View>
  );
};

const EmployeeDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { employeeId } = route.params || {};

  // --- Date/Month State ---
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Attendance');

  const tabs = ['Attendance', 'Salary', 'Incentive', 'Expense', 'Loan/Adv'];

  // --- Fetch Employee Details ---
  const { data: employeeDetails, isLoading: isLoadingEmployee, isError: isErrorEmployee, refetch: refetchEmployee } = useGetEmployeeById(employeeId || '');
  
  // Adjusted data extraction to handle different API wrapper structures
  const employee = useMemo(() => {
    if (!employeeDetails) return null;
    return employeeDetails.employee || employeeDetails.data || employeeDetails;
  }, [employeeDetails]);

  // --- Fetch Attendance Data ---
  const dateRange = useMemo(() => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, [currentMonth]);

  const { data: attendanceData, isLoading: isLoadingAttendance, refetch: refetchAttendance } = useGetAttendance({
    employeeId: employeeId || '',
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const attendanceRecords = attendanceData?.data?.records || [];

  // --- Action Handlers ---
  const handleCall = () => {
    if (employee?.phoneNumber) Linking.openURL(`tel:${employee.phoneNumber}`);
  };

  const handleWhatsApp = () => {
    if (employee?.phoneNumber) {
      const phone = employee.phoneNumber.replace('+', '');
      Linking.openURL(`whatsapp://send?phone=${phone}`);
    }
  };

  const handleEmail = () => {
    if (employee?.email) Linking.openURL(`mailto:${employee.email}`);
  };

  const handleMessage = () => {
    if (employee?.phoneNumber) Linking.openURL(`sms:${employee.phoneNumber}`);
  };

  // --- Action Mutations ---
  const deleteEmployeeMutation = useDeleteEmployee();

  const handleDeleteEmployee = () => {
    Alert.alert(
      "Delete Employee",
      "Are you sure you want to delete this employee? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteEmployeeMutation.mutate(employeeId, {
              onSuccess: () => {
                showSuccess("Employee deleted successfully");
                navigation.goBack();
              },
              onError: (err) => showError(err)
            });
          }
        }
      ]
    );
  };

  // --- Attendance Mapping ---
  const attendanceMap = useMemo(() => {
    const map: Record<string, 'present' | 'absent' | 'halfday' | 'leave'> = {};
    if (!Array.isArray(attendanceRecords)) return map;
    
    attendanceRecords.forEach((record: Attendance) => {
      try {
        const day = new Date(record.date).getDate().toString();
        let status: 'present' | 'absent' | 'halfday' | 'leave' = 'present';
        
        switch (record.status) {
          case 'PRESENT':
          case 'LATE':
            status = 'present';
            break;
          case 'ABSENT':
            status = 'absent';
            break;
          case 'HALF_DAY':
            status = 'halfday';
            break;
          case 'ON_LEAVE':
            status = 'leave';
            break;
          default:
            status = 'present';
        }
        map[day] = status;
      } catch (e) {
        console.warn("Invalid record date:", record.date);
      }
    });
    return map;
  }, [attendanceRecords]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let halfDay = 0;
    let leaves = 0;

    attendanceRecords.forEach((record: Attendance) => {
      if (record.status === 'PRESENT' || record.status === 'LATE') present++;
      if (record.status === 'ABSENT') absent++;
      if (record.status === 'HALF_DAY') halfDay++;
      if (record.status === 'ON_LEAVE') leaves++;
    });

    return { present, absent, halfDay, leaves };
  }, [attendanceRecords]);

  // --- Dynamic Calendar Generation ---
  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get total days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Get starting day of week (0 = Sun, 1 = Mon...)
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<DateCell key={`empty-${i}`} day="" isEmpty />);
    }

    // Actual Days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${i}`;
      const status = attendanceMap[dateKey];
      
      const currentDayOfWeek = new Date(year, month, i).getDay();
      const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;

      days.push(
        <DateCell 
          key={i} 
          day={i} 
          isWeekend={isWeekend} 
          status={status || null}
          isSelected={selectedDate === i}
          onPress={() => setSelectedDate(i)}
        />
      );
    }
    return days;
  };

  if (isLoadingEmployee) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: '#94A3B8', marginTop: 10 }}>Loading employee details...</Text>
      </View>
    );
  }

  if (isErrorEmployee || !employee) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#EF4444' }}>Failed to load employee details</Text>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.goBack()}>
          <Text style={styles.tabText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* --- TOP SECTION --- */}
      <View style={styles.topSection}>
        
        {/* Header Nav Icons */}
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => refetchAttendance()}
            >
              <Ionicons name="refresh-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="create-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleDeleteEmployee}>
              <Ionicons name="trash-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            {employee?.profilePicture?.url ? (
              <Image 
                source={{ 
                  uri: employee.profilePicture.url.startsWith('http') 
                    ? employee.profilePicture.url 
                    : `${IMAGE_BASE_URL}${employee.profilePicture.url}` 
                }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFF' }}>
                  {(employee?.firstname || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{employee?.payrollConfiguration === 'DAY_WISE' ? 'Daily' : 'Monthly'}</Text>
            </View>
          </View>
          <View style={styles.infoWrapper}>
            <Text style={styles.name}>{employee?.firstname} {employee?.lastname}</Text>
            <Text style={styles.phone}>{employee?.phoneNumber || 'No phone'}</Text>
            <Text style={styles.role}>{employee?.designation || 'Staff'}</Text>
          </View>
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.actionGrid}>
          <ActionButton icon="call-outline" label="Call" isIonicons onPress={handleCall} />
          <ActionButton icon="chatbubble-ellipses-outline" label="Msg" isIonicons onPress={handleMessage} />
          <ActionButton icon="mail-outline" label="Email" isIonicons onPress={handleEmail} />
          <ActionButton icon="logo-whatsapp" label="WhatsApp" isIonicons onPress={handleWhatsApp} />
        </View>

        {/* Tab Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={styles.tabButton}
            >
              <Text style={[
                styles.tabText, 
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeTabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- BOTTOM SECTION --- */}
      <View style={styles.bottomSection}>
        
        {/* Attendance Header Strip */}
        {activeTab === 'Attendance' && (
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Attendance For</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setCalendarVisible(true)}>
              <Feather name="calendar" size={16} color="#555" />
              <Text style={styles.dateText}>
                 {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Stats Cards */}
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsScrollContent}
            >
              <StatCard label="Present" count={`${stats.present} days`} color="#689F38" />
              <StatCard label="Absent" count={`${stats.absent} times`} color="#E65100" />
              <StatCard label="Half Day" count={`${stats.halfDay} times`} color="#0288D1" />
              <StatCard label="Casual Leave" count={`${stats.leaves} times`} color="#FBC02D" />
              <StatCard label="Holiday" count="0 times" color="#0097A7" />
            </ScrollView>
          </View>

          {/* Calendar Grid */}
          {activeTab === 'Attendance' && (
            <View style={styles.calendarContainer}>
              <View style={styles.weekRow}>
                {DAYS_OF_WEEK.map((day, index) => (
                  <Text key={index} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>

              <ScrollView 
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={false}
                style={styles.calendarScroll}
              >
                <View style={styles.datesGrid}>
                  {renderCalendarDays()}
                </View>
              </ScrollView>
            </View>
          )}

          {activeTab === 'Salary' && (
            <View style={{ padding: 20 }}>
              <SalaryScreen employeeId={employeeId} hideHeader />
            </View>
          )}

          <View style={{height: 100}} /> 
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="download" size={16} color="#333" />
            <Text style={styles.footerBtnText}>Monthly Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="download" size={16} color="#333" />
            <Text style={styles.footerBtnText}>Odometer Report</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Calendar Modal */}
      <Modal transparent visible={calendarVisible} animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setCalendarVisible(false)}
        >
          <View style={styles.calendarModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomCalendar 
                onSelect={(date) => setCurrentMonth(date)} 
                onClose={() => setCalendarVisible(false)} 
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// --- Helper Components ---

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, isMaterial, isIonicons, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={styles.actionIconCircle}>
      {isIonicons ? (
        <Ionicons name={icon} size={20} color="#FFF" />
      ) : isMaterial ? (
        <MaterialCommunityIcons name={icon} size={20} color="#FFF" />
      ) : (
        <Feather name={icon} size={20} color="#FFF" />
      )}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const StatCard: React.FC<StatCardProps> = ({ label, count, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statAccent, { backgroundColor: color }]} />
    <View style={styles.statContent}>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
      <Text style={styles.statCount}>{count}</Text>
    </View>
  </View>
);

const DateCell: React.FC<DateCellProps> = ({ day, isWeekend, status, isSelected, onPress, isEmpty }) => {
  if (isEmpty) {
    return <View style={styles.dateCell} />;
  }

  let bgColor = 'transparent';
  let textColor = '#FFF';

  if (isSelected) {
    bgColor = '#3B82F6';
    textColor = '#FFF'; 
  } else if (status === 'present') {
    bgColor = '#10B981';
  } else if (status === 'absent') {
    bgColor = '#EF4444';
  } else if (status === 'halfday') {
    bgColor = '#F59E0B';
  } else if (status === 'leave') {
    bgColor = '#8B5CF6';
  }

  if (isWeekend && !isSelected && !status) textColor = '#94A3B8';

  return (
    <TouchableOpacity 
      style={[styles.dateCell, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.dateTextNum, { color: textColor }]}>{day}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topSection: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 4, 
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarWrapper: {
    marginRight: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#3B82F6', 
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoWrapper: {
    justifyContent: 'center',
  },
  name: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  phone: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 2,
  },
  role: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconCircle: {
    marginBottom: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  tabsContent: {
    alignItems: 'center',
    paddingLeft: 4,
  },
  tabButton: {
    marginRight: 25,
    paddingBottom: 8,
    alignItems: 'center',
  },
  tabText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    marginTop: -10,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.05)', 
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  attendanceTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
  },
  dateText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    gap: 12, 
    paddingBottom: 10,
  },
  statCard: {
    width: width / 3.6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statAccent: {
    width: 3,
    height: '100%',
  },
  statContent: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 9,
    marginBottom: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statCount: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  weekDayText: {
    color: '#64748B',
    width: (width - 40 - (5 * 6)) / 7,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
  },
  datesGrid: {
    width: width - 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 5,
  },
  calendarScroll: {
    marginTop: 5,
  },
  dateCell: {
    width: (width - 40 - (5 * 6)) / 7,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  dateTextNum: {
    fontSize: 15,
    fontWeight: '700',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  footerBtnText: {
    marginLeft: 10,
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    width: width * 0.9,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  customCalendarContainer: {
    backgroundColor: '#1E293B',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  calendarWeekDayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    width: 35,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  calendarDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  calendarDayEmpty: {
    width: '14.28%',
    aspectRatio: 1,
  },
  calendarDayText: {
    fontSize: 15,
    color: '#E2E8F0',
    fontWeight: '600',
  },
});

export default EmployeeDetailsScreen;