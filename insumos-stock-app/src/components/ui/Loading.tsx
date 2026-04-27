import React from "react";
import { Text, View } from "react-native";
interface Props {
  text: string;
}

export default function Loading({ text }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <Text className="text-lg font-bold text-black dark:text-white">
        Cargando...
      </Text>
    </View>
  );
}
