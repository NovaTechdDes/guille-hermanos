import { Stock } from "@/src/actions/data.actions";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";

interface Props {
  item: Stock;
  isLast?: boolean;
}

export default function ListStockItem({ item, isLast }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Format ID to be shorter if it's too long
  const displayId =
    item.id_insumo?.toString().slice(0, 8).toUpperCase() || "N/A";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`bg-white dark:bg-neutral-800 p-5 flex-row items-center justify-between ${!isLast ? "border-b border-neutral-50 dark:border-neutral-700/50" : ""}`}
    >
      {/* Left side: Info */}
      <View className="flex-1 mr-4">
        <View className="bg-neutral-100 dark:bg-neutral-700 self-start px-2 py-0.5 rounded mb-1">
          <Text className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-tighter">
            ID-{displayId}
          </Text>
        </View>

        <Text className="text-lg font-bold text-neutral-800 dark:text-neutral-100 leading-tight mb-2">
          {item.nombre}
        </Text>

        <View className="flex-row items-center">
          <View className="bg-secondary/15 dark:bg-secondary/25 px-2 py-0.5 rounded">
            <Text className="text-[10px] font-black text-secondary uppercase tracking-widest">
              {item.unidad}
            </Text>
          </View>
        </View>
      </View>

      {/* Stock y Navegacion */}
      <View className="flex-row items-center gap-4">
        <View className="items-end">
          <Text className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-0.5">
            STOCK
          </Text>
          <Text className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {item.stock.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDark ? "#FFF" : "#000"}
        />
      </View>
    </TouchableOpacity>
  );
}
