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


interface TodaysAbsentScreenProps {
  onClose?: () => void;
  initialTab?: TabType;
}

type TabType = 'Absent' | 'Present' | 'Heads';

const TodaysAbsentScreen: React.FC<TodaysAbsentScreenProps> = ({ onClose, initialTab = 'Absent' }) => {
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
    limit: 50 // Fetch more at once for the status list
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
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>
              {(item.firstname || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Name & Role */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{item.firstname} {item.lastname}</Text>
        <Text style={[styles.roleText, { color: '#94A3B8' }]}>
          {item.designation || 'Staff'}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          {
            backgroundColor: item.attendances.length > 0 && ['PRESENT', 'LATE', 'HALF_DAY'].includes(item.attendances[0].status)
              ? '#065F46'
              : '#1E293B'
          }
        ]}>
          <Text style={[
            styles.statusText,
            {
              color: item.attendances.length > 0 && ['PRESENT', 'LATE', 'HALF_DAY'].includes(item.attendances[0].status)
                ? '#34D399'
                : '#94A3B8'
            }
          ]}>
            {item.attendances.length > 0 ? item.attendances[0].status : 'Not marked'}
          </Text>
        </View>
      </View>
    </View>
  );

  const tabs: TabType[] = ['Absent', 'Present', 'Heads'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Attendance</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={refetch}
          refreshing={isLoading}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 20 }} />
            ) : <View style={{ height: 40 }} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No staff found in this category.</Text>
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
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0F172A',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    // backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
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
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: '#1E293B',
    marginLeft: 65,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});

export default TodaysAbsentScreen;