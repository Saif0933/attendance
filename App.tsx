// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import React from "react";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import Icon from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// // ✅ Fixed folder name here
// import PunchScreen from "./screen/PunchScreen";
// import { RequestScreen } from "./screen/RequestScreen";
// import SalaryScreen from "./screen/SalaryScreen";
// import SettingScreen from "./screen/SettingScreen";
// import { WorkScreen } from "./screen/WorkScreen";
// import YouScreen from "./screen/YouScreen";


// const Tab = createBottomTabNavigator();

// function getTabBarIcon(routeName: string, color: string, size: number) {
//   switch (routeName) {
//     case "Punch":
//       return <FontAwesome5 name="hand-paper" size={size} color={color} />;
//     case "Salary":
//       return <Icon name="cash-outline" size={size} color={color} />;
//     case "You":
//       return <Icon name="person-outline" size={size} color={color} />;
//     case "Work":
//       return <MaterialIcons name="work-outline" size={size} color={color} />;
//     case "Requests":
//       return <Icon name="document-text-outline" size={size} color={color} />;
//     case "Settings":
//       return <Icon name="settings-outline" size={size} color={color} />;
//     default:
//       return null;
//   }
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           tabBarActiveTintColor: "#007bff",
//           tabBarInactiveTintColor: "#999",
//           tabBarStyle: {
//             height: 60,
//             paddingBottom: 5,
//           },
//           tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
//         })}
//       >
//         <Tab.Screen name="Punch" component={PunchScreen} />
//         <Tab.Screen name="Salary" component={SalaryScreen} />
//         <Tab.Screen name="You" component={YouScreen} />
//         <Tab.Screen name="Requests" component={RequestScreen} />
//         <Tab.Screen name="Work" component={WorkScreen} />
//         <Tab.Screen name="Settings" component={SettingScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }


import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
