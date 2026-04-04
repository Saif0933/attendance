
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { IMAGE_BASE_URL } from '../api/api';
import { useGetAttendance } from '../src/employee/hook/useAttendance';
import { useGetEmployeeById } from '../src/employee/hook/useEmployee';
import { useEmployeeAuthStore } from '../src/store/useEmployeeAuthStore';
import { useTheme } from '../src/theme/ThemeContext';

const { height, width } = Dimensions.get('window');

interface SalaryScreenProps {
  employeeId?: string;
  hideHeader?: boolean;
}

const SalaryScreen: React.FC<SalaryScreenProps> = ({ employeeId: propEmployeeId, hideHeader }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  
  // Use the employee data directly from the store if available
  const { employee: storeEmployee } = useEmployeeAuthStore();
  const employeeId = propEmployeeId || storeEmployee?.id || null;

  // State for Date Picker Modal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Fetch Employee Details
  const { data: employeeDetails, isLoading: isLoadingEmployee, refetch: refetchEmployee } = useGetEmployeeById(employeeId || '');

  // Calculate date range for selected month
  const dateRange = useMemo(() => {
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of month
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, [selectedYear, selectedMonth]);

  // Fetch Attendance for selected month
  const { data: attendanceData, isLoading: isLoadingAttendance, refetch: refetchAttendance } = useGetAttendance({
    employeeId: employeeId || '',
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchEmployee(), refetchAttendance()]);
    setRefreshing(false);
  };

  // Generate dates from Joining Date to Current Date
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const currentDate = new Date();
      // Try to get joining date from employee data
      const emp = employeeDetails?.data?.employee || employeeDetails?.data || employeeDetails?.employee || employeeDetails;
      const joiningDateStr = emp?.dateOfJoining || emp?.createdAt || '2024-01-01';
      const joiningDate = new Date(joiningDateStr);
      
      let tempDate = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);
      
      while (tempDate <= currentDate) {
        const monthStr = tempDate.toLocaleString('default', { month: 'long' });
        const yearStr = tempDate.getFullYear();
        dates.push(`${monthStr} ${yearStr}`);
        tempDate.setMonth(tempDate.getMonth() + 1);
      }
      setAvailableDates(dates.reverse());
    };
    if (employeeDetails) {
      generateDates();
    }
  }, [employeeDetails]);

  const handleSelectDate = (date: string) => {
    const [monthName, year] = date.split(' ');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    setSelectedMonth(months.indexOf(monthName));
    setSelectedYear(parseInt(year, 10));
    setShowDatePicker(false);
  };

  // Extract employee info
  const emp = employeeDetails?.data?.employee || employeeDetails?.data || employeeDetails?.employee;
  const fullName = emp ? `${emp.firstname || ''} ${emp.lastname || ''}`.trim() || 'Employee' : 'Loading...';
  const designation = emp?.designation || 'N/A';
  const empIdDisplay = emp?.employeeCode?.toString() || emp?.id?.slice(0, 8).toUpperCase() || 'N/A';
  const salary = emp?.salary || 0;
  const salaryType = emp?.payrollConfiguration === 'DAY_WISE' ? 'Day-wise' : (emp?.salaryType || 'Monthly');

  // Profile Image URL
  const getProfileImageUrl = () => {
    if (!emp) return null;
    const pp = emp.profilePicture || emp.avatar || emp.image;
    if (!pp) return null;
    let finalUrl = typeof pp === 'string' ? pp : pp.url || pp.secure_url || pp.uri || pp.path;
    if (!finalUrl) return null;
    if (finalUrl.startsWith('http')) return finalUrl;
    const normalizedPath = finalUrl.replace(/\\/g, '/');
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const path = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${baseUrl}${path}`;
  };
  const profileImageUrl = getProfileImageUrl();

  // Calculate salary details
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const dailyRate = salaryType === 'Day-wise' ? salary : (salary / daysInMonth);

  // Attendance summary calculations
  const attendanceRecords = attendanceData?.data?.records || attendanceData?.records || [];
  const attendanceSummary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let halfDay = 0;
    let late = 0;
    let onLeave = 0;

    attendanceRecords.forEach((record: any) => {
      switch (record.status) {
        case 'PRESENT':
          present++;
          break;
        case 'ABSENT':
          absent++;
          break;
        case 'HALF_DAY':
          halfDay++;
          break;
        case 'LATE':
          late++;
          present++; // Late still counts as present
          break;
        case 'ON_LEAVE':
          onLeave++;
          break;
      }
    });

    const payableDays = present + (halfDay * 0.5);
    const totalWorkingDays = attendanceRecords.length;
    const absentDays = absent;
    
    return {
      totalDays: totalWorkingDays || daysInMonth,
      payableDays,
      absentDays,
      halfDays: halfDay,
      lateDays: late,
      leaveDays: onLeave,
    };
  }, [attendanceRecords, daysInMonth]);

  // Salary calculations
  const regularEarnings = dailyRate * attendanceSummary.payableDays;
  const absentDeduction = dailyRate * attendanceSummary.absentDays;
  const netPayable = regularEarnings;
  const salaryPaid = 0; // This would come from a payments API
  const remainingBalance = netPayable - salaryPaid;

  const selectedDateDisplay = `${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} ${selectedYear}`;

  if (isLoadingEmployee) {
    const loadingContent = (
      <View style={[styles.container, hideHeader && { backgroundColor: 'transparent', height: 200 }, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4b43f0" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading salary details...</Text>
      </View>
    );
    if (hideHeader) return loadingContent;
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        {loadingContent}
      </SafeAreaView>
    );
  }

  const content = (
      <View style={[styles.container, hideHeader && { backgroundColor: 'transparent' }, { backgroundColor: colors.background }]}>
      
      {/* --- HEADER --- */}
      {!hideHeader && (
        <View style={[styles.navHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.text }]}>Salary Details</Text>
          <TouchableOpacity>
              <Icon name="eye-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, hideHeader && { padding: 0 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!hideHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2089dc']} />
        }
      >
        
        {/* --- PROFILE CARD --- */}
        {!hideHeader && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.profileRow}>
                  {profileImageUrl ? (
                    <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.profileImage, { backgroundColor: isDark ? colors.background : '#E1E1E1', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textSecondary }}>
                        {emp?.firstname ? emp.firstname.charAt(0).toUpperCase() : 'U'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.profileInfo}>
                      <Text style={[styles.profileName, { color: colors.text }]}>{fullName}</Text>
                      <Text style={styles.profileRole}>{designation}</Text>
                      <Text style={[styles.profileId, { color: colors.textSecondary }]}>EMP-ID: {empIdDisplay}</Text>
                  </View>
              </View>
          </View>
        )}

        {/* --- PAYROLL PERIOD SELECTOR --- */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Payroll Period</Text>
        <TouchableOpacity 
          style={[styles.dateSelector, { backgroundColor: colors.surface, borderColor: colors.border }]} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateSelectorText, { color: colors.text }]}>{selectedDateDisplay}</Text>
          <Icon name="chevron-down" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* --- EARNINGS CARD --- */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <Icon name="cash-outline" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Earnings & CTC</Text>
            </View>
            
            <View style={styles.row}>
                <Text style={styles.labelBlue}>Monthly CTC</Text>
                <Text style={[styles.value, { color: colors.text }]}>₹{salary.toLocaleString()}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
                <Text style={styles.labelBlue}>Daily Rate</Text>
                <Text style={[styles.value, { color: colors.text }]}>₹{dailyRate.toFixed(2)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
                <Text style={styles.labelBlue}>Regular Earnings</Text>
                <Text style={[styles.value, { color: colors.text }]}>₹{regularEarnings.toFixed(2)}</Text>
            </View>
        </View>

        {/* --- ATTENDANCE SUMMARY CARD --- */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <Icon name="calendar-outline" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Attendance Summary</Text>
                {isLoadingAttendance && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 10 }} />}
            </View>

            <View style={styles.attendanceContainer}>
                {/* Total Box */}
                <View style={[styles.attendBox, { backgroundColor: isDark ? colors.background : '#F5F5F5' }]}>
                    <Text style={styles.boxLabel}>TOTAL</Text>
                    <Text style={[styles.boxValue, { color: colors.text }]}>{attendanceSummary.totalDays}</Text>
                </View>

                {/* Payable Box */}
                <View style={[styles.attendBox, styles.boxPayable]}>
                    <Text style={[styles.boxLabel, {color: '#2089dc'}]}>PAYABLE</Text>
                    <Text style={[styles.boxValue, {color: '#2089dc'}]}>{attendanceSummary.payableDays}</Text>
                </View>

                {/* Absent Box */}
                <View style={[styles.attendBox, styles.boxAbsent]}>
                    <Text style={[styles.boxLabel, {color: '#d32f2f'}]}>ABSENT</Text>
                    <Text style={[styles.boxValue, {color: '#d32f2f'}]}>{attendanceSummary.absentDays}</Text>
                </View>
            </View>
        </View>

        {/* --- DEDUCTIONS CARD --- */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <Icon name="cut-outline" size={20} color="#EF4444" style={{transform: [{rotate: '90deg'}]}} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Deductions</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.labelBlue}>Absent Day Deductions</Text>
                <Text style={[styles.value, {color: '#d32f2f'}]}>-₹{absentDeduction.toFixed(2)}</Text>
            </View>
        </View>

        {/* --- GENERATE BUTTON --- */}
        <TouchableOpacity style={styles.generateBtn} onPress={() => navigation.navigate('PayslipScreen' as never)}>
            <Icon name="download-outline" size={20} color="#fff" />
            <Text style={styles.generateBtnText}>Generate Payslip</Text>
        </TouchableOpacity>

        {/* --- FOOTER INFO --- */}
        <View style={[styles.footerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
             {/* Note: Blurred effect simulation or just grey text */}
             <View style={styles.row}>
                <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Salary Paid</Text>
                <Text style={[styles.footerValueFaded, { color: colors.textSecondary, opacity: 0.5 }]}>₹{salaryPaid.toFixed(2)}</Text>
             </View>
             
             <View style={[styles.divider, { marginVertical: 10, backgroundColor: colors.border }]} />
             
             <View style={styles.row}>
                <Text style={styles.labelBlue}>Payment Mode</Text>
                <Text style={[styles.value, { color: colors.text }]}>{emp?.bankName ? `Transfer to ${emp.bankName}` : 'Bank Transfer'}</Text>
             </View>

             <View style={[styles.row, { marginTop: 15, alignItems: 'center' }]}>
                <Text style={[styles.bigTotalLabel, { color: colors.text }]}>Remaining Balance</Text>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={[styles.bigTotalValue, { color: colors.primary }]}>₹{remainingBalance.toFixed(2)}</Text>
                    {remainingBalance <= 0 && (
                      <View style={[styles.settledBadge, { backgroundColor: isDark ? colors.background : '#E8F5E9' }]}>
                          <Text style={[styles.settledText, { color: '#10B981' }]}>SETTLED</Text>
                      </View>
                    )}
                    {remainingBalance > 0 && (
                      <View style={[styles.settledBadge, { backgroundColor: isDark ? colors.background : '#FFF3E0' }]}>
                          <Text style={[styles.settledText, { color: '#F57C00' }]}>PENDING</Text>
                      </View>
                    )}
                </View>
             </View>
        </View>

      </ScrollView>

      {/* --- DATE PICKER MODAL (Logic Kept Same) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Salary Month</Text>
              <View style={styles.modalListContainer}>
                <FlatList
                  data={availableDates}
                  keyExtractor={(item) => item}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.modalItem, 
                        item === selectedDateDisplay && [styles.modalItemSelected, { backgroundColor: colors.background }],
                        { borderBottomColor: colors.border }
                      ]}
                      onPress={() => handleSelectDate(item)}
                    >
                      <Text style={[
                        styles.modalItemText,
                        { color: colors.text },
                        item === selectedDateDisplay && [styles.modalItemTextSelected, { color: colors.primary }]
                      ]}>{item}</Text>
                      {item === selectedDateDisplay && (
                        <Icon name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      </View>
  );

  if (hideHeader) return content;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        {content}
    </SafeAreaView>
  );
};

export default SalaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // Light greyish white background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  
  /* HEADER */
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  /* PROFILE CARD */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileRole: {
    fontSize: 12,
    color: '#2089dc', // Blueish tint for role
    marginTop: 2,
    fontWeight: '500',
  },
  profileId: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  /* PERIOD SELECTOR */
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  dateSelectorText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  /* COMMON CARD STYLES */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelBlue: {
    fontSize: 14,
    color: '#546E7A', // Blueish Grey
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },

  /* ATTENDANCE SECTION */
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  attendBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxPayable: {
    backgroundColor: '#E3F2FD', // Light Blue
  },
  boxAbsent: {
    backgroundColor: '#FFEBEE', // Light Red
  },
  boxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  boxValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  /* BUTTON */
  generateBtn: {
    backgroundColor: '#4b43f0', // Solid Blue
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  /* FOOTER */
  footerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  footerLabel: {
    fontSize: 14,
    color: '#ccc', // Faded
    fontWeight: '500',
  },
  footerValueFaded: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#eee', // Faded
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  bigTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  bigTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2089dc',
  },
  settledBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  settledText: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: 'bold',
  },

  /* MODAL STYLES (Keep Existing mostly) */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    maxHeight: height * 0.6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalListContainer: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#f5f9ff',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#2a568f',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '500',
  },
});