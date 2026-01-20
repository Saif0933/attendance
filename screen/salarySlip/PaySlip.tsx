// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   StatusBar,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { ArrowLeft, Share2, Download } from "lucide-react-native";

// const PayslipScreen = () => {
//   // Dummy Handlers for Buttons
//   const handleBack = () => console.log("Back pressed");
//   const handleShare = () => Alert.alert("Share", "Sharing Payslip PDF...");
//   const handleDownload = () => Alert.alert("Download", "Downloading Payslip...");

//   return (
//     <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFC107" />

//       {/* --- HEADER (Yellow) --- */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
//             <ArrowLeft size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Payslip - Md. Saif</Text>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
//             <Share2 size={22} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleDownload} style={styles.iconBtn}>
//             <Download size={22} color="#000" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* --- SCROLLABLE CONTENT --- */}
//       <ScrollView 
//         style={styles.contentContainer} 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 40 }}
//       >
        
//         {/* Company & Date Header */}
//         <View style={styles.topMetaContainer}>
//           <Text style={styles.companyName}>Symbosys</Text>
//           <View style={{ alignItems: "flex-end" }}>
//             <Text style={styles.metaLabel}>Payslip For the Month</Text>
//             <Text style={styles.metaValue}>January 2026</Text>
//           </View>
//         </View>

//         {/* --- EMPLOYEE & ATTENDANCE SUMMARY CARDS --- */}
//         <View style={styles.summarySection}>
          
//           {/* Employee Summary Card */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>EMPLOYEE SUMMARY</Text>
//             <View style={styles.divider} />
            
//             <SummaryRow label="Employee Name" value="Md. Saif" />
//             <SummaryRow label="Designation" value="-" />
//             <SummaryRow label="Pay Period" value="January 2026" />
//             <SummaryRow label="Pay Cycle" value="From: 0 To: 0" />
//             <SummaryRow label="Pan No" value="TFQPS6514R" />
//           </View>

//           {/* Attendance Summary Card */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>ATTENDANCE SUMMARY</Text>
//             <View style={styles.divider} />

//             <SummaryRow label="Total Working Days" value="31.0" />
//             <SummaryRow label="Present Days" value="9.0" />
//             <SummaryRow label="Leave Days" value="0" />
//             <SummaryRow label="Absent Days" value="4.0" />
//             <SummaryRow label="Half Days" value="4.0" />
//             <SummaryRow label="Holidays" value="0.0" />
//             <SummaryRow label="Week Off Days" value="3" />
//             <SummaryRow label="Total Overtime Hours" value="0.00 hrs" />
//             <SummaryRow label="Total Payable Days" value="14.0" />
//           </View>

//         </View>

//         {/* --- EARNINGS & DEDUCTIONS --- */}
//         <View style={styles.financialSection}>
          
//           {/* Earnings Table */}
//           <View style={styles.financialCard}>
//             <Text style={styles.financialHeader}>EARNINGS</Text>
//             <View style={styles.tableHeader}>
//               <Text style={styles.th}>Particular</Text>
//               <Text style={[styles.th, { textAlign: 'right' }]}>Amount</Text>
//             </View>
//             <View style={styles.divider} />
            
//             <View style={styles.tableRow}>
//               <Text style={styles.td}>Regular Earning</Text>
//               <Text style={styles.tdValue}>Rs. 4,516.13</Text>
//             </View>

//             {/* Spacer to push Gross to bottom if needed */}
//             <View style={{ height: 20 }} />

//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Gross Earnings:</Text>
//               <Text style={styles.totalValue}>Rs. 4,516.13</Text>
//             </View>
//           </View>

//           {/* Deductions Table */}
//           <View style={styles.financialCard}>
//             <Text style={styles.financialHeader}>DEDUCTIONS</Text>
//             <View style={styles.tableHeader}>
//               <Text style={styles.th}>Particular</Text>
//               <Text style={[styles.th, { textAlign: 'right' }]}>Amount</Text>
//             </View>
//             <View style={styles.divider} />

