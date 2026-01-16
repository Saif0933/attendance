
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
// 2. Imported FontAwesome5 for better icons
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; 
import { SafeAreaView } from "react-native-safe-area-context";

const HolidaysScreen = ({ navigation }: any) => {
  return (
    // 3. Changed View to SafeAreaView
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8A3D" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Holidays</Text>

        {/* spacer */}
        <View style={{ width: 24 }} />
      </View>

      {/* Empty state */}
      <View style={styles.content}>
        {/* 4. Used 'umbrella-beach' icon which is more attractive for Holidays */}
        <FontAwesome5
          name="umbrella-beach"
          size={80} // Slightly increased size for better look
          color="#FFCCBC" // Using a softer, lighter shade of the theme color for a nicer watermark look
        />
        <Text style={styles.emptyText}>No holidays found</Text>
      </View>
    </SafeAreaView>
  );
};

export default HolidaysScreen;

/* 🔥 STYLES MUST BE DEFINED AFTER COMPONENT 🔥 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },

  header: {
    height: 56,
    backgroundColor: "#FF8A3D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "500",
  },
});