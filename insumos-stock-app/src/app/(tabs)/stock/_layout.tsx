import { useTheme } from '@/src/hooks';
import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function StockLayout() {
  const { usuario } = useUsuarioStore();
  const { isDark } = useTheme();

  const isAdmin = usuario?.rol === 'SUPERADMIN';
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
        },
        headerTintColor: isDark ? colors.dark.text : colors.light.text,
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 18,
          color: isDark ? colors.dark.text : colors.light.text,
        },
        headerShadowVisible: false,
        headerRight: () =>
          isAdmin ? (
            <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 15 }}>
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : null,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Inventario' }} />
      <Stack.Screen name="[insumoId]" options={{ title: 'Detalle de Insumo', headerBackTitle: 'Volver' }} />
    </Stack>
  );
}
