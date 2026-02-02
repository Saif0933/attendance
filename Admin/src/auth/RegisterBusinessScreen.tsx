import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OnboardCompanyPayload } from '../../../api/hook/company/onBoarding/company.api';
import { useOnboardCompany } from '../../../api/hook/company/onBoarding/useCompany';
import { RootStackParamList } from '../../../src/navigation/Stack';

// Interfaces remain same
interface InputGroupProps {
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  icon?: string;
  isMaterialIcon?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

interface DropdownGroupProps {
  label: string;
  value: string;
  onPress: () => void;
}

const RegisterBusinessScreen = () => {
  // --- STATE ---
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [logoAsset, setLogoAsset] = useState<Asset | null>(null);
  const [status, setStatus] = useState('ACTIVE');
  const [payPeriod, setPayPeriod] = useState('WEEK_OFF_PAID');

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [employees, setEmployees] = useState('');
  const [established, setEstablished] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [gst, setGst] = useState('');

  const { mutate: onboardCompany, isPending } = useOnboardCompany();

  const [modalVisible, setModalVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [currentSelectionHandler, setCurrentSelectionHandler] = useState<(val: string) => void>(() => {});

  React.useEffect(() => {
    const checkRegistration = async () => {
      const registered = await AsyncStorage.getItem('adminIsBusinessRegistered');
      if (registered === 'true') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminBottomTabNavigation' }],
        });
      }
    };
    checkRegistration();
  }, []);

  // --- FUNCTIONS ---
  const handleImagePick = async () => {
    try {
      // Options define kiya taki gallery sahi se open ho
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setLogoUri(result.assets[0].uri);
        setLogoAsset(result.assets[0]);
      }
    } catch (error) {
      console.log('Error launching image library:', error);
    }
  };

  const openStatusPicker = () => {
    setPickerTitle('Select Status');
    setPickerOptions(['ACTIVE', 'INACTIVE']);
    setCurrentSelectionHandler(() => setStatus);
    setModalVisible(true);
  };

  const openPayPeriodPicker = () => {
    setPickerTitle('Select Pay Period');
    setPickerOptions(['FIXED_30_DAYS', 'WEEK_OFF_PAID', 'WEEK_OFF_UNPAID']);
    setCurrentSelectionHandler(() => setPayPeriod);
    setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    currentSelectionHandler(option);
    setModalVisible(false);
  };

  const handleCreateBusiness = () => {
    const payload: OnboardCompanyPayload = {
      name: name || undefined,
      code: code || undefined,
      numberOfEmployees: employees || undefined,
      estiblishedDate: established || undefined,
      email: email || undefined,
      phone: phone || undefined,
      website: website || undefined,
      address: address || undefined,
      gstNumber: gst || undefined,
      status,
      payPeriod,
    };

    if (logoAsset && logoAsset.uri) {
        // @ts-ignore - FormData expects specific object structure in React Native
        payload.logo = {
            uri: logoAsset.uri,
            type: logoAsset.type || 'image/jpeg',
            name: logoAsset.fileName || 'logo.jpg',
        };
    }

    onboardCompany(payload, {
        onSuccess: async (data) => {
            console.log('Business Created Successfully', data);
            
            try {
              await AsyncStorage.setItem('adminIsBusinessRegistered', 'true');
            } catch (error) {
              console.error('Error saving business registration state', error);
            }

            Alert.alert("Success", "Business Profile Created!", [
                { 
                    text: "OK", 
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'AdminBottomTabNavigation' }],
                    }) 
                }
            ]);
        },
        onError: (error) => {
            console.error('Error creating business', error);
            Alert.alert("Error", "Failed to create business profile. Please try again.");
        }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Your Business</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Upload Section - FIXED */}
          <View style={styles.logoSection}>
            
            {/* 1. Main Wrapper is now a View (Not Clickable) */}
            <View style={styles.logoUploadWrapper}>
              {logoUri ? (
                <Image 
                  source={{ uri: logoUri }} 
                  style={styles.uploadedLogo} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <View style={styles.innerLogoCircle} />
                  <Text style={styles.logoPlaceholderText}>BUSINESS LOGO</Text>
                </View>
              )}
              
              {/* 2. ONLY Camera Badge is TouchableOpacity */}
              <TouchableOpacity 
                style={styles.cameraBadge} 
                onPress={handleImagePick}
                activeOpacity={0.7}
                // HitSlop badha diya taki click karna aasan ho
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} 
              >
                <Ionicons name="camera" size={14} color="#FFF" />
              </TouchableOpacity>

            </View>

            <Text style={styles.uploadTitle}>Upload Business Logo</Text>
            <Text style={styles.uploadSubtitle}>Establish your brand identity</Text>
          </View>

          {/* --- BASIC INFORMATION --- */}
          <Text style={styles.sectionHeader}>BASIC INFORMATION</Text>
          <InputGroup label="Business Name" placeholder="e.g. Acme Corporation" value={name} onChangeText={setName} />
          <InputGroup label="Unique Company Code" placeholder="e.g. BIZ123" value={code} onChangeText={setCode} />

          <View style={styles.row}>
            <View style={styles.col}>
              <InputGroup label="Employees" placeholder="10" keyboardType="numeric" value={employees} onChangeText={setEmployees} />
            </View>
            <View style={styles.col}>
              <InputGroup label="Established" placeholder="YYYY-MM-DD" icon="calendar-month-outline" isMaterialIcon value={established} onChangeText={setEstablished} />
            </View>
          </View>

          {/* --- CONTACT DETAILS --- */}
          <Text style={styles.sectionHeader}>CONTACT DETAILS</Text>
          <InputGroup label="Email Address" placeholder="contact@business.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <InputGroup label="Phone Number" placeholder="+1 (555) 000-0000" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <InputGroup label="Website" placeholder="https://www.business.com" value={website} onChangeText={setWebsite} />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="123 Corporate Way, Suite 100, San Francisco, CA"
              placeholderTextColor="#7D8A99"
              multiline
              textAlignVertical="top"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* --- LEGAL & PAYROLL --- */}
          <Text style={styles.sectionHeader}>LEGAL & PAYROLL</Text>
          <InputGroup label="GST Number" placeholder="22AAAAA0000A1Z5" value={gst} onChangeText={setGst} />

          <View style={styles.row}>
            <View style={styles.col}>
              <DropdownGroup label="Status" value={status} onPress={openStatusPicker} />
            </View>
            <View style={styles.col}>
              <DropdownGroup label="Pay Period" value={payPeriod} onPress={openPayPeriodPicker} />
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity style={styles.createButton} activeOpacity={0.8} onPress={handleCreateBusiness} disabled={isPending}>
            <Text style={styles.createButtonText}>{isPending ? 'Creating...' : 'Create Business Profile'}</Text>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} /> 
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{pickerTitle}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={pickerOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalOption} onPress={() => handleSelectOption(item)}>
                      <Text style={styles.modalOptionText}>{item}</Text>
                      {(item === status || item === payPeriod) && (
                         <Ionicons name="checkmark" size={20} color="#2FAED7" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
};

// --- COMPONENTS ---
const InputGroup: React.FC<InputGroupProps> = ({ label, placeholder, keyboardType, icon, isMaterialIcon, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8F9BB3"
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
      {icon && (
        <View style={styles.iconContainer}>
            {isMaterialIcon ? <MaterialCommunityIcons name={icon} size={20} color="#5F6D7E" /> : <Ionicons name={icon} size={20} color="#5F6D7E" />}
        </View>
      )}
    </View>
  </View>
);

const DropdownGroup: React.FC<DropdownGroupProps> = ({ label, value, onPress }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={[styles.inputWrapper, styles.dropdownWrapper]} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.inputText} numberOfLines={1}>{value}</Text>
      <Ionicons name="chevron-down" size={18} color="#7D8A99" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8F9FB' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  backButton: { padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  
  // LOGO STYLES UPDATED
  logoSection: { alignItems: 'center', marginVertical: 25 },
  logoUploadWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 50,
    position: 'relative', // Important for absolute positioning of badge
  },
  uploadedLogo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  innerLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    marginBottom: 4,
  },
  logoPlaceholderText: { fontSize: 6, color: '#98A2B3', fontWeight: '600' },
  
  // Camera Badge Fixes
  cameraBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#2FAED7',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 999, // Ensure it sits on top and receives touches
    elevation: 10, // Android shadow/layering
  },
  uploadTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
  uploadSubtitle: { fontSize: 14, color: '#667085' },
  sectionHeader: { fontSize: 12, fontWeight: '700', color: '#5F6D7E', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#111', marginBottom: 8 },
  inputWrapper: { backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#E4E9F2', height: 50, justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, color: '#344054', paddingHorizontal: 15 },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top', backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#E4E9F2' },
  iconContainer: { position: 'absolute', right: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  col: { flex: 1 },
  dropdownWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  inputText: { fontSize: 15, color: '#344054', flex: 1, marginRight: 5 },
  createButton: { backgroundColor: '#2FAED7', height: 56, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#2FAED7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  createButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E4E9F2', paddingBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  modalOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F4F7', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOptionText: { fontSize: 16, color: '#344054' },
});

export default RegisterBusinessScreen;