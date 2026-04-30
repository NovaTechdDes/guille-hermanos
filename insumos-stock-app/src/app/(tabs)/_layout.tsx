import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { usuario } = useUsuarioStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const isAdmin = usuario?.rol === 'SUPERADMIN';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
        },
        headerTintColor: isDark ? colors.dark.text : colors.light.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />,
        headerRight: () =>
          isAdmin ? (
            <TouchableOpacity
              onPress={() => router.push('/settings')} // Ruta a tu pantalla de config
              style={{ marginRight: 15 }}
            >
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : null,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
        tabBarStyle: {
          display: usuario?.rol === 'EMPLEADO' ? 'none' : 'flex',
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
          borderTopWidth: 1,
          borderTopColor: isDark ? colors.dark.border : colors.light.border,
          height: 67 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="create"
        options={{
          title: 'Ingreso',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="stock"
        options={{
          title: 'Inventario',
          headerShown: false,

          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="movimiento"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          href: null,
        }}
      />
    </Tabs>
  );
}
