
// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const { height } = Dimensions.get('window');

// const SalaryScreen: React.FC = () => {
//   const navigation = useNavigation();
  
//   // Animation Value: Starts from bottom
//   const slideAnim = useRef(new Animated.Value(300)).current;
  
//   // State for Date Picker Modal
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState('Oct 2025');
//   const [availableDates, setAvailableDates] = useState<string[]>([]);

//   // Logic to generate dates from Joining Date to Current Date
//   useEffect(() => {
//     const generateDates = () => {
//       const dates = [];
//       const currentDate = new Date();
//       // Example Joining Date: Jan 1, 2023
//       const joiningDate = new Date('2023-01-01'); 

//       let tempDate = new Date(joiningDate);

//       // Loop while tempDate is less than or equal to current date
//       while (tempDate <= currentDate) {
//         const monthStr = tempDate.toLocaleString('default', { month: 'short' });
//         const yearStr = tempDate.getFullYear();
//         dates.push(`${monthStr} ${yearStr}`);
//         tempDate.setMonth(tempDate.getMonth() + 1);
//       }
      
//       setAvailableDates(dates.reverse());
//     };

//     generateDates();

//     // Run animation on mount
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 600,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleSelectDate = (date: string) => {
//     setSelectedDate(date);
//     setShowDatePicker(false);
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
      
//       {/* Blue Header Background */}
//       <View style={styles.headerBackground} />
      
//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header Section */}
//         <View style={styles.headerContent}>
//           <Image
//             source={require('../src/assets/profile.jpg')} 
//             style={styles.profileImage}
//           />
//           <Text style={styles.name}>Md. Saif</Text>
//           <Text style={styles.role}>Employee</Text>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>Full Stack Developer</Text>
//           </View>
//         </View>

//         {/* Salary Period Selector */}
//         <View style={styles.salaryForContainer}>
//           <Text style={styles.salaryForText}>Salary For</Text>
          
//           <TouchableOpacity 
//             style={styles.datePicker} 
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Icon name="calendar-outline" size={18} color="#000" />
//             <Text style={styles.dateText}>{selectedDate}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ANIMATED SHEET CARD */}
//         <Animated.View
//           style={[
//             styles.sheetContainer,
//             { transform: [{ translateY: slideAnim }] },
//           ]}
//         >
//           {/* EARNINGS SECTION */}
//           <Text style={styles.sectionTitle}>EARNINGS</Text>
//           <View style={styles.row}>
//             <Text style={styles.label}>CTC</Text>
//             <Text style={styles.value}>₹ 10,000.00</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Daily Rate</Text>
//             <Text style={styles.value}>₹ 322.58</Text>
//           </View>

//           <View style={styles.divider} />

//           {/* ATTENDANCE SECTION */}
//           <Text style={styles.sectionTitle}>ATTENDANCE</Text>
//           <View style={styles.row}>
//             <Text style={styles.label}>Total Days</Text>
//             <Text style={styles.value}>26 days</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Payable Days</Text>
//             <Text style={styles.value}>20 days</Text>
//           </View>

//           <View style={styles.divider} />

//           {/* DEDUCTIONS SECTION */}
//           <Text style={styles.sectionTitle}>DEDUCTIONS</Text>
//           <View style={styles.row}>
//             <Text style={[styles.label, styles.redText]}>Absent Days Deduction</Text>
//             <Text style={[styles.value, styles.redText]}>₹ 1,935.48</Text>
//           </View>

//           <View style={styles.divider} />

//           {/* SALARY PAYMENTS MADE SECTION */}
//           <Text style={styles.sectionTitle}>SALARY PAYMENTS MADE</Text>
//           <View style={styles.rowColumn}>
//             <View>
//               <Text style={styles.label}>Regular Earnings</Text>
//               <Text style={styles.subText}>15.5 days × ₹ 322.58/day</Text>
//               <Text style={styles.subText}>6 absent days, 9 half days</Text>
//             </View>
//             <Text style={styles.value}>₹ 5,000.00</Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>Payments Made</Text>
//             <Text style={styles.value}>₹ 0.00</Text>
//           </View>

//           <View style={[styles.row, styles.rowMarginTop]}>
//             <Text style={styles.label}>Remaining Balance</Text>
//             <Text style={[styles.value, styles.yellowText]}>₹ 5,000.00</Text>
//           </View>
//           <Text style={styles.subText}>Outstanding amount</Text>

//           {/* Generate Payslip Button */}
//           <TouchableOpacity style={styles.generateBtn} onPress={() => navigation.navigate('PayslipScreen' as never)}>
//             <MaterialIcons name="receipt-long" size={20} color="#000" />
//             <Text style={styles.generateBtnText}>Generate Payslip</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </ScrollView>

//       {/* DATE PICKER MODAL */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showDatePicker}
//         onRequestClose={() => setShowDatePicker(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Select Salary Month</Text>
//               <View style={styles.modalListContainer}>
//                 <FlatList
//                   data={availableDates}
//                   keyExtractor={(item) => item}
//                   showsVerticalScrollIndicator={false}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity 
//                       style={[
//                         styles.modalItem, 
//                         item === selectedDate && styles.modalItemSelected
//                       ]}
//                       onPress={() => handleSelectDate(item)}
//                     >
//                       <Text style={[
//                         styles.modalItemText,
//                         item === selectedDate && styles.modalItemTextSelected
//                       ]}>{item}</Text>
//                       {item === selectedDate && (
//                         <Icon name="checkmark-circle" size={20} color="#2a568f" />
//                       )}
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={() => setShowDatePicker(false)}
//               >
//                 <Text style={styles.closeButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//     </SafeAreaView>
//   );
// };

// export default SalaryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff', 
//   },
//   headerBackground: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 420, // INCREASED: changed from 300 to 420
//     backgroundColor: '#2a568f',
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   headerContent: {
//     alignItems: 'center',
//     paddingVertical: 25,
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 2,
//     borderColor: '#fff',
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   name: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   role: {
//     color: '#fff',
//     opacity: 0.8,
//   },
//   badge: {
//     backgroundColor: '#000',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     marginTop: 8,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   salaryForContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 15,
//   },
//   salaryForText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   datePicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   dateText: {
//     marginLeft: 6,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   sheetContainer: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: 25,
//     paddingBottom: 40,
//     minHeight: height * 0.7,
//     borderTopLeftRadius: 24, 
//     borderTopRightRadius: 24, 
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 15,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     color: '#888',
//     fontWeight: '700',
//     marginBottom: 10,
//     marginTop: 5,
//     letterSpacing: 0.5,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   rowColumn: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 14,
//     color: '#333',
//   },
//   value: {
//     fontSize: 14,
//     color: '#000',
//     fontWeight: '600',
//   },
//   subText: {
//     fontSize: 12,
//     color: '#777',
//     marginTop: 2,
//   },
//   redText: {
//     color: '#D32F2F',
//   },
//   yellowText: {
//     color: '#F9A825',
//   },
//   rowMarginTop: {
//     marginTop: 10,
//   },
//   generateBtn: {
//     backgroundColor: '#FFD54F',
//     marginTop: 30,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderRadius: 12,
//   },
//   generateBtnText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//     color: '#000',
//   },
  
//   // MODAL STYLES
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     maxHeight: height * 0.6,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#333',
//   },
//   modalListContainer: {
//     maxHeight: 300,
//   },
//   modalItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalItemSelected: {
//     backgroundColor: '#f5f9ff',
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     borderBottomWidth: 0,
//   },
//   modalItemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   modalItemTextSelected: {
//     color: '#2a568f',
//     fontWeight: '600',
//   },
//   closeButton: {
//     marginTop: 15,
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   closeButtonText: {
//     color: '#D32F2F',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });



import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');

const SalaryScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // State for Date Picker Modal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('October 2023'); // Default matching image
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Logic to generate dates
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const currentDate = new Date();
      const joiningDate = new Date('2023-01-01'); 
      let tempDate = new Date(joiningDate);
      while (tempDate <= currentDate) {
        const monthStr = tempDate.toLocaleString('default', { month: 'short' });
        const yearStr = tempDate.getFullYear();
        dates.push(`${monthStr} ${yearStr}`);
        tempDate.setMonth(tempDate.getMonth() + 1);
      }
      setAvailableDates(dates.reverse());
    };
    generateDates();
  }, []);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* --- HEADER --- */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Salary Details</Text>
        <TouchableOpacity>
            <Icon name="eye-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- PROFILE CARD --- */}
        <View style={styles.card}>
            <View style={styles.profileRow}>
                <Image
                    source={require('../src/assets/profile.jpg')} 
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Md. Saif</Text>
                    <Text style={styles.profileRole}>Senior Software Engineer</Text>
                    <Text style={styles.profileId}>EMP-ID: 10293</Text>
                </View>
            </View>
        </View>

        {/* --- PAYROLL PERIOD SELECTOR --- */}
        <Text style={styles.sectionLabel}>Payroll Period</Text>
        <TouchableOpacity 
          style={styles.dateSelector} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateSelectorText}>{selectedDate}</Text>
          <Icon name="chevron-down" size={20} color="#2a568f" />
        </TouchableOpacity>

        {/* --- EARNINGS CARD --- */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Icon name="cash-outline" size={20} color="#2089dc" />
                <Text style={styles.cardTitle}>Earnings & CTC</Text>
            </View>
            
            <View style={styles.row}>
                <Text style={styles.labelBlue}>Daily Rate</Text>
                <Text style={styles.value}>$250.00</Text>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
                <Text style={styles.labelBlue}>Regular Earnings</Text>
                <Text style={styles.value}>$5,000.00</Text>
            </View>
        </View>

        {/* --- ATTENDANCE SUMMARY CARD --- */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Icon name="calendar-outline" size={20} color="#2089dc" />
                <Text style={styles.cardTitle}>Attendance Summary</Text>
            </View>

            <View style={styles.attendanceContainer}>
                {/* Total Box */}
                <View style={styles.attendBox}>
                    <Text style={styles.boxLabel}>TOTAL</Text>
                    <Text style={styles.boxValue}>22</Text>
                </View>

                {/* Payable Box */}
                <View style={[styles.attendBox, styles.boxPayable]}>
                    <Text style={[styles.boxLabel, {color: '#2089dc'}]}>PAYABLE</Text>
                    <Text style={[styles.boxValue, {color: '#2089dc'}]}>20</Text>
                </View>

                {/* Absent Box */}
                <View style={[styles.attendBox, styles.boxAbsent]}>
                    <Text style={[styles.boxLabel, {color: '#d32f2f'}]}>ABSENT</Text>
                    <Text style={[styles.boxValue, {color: '#d32f2f'}]}>2</Text>
                </View>
            </View>
        </View>

        {/* --- DEDUCTIONS CARD --- */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Icon name="cut-outline" size={20} color="#d32f2f" style={{transform: [{rotate: '90deg'}]}} />
                <Text style={styles.cardTitle}>Deductions</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.labelBlue}>Absent Day Deductions</Text>
                <Text style={[styles.value, {color: '#d32f2f'}]}>-$500.00</Text>
            </View>
        </View>

        {/* --- GENERATE BUTTON --- */}
        <TouchableOpacity style={styles.generateBtn} onPress={() => navigation.navigate('PayslipScreen' as never)}>
            <Icon name="download-outline" size={20} color="#fff" />
            <Text style={styles.generateBtnText}>Generate Payslip</Text>
        </TouchableOpacity>

        {/* --- FOOTER INFO --- */}
        <View style={styles.footerContainer}>
             {/* Note: Blurred effect simulation or just grey text */}
             <View style={styles.row}>
                <Text style={styles.footerLabel}>Salary Paid</Text>
                <Text style={styles.footerValueFaded}>$4,500.00</Text>
             </View>
             
             <View style={[styles.divider, { marginVertical: 10 }]} />
             
             <View style={styles.row}>
                <Text style={styles.labelBlue}>Payment Mode</Text>
                <Text style={styles.value}>Bank Transfer</Text>
             </View>

             <View style={[styles.row, { marginTop: 15, alignItems: 'center' }]}>
                <Text style={styles.bigTotalLabel}>Remaining Balance</Text>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.bigTotalValue}>$0.00</Text>
                    <View style={styles.settledBadge}>
                        <Text style={styles.settledText}>SETTLED</Text>
                    </View>
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Salary Month</Text>
              <View style={styles.modalListContainer}>
                <FlatList
                  data={availableDates}
                  keyExtractor={(item) => item}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.modalItem, 
                        item === selectedDate && styles.modalItemSelected
                      ]}
                      onPress={() => handleSelectDate(item)}
                    >
                      <Text style={[
                        styles.modalItemText,
                        item === selectedDate && styles.modalItemTextSelected
                      ]}>{item}</Text>
                      {item === selectedDate && (
                        <Icon name="checkmark-circle" size={20} color="#2a568f" />
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
    backgroundColor: '#2089dc', // Solid Blue
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