//             {/* Empty Row space to match height */}
//             <View style={{ height: 40 }} />

//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Total Deductions:</Text>
//               <Text style={styles.totalValue}>Rs. 0.00</Text>
//             </View>
//           </View>

//         </View>

//         {/* --- NET AMOUNT BANNER --- */}
//         <View style={styles.netAmountContainer}>
//           <View>
//             <Text style={styles.netAmountLabel}>NET AMOUNT DUE:</Text>
//             <Text style={styles.netAmountSub}>Gross Earnings - Total Deductions</Text>
//           </View>
//           <Text style={styles.netAmountValue}>Rs. 4,516.13</Text>
//         </View>

//         {/* --- AMOUNT IN WORDS --- */}
//         <Text style={styles.amountInWords}>
//           <Text style={{ fontWeight: 'bold' }}>Amount In Words: </Text>
//           Four Thousand Five Hundred Sixteen and Thirteen Paise only
//         </Text>

//         <View style={styles.footerDivider} />

//         {/* --- FOOTER --- */}
//         <Text style={styles.footerText}>
//           -- This document has been automatically generated by AppnaRutine Payroll --
//         </Text>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // Reusable Row Component for Summaries
// const SummaryRow = ({ label, value }: { label: string; value: string }) => (
//   <View style={styles.summaryRow}>
//     <Text style={styles.summaryLabel}>{label}</Text>
//     <Text style={styles.summaryColon}>:</Text>
//     <Text style={styles.summaryValue}>{value}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   /* HEADER */
//   header: {
//     flexDirection: "row",
//     backgroundColor: "#FFC107", // The yellow color from image
//     height: 60,
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//     elevation: 4,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerRight: {
//     flexDirection: "row",
//     gap: 15,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginLeft: 15,
//   },
//   iconBtn: {
//     padding: 5,
//   },

//   /* CONTENT */
//   contentContainer: {
//     padding: 15,
//   },
//   topMetaContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   metaLabel: {
//     fontSize: 10,
//     color: "#666",
//   },
//   metaValue: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   /* CARDS */
//   summarySection: {
//     gap: 15,
//     marginBottom: 20,
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#fff",
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 8,
//     textTransform: "uppercase",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#DDD",
//     marginBottom: 8,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     flex: 0.5,
//     fontSize: 12,
//     color: "#444",
//   },
//   summaryColon: {
//     width: 10,
//     fontSize: 12,
//     color: "#444",
//   },
//   summaryValue: {
//     flex: 0.5,
//     fontSize: 12,
//     color: "#000",
//   },

//   /* EARNINGS & DEDUCTIONS */
//   financialSection: {
//     flexDirection: "column", // Stacked on mobile usually, or side-by-side on tablet
//     gap: 15,
//     marginBottom: 20,
//   },
//   financialCard: {
//     // borderTopWidth: 1,
//     // borderColor: "#DDD",
//   },
//   financialHeader: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 5,
//     textTransform: "uppercase",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },
//   th: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   tableRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   td: {
//     fontSize: 12,
//     color: "#333",
//   },
//   tdValue: {
//     fontSize: 12,
//     color: "#333",
//     fontWeight: "500",
//   },
  
//   /* TOTAL ROWS (Yellow Highlight) */
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#FFF8E1", // Light Yellow Background
//     padding: 10,
//     borderRadius: 4,
//     marginTop: 5,
//   },
//   totalLabel: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   totalValue: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   /* NET AMOUNT */
//   netAmountContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#FFF8E1", // Light Yellow
//     borderWidth: 1,
//     borderColor: "#FFE082",
//     padding: 15,
//     borderRadius: 6,
//     marginBottom: 20,
//   },
//   netAmountLabel: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   netAmountSub: {
//     fontSize: 10,
//     color: "#666",
//     marginTop: 2,
//   },
//   netAmountValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   /* FOOTER */
//   amountInWords: {
//     fontSize: 12,
//     color: "#000",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   footerDivider: {
//     height: 1,
//     backgroundColor: "#EEE",
//     marginBottom: 20,
//   },
//   footerText: {
//     fontSize: 10,
//     color: "#888",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
// });

