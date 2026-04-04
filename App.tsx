
// import { NavigationContainer } from "@react-navigation/native";
// import React from "react";
// import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
// import Stack from "./src/navigation/Stack";


// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack/>
//     </NavigationContainer>
//   );
// }


import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { StatusBar } from "react-native";
import Stack from "./src/navigation/Stack";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // ✅ correct for v5
    },
  },
});

const AppContent = () => {
  const { isDark, colors } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
