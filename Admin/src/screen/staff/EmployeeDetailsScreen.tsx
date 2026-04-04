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
import { useTheme } from '../../../../src/theme/ThemeContext';
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
  const { colors, isDark } = useTheme();
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
        <Text style={[styles.calendarDayText, { color: colors.text }]}>{i}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.customCalendarContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.calendarMonthYear, { color: colors.text }]}>{monthNames[month]} {year}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarWeekRow}>
        {DAYS_OF_WEEK_SHORT.map((day, index) => (
          <Text key={index} style={[styles.calendarWeekDayText, { color: colors.textSecondary }]}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendarDaysGrid}>
        {days}
      </View>
    </View>
  );
};

const EmployeeDetailsScreen = () => {
  const { colors, isDark } = useTheme();
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

  // Handle multiple possible API response shapes
  const attendanceRecords = attendanceData?.data?.records 
    || attendanceData?.records 
    || attendanceData?.data 
    || [];

  // --- Action Handlers ---
  const handleCall = () => {
    if (employee?.phoneNumber) Linking.openURL(`tel:${employee.phoneNumber}`);
  };

  const handleWhatsApp = () => {
    if (employee?.phoneNumber) {
      const phone = employee.phoneNumber.replace(/[^0-9]/g, '');
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
        // Directly take the date portion from ISO string to avoid timezone shifting
        // e.g. "2026-02-21T18:30:00.000Z" → "2026-02-21"
        const dateKey = record.date.includes('T')
          ? record.date.split('T')[0]        // ISO format: "2026-02-21T..."
          : record.date.split(' ')[0];        // Space format: "2026-02-21 ..."

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
        map[dateKey] = status;
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

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonthCnt = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeekCnt = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeekCnt; i++) {
      days.push(<DateCell key={`empty-${i}`} day="" isEmpty />);
    }
    for (let i = 1; i <= daysInMonthCnt; i++) {
      // Use full YYYY-MM-DD key to match attendanceMap
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
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
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading employee details...</Text>
      </View>
    );
  }

  if (isErrorEmployee || !employee) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#EF4444' }}>Failed to load employee details</Text>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.tabText, { color: colors.primary }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* --- TOP SECTION --- */}
      <View style={[styles.topSection, { backgroundColor: colors.background }]}>
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButtonCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitleText, { color: colors.text }]}>Employee Details</Text>
          <TouchableOpacity onPress={handleDeleteEmployee} style={[styles.backButtonCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={[styles.profileContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.avatarWrapper}>
            {employee?.profilePicture?.url ? (
              <Image 
                source={{ 
                  uri: employee.profilePicture.url.startsWith('http') 
                    ? employee.profilePicture.url 
                    : `${IMAGE_BASE_URL}${employee.profilePicture.url}` 
                }} 
                style={[styles.avatar, { borderColor: colors.primary }]} 
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: isDark ? colors.background : '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderColor: colors.primary }]}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.primary }}>
                  {(employee?.firstname || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={[styles.statusDotIndicator, { borderColor: colors.surface }]} />
          </View>
          <View style={styles.infoWrapper}>
            <Text style={[styles.nameText, { color: colors.text }]}>{employee?.firstname} {employee?.lastname}</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.designationText, { color: colors.primary }]}>{employee?.designation || 'Staff'}</Text>
              <View style={[styles.dotSeparator, { backgroundColor: colors.border }]} />
              <Text style={[styles.payrollBadge, { color: colors.textSecondary }]}>{employee?.payrollConfiguration === 'DAY_WISE' ? 'Daily' : 'Monthly'}</Text>
            </View>
            <Text style={[styles.phoneText, { color: colors.textSecondary }]}>{employee?.phoneNumber || 'No phone'}</Text>
          </View>
        </View>

        <View style={[styles.actionGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ActionButton icon="call-outline" label="Call" isIonicons onPress={handleCall} />
          <ActionButton icon="chatbubble-ellipses-outline" label="Msg" isIonicons onPress={handleMessage} />
          <ActionButton icon="mail-outline" label="Email" isIonicons onPress={handleEmail} />
          <ActionButton icon="logo-whatsapp" label="WhatsApp" isIonicons onPress={handleWhatsApp} />
        </View>

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
                { color: colors.textSecondary },
                activeTab === tab && [styles.activeTabText, { color: colors.primary }]
              ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={[styles.activeTabUnderline, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- BOTTOM SECTION --- */}
      <View style={[styles.bottomSection, { backgroundColor: isDark ? colors.background : '#F8FAFC' }]}>
        {activeTab === 'Attendance' && (
          <View style={styles.attendanceHeader}>
            <Text style={[styles.attendanceTitle, { color: colors.text }]}>Attendance For</Text>
            <TouchableOpacity style={[styles.datePicker, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setCalendarVisible(true)}>
              <Feather name="calendar" size={16} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.text }]}>
                 {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {activeTab === 'Attendance' && (
            <>
              <View style={styles.statsContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.statsScrollContent}
                >
                  <StatCard label="Present" count={`${stats.present} days`} color="#10B981" />
                  <StatCard label="Absent" count={`${stats.absent} times`} color="#EF4444" />
                  <StatCard label="Half Day" count={`${stats.halfDay} times`} color="#F59E0B" />
                  <StatCard label="Casual Leave" count={`${stats.leaves} times`} color="#8B5CF6" />
                  <StatCard label="Holiday" count="0 times" color="#0EA5E9" />
                </ScrollView>
              </View>

              <View style={[styles.calendarContainer, { backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 24, padding: 16, marginTop: 10, borderWidth: 1, borderColor: colors.border }]}>
                <View style={styles.weekRow}>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <Text key={index} style={[styles.weekDayText, { color: colors.textSecondary }]}>{day}</Text>
                  ))}
                </View>
                <View style={styles.datesGrid}>
                  {renderCalendarDays()}
                </View>
              </View>
            </>
          )}

          {activeTab === 'Salary' && (
            <View style={{ padding: 16 }}>
              <SalaryScreen employeeId={employeeId} hideHeader />
            </View>
          )}

          {['Incentive', 'Expense', 'Loan/Adv'].includes(activeTab) && (
             <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialCommunityIcons name="timer-sand" size={60} color={colors.border} />
                <Text style={{ color: colors.textSecondary, marginTop: 16, fontSize: 16, fontWeight: '600' }}>Coming Soon</Text>
             </View>
          )}
        </ScrollView>

        <View style={[styles.footerContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.footerButton, { backgroundColor: isDark ? colors.background : '#F1F5F9', borderColor: colors.border }]}>
            <Feather name="download" size={16} color={colors.text} />
            <Text style={[styles.footerBtnText, { color: colors.text }]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerButton, { backgroundColor: isDark ? colors.background : '#F1F5F9', borderColor: colors.border }]}>
            <Feather name="download" size={16} color={colors.text} />
            <Text style={[styles.footerBtnText, { color: colors.text }]}>Odometer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={calendarVisible} animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setCalendarVisible(false)}
        >
          <View style={[styles.calendarModalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Month</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <CustomCalendar 
              onSelect={(date) => setCurrentMonth(date)} 
              onClose={() => setCalendarVisible(false)} 
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// --- Helper Components ---

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, isMaterial, isIonicons, onPress }) => {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <View style={[styles.actionIconCircle, { backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border }]}>
        {isIonicons ? (
          <Ionicons name={icon} size={18} color={isDark ? colors.text : colors.primary} />
        ) : isMaterial ? (
          <MaterialCommunityIcons name={icon} size={18} color={isDark ? colors.text : colors.primary} />
        ) : (
          <Feather name={icon} size={18} color={isDark ? colors.text : colors.primary} />
        )}
      </View>
      <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const StatCard: React.FC<StatCardProps> = ({ label, count, color }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.statAccent, { backgroundColor: color }]} />
      <View style={styles.statContent}>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
        <Text style={[styles.statCount, { color: colors.text }]}>{count}</Text>
      </View>
    </View>
  );
};

const DateCell: React.FC<DateCellProps> = ({ day, isWeekend, status, isSelected, onPress, isEmpty }) => {
  const { colors, isDark } = useTheme();
  
  if (isEmpty) {
    return <View style={styles.dateCell} />;
  }

  let bgColor = isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC';
  let textColor = isWeekend ? colors.textSecondary : colors.text;
  let borderColor = 'transparent';

  if (isSelected && !status) {
    bgColor = colors.primary;
    textColor = '#FFF';
    borderColor = colors.primary;
  } else if (status === 'present') {
    bgColor = '#10B981';
    textColor = '#FFFFFF';
    borderColor = '#059669';
  } else if (status === 'absent') {
    bgColor = '#EF4444';
    textColor = '#FFFFFF';
    borderColor = '#DC2626';
  } else if (status === 'halfday') {
    bgColor = '#F59E0B';
    textColor = '#FFFFFF';
    borderColor = '#D97706';
  } else if (status === 'leave') {
    bgColor = '#8B5CF6';
    textColor = '#FFFFFF';
    borderColor = '#7C3AED';
  }

  return (
    <TouchableOpacity 
      style={[styles.dateCell, { backgroundColor: bgColor, borderColor: borderColor, borderWidth: status ? 0 : 1 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.dateTextNum, { color: textColor }]}>{day}</Text>
      {isSelected && status && (
        <View style={[styles.selectedIndicator, { backgroundColor: '#FFF' }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  avatarWrapper: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 2,
  },
  statusDotIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
  },
  infoWrapper: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  designationText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  payrollBadge: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconCircle: {
    marginBottom: 6,
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tabsContent: {
    alignItems: 'center',
    paddingLeft: 4,
  },
  tabButton: {
    marginRight: 28,
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activeTabText: {
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  bottomSection: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  attendanceTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
  },
  statsContainer: {
    marginTop: 10,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 12, 
    paddingBottom: 10,
  },
  statCard: {
    width: width / 3.4,
    borderRadius: 20,
    minHeight: 65,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statAccent: {
    width: 4,
    height: '100%',
  },
  statContent: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    marginBottom: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statCount: {
    fontSize: 14,
    fontWeight: '800',
  },
  calendarContainer: {
    paddingHorizontal: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDayText: {
    width: (width - 72 - 24) / 7,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dateCell: {
    width: (width - 72 - 24) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 4,
    borderWidth: 1.5,
  },
  dateTextNum: {
    fontSize: 15,
    fontWeight: '800',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  footerBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  calendarModalContent: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  customCalendarContainer: {
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
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  calendarWeekDayText: {
    fontSize: 12,
    fontWeight: '800',
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
    fontWeight: '700',
  },
});

export default EmployeeDetailsScreen;