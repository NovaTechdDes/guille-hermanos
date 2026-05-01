import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import '../../global.css';
import { useAutoUpdate } from '../hooks/useAutoUpdate';

const queryClient = new QueryClient();

export default function RootLayout() {
  useAutoUpdate();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 items-stretch bg-gray-50 dark:bg-slate-950">
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
