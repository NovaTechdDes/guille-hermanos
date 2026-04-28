import { useTheme } from '@/src/hooks';
import { useMutateMovimiento } from '@/src/hooks/movimientos/useMutateMovimiento';
import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Mov_insumo } from '../../interface/Mov_insumo';
import ToastConfirmacion from '../ui/ToastConfirmacion';

interface Props {
  movimiento: Mov_insumo;
  eliminar?: boolean;
}

export default function MovimientoItem({ movimiento, eliminar = false }: Props) {
  const { isDark } = useTheme();
  const isIngreso = movimiento.tipo.toUpperCase() === 'INGRESO';
  const { usuario } = useUsuarioStore();
  const { startPostMovimiento } = useMutateMovimiento();

  const [show, setShow] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!movimiento.insumo || !movimiento.bodega) return;

    const antiMovmineto: Mov_insumo = {
      usuario_id: usuario?.id_usuario || '0',
      insumo_id: movimiento.insumo.id,
      bodega_id: movimiento.bodega.id,
      destino_id: movimiento.destino?.id,
      cantidad: movimiento.cantidad,
      tipo: movimiento.tipo,
      observacion: `Anti Movimiento de un insumo eliminado. Usuario: ${usuario?.usuario}.`,
      fecha: new Date().toISOString(),
    };

    antiMovmineto.tipo = isIngreso ? 'EGRESO' : 'INGRESO';

    const res = await startPostMovimiento.mutateAsync(antiMovmineto);
    if (res) {
      mensaje('success', 'Contra Movimiento Registrado correctamente');
    } else {
      mensaje('error', 'Error al eliminar movimiento');
    }

    setShow(false);
  };

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

      {eliminar && (
        <View className="px-4 pb-4">
          <Pressable
            onPress={() => setShow(true)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50/30 h-12 dark:border-rose-900/20 dark:bg-rose-900/10"
          >
            <Ionicons name="trash-outline" size={18} color={isDark ? '#e11d48' : '#e11d48'} />
            <Text className="text-rose-600 dark:text-white font-bold text-sm uppercase tracking-widest">Eliminar Registro</Text>
          </Pressable>
        </View>
      )}

      <ToastConfirmacion visible={show} onConfirm={handleDelete} onCancel={() => setShow(false)} mensaje="¿Estás seguro de eliminar este movimiento? (Se revertirá el movimiento)" />
    </View>
  );
}
