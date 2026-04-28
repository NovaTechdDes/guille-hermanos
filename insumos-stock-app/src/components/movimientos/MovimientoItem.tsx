import { useUsuario } from '@/src/hooks/usuarios/useUsuarios';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Mov_insumo } from '../../interface/Mov_insumo';

interface Props {
  movimiento: Mov_insumo;
}

export default function MovimientoItem({ movimiento }: Props) {
  const isIngreso = movimiento.tipo === 'Ingreso' || movimiento.tipo.toUpperCase() === 'INGRESO';

  const { data: usuario } = useUsuario(movimiento.usuario_id);
  return (
    <View className="bg-white dark:bg-neutral-900 mx-4 mb-1 border-b border-neutral-100 dark:border-neutral-800">
      <View className="flex-row items-center p-4">
        {/* Left Icon */}
        <View className={`w-12 h-12 rounded-lg items-center justify-center ${isIngreso ? 'bg-lime-200 dark:bg-lime-900/40' : 'bg-orange-100 dark:bg-orange-900/40'}`}>
          <Ionicons
            name={isIngreso ? 'arrow-up-outline' : 'arrow-down-outline'}
            size={24}
            color={isIngreso ? '#4d7c0f' : '#9a3412'}
            style={{ transform: [{ rotate: isIngreso ? '45deg' : '45deg' }] }} // Adjusting to match the image's diagonal arrow
          />
        </View>

        {/* Content */}
        <View className="flex-1 ml-4">
          <Text className="text-neutral-900 dark:text-neutral-100 font-bold text-base leading-tight">{movimiento.insumo?.nombre || 'Insumo Desconocido'}</Text>
          <Text className="text-neutral-400 dark:text-neutral-500 text-xs mt-0.5">Bodega: {movimiento.bodega?.nombre || 'N/A'}</Text>
          <Text className="text-neutral-400 dark:text-neutral-500 text-xs mt-0.5">Destino: {movimiento.destino?.nombre || 'N/A'}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-neutral-400 dark:text-neutral-500 text-xs">{new Date(movimiento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            <View className="w-1 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-2" />
            <Text className="text-neutral-400 dark:text-neutral-500 text-xs">{new Date(movimiento.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>

        {/* Right Info */}
        <View className="items-end">
          <Text className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">
            {isIngreso ? '+' : '-'}
            {movimiento.cantidad} {movimiento.insumo?.unidad}
          </Text>
          <View className={`mt-1 px-2 py-0.5 rounded ${isIngreso ? 'bg-green-800' : 'bg-orange-900'}`}>
            <Text className="text-white text-[10px] font-bold">{isIngreso ? 'INGRESO' : 'EGRESO'}</Text>
          </View>

          <Text className="mt-1 text-neutral-400 dark:text-neutral-500 text-md">Vendedor: {usuario?.usuario}</Text>
        </View>
      </View>
    </View>
  );
}
