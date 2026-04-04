
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import { useGetPublicHolidays } from "../../api/hook/holiday/useHoliday";
import { Holiday } from "../../api/hook/type/holiday";
import { useEmployeeAuthStore } from "../store/useEmployeeAuthStore";
import { useTheme } from "../theme/ThemeContext";

const HolidaysScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { company } = useEmployeeAuthStore();

  // Fetch Data - Using public hook for employees with their company ID
  const { data, isLoading, refetch } = useGetPublicHolidays(company?.id || "", {});
  const holidays = data?.holidays || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderHolidayItem = ({ item }: { item: Holiday }) => (
    <View style={[styles.holidayCard, { backgroundColor: colors.surface }]}>
      <View style={styles.holidayHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.holidayName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.holidayDate, { color: colors.textSecondary }]}>
            {new Date(item.date).toLocaleDateString("en-US", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>
      
      {item.description ? (
        <Text style={[styles.holidayDesc, { color: colors.textSecondary }]}>{item.description}</Text>
      ) : null}
      
      <View style={styles.badgeRow}>
        <View style={[styles.paidBadge, { backgroundColor: item.isPaid ? (isDark ? "#064E3B" : "#E8F5E9") : (isDark ? "#7F1D1D" : "#FFEBEE") }]}>
          <Text style={[styles.paidBadgeText, { color: item.isPaid ? (isDark ? "#6EE7B7" : "#2E7D32") : (isDark ? "#FCA5A5" : "#C62828") }]}>
            {item.isPaid ? "Paid Holiday" : "Unpaid Holiday"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Company Holidays</Text>

        {/* Spacer for layout balance */}
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.flexContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : holidays.length === 0 ? (
          <View style={styles.content}>
            <FontAwesome5
              name="umbrella-beach"
              size={80}
              color={isDark ? colors.surface : "#FFCCBC"}
              style={{ opacity: isDark ? 0.3 : 1 }}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No holidays found</Text>
          </View>
        ) : (
          <FlatList
            data={holidays}
            keyExtractor={(item) => item.id}
            renderItem={renderHolidayItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HolidaysScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 56,
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
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  holidayCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  holidayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  holidayName: {
    fontSize: 18,
    fontWeight: "700",
  },
  holidayDate: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "500",
  },
  holidayDesc: {
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  paidBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});