import { useTheme } from '@/src/hooks';
import { colors } from '@/src/theme/colors';
import { Stack } from 'expo-router';
import React from 'react';

export default function StockLayout() {
  const { isDark } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
        },
        headerTintColor: isDark ? colors.dark.text : colors.light.text,
        headerTitleStyle: {
          color: isDark ? colors.dark.text : colors.light.text,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Inventario' }} />
      <Stack.Screen name="[insumoId]" options={{ title: 'Detalle de Insumo', headerBackTitle: 'Volver' }} />
    </Stack>
  );
}
