
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import React from "react";
// import Icon from "react-native-vector-icons/Ionicons";
// import { AdminWork } from "../screen/AdminWork";
// import AllRequestsScreen from "../screen/AllRequestsScreen";
// import AdminSettingScreen from "../screen/setting/AdminSettingScreen";
// import StaffHomeScreen from "../screen/staff/StaffHomeScreen";
// import AdminHomeScreen from "../screen/homeScreen/AdminHomeScreen";


// const Tab = createBottomTabNavigator();

// function getTabBarIcon(routeName: string, color: string, size: number) {
//   switch (routeName) {
//     case "Map":
//       return <Icon name="map-outline" size={size} color={color} />;
//     case "Staff":
//       return <Icon name="person-outline" size={size} color={color} />;
//     case "Work":
//       return <Icon name="briefcase-outline" size={size} color={color} />;
//     case "Leave":
//     //   return <Icon name="briefcase-outline" size={size} color={color} />;
//     // case "Requests":
//       return <Icon name="reader-outline" size={size} color={color} />;
//     case "Settings":
//       return <Icon name="settings-outline" size={size} color={color} />;
//     default:
//       return null;
//   }
// }

// export default function BottomTabNavigation() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: "#007bff",
//         tabBarInactiveTintColor: "#999",
//         tabBarStyle: {
//           height: 60,
//           paddingBottom: 5,
//         },
//         tabBarIcon: ({ color, size }) =>
//           getTabBarIcon(route.name, color, size),
//       })}
//     >
//       <Tab.Screen name="Map" component={AdminHomeScreen} />
//       <Tab.Screen name="Staff" component={StaffHomeScreen} />
//       <Tab.Screen name="Work" component={AdminWork} />
//       <Tab.Screen name="Leave" component={AllRequestsScreen} />
//       {/* <Tab.Screen name="Settings" component={SettingsStackNavigator} /> */}
//       <Tab.Screen name="Settings" component={AdminSettingScreen} />
//     </Tab.Navigator>
//   );
// }



import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../src/theme/ThemeContext";
import { AdminWork } from "../screen/AdminWork";
import AllRequestsScreen from "../screen/AllRequestsScreen";
import AdminHomeScreen from "../screen/homeScreen/AdminHomeScreen";
import AdminSettingScreen from "../screen/setting/AdminSettingScreen";
import StaffHomeScreen from "../screen/staff/StaffHomeScreen";


const Tab = createBottomTabNavigator();

function getTabBarIcon(routeName: string, color: string, size: number) {
  switch (routeName) {
    case "Map":
      return <Icon name="map-outline" size={size} color={color} />;
    case "Staff":
      return <Icon name="person-outline" size={size} color={color} />;
    case "Work":
      return <Icon name="briefcase-outline" size={size} color={color} />;
    case "Leave":
    //   return <Icon name="briefcase-outline" size={size} color={color} />;
    // case "Requests":
      return <Icon name="reader-outline" size={size} color={color} />;
    case "Settings":
      return <Icon name="settings-outline" size={size} color={color} />;
    default:
      return null;
  }
}

export default function BottomTabNavigation() {
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
          borderTopWidth: 1,
        },
        tabBarIcon: ({ color, size }) =>
          getTabBarIcon(route.name, color, size),
      })}
    >
      <Tab.Screen name="Map" component={AdminHomeScreen} />
      <Tab.Screen name="Staff" component={StaffHomeScreen} />
      <Tab.Screen name="Work" component={AdminWork} />
      <Tab.Screen name="Leave" component={AllRequestsScreen} />
      {/* <Tab.Screen name="Settings" component={SettingsStackNavigator} /> */}
      <Tab.Screen name="Settings" component={AdminSettingScreen} />
    </Tab.Navigator>
  );
}