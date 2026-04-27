import { Stock } from "@/src/actions/data.actions";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Stock;
}

export default function ListStockItem({ item }: Props) {
  return (
    <TouchableOpacity className="bg-white p-4 rounded-xl mb-4 flex-row items-center justify-between">
      {/* Nombre y unidad */}
      <View className="w-[60%]">
        <Text className="font-semibold capitalize">{item.nombre}</Text>
        <View className="items-start mt-1">
          <Text className="bg-secondary/20 text-secondary border border-secondary/30 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider overflow-hidden">
            {item.unidad}
          </Text>
        </View>
      </View>

      {/* Stock */}
      <View className="flex items-center gap-2">
        <Text className="text-gray-400">Stock:</Text>
        <Text className="font-semibold">{item.stock.toFixed(2)}</Text>
      </View>

      {/* Navegacion */}
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </TouchableOpacity>
  );
}
