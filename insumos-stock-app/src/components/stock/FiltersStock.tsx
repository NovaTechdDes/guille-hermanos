import { Stock } from "@/src/actions/data.actions";
import { useStockStore } from "@/src/store/useStockStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View, useColorScheme } from "react-native";
import Button from "../ui/Button";

interface Props {
  filteredStock: Stock[];
}

export default function FiltersStock({ filteredStock }: Props) {
  const { openModal, setBuscador, buscador } = useStockStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleAddInsumo = () => {
    openModal();
  };

  return (
    <View className="flex-row gap-3 items-center">
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
        className="flex-1 flex-row items-center bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/50 py-3 rounded-2xl px-4"
      >
        <Ionicons
          name="search"
          size={18}
          color={isDark ? "#9CA3AF" : "#9CA3AF"}
          className="mr-2"
        />
        <TextInput
          value={buscador}
          onChangeText={setBuscador}
          placeholder="Buscar por nombre..."
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          className="flex-1 text-neutral-800 dark:text-neutral-100 font-semibold text-sm h-10"
        />
      </View>

      <Button
        variant="primary"
        icon="add"
        onPress={handleAddInsumo}
        className="h-14 w-14 rounded-2xl m-0"
      />
    </View>
  );
}
