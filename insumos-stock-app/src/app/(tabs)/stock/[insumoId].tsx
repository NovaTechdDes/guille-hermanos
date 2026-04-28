import { useInsumoById } from "@/src/hooks/insumo/useInsumo";
import { useUsuarioStore } from "@/src/store/useUsuarioStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function InsumoIdScreen() {
  const { insumoId } = useLocalSearchParams();
  const { data, isLoading, error } = useInsumoById(insumoId as string);
  const { usuario } = useUsuarioStore();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F9FA]">
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F9FA]">
        <Text>Error al cargar el insumo</Text>
      </View>
    );
  }

  if (!data) return null;

  const { nombre, unidad, stock_global, stock_por_bodega } = data;

  const unidadParseada =
    unidad === "KG" ? "Kilogramos" : unidad === "LT" ? "Litros" : "Unidades";
  const unidadCorta = unidad === "KG" ? "kg" : unidad === "LT" ? "L" : "ud";

  const handleRouterMov = () => {
    console.log("Ver movimientos");
  };

  const handleEditar = () => {
    console.log("Editar");
  };

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-4">
      {/* Top Card */}
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-neutral-100">
        <Text className="text-[#F97316] text-xs font-bold uppercase tracking-wider mb-1">
          Insumo Seleccionado
        </Text>
        <Text className="text-2xl font-black text-neutral-800 mb-4">
          {nombre}
        </Text>

        <View className="flex-row items-center mb-4">
          <View className="bg-[#FFF1E6] px-3 py-1.5 rounded-full flex-row items-center">
            <Text className="text-[#F97316] font-bold text-sm">
              Stock Total: {stock_global.toLocaleString("es-AR")}{" "}
              {unidadParseada}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-6">
          <MaterialCommunityIcons
            name="scale-balance"
            size={20}
            color="#6B7280"
          />
          <Text className="text-neutral-500 font-medium ml-2">
            Unidad: {unidadParseada}
          </Text>
        </View>

        <View className="flex-row justify-between w-full">
          <TouchableOpacity
            onPress={handleRouterMov}
            className="bg-[#F97316] py-3 rounded-xl flex-row justify-center items-center flex-1 mr-2"
          >
            <MaterialCommunityIcons name="history" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Ver Movimientos</Text>
          </TouchableOpacity>
          {usuario?.rol === "superAdmin" && (
            <TouchableOpacity
              onPress={handleEditar}
              className="bg-white py-3 rounded-xl flex-row justify-center items-center flex-1 ml-2 border border-neutral-200"
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#374151" />
              <Text className="text-neutral-700 font-bold ml-2">Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom Card: Desglose */}
      <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-neutral-100">
        <View className="flex-row items-center mb-4">
          <MaterialCommunityIcons name="warehouse" size={22} color="#374151" />
          <Text className="text-neutral-800 font-black text-base ml-2 uppercase tracking-wide">
            Desglose por Bodega
          </Text>
        </View>

        {/* Filters/Chips */}
        <View className="flex-row mb-5">
          <View className="bg-[#FFF1E6] px-4 py-2 rounded-full border border-[#F97316]">
            <Text className="text-[#F97316] font-bold text-sm">
              Todas las Bodegas
            </Text>
          </View>
        </View>

        {/* Table Header */}
        <View className="flex-row justify-between mb-3 px-2">
          <Text className="text-neutral-400 font-bold text-xs w-1/2">
            UBICACIÓN / BODEGA
          </Text>
          <Text className="text-neutral-400 font-bold text-xs w-1/4 text-center">
            CANTIDAD
          </Text>
          <Text className="text-neutral-400 font-bold text-xs w-1/4 text-right">
            ACCIÓN
          </Text>
        </View>

        {/* Table Rows */}
        <View>
          {stock_por_bodega.map((bodega, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row justify-between items-center py-4 px-2 ${
                index !== stock_por_bodega.length - 1
                  ? "border-b border-neutral-100"
                  : ""
              }`}
            >
              <View className="w-1/2">
                <Text className="text-neutral-800 font-bold text-base">
                  {bodega.bodega_nombre}
                </Text>
              </View>
              <View className="w-1/4 items-center">
                <Text className="text-neutral-800 font-bold text-base">
                  {bodega.stock.toLocaleString("es-AR")} {unidadCorta}
                </Text>
              </View>
              <View className="w-1/4 items-end justify-center">
                <Ionicons name="chevron-forward" size={20} color="#F97316" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
