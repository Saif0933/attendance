
import React from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../theme/ThemeContext";

const PaySlipsScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  return (
    // 3. Changed View to SafeAreaView
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>PaySlips</Text>

        <MaterialIcons name="receipt-long" size={22} color="#FFFFFF" />
      </View>

      {/* Body with Attractive Background Icon */}
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        {/* 4. Added attractive 'file-invoice-dollar' icon */}
        <FontAwesome5 
          name="file-invoice-dollar" 
          size={80} 
          color={isDark ? colors.surface : "#E0E0E0"} 
          style={{ opacity: isDark ? 0.3 : 1 }}
        />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No PaySlips Available</Text>
      </View>
    </SafeAreaView>
  );
};

export default PaySlipsScreen;

/* 🔥 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 56,
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
    // Added centering to display the icon properly
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Added style for the empty text to match the previous UI pattern
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
  }
});