
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import Stack from "./src/navigation/Stack";

export default function App() {
  return (
    <NavigationContainer>
      <Stack/>
    </NavigationContainer>
  );
}
