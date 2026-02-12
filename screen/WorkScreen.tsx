import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Eye,
  Filter,
  Plus,
  Users,
  XCircle
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateDecision, useGetAllDecisions, useGetDecisionById, useParticipantApproval } from '../api/hook/decision/useDecision';
import { useGetAllTasks } from '../api/hook/task/useTask';
import { Decision } from '../api/hook/type/decision';
import { Task } from '../api/hook/type/task';
import { useGetAllEmployees } from '../src/employee/hook/useEmployee';
import { useEmployeeAuthStore } from '../src/store/useEmployeeAuthStore';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

const { width } = Dimensions.get('window');

const DARK_BLUE = '#0A2540';
const WHITE = '#FFFFFF';
const ORANGE = '#FF9500';
const LIGHT_GRAY = '#B0B3B8';
const LIGHT_BLACK = '#060505ff';

const WorkScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Decisions' | 'Clients'>('Tasks');
  const scrollViewRef = useRef<ScrollView>(null);

  const { company, employee } = useEmployeeAuthStore();
  const companyId = company?.id || '';

  // --- TASK STATE & HOOKS ---
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [filterState, setFilterState] = useState({
    startDate: '',
    endDate: '',
  });

  const { 
    data: tasksData, 
    isLoading: isLoadingTasks, 
    refetch: refetchTasks 
  } = useGetAllTasks(companyId, filterState);

  const tasks = tasksData?.data || [];

  // --- DECISION STATE & HOOKS ---
  const { 
    data: decisionsData, 
    isLoading: isLoadingDecisions, 
    refetch: refetchDecisions 
  } = useGetAllDecisions(companyId, { page: 1, limit: 50, ...filterState });
  const decisions = decisionsData?.decisions || [];
  const participantApprovalMutation = useParticipantApproval();
  const createDecisionMutation = useCreateDecision();

  const { data: employeesData } = useGetAllEmployees();
  const employees = employeesData?.data?.employees || [];

  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const { data: selectedDecision, isLoading: isLoadingDecisionDetails } = useGetDecisionById(selectedDecisionId || '');
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  // Fallback to data from list if detail query hasn't finished
  const displayDecision = selectedDecision || decisions.find(d => d.id === selectedDecisionId);

  // --- CREATE DECISION STATE ---
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [createDecisionData, setCreateDecisionData] = useState<{
    title: string;
    description: string;
    participantIds: string[];
  }>({
    title: '',
    description: '',
    participantIds: [],
  });

  // Tab Order Definition
  const tabs: ('Tasks' | 'Decisions' | 'Clients')[] = ['Tasks', 'Decisions', 'Clients'];

  // Handle Tab Press - Switch tabs locally
  const handleTabPress = (tab: 'Tasks' | 'Decisions' | 'Clients') => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#FF3B30';
      case 'HIGH': return '#FF9500';
      case 'MEDIUM': return '#FFCC00';
      case 'LOW': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED': return '#34C759';
      case 'IN_PROGRESS': return '#007AFF';
      case 'CANCELLED':
      case 'REJECTED': return '#FF3B30';
      case 'PENDING': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <View style={[styles.priorityAccent, { backgroundColor: getPriorityColor(item.priority || '') }]} />
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority || '') + '15' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority || '') }]}>{item.priority}</Text>
          </View>
        </View>

        {item.description ? <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text> : null}

        <View style={styles.taskFooter}>
          <View style={styles.dueDateRow}>
            <CalendarDays size={14} color="#0369A1" />
            <Text style={styles.dueDateText}>
              {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB') : 'No Date'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || '') }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const handleParticipantApproval = (id: string, status: 'APPROVED' | 'REJECTED') => {
    participantApprovalMutation.mutate({ id, status }, {
      onSuccess: () => {
        Alert.alert('Success', `Action submitted successfully`);
        if (isDetailsModalVisible) setDetailsModalVisible(false);
      },
      onError: (error: any) => {
        Alert.alert('Error', error?.message || 'Action failed');
      }
    });
  };

  const handleCreateDecision = () => {
    if (!createDecisionData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (createDecisionData.participantIds.length === 0) {
      Alert.alert('Error', 'Please select at least one participant');
      return;
    }

    createDecisionMutation.mutate({ companyId, payload: createDecisionData }, {
      onSuccess: () => {
        Alert.alert('Success', 'Decision created successfully');
        setCreateModalVisible(false);
        setCreateDecisionData({ title: '', description: '', participantIds: [] });
      },
      onError: (error: any) => {
        Alert.alert('Error', error?.message || 'Failed to create decision');
      }
    });
  };

  const toggleParticipant = (id: string) => {
    setCreateDecisionData(prev => {
      const exists = prev.participantIds.includes(id);
      if (exists) {
        return { ...prev, participantIds: prev.participantIds.filter(i => i !== id) };
      } else {
        return { ...prev, participantIds: [...prev.participantIds, id] };
      }
    });
  };

  const renderDecisionItem = ({ item }: { item: Decision }) => (
    <View style={styles.taskCard}>
      <View style={[styles.priorityAccent, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getStatusColor(item.status) + '15', alignSelf: 'flex-start', marginTop: 4 }]}>
              <Text style={[styles.priorityText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => {
              setSelectedDecisionId(item.id);
              setDetailsModalVisible(true);
            }}
            style={styles.actionIconButton}
          >
            <Eye size={18} color={DARK_BLUE} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {item.description ? <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text> : null}

        <View style={styles.taskFooter}>
          <View style={styles.dueDateRow}>
            <Users size={14} color="#0369A1" strokeWidth={2.5} />
            <Text style={styles.dueDateText}>{item.participants.length} Participants</Text>
          </View>
          
          <View style={styles.decisionActions}>
            <TouchableOpacity 
              style={[styles.miniBtn, { backgroundColor: '#ECFDF5' }]}
              onPress={() => handleParticipantApproval(item.id, 'APPROVED')}
            >
              <CheckCircle2 size={16} color="#059669" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.miniBtn, { backgroundColor: '#FEF2F2' }]}
              onPress={() => handleParticipantApproval(item.id, 'REJECTED')}
            >
              <XCircle size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPlaceholderContent = (title: string) => (
    <View style={[styles.contentPage, { width: width }]}>
      <Text style={styles.contentTextGray}>Your firm has not enabled {title} Management.</Text>
      <Text style={styles.contentTextGray}>Please contact your administrator.</Text>
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
        <TouchableOpacity 
          onPress={() => setIsFilterVisible(!isFilterVisible)}
          style={[styles.filterToggle, isFilterVisible && styles.filterToggleActive]}
        >
          <Filter size={20} color={isFilterVisible ? WHITE : ORANGE} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {isFilterVisible && (
        <View style={styles.filterBar}>
          <TouchableOpacity 
            onPress={() => setIsMonthModalVisible(true)}
            style={styles.datePickerBtn}
          >
            <Calendar size={16} color={ORANGE} />
            <Text style={styles.datePickerBtnText}>
              {filterState.startDate ? `${months[selectedMonth]} ${selectedYear}` : 'Select Month'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setFilterState({ startDate: '', endDate: '' });
            }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

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
        <View style={{ width: width, flex: 1 }}>
          {isLoadingTasks ? (
            <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 50 }} />
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskItem}
                contentContainerStyle={styles.taskList}
                ListEmptyComponent={renderPlaceholderContent('Task')}
                refreshControl={<RefreshControl refreshing={isLoadingTasks} onRefresh={refetchTasks} tintColor={ORANGE} />}
              />
            </View>
          )}
        </View>

        {/* Content for Decisions */}
        <View style={{ width: width, flex: 1 }}>
          {isLoadingDecisions ? (
            <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 50 }} />
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={decisions}
                keyExtractor={(item) => item.id}
                renderItem={renderDecisionItem}
                contentContainerStyle={styles.taskList}
                ListEmptyComponent={renderPlaceholderContent('Decision')}
                refreshControl={<RefreshControl refreshing={isLoadingDecisions} onRefresh={refetchDecisions} tintColor={ORANGE} />}
              />
            </View>
          )}
        </View>

        {/* Content for Clients */}
        {renderPlaceholderContent('Client')}
      </ScrollView>

      {/* FAB for Creating Decisions */}
      {activeTab === 'Decisions' && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setCreateModalVisible(true)}
          activeOpacity={0.9}
        >
          <Plus size={30} color={WHITE} strokeWidth={3} />
        </TouchableOpacity>
      )}

      {/* Create Decision Modal */}
      <Modal visible={isCreateModalVisible} animationType="slide" transparent={true} onRequestClose={() => setCreateModalVisible(false)}>
        <View style={styles.monthModalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Decision</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <XCircle size={28} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.pickerLabel}>Decision Title</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter title..."
                  placeholderTextColor={LIGHT_GRAY}
                  value={createDecisionData.title}
                  onChangeText={(text) => setCreateDecisionData({ ...createDecisionData, title: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.pickerLabel}>Description</Text>
                <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Enter description..."
                  placeholderTextColor={LIGHT_GRAY}
                  multiline
                  value={createDecisionData.description}
                  onChangeText={(text) => setCreateDecisionData({ ...createDecisionData, description: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.pickerLabel}>Select Participants</Text>
                <View style={styles.participantList}>
                  {employees.map((emp) => (
                    <TouchableOpacity 
                      key={emp.id} 
                      style={[
                        styles.participantChip, 
                        createDecisionData.participantIds.includes(emp.id) && styles.participantChipActive
                      ]}
                      onPress={() => toggleParticipant(emp.id)}
                    >
                      <Text style={[
                        styles.participantChipText,
                        createDecisionData.participantIds.includes(emp.id) && styles.participantChipTextActive
                      ]}>
                        {emp.firstname} {emp.lastname}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.applyBtn}
                onPress={handleCreateDecision}
                disabled={createDecisionMutation.isPending}
              >
                {createDecisionMutation.isPending ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <Text style={styles.applyBtnText}>Launch Decision</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Month Selection Modal */}
      <Modal visible={isMonthModalVisible} transparent animationType="fade">
        <View style={styles.monthModalOverlay}>
          <View style={styles.monthPickerContainer}>
            <Text style={styles.monthPickerHeader}>Select Month & Year</Text>
            
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.monthGrid}>
                  {months.map((m, idx) => (
                    <TouchableOpacity 
                      key={m} 
                      style={[styles.monthOption, selectedMonth === idx && styles.activeOption]}
                      onPress={() => setSelectedMonth(idx)}
                    >
                      <Text style={[styles.optionText, selectedMonth === idx && styles.activeOptionText]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Year</Text>
              <View style={styles.yearGrid}>
                {years.map(y => (
                  <TouchableOpacity 
                    key={y} 
                    style={[styles.yearOption, selectedYear === y && styles.activeOption]}
                    onPress={() => setSelectedYear(y)}
                  >
                    <Text style={[styles.optionText, selectedYear === y && styles.activeOptionText]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={() => {
                const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
                const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
                setFilterState({ ...filterState, startDate, endDate });
                setIsMonthModalVisible(false);
              }}
            >
              <Text style={styles.applyBtnText}>Apply Filter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsMonthModalVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Decision Details Modal */}
      <Modal visible={isDetailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.monthModalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                {isLoadingDecisionDetails ? (
                  <ActivityIndicator size="small" color={ORANGE} />
                ) : (
                  <>
                    <Text style={styles.modalTitle}>{displayDecision?.title || 'Decision Details'}</Text>
                    <Text style={styles.creatorSubText}>
                      Created by: {displayDecision?.creator ? `${displayDecision?.creator?.firstname} ${displayDecision?.creator?.lastname}` : 'Admin'}
                    </Text>
                  </>
                )}
              </View>
              <TouchableOpacity onPress={() => { setDetailsModalVisible(false); setSelectedDecisionId(null); }}>
                <XCircle size={28} color="#CBD5E1" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              {!displayDecision && isLoadingDecisionDetails ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={ORANGE} />
                  <Text style={{ marginTop: 10, color: LIGHT_GRAY }}>Fetching details...</Text>
                </View>
              ) : !displayDecision ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text style={{ color: LIGHT_GRAY }}>Decision not found.</Text>
                </View>
              ) : (
                <>
                  <View style={styles.detailsSection}>
                    <Text style={styles.pickerLabel}>Description</Text>
                    <Text style={styles.descriptionText}>{displayDecision.description || 'No description provided.'}</Text>
                  </View>

                  <View style={styles.detailsSection}>
                    <Text style={styles.pickerLabel}>Participants Status</Text>
                    {displayDecision.participants?.map((p) => (
                      <View key={p.id} style={styles.participantRow}>
                        <View style={styles.participantInfo}>
                          <Text style={styles.participantName}>
                            {p.employee?.firstname || 'Unknown'} {p.employee?.lastname || ''}
                          </Text>
                          {p.comment ? <Text style={styles.participantComment}>"{p.comment}"</Text> : null}
                        </View>
                        <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(p.status) }]}>
                          <Text style={styles.statusTextSmall}>{p.status}</Text>
                        </View>
                      </View>
                    ))}
                    {!displayDecision.participants || displayDecision.participants.length === 0 ? (
                      <Text style={[styles.descriptionText, { fontStyle: 'italic', opacity: 0.6 }]}>No participants listed.</Text>
                    ) : null}
                  </View>

                  <View style={[styles.detailsSection, { borderBottomWidth: 0, marginTop: 10 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={styles.pickerLabel}>Your Action</Text>
                      {displayDecision.participants?.find(p => p.employee?.id === employee?.id || p.employee?.id === employee?.userId) && (
                        <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(displayDecision.participants.find(p => p.employee?.id === employee?.id || p.employee?.id === employee?.userId)?.status || 'PENDING') }]}>
                          <Text style={styles.statusTextSmall}>
                            {displayDecision.participants.find(p => p.employee?.id === employee?.id || p.employee?.id === employee?.userId)?.status}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.modalActionRow}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                        onPress={() => handleParticipantApproval(displayDecision.id, 'APPROVED')}
                        disabled={participantApprovalMutation.isPending}
                      >
                        {participantApprovalMutation.isPending ? (
                          <ActivityIndicator size="small" color={WHITE} />
                        ) : (
                          <>
                            <CheckCircle2 size={20} color={WHITE} />
                            <Text style={styles.actionBtnText}>Approve</Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
                        onPress={() => handleParticipantApproval(displayDecision.id, 'REJECTED')}
                        disabled={participantApprovalMutation.isPending}
                      >
                        {participantApprovalMutation.isPending ? (
                          <ActivityIndicator size="small" color={WHITE} />
                        ) : (
                          <>
                            <XCircle size={20} color={WHITE} />
                            <Text style={styles.actionBtnText}>Reject</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginTop: 10,
  },
  taskList: {
    padding: 16,
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  priorityAccent: { width: 6, height: '100%' },
  taskCardContent: { flex: 1, padding: 16 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  taskTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  taskDescription: { fontSize: 14, color: '#475569', marginBottom: 12, lineHeight: 20 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  dueDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dueDateText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, color: WHITE, fontWeight: '800', textTransform: 'uppercase' },
  filterToggle: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1B3555', justifyContent: 'center', alignItems: 'center' },
  filterToggleActive: { backgroundColor: ORANGE },
  filterBar: { backgroundColor: DARK_BLUE, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterInputGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B3555', borderRadius: 10, paddingHorizontal: 10, height: 40 },
  filterInput: { flex: 1, color: WHITE, fontSize: 12, fontWeight: '600', padding: 0 },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#334155' },
  clearBtnText: { color: WHITE, fontSize: 12, fontWeight: '700' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  pageBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: DARK_BLUE },
  pageBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  pageInfo: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  datePickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B3555',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  datePickerBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },
  monthModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPickerContainer: {
    backgroundColor: WHITE,
    width: '90%',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
  },
  monthPickerHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: DARK_BLUE,
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerSection: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: LIGHT_GRAY,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  monthGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  monthOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  activeOption: {
    backgroundColor: DARK_BLUE,
  },
  optionText: {
    fontSize: 14,
    color: DARK_BLUE,
    fontWeight: '600',
  },
  activeOptionText: {
    color: WHITE,
  },
  applyBtn: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  applyBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: LIGHT_GRAY,
    fontSize: 14,
    fontWeight: '600',
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decisionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  miniBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: WHITE,
    width: '90%',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  creatorSubText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  detailsSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  descriptionText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  participantComment: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTextSmall: {
    fontSize: 10,
    color: WHITE,
    fontWeight: '800',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '500',
  },
  participantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  participantChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  participantChipActive: {
    backgroundColor: DARK_BLUE,
    borderColor: DARK_BLUE,
  },
  participantChipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  participantChipTextActive: {
    color: WHITE,
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
