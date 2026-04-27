import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";
import Button from "../ui/Button";

export default function FiltersStock() {
  const handleAddInsumo = () => {};

  return (
    <View className="flex-row gap-4 items-center">
      <View className="flex-1 flex-row gap-2 border items-center border-neutral-700 py-2 rounded-xl px-3 bg-white">
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput placeholder="Buscar por nombre" className="flex-1" />
      </View>
      <Button
        variant="primary"
        icon="add"
        onPress={handleAddInsumo}
        className="py-3 px-3 m-0"
      />
    </View>
  );
}
