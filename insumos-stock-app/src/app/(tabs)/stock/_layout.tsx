import { Stack } from "expo-router";
import React from "react";

export default function StockLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[insumoId]" options={{ headerShown: false }} />
    </Stack>
  );
}
