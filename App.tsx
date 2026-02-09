
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


import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import Stack from "./src/navigation/Stack";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // ✅ correct for v5
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
