// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
// } from "react-native";

// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// const PaySlipsScreen = ({ navigation }: any) => {
//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#000000" barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>PaySlips</Text>

//         <MaterialIcons name="receipt-long" size={22} color="#FFFFFF" />
//       </View>

//       {/* Empty Body */}
//       <View style={styles.content} />
//     </View>
//   );
// };

// export default PaySlipsScreen;

// /* 🔥 Styles */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F6F8",
//   },

//   header: {
//     height: 56,
//     backgroundColor: "#000000",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     justifyContent: "space-between",
//   },

//   headerTitle: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "600",
//   },

//   content: {
//     flex: 1,
//     backgroundColor: "#F5F6F8",
//   },
// });



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// 2. Imported FontAwesome5 for a more attractive icon
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; 
import { SafeAreaView } from "react-native-safe-area-context";

const PaySlipsScreen = ({ navigation }: any) => {
  return (
    // 3. Changed View to SafeAreaView
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>PaySlips</Text>

        <MaterialIcons name="receipt-long" size={22} color="#FFFFFF" />
      </View>

      {/* Body with Attractive Background Icon */}
      <View style={styles.content}>
        {/* 4. Added attractive 'file-invoice-dollar' icon */}
        <FontAwesome5 
          name="file-invoice-dollar" 
          size={80} 
          color="#E0E0E0" // Light grey for a subtle background look
        />
        <Text style={styles.emptyText}>No PaySlips Available</Text>
      </View>
    </SafeAreaView>
  );
};

export default PaySlipsScreen;

/* 🔥 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },

  header: {
    height: 56,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    // Added centering to display the icon properly
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Added style for the empty text to match the previous UI pattern
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "500",
  }
});