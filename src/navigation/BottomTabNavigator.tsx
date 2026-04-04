
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";

// Screens
import PunchScreen from "../../screen/PunchScreen";
import { RequestScreen } from "../../screen/RequestScreen";
import SalaryScreen from "../../screen/SalaryScreen";
import SettingScreen from "../../screen/SettingScreen";
import { WorkScreen } from "../../screen/WorkScreen";
import YouScreen from "../../screen/YouScreen";
// import SalaryStackNavigator from "./SalaryStackNavigator";
// import SettingsStackNavigator from "../navigation/SettingsStackNavigator";


const Tab = createBottomTabNavigator();

function getTabBarIcon(routeName: string, color: string, size: number) {
  switch (routeName) {
    case "Punch":
      return <Icon name="finger-print-outline" size={size} color={color} />;
    case "Salary":
      return <Icon name="wallet-outline" size={size} color={color} />;
    case "You":
      return <Icon name="person-circle-outline" size={size} color={color} />;
    case "Work":
      return <Icon name="briefcase-outline" size={size} color={color} />;
    case "Requests":
      return <Icon name="reader-outline" size={size} color={color} />;
    case "Settings":
      return <Icon name="settings-outline" size={size} color={color} />;
    default:
      return null;
  }
}

export default function BottomTabNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? "#94A3B8" : "#999",
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) =>
          getTabBarIcon(route.name, color, size),
      })}
    >
      <Tab.Screen name="Punch" component={PunchScreen} />
      <Tab.Screen name="Salary" component={SalaryScreen} />
      <Tab.Screen name="You" component={YouScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />
      <Tab.Screen name="Work" component={WorkScreen} />
      {/* <Tab.Screen name="Settings" component={SettingsStackNavigator} /> */}
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}