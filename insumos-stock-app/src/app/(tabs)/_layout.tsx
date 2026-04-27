import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="create"
        options={{
          title: "Crear",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            return <Ionicons name="add-circle" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: "Stock",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            return <Ionicons name="cube" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="movimiento"
        options={{
          title: "Movimiento",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            return <Ionicons name="arrow-up" size={24} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