// export default PayslipScreen;



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Share,          // Share feature ke liye
  Platform,
  ToastAndroid    // Android pe toast dikhane ke liye
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Share2, Download } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native"; // Navigation ke liye

const PayslipScreen = () => {
  const navigation = useNavigation(); // Hook to access navigation

  // --- 1. REAL BACK FUNCTION ---
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack(); // Pichle screen pe le jayega
    } else {
      // Agar piche koi screen nahi hai to app close confirm karega
      Alert.alert("Exit", "Do you want to exit?", [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => console.log("Exit App") } // BackHandler.exitApp() use kar sakte hain
      ]);
    }
  };

  // --- 2. REAL SHARE FUNCTION ---
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Here is the Payslip for Md. Saif - January 2026.\n\nNet Amount: Rs. 4,516.13",
        title: "Payslip Share",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share file.");
    }
  };

  // --- 3. DOWNLOAD SIMULATION ---
  const handleDownload = () => {
    // Asli download ke liye Backend URL chahiye hota hai.
    // Hum yahan user ko feel dene ke liye 'Downloading' simulate karenge.
    
    if (Platform.OS === 'android') {
      ToastAndroid.show("Downloading Payslip...", ToastAndroid.SHORT);
    } else {
      Alert.alert("Downloading...", "Please wait.");
    }

    // 2 second baad success dikhayenge
    setTimeout(() => {
      Alert.alert("Download Complete", "Payslip_Jan_2026.pdf has been saved to your Downloads folder.");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFC107" />

      {/* --- HEADER (Yellow) --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payslip - Md. Saif</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Share2 size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload} style={styles.iconBtn}>
            <Download size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- SCROLLABLE CONTENT --- */}
      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        
        {/* Company & Date Header */}
        <View style={styles.topMetaContainer}>
          <Text style={styles.companyName}>Symbosys</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.metaLabel}>Payslip For the Month</Text>
            <Text style={styles.metaValue}>January 2026</Text>
          </View>
        </View>

        {/* --- EMPLOYEE & ATTENDANCE SUMMARY CARDS --- */}
        <View style={styles.summarySection}>
          
          {/* Employee Summary Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>EMPLOYEE SUMMARY</Text>
            <View style={styles.divider} />
            
            <SummaryRow label="Employee Name" value="Md. Saif" />
            <SummaryRow label="Designation" value="-" />
            <SummaryRow label="Pay Period" value="January 2026" />
            <SummaryRow label="Pay Cycle" value="From: 0 To: 0" />
            <SummaryRow label="Pan No" value="TFQPS6514R" />
          </View>

          {/* Attendance Summary Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ATTENDANCE SUMMARY</Text>
            <View style={styles.divider} />

            <SummaryRow label="Total Working Days" value="31.0" />
            <SummaryRow label="Present Days" value="9.0" />
            <SummaryRow label="Leave Days" value="0" />
            <SummaryRow label="Absent Days" value="4.0" />
            <SummaryRow label="Half Days" value="4.0" />
            <SummaryRow label="Holidays" value="0.0" />
            <SummaryRow label="Week Off Days" value="3" />
            <SummaryRow label="Total Overtime Hours" value="0.00 hrs" />
            <SummaryRow label="Total Payable Days" value="14.0" />
          </View>

        </View>

        {/* --- EARNINGS & DEDUCTIONS --- */}
        <View style={styles.financialSection}>
          
          {/* Earnings Table */}
          <View style={styles.financialCard}>
            <Text style={styles.financialHeader}>EARNINGS</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.th}>Particular</Text>
              <Text style={[styles.th, { textAlign: 'right' }]}>Amount</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.tableRow}>
              <Text style={styles.td}>Regular Earning</Text>
              <Text style={styles.tdValue}>Rs. 4,516.13</Text>
            </View>

            <View style={{ height: 20 }} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Gross Earnings:</Text>
              <Text style={styles.totalValue}>Rs. 4,516.13</Text>
            </View>
          </View>

          {/* Deductions Table */}
          <View style={styles.financialCard}>
            <Text style={styles.financialHeader}>DEDUCTIONS</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.th}>Particular</Text>
              <Text style={[styles.th, { textAlign: 'right' }]}>Amount</Text>
            </View>
            <View style={styles.divider} />

            <View style={{ height: 40 }} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Deductions:</Text>
              <Text style={styles.totalValue}>Rs. 0.00</Text>
            </View>
          </View>

        </View>

        {/* --- NET AMOUNT BANNER --- */}
        <View style={styles.netAmountContainer}>
          <View>
            <Text style={styles.netAmountLabel}>NET AMOUNT DUE:</Text>
            <Text style={styles.netAmountSub}>Gross Earnings - Total Deductions</Text>
          </View>
          <Text style={styles.netAmountValue}>Rs. 4,516.13</Text>
        </View>

        {/* --- AMOUNT IN WORDS --- */}
        <Text style={styles.amountInWords}>
          <Text style={{ fontWeight: 'bold' }}>Amount In Words: </Text>
          Four Thousand Five Hundred Sixteen and Thirteen Paise only
        </Text>

        <View style={styles.footerDivider} />

        {/* --- FOOTER --- */}
        <Text style={styles.footerText}>
          -- This document has been automatically generated by Hisaab Payroll --
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Row Component
const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryColon}>:</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    backgroundColor: "#FFC107",
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", gap: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000", marginLeft: 15 },
  iconBtn: { padding: 5 },
  contentContainer: { padding: 15 },
  topMetaContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, marginTop: 10 },
  companyName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  metaLabel: { fontSize: 10, color: "#666" },
  metaValue: { fontSize: 14, fontWeight: "bold", color: "#000" },
  summarySection: { gap: 15, marginBottom: 20 },
  card: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, backgroundColor: "#fff" },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#000", marginBottom: 8, textTransform: "uppercase" },
  divider: { height: 1, backgroundColor: "#DDD", marginBottom: 8 },
  summaryRow: { flexDirection: "row", marginBottom: 4 },
  summaryLabel: { flex: 0.5, fontSize: 12, color: "#444" },
  summaryColon: { width: 10, fontSize: 12, color: "#444" },
  summaryValue: { flex: 0.5, fontSize: 12, color: "#000" },
  financialSection: { flexDirection: "column", gap: 15, marginBottom: 20 },
  financialCard: {},
  financialHeader: { fontSize: 14, fontWeight: "bold", color: "#000", marginBottom: 5, textTransform: "uppercase" },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  th: { fontSize: 12, fontWeight: "bold", color: "#000" },
  tableRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  td: { fontSize: 12, color: "#333" },
  tdValue: { fontSize: 12, color: "#333", fontWeight: "500" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFF8E1", padding: 10, borderRadius: 4, marginTop: 5 },
  totalLabel: { fontSize: 12, fontWeight: "bold", color: "#000" },
  totalValue: { fontSize: 12, fontWeight: "bold", color: "#000" },
  netAmountContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF8E1", borderWidth: 1, borderColor: "#FFE082", padding: 15, borderRadius: 6, marginBottom: 20 },
  netAmountLabel: { fontSize: 14, fontWeight: "bold", color: "#000" },
  netAmountSub: { fontSize: 10, color: "#666", marginTop: 2 },
  netAmountValue: { fontSize: 18, fontWeight: "bold", color: "#000" },
  amountInWords: { fontSize: 12, color: "#000", textAlign: "center", marginBottom: 20 },
  footerDivider: { height: 1, backgroundColor: "#EEE", marginBottom: 20 },
  footerText: { fontSize: 10, color: "#888", textAlign: "center", fontStyle: "italic" },
});

export default PayslipScreen;