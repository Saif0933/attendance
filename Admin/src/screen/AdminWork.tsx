import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Pencil,
  Plus,
  Trash2,
  User2,
  Users,
  XCircle,
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
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useCompanyApproval,
  useCreateDecision,
  useDeleteDecision,
  useGetAllDecisions,
  useGetDecisionById,
  useParticipantApproval,
  useUpdateDecision,
} from '../../../api/hook/decision/useDecision';
import { useCreateTask, useDeleteTask, useGetAllTasks, useUpdateTask } from '../../../api/hook/task/useTask';
import { Decision, DecisionParticipant } from '../../../api/hook/type/decision';
import { Task, TaskPriority, TaskStatus } from '../../../api/hook/type/task';
import { useGetAllEmployees } from '../../../src/employee/hook/useEmployee';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { useTheme } from '../../../src/theme/ThemeContext';

const { width } = Dimensions.get('window');

const DARK_BLUE = '#0F172A';
const CARD_BG = '#1E293B';
const BORDER_COLOR = '#334155';
const WHITE = '#FFFFFF';
const ORANGE = '#FF9500';
const LIGHT_GRAY = '#94A3B8';
const LIGHT_BLACK = '#060505ff';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

// --- DATE PICKER CONSTANTS ---
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS_PICKER = [
  { label: 'Jan', value: '01' }, { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' },
  { label: 'Apr', value: '04' }, { label: 'May', value: '05' }, { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' }, { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' },
  { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_PICKER = Array.from({ length: 50 }, (_, i) => (CURRENT_YEAR + 10 - i).toString());

const AdminWork: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Decisions' | 'Clients'>('Tasks');
  const scrollViewRef = useRef<ScrollView>(null);

  // --- TASK STATE & HOOKS ---
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [filterState, setFilterState] = useState({
    startDate: '',
    endDate: '',
  });

  const { company } = useAuthStore();
  const companyId = company?.id || '';

  const { 
    data: tasksData, 
    isLoading: isLoadingTasks, 
    refetch: refetchTasks 
  } = useGetAllTasks(companyId, filterState);

  const tasks = tasksData?.data || [];
  const { data: employeesData } = useGetAllEmployees();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [isModalVisible, setModalVisible] = useState(false);
  const [taskForm, setTaskForm] = useState({
    id: null as string | null,
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM' as TaskPriority,
    status: 'PENDING' as TaskStatus,
    employeeId: '',
  });

  // --- DATE PICKER STATE ---
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDay, setTempDay] = useState('01');
  const [tempMonth, setTempMonth] = useState('01');
  const [tempYear, setTempYear] = useState(CURRENT_YEAR.toString());

  const dayListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);

  // Auto-scroll to center on mount/open
  React.useEffect(() => {
    if (showDatePicker) {
      const timer = setTimeout(() => {
        const dIdx = DAYS.indexOf(tempDay);
        const mIdx = MONTHS_PICKER.findIndex(m => m.value === tempMonth);
        const yIdx = YEARS_PICKER.indexOf(tempYear);
        
        if (dIdx !== -1) dayListRef.current?.scrollToOffset({ offset: dIdx * 50, animated: false });
        if (mIdx !== -1) monthListRef.current?.scrollToOffset({ offset: mIdx * 50, animated: false });
        if (yIdx !== -1) yearListRef.current?.scrollToOffset({ offset: yIdx * 50, animated: false });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showDatePicker]);

  const openDatePicker = () => {
    const currentDate = taskForm.dueDate;
    if (currentDate && currentDate.includes('-')) {
      const [y, m, d] = currentDate.split('-');
      setTempDay(d || '01');
      setTempMonth(m || '01');
      setTempYear(y || CURRENT_YEAR.toString());
    } else {
      const now = new Date();
      setTempDay(now.getDate().toString().padStart(2, '0'));
      setTempMonth((now.getMonth() + 1).toString().padStart(2, '0'));
      setTempYear(now.getFullYear().toString());
    }
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const formattedDate = `${tempYear}-${tempMonth}-${tempDay}`;
    setTaskForm({ ...taskForm, dueDate: formattedDate });
    setShowDatePicker(false);
  };

  const resetForm = () => {
    setTaskForm({
      id: null,
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      employeeId: '',
    });
  };

  const employees = employeesData?.data?.employees || [];

  // --- DECISION STATE & HOOKS ---
  const { data: decisionsData, isLoading: isLoadingDecisions, refetch: refetchDecisions } = useGetAllDecisions(companyId, {
    page: 1,
    limit: 50,
    ...filterState
  });
  const decisions = decisionsData?.decisions || [];
  const createDecisionMutation = useCreateDecision();
  const updateDecisionMutation = useUpdateDecision();
  const companyApprovalMutation = useCompanyApproval();
  const participantApprovalMutation = useParticipantApproval();
  const deleteDecisionMutation = useDeleteDecision();

  const [isDecisionModalVisible, setDecisionModalVisible] = useState(false);
  const [decisionForm, setDecisionForm] = useState({
    id: null as string | null,
    title: '',
    description: '',
    participantIds: [] as string[]
  });
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const { data: selectedDecision, isLoading: isLoadingDecisionDetails } = useGetDecisionById(selectedDecisionId || '');
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  // Tab Order Definition
  const tabs: ('Tasks' | 'Decisions' | 'Clients')[] = ['Tasks', 'Decisions', 'Clients'];

  const handleTabPress = (tab: 'Tasks' | 'Decisions' | 'Clients') => {
    setActiveTab(tab);
    const index = tabs.indexOf(tab);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    const newTab = tabs[slide];
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const handleSaveTask = () => {
    if (!taskForm.title) {
      Alert.alert('Error', 'Please provide a task title');
      return;
    }

    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      status: taskForm.status,
      dueDate: taskForm.dueDate || undefined,
      employeeId: taskForm.employeeId || undefined,
    };

    if (taskForm.id) {
      updateTaskMutation.mutate(
        { id: taskForm.id, payload },
        {
          onSuccess: () => {
            setModalVisible(false);
            resetForm();
            Alert.alert('Success', 'Task updated successfully');
          },
          onError: (error: any) => {
            Alert.alert('Error', error?.message || 'Failed to update task');
          },
        }
      );
    } else {
      createTaskMutation.mutate(payload, {
        onSuccess: () => {
          setModalVisible(false);
          resetForm();
          Alert.alert('Success', 'Task created successfully');
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to create task');
        },
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskForm({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'PENDING',
      employeeId: task.employee?.id || '',
    });
    setModalVisible(true);
  };

  const handleUpdateStatus = (id: string, currentStatus: TaskStatus) => {
    const statuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    updateTaskMutation.mutate({ id, payload: { status: nextStatus } });
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTaskMutation.mutate(id) },
    ]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#FF3B30';
      case 'HIGH': return '#F59E0B';
      case 'MEDIUM': return '#3B82F6';
      case 'LOW': return '#10B981';
      default: return '#8E8E93';
    }
  };

  const resetDecisionForm = () => {
    setDecisionForm({
      id: null,
      title: '',
      description: '',
      participantIds: []
    });
  };

  const handleEditDecision = (decision: Decision) => {
    setDecisionForm({
      id: decision.id,
      title: decision.title,
      description: decision.description || '',
      participantIds: decision.participants.map(p => p.employee.id)
    });
    setDecisionModalVisible(true);
  };

  const handleSaveDecision = () => {
    if (!decisionForm.title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    if (decisionForm.id) {
      updateDecisionMutation.mutate({
        id: decisionForm.id,
        payload: {
          title: decisionForm.title,
          description: decisionForm.description,
        }
      }, {
        onSuccess: () => {
          setDecisionModalVisible(false);
          resetDecisionForm();
          Alert.alert('Success', 'Decision updated');
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to update decision');
        }
      });
    } else {
      createDecisionMutation.mutate({
        companyId,
        payload: {
          title: decisionForm.title,
          description: decisionForm.description,
          participantIds: decisionForm.participantIds
        }
      }, {
        onSuccess: () => {
          setDecisionModalVisible(false);
          resetDecisionForm();
          Alert.alert('Success', 'Decision created');
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to create decision');
        }
      });
    }
  };

  const handleCompanyApproval = (id: string, status: 'APPROVED' | 'REJECTED') => {
    companyApprovalMutation.mutate({ id, status }, {
      onSuccess: () => {
        Alert.alert('Success', `Decision ${status.toLowerCase()} successfully`);
        if (isDetailsModalVisible) setDetailsModalVisible(false);
      },
      onError: (error: any) => {
        Alert.alert('Error', error?.message || 'Action failed');
      }
    });
  };

  const handleParticipantApproval = (id: string, status: 'APPROVED' | 'REJECTED') => {
    participantApprovalMutation.mutate({ id, status }, {
      onSuccess: () => {
        Alert.alert('Success', `Participant status updated to ${status.toLowerCase()}`);
        if (isDetailsModalVisible) setDetailsModalVisible(false);
      },
      onError: (error: any) => {
        Alert.alert('Error', error?.message || 'Action failed');
      }
    });
  };

  const handleDeleteDecision = (id: string) => {
    Alert.alert('Delete Decision', 'Are you sure you want to delete this decision?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => deleteDecisionMutation.mutate(id, {
          onSuccess: () => Alert.alert('Success', 'Decision deleted successfully'),
          onError: (error: any) => Alert.alert('Error', error?.message || 'Failed to delete decision')
        }) 
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': case 'APPROVED': return '#34C759';
      case 'IN_PROGRESS': return '#007AFF';
      case 'CANCELLED': case 'REJECTED': return '#FF3B30';
      case 'PENDING': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.priorityAccent, { backgroundColor: getPriorityColor(item.priority || '') }]} />
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <View style={styles.taskHeaderLeft}>
        <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority || '') + '15' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority || '') }]}>{item.priority}</Text>
            </View>
          </View>
          <View style={styles.taskHeaderRight}>
            <TouchableOpacity onPress={() => handleEditTask(item)} style={[styles.actionIconButton, { backgroundColor: isDark ? colors.background : '#EEF2FF' }]}>
              <Pencil size={18} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id || '')} style={[styles.actionIconButton, { backgroundColor: isDark ? colors.background : '#FFEEED' }]}>
              <Trash2 size={18} color="#FF3B30" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {item.description ? <Text style={[styles.taskDescription, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text> : null}

        <View style={styles.taskFooter}>
          <View style={styles.taskFooterLeft}>
            {item.dueDate && (
              <View style={[styles.dueDateRow, { backgroundColor: isDark ? colors.surface : '#EFF6FF' }]}>
                <CalendarDays size={14} color={colors.primary} strokeWidth={2.5} />
                <Text style={[styles.dueDateText, { color: colors.textSecondary }]}>{new Date(item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</Text>
              </View>
            )}
            <View style={styles.taskAssignee}>
              <View style={[styles.assigneeAvatar, { backgroundColor: colors.primary }]}><User2 size={10} color={WHITE} strokeWidth={3} /></View>
              <Text style={[styles.assigneeText, { color: colors.textSecondary }]}>{item.employee ? item.employee.firstname : 'Unassigned'}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'PENDING') }]}
            onPress={() => handleUpdateStatus(item.id || '', item.status || 'PENDING')}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPlaceholderContent = (title: string) => (
    <View style={[styles.contentPage, { width: width, backgroundColor: colors.background }]}>
      <Text style={[styles.contentTextGray, { color: colors.textSecondary }]}>Your firm has not enabled {title} Management.</Text>
      <Text style={[styles.contentTextGray, { color: colors.textSecondary }]}>Please contact your administrator.</Text>
    </View>
  );

  const renderDecisionItem = ({ item }: { item: Decision }) => (
    <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.priorityAccent, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.taskCardContent}>
        <View style={styles.taskHeader}>
          <View style={styles.taskHeaderLeft}>
            <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={[styles.priorityBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.priorityText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
              {item.companyApproval && (
                <View style={[styles.priorityBadge, { backgroundColor: getStatusColor(item.companyApproval) + '25', borderColor: getStatusColor(item.companyApproval), borderWidth: 0.5 }]}>
                  <Text style={[styles.priorityText, { color: getStatusColor(item.companyApproval), fontSize: 9 }]}>MY: {item.companyApproval}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.taskHeaderRight}>
            <TouchableOpacity 
              onPress={() => {
                setSelectedDecisionId(item.id);
                setDetailsModalVisible(true);
              }}
              style={[styles.actionIconButton, { backgroundColor: isDark ? colors.background : '#F0FDFA' }]}
            >
              <Eye size={18} color={isDark ? colors.text : "#059669"} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleEditDecision(item)}
              style={[styles.actionIconButton, { backgroundColor: isDark ? colors.background : '#F0F9FF' }]}
            >
              <Pencil size={18} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteDecision(item.id)}
              style={[styles.actionIconButton, { backgroundColor: isDark ? colors.background : '#FFEEED' }]}
            >
              <Trash2 size={18} color="#FF3B30" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {item.description ? <Text style={[styles.taskDescription, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text> : null}

        <View style={styles.taskFooter}>
          <View style={styles.taskFooterLeft}>
            <View style={[styles.dueDateRow, { backgroundColor: isDark ? colors.background : '#F0F9FF' }]}>
              <Users size={14} color={colors.primary} strokeWidth={2.5} />
              <Text style={[styles.dueDateText, { color: colors.textSecondary }]}>{item.participants.length} Participants</Text>
            </View>
            <View style={styles.taskAssignee}>
              <View style={[styles.assigneeAvatar, { backgroundColor: colors.primary }]}><User2 size={10} color={WHITE} strokeWidth={3} /></View>
              <Text style={[styles.assigneeText, { color: colors.textSecondary }]}>
                {item.creator ? `${item.creator.firstname} ${item.creator.lastname}` : 'Admin'}
              </Text>
            </View>
          </View>
          
          <View style={styles.decisionActions}>
            <TouchableOpacity 
              style={[styles.miniBtn, { backgroundColor: isDark ? colors.background : '#ECFDF5' }]}
              onPress={() => handleCompanyApproval(item.id, 'APPROVED')}
            >
              <CheckCircle2 size={16} color="#059669" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.miniBtn, { backgroundColor: isDark ? colors.background : '#FEF2F2' }]}
              onPress={() => handleCompanyApproval(item.id, 'REJECTED')}
            >
              <XCircle size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.containerDark, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={[styles.headerDark, { backgroundColor: colors.background }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.titleWhite, { color: colors.text }]}>Work Dashboard</Text>
          <Text style={styles.orangeDot}>•</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsFilterVisible(!isFilterVisible)}
          style={[styles.filterToggle, isFilterVisible && [styles.filterToggleActive, { backgroundColor: colors.primary + '20' }]]}
        >
          <Filter size={20} color={isFilterVisible ? colors.primary : colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {isFilterVisible && (
        <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => setIsMonthModalVisible(true)}
            style={[styles.datePickerBtn, { backgroundColor: isDark ? colors.background : '#F1F5F9' }]}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.datePickerBtnText, { color: colors.text }]}>
              {filterState.startDate ? `${months[selectedMonth]} ${selectedYear}` : 'Select Month'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setFilterState({ startDate: '', endDate: '' });
              const now = new Date();
              setSelectedMonth(now.getMonth());
              setSelectedYear(now.getFullYear());
            }}
            style={[styles.clearBtn, { backgroundColor: isDark ? colors.background : '#E2E8F0' }]}
          >
            <Text style={[styles.clearBtnText, { color: colors.primary }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.tabContainerDark, { backgroundColor: colors.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)} activeOpacity={0.8} style={styles.tabWrapper}>
            <Text style={[styles.tabWhite, { color: colors.textSecondary }, activeTab === tab && [styles.activeTabWhite, { color: colors.primary }]]}>{tab}</Text>
            {activeTab === tab && <View style={[styles.activeLine, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEnabled={!isModalVisible}
        >
          <View style={[styles.contentPage, { width: width, paddingHorizontal: 0, backgroundColor: colors.background }]}>
            {isLoadingTasks ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
              <View style={{ flex: 1 }}>
                <FlatList
                  data={tasks}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTaskItem}
                  contentContainerStyle={styles.taskList}
                  ListEmptyComponent={renderPlaceholderContent('Task')}
                  refreshControl={<RefreshControl refreshing={isLoadingTasks} onRefresh={refetchTasks} tintColor={colors.primary} />}
                />
              </View>
            )}
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => { resetForm(); setModalVisible(true); }} activeOpacity={0.9}>
              <Plus size={32} color={WHITE} strokeWidth={3} />
            </TouchableOpacity>
          </View>
          <View style={[styles.contentPage, { width: width, paddingHorizontal: 0, backgroundColor: colors.background }]}>
            {isLoadingDecisions ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
              <View style={{ flex: 1 }}>
                <FlatList
                  data={decisions}
                  keyExtractor={(item) => item.id}
                  renderItem={renderDecisionItem}
                  contentContainerStyle={styles.taskList}
                  ListEmptyComponent={renderPlaceholderContent('Decision')}
                  refreshControl={<RefreshControl refreshing={isLoadingDecisions} onRefresh={refetchDecisions} tintColor={colors.primary} />}
                />
              </View>
            )}
            <TouchableOpacity 
              style={[styles.fab, { backgroundColor: colors.primary }]} 
              onPress={() => { resetDecisionForm(); setDecisionModalVisible(true); }} 
              activeOpacity={0.9}
            >
              <Plus size={32} color={WHITE} strokeWidth={3} />
            </TouchableOpacity>
          </View>
          {renderPlaceholderContent('Client')}
        </ScrollView>
      </View>

      {/* Task Creation Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitle}>
                <FileText size={20} color={colors.text} strokeWidth={2.5} style={{ marginRight: 8 }} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>{taskForm.id ? 'Update Task' : 'New Task'}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}><XCircle size={28} color={colors.textSecondary} strokeWidth={2} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Title</Text>
              <TextInput style={[styles.input, { backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border, color: colors.text }]} placeholder="Task Title" placeholderTextColor={colors.textSecondary} value={taskForm.title} onChangeText={(text) => setTaskForm({ ...taskForm, title: text })} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border, color: colors.text }]} placeholder="Description" placeholderTextColor={colors.textSecondary} multiline value={taskForm.description} onChangeText={(text) => setTaskForm({ ...taskForm, description: text })} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Due Date</Text>
              <TouchableOpacity onPress={openDatePicker} style={[styles.dateInputTrigger, { backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border }]}>
                <Text style={[styles.dateInputText, { color: colors.text }, !taskForm.dueDate && { color: colors.textSecondary }]}>
                  {taskForm.dueDate || 'Select Due Date (YYYY-MM-DD)'}
                </Text>
                <Calendar size={18} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Priority</Text>
              <View style={styles.pickerRow}>
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TaskPriority[]).map((p) => (
                  <TouchableOpacity key={p} style={[styles.pickerButton, { backgroundColor: isDark ? colors.background : '#F1F5F9', borderColor: colors.border }, taskForm.priority === p && { backgroundColor: getPriorityColor(p), borderColor: getPriorityColor(p) }]} onPress={() => setTaskForm({ ...taskForm, priority: p })}>
                    <Text style={[styles.pickerText, { color: colors.textSecondary }, taskForm.priority === p && { color: WHITE }]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Assign to Employee</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.employeePicker}>
                {employees.map((emp: any) => (
                  <TouchableOpacity key={emp.id} style={[styles.employeeItem, { backgroundColor: isDark ? colors.background : '#F1F5F9', borderColor: colors.border }, taskForm.employeeId === emp.id && [styles.employeeItemSelected, { backgroundColor: colors.primary, borderColor: colors.primary }]]} onPress={() => setTaskForm({ ...taskForm, employeeId: emp.id })}>
                    <Text style={[styles.employeeItemText, { color: colors.textSecondary }, taskForm.employeeId === emp.id && { color: WHITE }]}>{emp.firstname}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.primary }]} onPress={handleSaveTask}>
                {createTaskMutation.isPending || updateTaskMutation.isPending ? <ActivityIndicator color={WHITE} /> : <Text style={styles.createButtonText}>{taskForm.id ? 'Update Task' : 'Create Task'}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- PREMIUM WHEEL DATE PICKER --- */}
      <Modal animationType="slide" transparent={true} visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.datePickerOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.datePickerBottomContent, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={[styles.sheetHandle, { backgroundColor: isDark ? colors.border : '#E2E8F0' }]} />

          <View style={styles.datePickerHeader}>
            <View>
              <Text style={[styles.datePickerTitle, { color: colors.text }]}>Set Due Date</Text>
              <Text style={[styles.datePickerSubTitle, { color: colors.textSecondary }]}>Scroll or tap to select</Text>
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(false)} style={[styles.closeBtnCircle, { borderColor: colors.border }]}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.wheelLabelRow}>
            <Text style={[styles.wheelColumnLabel, { color: colors.primary }]}>DAY</Text>
            <Text style={[styles.wheelColumnLabel, { color: colors.primary }]}>MONTH</Text>
            <Text style={[styles.wheelColumnLabel, { color: colors.primary }]}>YEAR</Text>
          </View>

          <View style={[styles.wheelMainContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.wheelRow}>
              {/* Day Wheel */}
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={dayListRef}
                  data={DAYS}
                  keyExtractor={(item) => `day-${item}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.wheelItem}
                      onPress={() => {
                        dayListRef.current?.scrollToOffset({ offset: index * 50, animated: true });
                        setTempDay(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.wheelText, { color: colors.textSecondary }, tempDay === item && [styles.wheelTextSelected, { color: colors.text }]]}>
                        {item}
                      </Text>
                      {tempDay === item && <View style={[styles.wheelUnderline, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  scrollEventThrottle={16}
                  getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
                  contentContainerStyle={{ paddingVertical: 100 }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 50);
                    if (DAYS[index]) setTempDay(DAYS[index]);
                  }}
                  onScrollToIndexFailed={() => {}}
                />
              </View>

              {/* Month Wheel */}
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={monthListRef}
                  data={MONTHS_PICKER}
                  keyExtractor={(item) => `month-${item.value}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.wheelItem}
                      onPress={() => {
                        monthListRef.current?.scrollToOffset({ offset: index * 50, animated: true });
                        setTempMonth(item.value);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.wheelText, { color: colors.textSecondary }, tempMonth === item.value && [styles.wheelTextSelected, { color: colors.text }]]}>
                        {item.label}
                      </Text>
                      {tempMonth === item.value && <View style={[styles.wheelUnderline, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  scrollEventThrottle={16}
                  getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
                  contentContainerStyle={{ paddingVertical: 100 }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 50);
                    if (MONTHS_PICKER[index]) setTempMonth(MONTHS_PICKER[index].value);
                  }}
                  onScrollToIndexFailed={() => {}}
                />
              </View>

              {/* Year Wheel */}
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={yearListRef}
                  data={YEARS_PICKER}
                  keyExtractor={(item) => `year-${item}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.wheelItem}
                      onPress={() => {
                        yearListRef.current?.scrollToOffset({ offset: index * 50, animated: true });
                        setTempYear(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.wheelText, { color: colors.textSecondary }, tempYear === item && [styles.wheelTextSelected, { color: colors.text }]]}>
                        {item}
                      </Text>
                      {tempYear === item && <View style={[styles.wheelUnderline, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  scrollEventThrottle={16}
                  getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
                  contentContainerStyle={{ paddingVertical: 100 }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 50);
                    if (YEARS_PICKER[index]) setTempYear(YEARS_PICKER[index]);
                  }}
                  onScrollToIndexFailed={() => {}}
                />
              </View>
            </View>

            <LinearGradient colors={[colors.background, isDark ? 'rgba(15,23,42,0)' : 'rgba(255,255,255,0)']} style={styles.wheelVignetteTop} pointerEvents="none" />
            <LinearGradient colors={[isDark ? 'rgba(15,23,42,0)' : 'rgba(255,255,255,0)', colors.background]} style={styles.wheelVignetteBottom} pointerEvents="none" />
          </View>

          <View style={styles.wheelActionRow}>
             <TouchableOpacity style={[styles.wheelCancelBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setShowDatePicker(false)}>
               <Text style={[styles.wheelCancelText, { color: colors.textSecondary }]}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.wheelConfirmBtn, { backgroundColor: colors.primary }]} onPress={confirmDate}>
               <Text style={styles.wheelConfirmText}>Confirm Date</Text>
             </TouchableOpacity>
          </View>
          <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
        </View>
      </Modal>

      {/* Month Selection Modal */}
      <Modal visible={isMonthModalVisible} transparent animationType="fade">
        <View style={styles.monthModalOverlay}>
          <View style={[styles.monthPickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.monthPickerHeader, { color: colors.text }]}>Select Month & Year</Text>
            
            <View style={styles.pickerSection}>
              <Text style={[styles.pickerLabel, { color: colors.primary }]}>Month</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.monthGrid}>
                  {months.map((m, idx) => (
                    <TouchableOpacity 
                      key={m} 
                      style={[styles.monthOption, { backgroundColor: isDark ? colors.surface : '#F1F5F9' }, selectedMonth === idx && styles.activeOption]}
                      onPress={() => setSelectedMonth(idx)}
                    >
                      <Text style={[styles.optionText, { color: colors.textSecondary }, selectedMonth === idx && styles.activeOptionText]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.pickerSection}>
              <Text style={[styles.pickerLabel, { color: colors.primary }]}>Year</Text>
              <View style={styles.yearGrid}>
                {years.map(y => (
                  <TouchableOpacity 
                    key={y} 
                    style={[styles.yearOption, { backgroundColor: isDark ? colors.surface : '#F1F5F9' }, selectedYear === y && styles.activeOption]}
                    onPress={() => setSelectedYear(y)}
                  >
                    <Text style={[styles.optionText, { color: colors.textSecondary }, selectedYear === y && styles.activeOptionText]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
                const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
                setFilterState({ ...filterState, startDate, endDate });
                setIsMonthModalVisible(false);
              }}
            >
              <Text style={[styles.applyBtnText, { color: WHITE }]}>Apply Filter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsMonthModalVisible(false)} style={[styles.cancelBtn, { borderColor: colors.border }]}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Decision Modal */}
      <Modal visible={isDecisionModalVisible} animationType="slide" transparent={true} onRequestClose={() => setDecisionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitle}>
                <FileCheck size={20} color={colors.text} strokeWidth={2.5} style={{ marginRight: 8 }} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>{decisionForm.id ? 'Edit Decision' : 'New Decision'}</Text>
              </View>
              <TouchableOpacity onPress={() => setDecisionModalVisible(false)}><XCircle size={28} color={colors.textSecondary} strokeWidth={2} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Decision Title</Text>
              <TextInput style={[styles.input, { backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border, color: colors.text }]} placeholder="e.g. Office Renovation" placeholderTextColor={colors.textSecondary} value={decisionForm.title} onChangeText={(text) => setDecisionForm({ ...decisionForm, title: text })} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border, color: colors.text }]} placeholder="Details..." placeholderTextColor={colors.textSecondary} multiline value={decisionForm.description} onChangeText={(text) => setDecisionForm({ ...decisionForm, description: text })} />
              
              <Text style={[styles.inputLabel, { color: colors.text }]}>Participants (Select Multiple)</Text>
              <View style={styles.pickerRow}>
                {employees.map((emp: any) => {
                  const isSelected = decisionForm.participantIds.includes(emp.id);
                  return (
                    <TouchableOpacity 
                      key={emp.id} 
                      style={[styles.employeeItem, { backgroundColor: isDark ? colors.background : '#F1F5F9', borderColor: colors.border }, isSelected && [styles.employeeItemSelected, { backgroundColor: colors.primary, borderColor: colors.primary }]]} 
                      onPress={() => {
                        const newIds = isSelected 
                          ? decisionForm.participantIds.filter(id => id !== emp.id)
                          : [...decisionForm.participantIds, emp.id];
                        setDecisionForm({ ...decisionForm, participantIds: newIds });
                      }}
                    >
                      <Text style={[styles.employeeItemText, { color: colors.textSecondary }, isSelected && { color: WHITE }]}>{emp.firstname}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity 
                style={[styles.createButton, { backgroundColor: colors.primary }]} 
                onPress={handleSaveDecision}
              >
                {createDecisionMutation.isPending || updateDecisionMutation.isPending ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <Text style={styles.createButtonText}>{decisionForm.id ? 'Update Decision' : 'Create Decision'}</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Decision Details Modal */}
      <Modal visible={isDetailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%', backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{isLoadingDecisionDetails ? 'Loading...' : selectedDecision?.title}</Text>
                <Text style={[styles.creatorSubText, { color: colors.textSecondary }]}>
                  Created by: {selectedDecision?.creator ? `${selectedDecision.creator.firstname} ${selectedDecision.creator.lastname}` : 'Admin'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setDetailsModalVisible(false); setSelectedDecisionId(null); }}>
                <XCircle size={28} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailsSection}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
                <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{selectedDecision?.description || 'No description provided.'}</Text>
              </View>

              <View style={styles.detailsSection}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Participants Status</Text>
                  {selectedDecision?.participants.map((p: DecisionParticipant) => (
                    <View key={p.id} style={[styles.participantRow, { backgroundColor: isDark ? colors.background : '#F8FAFC', borderColor: colors.border }]}>
                    <View style={styles.participantInfo}>
                      <Text style={[styles.participantName, { color: colors.text }]}>{p.employee.firstname} {p.employee.lastname}</Text>
                      {p.comment ? <Text style={[styles.participantComment, { color: colors.textSecondary }]}>"{p.comment}"</Text> : null}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(p.status) }]}>
                      <Text style={styles.statusText}>{p.status}</Text>
                    </View>
                  </View>
                ))}
                {selectedDecision?.participants.length === 0 && (
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No participants added.</Text>
                )}
              </View>

              <View style={[styles.detailsSection, { borderBottomWidth: 0 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Company Action</Text>
                  {selectedDecision?.companyApproval && (
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedDecision.companyApproval) }]}>
                      <Text style={styles.statusText}>Current: {selectedDecision.companyApproval}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.modalActionRow}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#10B981', opacity: selectedDecision?.companyApproval === 'APPROVED' ? 0.6 : 1 }]}
                    onPress={() => {
                      if (selectedDecision) {
                        handleCompanyApproval(selectedDecision.id, 'APPROVED');
                      }
                    }}
                    disabled={selectedDecision?.companyApproval === 'APPROVED'}
                  >
                    <CheckCircle2 size={20} color={WHITE} />
                    <Text style={styles.actionBtnText}>{selectedDecision?.companyApproval === 'APPROVED' ? 'Approved' : 'Approve'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#EF4444', opacity: selectedDecision?.companyApproval === 'REJECTED' ? 0.6 : 1 }]}
                    onPress={() => {
                      if (selectedDecision) {
                        handleCompanyApproval(selectedDecision.id, 'REJECTED');
                      }
                    }}
                    disabled={selectedDecision?.companyApproval === 'REJECTED'}
                  >
                    <XCircle size={20} color={WHITE} />
                    <Text style={styles.actionBtnText}>{selectedDecision?.companyApproval === 'REJECTED' ? 'Rejected' : 'Reject'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerDark: { flex: 1 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerDark: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  titleWhite: { fontSize: 25, fontWeight: '800', padding: 5, color: WHITE },
  orangeDot: { fontSize: 34, color: ORANGE, marginLeft: 4 },
  tabContainerDark: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  tabWrapper: { alignItems: 'center' },
  tabWhite: { fontSize: 17, fontWeight: '400', color: LIGHT_GRAY },
  activeTabWhite: { color: WHITE, fontWeight: '600' },
  activeLine: { marginTop: 4, height: 3, width: 40, backgroundColor: ORANGE, borderRadius: 2 },
  contentContainer: { flex: 1 },
  contentPage: { flex: 1 },
  contentTextGray: { fontSize: 15, color: LIGHT_GRAY, textAlign: 'center', lineHeight: 24, marginTop: 10 },
  taskList: { padding: 16, paddingBottom: 100 },
  taskCard: { borderRadius: 20, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 12, flexDirection: 'row', overflow: 'hidden', borderWidth: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    borderWidth: 1,
  },
  priorityAccent: { width: 6, height: '100%' },
  taskCardContent: { flex: 1, padding: 16 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  taskHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  taskTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  taskDescription: { fontSize: 14, color: LIGHT_GRAY, marginBottom: 15, lineHeight: 20, fontWeight: '400' },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER_COLOR },
  taskFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskAssignee: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  assigneeAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#475569', justifyContent: 'center', alignItems: 'center' },
  assigneeText: { fontSize: 12, color: LIGHT_GRAY, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, color: WHITE, fontWeight: '800', textTransform: 'uppercase' },
  actionIconButton: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8, borderWidth: 1 },
  fab: { position: 'absolute', bottom: 30, right: 24, width: 65, height: 65, borderRadius: 22, backgroundColor: ORANGE, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: ORANGE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15 },
  dueDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  dueDateText: { fontSize: 11, color: '#38BDF8', fontWeight: '700' },
  modalHeaderTitle: { flexDirection: 'row', alignItems: 'center' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  pickerButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: BORDER_COLOR, backgroundColor: '#1E293B' },
  pickerText: { fontSize: 12, fontWeight: '600', color: LIGHT_GRAY },
  employeePicker: { marginBottom: 20 },
  employeeItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1 },
  employeeItemSelected: { },
  employeeItemText: { fontSize: 13 },
  createButton: { backgroundColor: ORANGE, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20, marginBottom: 20 },
  createButtonText: { color: WHITE, fontSize: 16, fontWeight: '700' },
  taskHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  filterToggle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleActive: {
    backgroundColor: ORANGE,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  clearBtnText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  monthModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPickerContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  monthPickerHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: WHITE,
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
  },
  activeOption: {
    backgroundColor: ORANGE,
  },
  optionText: {
    fontSize: 14,
    color: LIGHT_GRAY,
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
  decisionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  miniBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  detailsSection: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  creatorSubText: {
    fontSize: 12,
    color: LIGHT_GRAY,
    fontWeight: '600',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: LIGHT_GRAY,
    lineHeight: 22,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  participantInfo: {
    flex: 1,
    marginRight: 10,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },
  participantComment: {
    fontSize: 12,
    color: LIGHT_GRAY,
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: LIGHT_GRAY,
    fontSize: 13,
    marginTop: 10,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  // --- DATE PICKER STYLES ---
  dateInputTrigger: {
    borderRadius: 12, padding: 14, flexDirection: 'row', 
    justifyContent: 'space-between', alignItems: 'center', borderWidth: 1
  },
  dateInputText: { fontSize: 14, fontWeight: '600' },
  datePickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  datePickerBottomContent: {
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingHorizontal: 28, paddingVertical: 24, position: 'absolute', bottom: 0, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -15 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 30,
    borderTopWidth: 1.5,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  datePickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  datePickerTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  datePickerSubTitle: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  closeBtnCircle: { padding: 8, borderRadius: 25, borderWidth: 1 },
  wheelMainContainer: { height: 250, justifyContent: 'center', borderRadius: 32, overflow: 'hidden', borderWidth: 1 },
  wheelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' },
  wheelColumn: { flex: 1, height: '100%', alignItems: 'center' },
  wheelLabelRow: { flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 12, paddingHorizontal: 12 },
  wheelColumnLabel: { flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '900', letterSpacing: 2.5 },
  wheelItem: { height: 50, width: '100%', justifyContent: 'center', alignItems: 'center' },
  wheelText: { fontSize: 18, color: '#475569', fontWeight: '600' },
  wheelTextSelected: { fontWeight: '900', fontSize: 24 },
  wheelUnderline: { height: 3, backgroundColor: ORANGE, width: 28, borderRadius: 2, position: 'absolute', bottom: 6, shadowColor: ORANGE, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5 },
  wheelVignetteTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 90 },
  wheelVignetteBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
  wheelActionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 30 },
  wheelCancelBtn: { flex: 1, paddingVertical: 18, borderRadius: 22, alignItems: 'center', borderWidth: 1.5 },
  wheelCancelText: { fontSize: 16, fontWeight: '700' },
  wheelConfirmBtn: { flex: 2, backgroundColor: ORANGE, paddingVertical: 18, borderRadius: 22, alignItems: 'center', shadowColor: ORANGE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 12 },
  wheelConfirmText: { fontSize: 16, fontWeight: '900', letterSpacing: 0.8 },
});

export { AdminWork };

