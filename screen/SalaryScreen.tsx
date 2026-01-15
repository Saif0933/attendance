// import React from 'react';
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const SalaryScreen: React.FC = () => {
//   return (
//     <View style={styles.container}>
//   <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header Section */}
//         <View style={styles.header}>
//           <Image
//             source={require('../src/assets/profile.jpg')} // Replace with your local image
//             style={styles.profileImage}
//           />
//           <Text style={styles.name}>Md. Saif</Text>
//           <Text style={styles.role}>Employee</Text>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>Full Stack Developer</Text>
//           </View>
//         </View>

//         {/* Salary Period */}
//         <View style={styles.salaryFor}>
//           <Text style={styles.salaryForText}>Salary For</Text>
//           <TouchableOpacity style={styles.datePicker}>
//             <Icon name="calendar-outline" size={18} color="#000" />
//             <Text style={styles.dateText}>Oct 2025</Text>
//           </TouchableOpacity>
//         </View>

//         {/* EARNINGS */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>EARNINGS</Text>
//           <View style={styles.row}>
//             <Text style={styles.label}>CTC</Text>
//             <Text style={styles.value}>₹ 10,000.00</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Daily Rate</Text>
//             <Text style={styles.value}>₹ 322.58</Text>
//           </View>
//         </View>

//         {/* ATTENDANCE */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>ATTENDANCE</Text>
//           <View style={styles.row}>
//             <Text style={styles.label}>Total Days</Text>
//             <Text style={styles.value}>26 days</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Payable Days</Text>
//             <Text style={styles.value}>20 days</Text>
//           </View>
//         </View>

//         {/* DEDUCTIONS */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>DEDUCTIONS</Text>
//           <View style={styles.row}>
//             <Text style={[styles.label, styles.redText]}>Absent Days Deduction</Text>
//             <Text style={[styles.value, styles.redText]}>₹ 1,935.48</Text>
//           </View>
//         </View>

//         {/* SALARY PAYMENTS MADE */}
//         <View style={styles.section}>
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
//         </View>

//         {/* Generate Payslip Button */}
//         <TouchableOpacity style={styles.generateBtn}>
//           <MaterialIcons name="receipt-long" size={20} color="#000" />
//           <Text style={styles.generateBtnText}>Generate Payslip</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// export default SalaryScreen;

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingBottom: 100,
//   },
//   redText: {
//     color: 'red',
//   },
//   yellowText: {
//     color: '#F9A825',
//   },
//   rowMarginTop: {
//     marginTop: 10,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#f6f7fb',
//   },
//   header: {
//     alignItems: 'center',
//     backgroundColor: '#2a568f',
//     paddingVertical: 25,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 2,
//     borderColor: '#fff',
//     marginBottom: 10,
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
//   salaryFor: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginTop: 15,
//   },
//   salaryForText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#222',
//   },
//   datePicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     elevation: 1,
//   },
//   dateText: {
//     marginLeft: 6,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   section: {
//     backgroundColor: '#fff',
//     marginHorizontal: 15,
//     marginTop: 15,
//     borderRadius: 12,
//     padding: 15,
//     elevation: 1,
//   },
//   sectionTitle: {
//     fontSize: 13,
//     color: '#888',
//     fontWeight: '700',
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
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
//   },
//   generateBtn: {
//     backgroundColor: '#FFD54F',
//     marginHorizontal: 20,
//     marginVertical: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderRadius: 10,
//   },
//   generateBtnText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });



import React, { useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height } = Dimensions.get('window');

const SalaryScreen: React.FC = () => {
  // Animation Value: Starts from bottom (300px down)
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Run animation on mount
    Animated.timing(slideAnim, {
      toValue: 0, // Slide up to original position
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerContent}>
          <Image
            source={require('../src/assets/profile.jpg')} // Replace with your local image
            style={styles.profileImage}
          />
          <Text style={styles.name}>Md. Saif</Text>
          <Text style={styles.role}>Employee</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Full Stack Developer</Text>
          </View>
        </View>

        {/* Salary Period Selector */}
        <View style={styles.salaryForContainer}>
          <Text style={styles.salaryForText}>Salary For</Text>
          <TouchableOpacity style={styles.datePicker}>
            <Icon name="calendar-outline" size={18} color="#000" />
            <Text style={styles.dateText}>Oct 2025</Text>
          </TouchableOpacity>
        </View>

        {/* ONE SINGLE ANIMATED SHEET CARD */}
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* EARNINGS SECTION */}
          <Text style={styles.sectionTitle}>EARNINGS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>CTC</Text>
            <Text style={styles.value}>₹ 10,000.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Daily Rate</Text>
            <Text style={styles.value}>₹ 322.58</Text>
          </View>

          <View style={styles.divider} />

          {/* ATTENDANCE SECTION */}
          <Text style={styles.sectionTitle}>ATTENDANCE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Days</Text>
            <Text style={styles.value}>26 days</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payable Days</Text>
            <Text style={styles.value}>20 days</Text>
          </View>

          <View style={styles.divider} />

          {/* DEDUCTIONS SECTION */}
          <Text style={styles.sectionTitle}>DEDUCTIONS</Text>
          <View style={styles.row}>
            <Text style={[styles.label, styles.redText]}>Absent Days Deduction</Text>
            <Text style={[styles.value, styles.redText]}>₹ 1,935.48</Text>
          </View>

          <View style={styles.divider} />

          {/* SALARY PAYMENTS MADE SECTION */}
          <Text style={styles.sectionTitle}>SALARY PAYMENTS MADE</Text>
          <View style={styles.rowColumn}>
            <View>
              <Text style={styles.label}>Regular Earnings</Text>
              <Text style={styles.subText}>15.5 days × ₹ 322.58/day</Text>
              <Text style={styles.subText}>6 absent days, 9 half days</Text>
            </View>
            <Text style={styles.value}>₹ 5,000.00</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payments Made</Text>
            <Text style={styles.value}>₹ 0.00</Text>
          </View>

          <View style={[styles.row, styles.rowMarginTop]}>
            <Text style={styles.label}>Remaining Balance</Text>
            <Text style={[styles.value, styles.yellowText]}>₹ 5,000.00</Text>
          </View>
          <Text style={styles.subText}>Outstanding amount</Text>

          {/* Generate Payslip Button (Inside the sheet) */}
          <TouchableOpacity style={styles.generateBtn}>
            <MaterialIcons name="receipt-long" size={20} color="#000" />
            <Text style={styles.generateBtnText}>Generate Payslip</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default SalaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfbff', // Match header color for top background
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#2a568f',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
    marginTop: 20,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  role: {
    color: '#fff',
    opacity: 0.8,
  },
  badge: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  salaryForContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15, // Space before the sheet starts
  },
  salaryForText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff', // Changed to white to sit on blue background
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  // THE MAIN SHEET STYLE
  sheetContainer: {
    backgroundColor: '#fff',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
    minHeight: height * 0.7, // Takes up at least 70% of screen
    // elevation: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 5,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  subText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  redText: {
    color: '#D32F2F',
  },
  yellowText: {
    color: '#F9A825',
  },
  rowMarginTop: {
    marginTop: 10,
  },
  generateBtn: {
    backgroundColor: '#FFD54F',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
});