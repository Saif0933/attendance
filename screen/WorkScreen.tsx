import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Eye,
  Filter,
  Plus,
  ServerOff,
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
import { useTheme } from '../src/theme/ThemeContext';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

const { width } = Dimensions.get('window');

const DARK_BLUE = '#4b43f0';
const WHITE = '#FFFFFF';
const ORANGE = '#FF9500';
const LIGHT_GRAY = '#B0B3B8';
const LIGHT_BLACK = '#060505ff';

const WorkScreen: React.FC = () => {
  const { colors, isDark, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
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
    isError: isTaskError,
    refetch: refetchTasks 
  } = useGetAllTasks(companyId, filterState);

  const tasks = tasksData?.data || [];

  // --- DECISION STATE & HOOKS ---
  const { 
    data: decisionsData, 
    isLoading: isLoadingDecisions, 
    isError: isDecisionError,
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
    <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.priorityAccent, { backgroundColor: getPriorityColor(item.priority || '') }]} />
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority || '') + '15' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority || '') }]}>{item.priority}</Text>
          </View>
        </View>

        {item.description ? <Text style={[styles.taskDescription, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text> : null}

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
    <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.priorityAccent, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getStatusColor(item.status) + '15', alignSelf: 'flex-start', marginTop: 4 }]}>
              <Text style={[styles.priorityText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => {
              setSelectedDecisionId(item.id);
              setDetailsModalVisible(true);
            }}
            style={[styles.actionIconButton, { backgroundColor: colors.background }]}
          >
            <Eye size={18} color={colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {item.description ? <Text style={[styles.taskDescription, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text> : null}

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

  const renderPlaceholderContent = (title: string, isError: boolean = false) => (
    <View style={[styles.contentPage, { width: width, backgroundColor: colors.background }]}>
      {isError ? (
        <ServerOff size={60} color={ORANGE} />
      ) : (
        <Calendar size={60} color="#CBD5E1" />
      )}
      <Text style={[styles.contentTextGray, { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginTop: 20 }]}>
        {isError ? "Connection Problem" : `${title} Not Available`}
      </Text>
      <Text style={[styles.contentTextGray, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
        {isError 
          ? "We could not connect to the server. Please check your internet or try again later." 
          : `Your firm has not enabled ${title} Management. Please contact your administrator.`}
      </Text>
      {isError && (
        <TouchableOpacity style={styles.retryBtn} onPress={() => { refetchTasks(); refetchDecisions(); }}>
          <Text style={styles.retryBtnText}>Retry Connection</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.containerDark, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.headerDark, { backgroundColor: colors.background }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.titleWhite, { color: colors.text }]}>Work Dashboard</Text>
          <Text style={styles.orangeDot}>•</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsFilterVisible(!isFilterVisible)}
          style={[styles.filterToggle, isFilterVisible && [styles.filterToggleActive, { backgroundColor: colors.primary }], { backgroundColor: isDark ? colors.surface : '#F8FAFC' }]}
        >
          <Filter size={20} color={isFilterVisible ? WHITE : colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {isFilterVisible && (
        <View style={[styles.filterBar, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            onPress={() => setIsMonthModalVisible(true)}
            style={[styles.datePickerBtn, { backgroundColor: isDark ? colors.surface : '#F8FAFC' }]}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.datePickerBtnText, { color: colors.text }]}>
              {filterState.startDate ? `${months[selectedMonth]} ${selectedYear}` : 'Select Month'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setFilterState({ startDate: '', endDate: '' });
            }}
            style={[styles.clearBtn, { backgroundColor: isDark ? colors.surface : '#F1F5F9' }]}
          >
            <Text style={[styles.clearBtnText, { color: colors.primary }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={[styles.tabContainerDark, { backgroundColor: colors.background, borderBottomColor: isDark ? colors.border : '#F1F5F9' }]}>
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
                { color: isDark ? colors.textSecondary : '#000000' },
                activeTab === tab && [styles.activeTabWhite, { color: colors.text }],
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeLine, { backgroundColor: colors.primary }]} />}
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
        style={[styles.contentContainer, { backgroundColor: colors.background }]}
      >
        {/* Content for Tasks */}
        <View style={{ width: width, flex: 1, backgroundColor: colors.background }}>
          {isLoadingTasks ? (
            <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 50 }} />
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskItem}
                contentContainerStyle={styles.taskList}
                ListEmptyComponent={renderPlaceholderContent('Task', isTaskError)}
                refreshControl={<RefreshControl refreshing={isLoadingTasks} onRefresh={refetchTasks} tintColor={ORANGE} />}
              />
            </View>
          )}
        </View>

        {/* Content for Decisions */}
        <View style={{ width: width, flex: 1, backgroundColor: colors.background }}>
          {isLoadingDecisions ? (
            <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 50 }} />
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={decisions}
                keyExtractor={(item) => item.id}
                renderItem={renderDecisionItem}
                contentContainerStyle={styles.taskList}
                ListEmptyComponent={renderPlaceholderContent('Decision', isDecisionError)}
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
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Decision</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <XCircle size={28} color={isDark ? colors.border : "#CBD5E1"} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.pickerLabel, { color: colors.text }]}>Decision Title</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: isDark ? colors.background : '#F8FAFC', color: colors.text, borderColor: colors.border }]}
                  placeholder="Enter title..."
                  placeholderTextColor={colors.textSecondary}
                  value={createDecisionData.title}
                  onChangeText={(text) => setCreateDecisionData({ ...createDecisionData, title: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.pickerLabel, { color: colors.text }]}>Description</Text>
                <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top', backgroundColor: isDark ? colors.background : '#F8FAFC', color: colors.text, borderColor: colors.border }]}
                  placeholder="Enter description..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={createDecisionData.description}
                  onChangeText={(text) => setCreateDecisionData({ ...createDecisionData, description: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.pickerLabel, { color: colors.text }]}>Select Participants</Text>
                <View style={styles.participantList}>
                  {employees.map((emp) => (
                    <TouchableOpacity 
                      key={emp.id} 
                      style={[
                        styles.participantChip, 
                        { backgroundColor: isDark ? colors.background : '#F1F5F9' },
                        createDecisionData.participantIds.includes(emp.id) && [styles.participantChipActive, { backgroundColor: colors.primary }]
                      ]}
                      onPress={() => toggleParticipant(emp.id)}
                    >
                      <Text style={[
                        styles.participantChipText,
                        { color: colors.text },
                        createDecisionData.participantIds.includes(emp.id) && [styles.participantChipTextActive, { color: WHITE }]
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
          <View style={[styles.monthPickerContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.monthPickerHeader, { color: colors.text }]}>Select Month & Year</Text>
            
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
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                {isLoadingDecisionDetails ? (
                  <ActivityIndicator size="small" color={ORANGE} />
                ) : (
                  <>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{displayDecision?.title || 'Decision Details'}</Text>
                    <Text style={[styles.creatorSubText, { color: colors.textSecondary }]}>
                      Created by: {displayDecision?.creator ? `${displayDecision?.creator?.firstname} ${displayDecision?.creator?.lastname}` : 'Admin'}
                    </Text>
                  </>
                )}
              </View>
              <TouchableOpacity onPress={() => { setDetailsModalVisible(false); setSelectedDecisionId(null); }}>
                <XCircle size={28} color={isDark ? colors.border : "#CBD5E1"} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              {!displayDecision && isLoadingDecisionDetails ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={{ marginTop: 10, color: colors.textSecondary }}>Fetching details...</Text>
                </View>
              ) : !displayDecision ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text style={{ color: colors.textSecondary }}>Decision not found.</Text>
                </View>
              ) : (
                <>
                  <View style={[styles.detailsSection, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.pickerLabel, { color: colors.text }]}>Description</Text>
                    <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{displayDecision.description || 'No description provided.'}</Text>
                  </View>

                  <View style={[styles.detailsSection, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.pickerLabel, { color: colors.text }]}>Participants Status</Text>
                    {displayDecision.participants?.map((p: any) => (
                      <View key={p.id} style={styles.participantRow}>
                        <View style={styles.participantInfo}>
                          <Text style={[styles.participantName, { color: colors.text }]}>
                            {p.employee?.firstname || 'Unknown'} {p.employee?.lastname || ''}
                          </Text>
                          {p.comment ? <Text style={[styles.participantComment, { color: colors.textSecondary }]}>"{p.comment}"</Text> : null}
                        </View>
                        <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(p.status) }]}>
                          <Text style={styles.statusTextSmall}>{p.status}</Text>
                        </View>
                      </View>
                    ))}
                    {!displayDecision.participants || displayDecision.participants.length === 0 ? (
                      <Text style={[styles.descriptionText, { fontStyle: 'italic', opacity: 0.6, color: colors.textSecondary }]}>No participants listed.</Text>
                    ) : null}
                  </View>

                  <View style={[styles.detailsSection, { borderBottomWidth: 0, marginTop: 10 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={[styles.pickerLabel, { color: colors.text }]}>Your Action</Text>
                      {displayDecision.participants?.find((p: any) => p.employee?.id === employee?.id || p.employee?.id === employee?.userId) && (
                        <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(displayDecision.participants.find((p: any) => p.employee?.id === employee?.id || p.employee?.id === employee?.userId)?.status || 'PENDING') }]}>
                          <Text style={styles.statusTextSmall}>
                            {displayDecision.participants.find((p: any) => p.employee?.id === employee?.id || p.employee?.id === employee?.userId)?.status}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.modalActionRow}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                        onPress={() => displayDecision && handleParticipantApproval(displayDecision.id, 'APPROVED')}
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
                        onPress={() => displayDecision && handleParticipantApproval(displayDecision.id, 'REJECTED')}
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

const createStyles = (colors: any, fonts: any) => StyleSheet.create({
  containerDark: {
    flex: 1,
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
  },
  titleWhite: {
    fontSize: 25,
    fontFamily: fonts.bold,
    padding: 5,
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
    borderBottomWidth: 1,
  },
  tabWrapper: {
    alignItems: 'center',
  },
  tabWhite: {
    fontSize: 17,
    fontFamily: fonts.medium,
  },
  activeTabWhite: {
    fontFamily: fonts.bold,
  },
  activeLine: {
    marginTop: 4,
    height: 3,
    width: 40,
    borderRadius: 2,
  },
  // New container style for the scroll view area
  contentContainer: {
    flex: 1,
  },
  // Style for individual pages inside the scroll view
  contentPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  contentTextGray: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 10,
  },
  taskList: {
    padding: 16,
    paddingBottom: 20,
  },
  taskCard: {
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
  },
  priorityAccent: { width: 6, height: '100%' },
  taskCardContent: { flex: 1, padding: 16 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  taskTitle: { fontSize: 17, fontFamily: fonts.bold, flex: 1, marginRight: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontFamily: fonts.bold, textTransform: 'uppercase' },
  taskDescription: { fontSize: 14, marginBottom: 12, lineHeight: 20, fontFamily: fonts.regular },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 10, borderTopWidth: 1 },
  dueDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dueDateText: { fontSize: 12, fontFamily: fonts.bold },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, color: WHITE, fontFamily: fonts.bold, textTransform: 'uppercase' },
  filterToggle: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  filterToggleActive: { },
  filterBar: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterInputGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 10, height: 40 },
  filterInput: { flex: 1, color: '#0F172A', fontSize: 12, fontFamily: fonts.bold, padding: 0 },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  clearBtnText: { fontSize: 12, fontFamily: fonts.bold },
  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  pageBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: DARK_BLUE },
  pageBtnText: { color: WHITE, fontSize: 14, fontFamily: fonts.bold },
  pageInfo: { fontSize: 14, fontFamily: fonts.bold, color: '#64748B' },
  datePickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  datePickerBtnText: {
    fontSize: 13,
    fontFamily: fonts.bold,
  },
  monthModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPickerContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
  },
  monthPickerHeader: {
    fontSize: 20,
    fontFamily: fonts.bold,
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerSection: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monthOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  yearOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeOption: {
    backgroundColor: DARK_BLUE,
    borderColor: DARK_BLUE,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#475569',
  },
  activeOptionText: {
    color: WHITE,
  },
  applyBtn: {
    backgroundColor: DARK_BLUE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  applyBtnText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  cancelBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: ORANGE,
    borderRadius: 10,
  },
  retryBtnText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalContent: {
    width: '94%',
    borderRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  participantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  participantChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  participantChipActive: { },
  participantChipText: {
    fontSize: 13,
    fontFamily: fonts.bold,
  },
  participantChipTextActive: { },
  actionIconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decisionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  miniBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsSection: {
    paddingBottom: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  participantComment: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
    fontStyle: 'italic',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTextSmall: {
    fontSize: 10,
    color: WHITE,
    fontFamily: fonts.bold,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  creatorSubText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 4,
  },
});

export default WorkScreen;
