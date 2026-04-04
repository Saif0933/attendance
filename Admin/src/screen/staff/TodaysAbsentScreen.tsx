import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IMAGE_BASE_URL } from '../../../../api/api';
import { useGetAllEmployeesWithInfiniteQuery } from '../../../../src/employee/hook/useEmployee';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useTheme } from '../../../../src/theme/ThemeContext';


interface TodaysAbsentScreenProps {
  onClose?: () => void;
  initialTab?: TabType;
}

type TabType = 'Absent' | 'Present' | 'Heads';

const TodaysAbsentScreen: React.FC<TodaysAbsentScreenProps> = ({ onClose, initialTab = 'Absent' }) => {
  const { colors, isDark } = useTheme();
  const { company } = useAuthStore();
  const companyId = company?.id;
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Fetch employees data
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useGetAllEmployeesWithInfiniteQuery({
    limit: 50, // Fetch more at once for the status list
    companyId: companyId
  });

  const allEmployees = useMemo(() => {
    return data?.pages?.flatMap(page => page.data.employees) || [];
  }, [data]);

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case 'Absent':
        return allEmployees.filter(emp => emp.attendances.length === 0 || emp.attendances[0]?.status === 'ABSENT');
      case 'Present':
        return allEmployees.filter(emp => emp.attendances.length > 0 && (emp.attendances[0]?.status === 'PRESENT' || emp.attendances[0]?.status === 'LATE' || emp.attendances[0]?.status === 'HALF_DAY'));
      case 'Heads':
        return allEmployees;
      default:
        return allEmployees;
    }
  }, [allEmployees, activeTab]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.profilePicture?.url ? (
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${item.profilePicture.url}` }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? colors.surface : '#E2E8F0' }]}>
            <Text style={[styles.avatarInitials, { color: colors.text }]}>
              {(item.firstname || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Name & Role */}
      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, { color: colors.text }]}>
          {item.firstname || ''} {item.lastname || ''}
        </Text>
        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
          {item.designation || 'Staff'}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          {
            backgroundColor: item.attendances && item.attendances.length > 0 && ['PRESENT', 'LATE', 'HALF_DAY'].includes(item.attendances[0].status)
              ? (isDark ? '#065F46' : '#D1FAE5')
              : (isDark ? '#1E293B' : '#F1F5F9')
          }
        ]}>
          <Text style={[
            styles.statusText,
            {
              color: item.attendances && item.attendances.length > 0 && ['PRESENT', 'LATE', 'HALF_DAY'].includes(item.attendances[0].status)
                ? (isDark ? '#34D399' : '#059669')
                : colors.textSecondary
            }
          ]}>
            {item.attendances && item.attendances.length > 0 ? item.attendances[0].status : 'Not marked'}
          </Text>
        </View>
      </View>
    </View>
  );

  const tabs: TabType[] = ['Absent', 'Present', 'Heads'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Attendance</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === tab && [styles.activeTabText, { color: colors.primary }]]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
          onRefresh={refetch}
          refreshing={isLoading}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
            ) : <View style={{ height: 40 }} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.centerContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No staff found in this category.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    borderRadius: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  separator: {
    height: 1,
    marginLeft: 65,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 14,
  },
});

export default TodaysAbsentScreen;