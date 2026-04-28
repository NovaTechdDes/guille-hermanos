import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  text?: string;
}

export default function Loading({ text = "Cargando..." }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-4 text-neutral-500 dark:text-neutral-400 font-bold tracking-tight">
        {text}
      </Text>
    </View>
  );
}
