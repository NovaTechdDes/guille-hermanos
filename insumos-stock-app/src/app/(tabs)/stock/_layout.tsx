import { useTheme } from '@/src/hooks';
import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export default function StockLayout() {
  const { usuario } = useUsuarioStore();
  const { isDark } = useTheme();

  const isAdmin = usuario?.rol === 'superAdmin';
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
        },
        headerRight: () =>
          isAdmin ? (
            <Pressable
              onPress={() => router.push('/settings')} // Ruta a tu pantalla de config
              style={{ marginRight: 15 }}
            >
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
            </Pressable>
          ) : null,
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
