import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetAttendance } from '../src/employee/hook/useAttendance';
import { Attendance } from '../src/employee/type/attendance.type';
import { useEmployeeAuthStore } from '../src/store/useEmployeeAuthStore';

const { width } = Dimensions.get('window');

const AttendanceDashboardScreen: React.FC = () => {
  const { employee } = useEmployeeAuthStore();
  const employeeId = employee?.id || '';

  const { data: attendanceHistory, isLoading, error, refetch } = useGetAttendance({
    employeeId: employeeId,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const previousMonths = [
    {
      id: '1',
      month: 'December',
      year: '2025',
      animation: require('../src/assets/Fun Christmas tree.json'), 
      color: '#81C784', 
      bg: '#E8F5E9',
    },
    {
      id: '2',
      month: 'November',
      year: '2025',
      animation: require('../src/assets/fall.json'),
      color: '#FFAB91', 
      bg: '#FBE9E7',
    },
    {
      id: '3',
      month: 'October',
      year: '2025',
      animation: require('../src/assets/Halloween.json'),
      color: '#B39DDB', 
      bg: '#EDE7F6',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderBanner = ({ item }: { item: any }) => (
    <View style={styles.bannerWrapper}>
      <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
         <LottieView 
            source={item.animation} 
            autoPlay 
            loop 
            style={styles.lottieAnimation}
            resizeMode="cover"
         />
      </View>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerMonth}>
          {item.month} <Text style={styles.bannerYear}>• {item.year}</Text>
        </Text>
      </View>
    </View>
  );

  const renderAttendanceItem = (item: Attendance, index: number) => {
    const isLate = item.status === 'LATE';
    const isAbsent = item.status === 'ABSENT';
    const isLeave = item.status === 'ON_LEAVE';

    return (
      <View key={item.id || index} style={styles.rowContainer}>
        <View style={styles.dateColumn}>
          <Text style={styles.dayText}>{formatDay(item.date)}</Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.statusContainer}>
          {!isAbsent && !isLeave ? (
            <>
              <View style={styles.timeColumn}>
                <Text style={styles.labelIn}>IN</Text>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(item.checkIn)}</Text>
                  {isLate && <Text style={styles.lateTag}> L</Text>}
                </View>
              </View>

              <View style={styles.timeColumn}>
                <Text style={styles.labelOut}>OUT</Text>
                <Text style={styles.timeText}>{formatTime(item.checkOut)}</Text>
              </View>
            </>
          ) : (
            <View style={styles.absentContainer}>
                <Text style={[styles.absentText, isLeave && { color: '#FFA726' }]}>
                    {item.status}
                </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4b43f0']}
            tintColor="#4b43f0"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance Dashboard</Text>
        </View>

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
            snapToInterval={335}
            decelerationRate="fast"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your current analytics</Text>
          <Text style={styles.sectionSubtitle}>Based on your current monthly data</Text>
          
          <View style={styles.listContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#4b43f0" style={{ marginTop: 20 }} />
            ) : error ? (
              <Text style={styles.errorText}>Failed to load attendance history</Text>
            ) : attendanceHistory?.data?.length > 0 ? (
              attendanceHistory.data.map((item: Attendance, index: number) => renderAttendanceItem(item, index))
            ) : (
              <Text style={styles.emptyText}>No attendance records found</Text>
            )}
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
  bannerList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  bannerWrapper: {
    marginRight: 15,
  },
  bannerCard: {
    width: 320,
    height: 200,
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
    color: '#000',
  },
  bannerYear: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFA726',
  },
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140, 
    justifyContent: 'flex-end',
  },
  timeColumn: {
    alignItems: 'center', 
    marginLeft: 20,
    minWidth: 60,
  },
  labelIn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  labelOut: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFA726',
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
    color: '#F44336',
  },
  absentContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  absentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5252',
  },
  errorText: {
    textAlign: 'center',
    color: '#F44336',
    marginTop: 20,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9E9E9E',
    marginTop: 20,
    fontSize: 14,
  },
});