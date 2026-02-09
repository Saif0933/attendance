
// export default AllRequestsScreen;

import {
  Calendar,
  ClipboardList,
  FileText,
  Pencil,
  RefreshCw,
  Search,
  Tag,
  X
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useGetLeaves, useUpdateLeaveStatus } from '../../../api/hook/leaves/hook/useLeave';
import { Leave, LeaveStatus } from '../../../api/hook/leaves/type';

const AllRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'PENDING' | 'APPROVED' | 'REJECTED'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  const { data: leavesResponse, isLoading, isError, refetch } = useGetLeaves({
    status: activeTab === 'All' ? undefined : activeTab,
  });

  const updateStatusMutation = useUpdateLeaveStatus();

  const leaves: Leave[] = leavesResponse?.data || [];

  const filteredLeaves = useMemo(() => {
    if (!searchQuery) return leaves;
    const lowerQuery = searchQuery.toLowerCase();
    return leaves.filter((leave) => {
      const fullName = `${leave.employee?.firstname || ''} ${leave.employee?.lastname || ''}`.toLowerCase();
      const reason = (leave.reason || '').toLowerCase();
      const type = leave.type.toLowerCase();
      return fullName.includes(lowerQuery) || reason.includes(lowerQuery) || type.includes(lowerQuery);
    });
  }, [leaves, searchQuery]);

  const stats = useMemo(() => {
    // If we have "All" leaves, we can calculate stats from there. 
    // But since useGetLeaves is filtered by tab, we might need a separate query for stats or just use the current tab data if it's "All"
    // Usually, it's better to fetch All once or have a stats endpoint.
    // For now, if activeTab is All, we use that. If not, stats might be incomplete.
    // Let's assume we want stats for ALL leaves regardless of tab.
    // To do this properly, we'd need useGetLeaves({}) called somewhere.
    return {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'PENDING').length,
      approved: leaves.filter(l => l.status === 'APPROVED').length,
      rejected: leaves.filter(l => l.status === 'REJECTED').length,
    };
  }, [leaves]);

  const handleUpdateStatus = (id: string, status: LeaveStatus) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${status.toLowerCase()} this leave request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            updateStatusMutation.mutate({ id, payload: { status } }, {
              onSuccess: () => {
                Alert.alert('Success', `Leave request ${status.toLowerCase()} successfully.`);
              },
              onError: (error: any) => {
                Alert.alert('Error', 'Failed to update leave status.');
                console.error(error);
              }
            });
          }
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderLeaveItem = ({ item }: { item: Leave }) => (
    <View style={styles.leaveCard}>
      <View style={styles.leaveHeader}>
        <View style={styles.employeeInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.employee?.firstname?.[0]}{item.employee?.lastname?.[0]}
            </Text>
          </View>
          <View>
            <Text style={styles.employeeName}>
              {item.employee?.firstname} {item.employee?.lastname}
            </Text>
            <Text style={styles.employeeCode}>{item.employee?.employeeCode} • {item.employee?.designation}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.leaveDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#94A3B8" />
          <Text style={styles.detailText}>
            {formatDate(item.startDate)} - {formatFullDate(item.endDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Tag size={16} color="#94A3B8" />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
        {item.reason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Reason:</Text>
            <Text style={styles.reasonText} numberOfLines={2}>{item.reason}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        {selectedLeaveId === item.id ? (
          <View style={styles.updateOptionsRow}>
            <TouchableOpacity 
              style={[styles.smallActionButton, styles.pendingButton]}
              onPress={() => {
                handleUpdateStatus(item.id, 'PENDING');
                setSelectedLeaveId(null);
              }}
            >
              <Text style={[styles.actionButtonText, { color: '#FFCA28', marginLeft: 0 }]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.smallActionButton, styles.approveButton]}
              onPress={() => {
                handleUpdateStatus(item.id, 'APPROVED');
                setSelectedLeaveId(null);
              }}
            >
              <Text style={[styles.actionButtonText, { color: '#66BB6A', marginLeft: 0 }]}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.smallActionButton, styles.rejectButton]}
              onPress={() => {
                handleUpdateStatus(item.id, 'REJECTED');
                setSelectedLeaveId(null);
              }}
            >
              <Text style={[styles.actionButtonText, { color: '#FF7043', marginLeft: 0 }]}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.smallActionButton, { borderColor: '#94A3B8' }]}
              onPress={() => setSelectedLeaveId(null)}
            >
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.updateStatusButton]}
            onPress={() => setSelectedLeaveId(item.id)}
            disabled={updateStatusMutation.isPending}
          >
            <Pencil size={20} color="#3B82F6" />
            <Text style={[styles.actionButtonText, { color: '#3B82F6', marginLeft: 8 }]}>Update Status</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.backgroundLayer} />

      <View style={styles.mainContent}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ClipboardList size={28} color="#fff" strokeWidth={2.5} style={{ marginRight: 10 }} />
            <Text style={styles.headerTitle}>All Requests.</Text>
          </View>
          <TouchableOpacity onPress={() => refetch()} activeOpacity={0.7}>
            <RefreshCw size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* --- Statistics Card --- */}
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <StatItem label="Total" count={stats.total.toString()} color="#29B6F6" />
              <StatItem label="Pending" count={stats.pending.toString()} color="#FFCA28" />
              <StatItem label="Approved" count={stats.approved.toString()} color="#66BB6A" />
              <StatItem label="Rejected" count={stats.rejected.toString()} color="#FF7043" />
            </View>
          </View>

          {/* --- Search Bar --- */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by name, reason or type..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* --- Filter Tabs --- */}
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.tabsContainer}
            >
              <FilterTab label="All" active={activeTab === 'All'} onPress={() => setActiveTab('All')} />
              <FilterTab label="Pending" active={activeTab === 'PENDING'} onPress={() => setActiveTab('PENDING')} />
              <FilterTab label="Approved" active={activeTab === 'APPROVED'} onPress={() => setActiveTab('APPROVED')} />
              <FilterTab label="Rejected" active={activeTab === 'REJECTED'} onPress={() => setActiveTab('REJECTED')} />
            </ScrollView>
          </View>

          {/* --- Leave Requests Section --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leave Requests</Text>
            <Text style={styles.resultsCount}>{filteredLeaves.length} results</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : isError ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Error fetching requests</Text>
            </View>
          ) : filteredLeaves.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <FileText size={48} color="#334155" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyStateText}>No requests found</Text>
            </View>
          ) : (
            filteredLeaves.map((item) => (
              <React.Fragment key={item.id}>
                {renderLeaveItem({ item })}
              </React.Fragment>
            ))
          ) || (
            <View style={{ height: 100 }} />
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// --- Helper Functions ---
const getStatusColor = (status: LeaveStatus) => {
  switch (status) {
    case 'PENDING': return '#FFCA28';
    case 'APPROVED': return '#66BB6A';
    case 'REJECTED': return '#FF7043';
    default: return '#94A3B8';
  }
};

// --- Reusable Components ---

const StatItem = ({ label, count, color }: { label: string, count: string, color: string }) => (
  <View style={styles.statItem}>
    <View style={styles.statLabelRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.statLabel, { color: color }]}>{label}</Text>
    </View>
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statSubText}>requests</Text>
  </View>
);

const FilterTab = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    style={[styles.tab, active ? styles.activeTab : styles.inactiveTab]} 
    onPress={onPress}
  >
    <Text style={[styles.tabText, active ? styles.activeTabText : styles.inactiveTabText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E293B',
    opacity: 0.5,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statSubText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  inactiveTab: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0F172A',
  },
  inactiveTabText: {
    color: '#94A3B8',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultsCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  leaveCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  employeeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeCode: {
    color: '#94A3B8',
    fontSize: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  leaveDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#E2E8F0',
    fontSize: 14,
    marginLeft: 8,
  },
  reasonContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 8,
  },
  reasonLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  reasonText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  approveButton: {
    borderColor: '#66BB6A',
    backgroundColor: 'rgba(102, 187, 106, 0.1)',
  },
  rejectButton: {
    borderColor: '#FF7043',
    backgroundColor: 'rgba(255, 112, 67, 0.1)',
  },
  updateStatusButton: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  updateOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  smallActionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingButton: {
    borderColor: '#FFCA28',
    backgroundColor: 'rgba(255, 202, 40, 0.1)',
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
});

export default AllRequestsScreen;