import { useInsumoById } from '@/src/hooks/insumo/useInsumo';
import { useStockStore } from '@/src/store/useStockStore';
import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function InsumoIdScreen() {
  const colorScheme = useColorScheme();
  const { insumoId } = useLocalSearchParams();
  const { openModal, setInsumoSeleccionado } = useStockStore();
  const { data, isLoading, error } = useInsumoById(insumoId as string);
  const { usuario } = useUsuarioStore();

  const isDark = colorScheme === 'dark';

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-950">
        <Text className="dark:text-neutral-100">Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-950">
        <Text className="dark:text-neutral-100">Error al cargar el insumo</Text>
      </View>
    );
  }

  if (!data) return null;

  const { nombre, unidad, stock_global, stock_por_bodega } = data;

  const unidadParseada = unidad === 'KG' ? 'Kilogramos' : unidad === 'L' ? 'Litros' : 'Unidades';
  const unidadCorta = unidad === 'KG' ? 'kg' : unidad === 'L' ? 'L' : 'UN';

  const handleRouterMov = () => {
    router.push({ pathname: '/(tabs)/movimiento', params: { insumoId: insumoId as string } });
  };

  const handleEditar = () => {
    setInsumoSeleccionado(data);
    openModal();
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-950 p-4">
      {/* Top Card */}
      <View className="bg-white dark:bg-neutral-900 rounded-2xl p-5 mb-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
        <Text className="text-[#F97316] text-xs font-bold uppercase tracking-wider mb-1">Insumo Seleccionado</Text>
        <Text className="text-2xl font-black text-neutral-800 dark:text-neutral-100 mb-4">{nombre}</Text>

        <View className="flex-row items-center mb-4">
          <View className="bg-[#FFF1E6] dark:bg-[#2C1A0A] px-3 py-1.5 rounded-full flex-row items-center">
            <Text className="text-[#F97316] font-bold text-sm">
              Stock Total: {stock_global.toLocaleString('es-AR')} {unidadParseada}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-6">
          <MaterialCommunityIcons name="scale-balance" size={20} color="#6B7280" />
          <Text className="text-neutral-500 dark:text-neutral-400 font-medium ml-2">Unidad: {unidadParseada}</Text>
        </View>

        <View className="flex-row justify-between w-full">
          <TouchableOpacity onPress={handleRouterMov} className="bg-[#F97316] py-3 rounded-xl flex-row justify-center items-center flex-1 mr-2">
            <MaterialCommunityIcons name="history" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Ver Movimientos</Text>
          </TouchableOpacity>
          {usuario?.rol === 'SUPERADMIN' && (
            <TouchableOpacity
              onPress={handleEditar}
              className="bg-white dark:bg-neutral-800 py-3 rounded-xl flex-row justify-center items-center flex-1 ml-2 border border-neutral-200 dark:border-neutral-700"
            >
              <MaterialCommunityIcons name="pencil" size={20} color={isDark ? '#E5E7EB' : '#374151'} />
              <Text className="text-neutral-700 dark:text-neutral-200 font-bold ml-2">Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom Card: Desglose */}
      <View className="bg-white dark:bg-neutral-900 rounded-2xl p-5 mb-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
        <View className="flex-row items-center mb-4">
          <MaterialCommunityIcons name="warehouse" size={22} color={isDark ? '#E5E7EB' : '#374151'} />
          <Text className="text-neutral-800 dark:text-neutral-100 font-black text-base ml-2 uppercase tracking-wide">Desglose por Bodega</Text>
        </View>

        {/* Filters/Chips */}
        <View className="flex-row mb-5">
          <View className="bg-[#FFF1E6] dark:bg-[#2C1A0A] px-4 py-2 rounded-full border border-[#F97316]">
            <Text className="text-[#F97316] font-bold text-sm">Todas las Bodegas</Text>
          </View>
        </View>

        {/* Table Header */}
        <View className="flex-row justify-between mb-3 px-2">
          <Text className="text-neutral-400 font-bold text-xs w-1/2">UBICACIÓN / BODEGA</Text>
          <Text className="text-neutral-400 font-bold text-xs w-1/4 text-center">CANTIDAD</Text>
        </View>

        {/* Table Rows */}
        <View>
          {stock_por_bodega.map((bodega, index) => (
            <TouchableOpacity key={index} className={`flex-row justify-between items-center py-4 px-2 ${index !== stock_por_bodega.length - 1 ? 'border-b border-neutral-100' : ''}`}>
              <View className="w-1/2">
                <Text className="text-neutral-800 dark:text-neutral-100 font-bold text-base">{bodega.bodega_nombre}</Text>
              </View>
              <View className="w-1/4 items-center">
                <Text className="text-neutral-800 dark:text-neutral-100 font-bold text-base">
                  {bodega.stock.toLocaleString('es-AR')} {unidadCorta}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
