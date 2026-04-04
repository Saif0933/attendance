import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetCompanyById, useOnboardCompany } from '../../api/hook/company/onBoarding/useCompany';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../theme/ThemeContext';
import { showSuccess } from '../utils/meesage';

// Custom Component for the "Label on Border" Input style
interface OutlinedInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  editable?: boolean;
}

const OutlinedInput = ({ 
  label, 
  value, 
  onChangeText, 
  multiline = false, 
  keyboardType = 'default',
  editable = true 
}: OutlinedInputProps) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.inputContainer, multiline && { height: 100 }]}>
      <View style={[
        styles.inputBorder, 
        multiline && { height: 100, alignItems: 'stretch' }, 
        !editable && { opacity: 0.6 },
        { borderColor: colors.border }
      ]}>
        <TextInput
          style={[
            styles.textInput, 
            { flex: 1, width: '100%', color: colors.text },
            multiline && { textAlignVertical: 'top', paddingTop: 12 }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textSecondary}
          multiline={multiline}
          keyboardType={keyboardType}
          editable={editable}
          underlineColorAndroid="transparent"
        />
      </View>
      {/* The Label sits on top of the border */}
      <View style={[styles.labelContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.labelText, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
};

const CompanyDetails = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { company, setAuth, token } = useAuthStore();
  
  // Fetch Company Data
  const { data: companyData, isLoading } = useGetCompanyById(company?.id as string);
  
  // Update Mutation
  const onboardMutation = useOnboardCompany();

  // Pay Period Mapping
  const PAY_PERIOD_MAP: Record<string, string> = {
    '30 days (fixed)': 'FIXED_30_DAYS',
    'calendar (week-offs paid)': 'WEEK_OFF_PAID',
    'calendar (week-offs unpaid)': 'WEEK_OFF_UNPAID',
  };

  const REVERSE_PAY_PERIOD_MAP: Record<string, string> = {
    'FIXED_30_DAYS': '30 days (fixed)',
    'WEEK_OFF_PAID': 'calendar (week-offs paid)',
    'WEEK_OFF_UNPAID': 'calendar (week-offs unpaid)',
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    code: '',
    payPeriod: 'calendar (week-offs paid)',
  });

  // Sync state with fetched data
  useEffect(() => {
    // Backend might return company directly, or inside 'company' or 'data' key
    const c = companyData?.company || companyData?.data || companyData;
    
    if (c && (c.id || c.name)) {
      setFormData({
        name: c.name || '',
        gstNumber: c.gstNumber || '',
        address: c.address || '',
        phone: c.phone || '',
        email: c.email || '',
        code: c.code || '',
        payPeriod: REVERSE_PAY_PERIOD_MAP[c.payPeriod] || 'calendar (week-offs paid)',
      });
    }
  }, [companyData]);

  const handleChange = (key: string, val: string) => {
    setFormData({ ...formData, [key]: val });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        payPeriod: PAY_PERIOD_MAP[formData.payPeriod] || formData.payPeriod,
      };
      
      const response = await onboardMutation.mutateAsync(payload);
      
      if (response?.success && response?.company) {
        setAuth(token as string, response.company);
        queryClient.setQueryData(['company', company?.id], response);
        showSuccess('Company updated successfully');
      } else {
        const updatedComp = response?.company || response?.data || response;
        if (updatedComp && (updatedComp.id || updatedComp.name)) {
          setAuth(token as string, updatedComp);
          queryClient.setQueryData(['company', company?.id], response);
        }
        showSuccess('Company updated successfully');
        queryClient.invalidateQueries({ queryKey: ['company', company?.id] });
      }
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

  const payPeriodOptions = [
    '30 days (fixed)',
    'calendar (week-offs paid)',
    'calendar (week-offs unpaid)',
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePayPeriodSelect = (option: string) => {
    setFormData({ ...formData, payPeriod: option });
    setIsModalVisible(false);
  };

  const getHelperText = (period: string) => {
    switch (period.toLowerCase()) {
      case '30 days (fixed)':
        return 'Daily rate = Monthly salary ÷ 30 days.\nFixed calculation regardless of month length.';
      case 'calendar (week-offs paid)':
        return 'Daily rate = Monthly salary ÷ Total calendar days.\nWeek-offs are paid (30/31).';
      case 'calendar (week-offs unpaid)':
        return 'Daily rate = Monthly salary ÷ Total calendar days.\nWeek-offs are excluded from pay calculation.';
      default:
        return 'Daily rate calculation based on your selection.';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* --- Header --- */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>Company Details</Text>

        <TouchableOpacity 
          onPress={handleUpdate} 
          disabled={onboardMutation.isPending}
        >
          {onboardMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.updateText, { color: colors.primary }]}>Update</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <OutlinedInput 
          label="Company Name" 
          value={formData.name} 
          onChangeText={(t) => handleChange('name', t)}
        />

        <OutlinedInput 
          label="Company Code" 
          value={formData.code} 
          onChangeText={(t) => handleChange('code', t)}
          editable={false}
        />

        <OutlinedInput 
          label="GSTIN" 
          value={formData.gstNumber} 
          onChangeText={(t) => handleChange('gstNumber', t)}
        />

        <OutlinedInput 
          label="Address" 
          value={formData.address} 
          onChangeText={(t) => handleChange('address', t)}
          multiline={true}
        />

        <OutlinedInput 
          label="Phone Number" 
          value={formData.phone} 
          onChangeText={(t) => handleChange('phone', t)}
          keyboardType="phone-pad"
        />

        <OutlinedInput 
          label="Email" 
          value={formData.email} 
          onChangeText={(t) => handleChange('email', t)}
          keyboardType="email-address"
        />

        <View style={styles.payPeriodContainer}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Pay Period</Text>
          
          <TouchableOpacity 
            style={[styles.dropdownBox, { borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={[styles.dropdownText, { color: colors.text }]}>{formData.payPeriod}</Text>
            <Ionicons name="caret-down" size={16} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {getHelperText(formData.payPeriod)}
          </Text>
        </View>

      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Pay Period</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {payPeriodOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  { backgroundColor: colors.background },
                  formData.payPeriod === option && [styles.selectedOption, { borderColor: colors.primary }]
                ]}
                onPress={() => handlePayPeriodSelect(option)}
              >
                <Text style={[
                  styles.optionText,
                  { color: colors.textSecondary },
                  formData.payPeriod === option && [styles.selectedOptionText, { color: colors.text }]
                ]}>
                  {option}
                </Text>
                {formData.payPeriod === option && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginLeft: 16,
  },
  updateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 25,
    height: 56,
    justifyContent: 'center',
    position: 'relative',
  },
  inputBorder: {
    borderWidth: 1.5,
    borderRadius: 8,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 12,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  payPeriodContainer: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  dropdownBox: {
    borderWidth: 1.5,
    borderRadius: 8,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    width: '100%',
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedOption: {
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedOptionText: {
    fontWeight: '700',
  },
});

export default CompanyDetails;