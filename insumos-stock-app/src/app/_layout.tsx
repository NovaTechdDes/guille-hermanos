import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 items-stretch bg-gray-50 dark:bg-slate-950">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
