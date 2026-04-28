import { Mov_insumo } from '@/src/interface/Mov_insumo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import MovimientoItem from '../movimientos/MovimientoItem';

interface Props {
  movimientos: Mov_insumo[];
  refetch: () => void;
  isRefetching: boolean;
}

export default function ListaMovimientosVendedor({ movimientos, refetch, isRefetching }: Props) {
  return (
    <View className="mb-2 mt-4">
      <HeaderComponent refetch={refetch} isRefetching={isRefetching} />
      {movimientos.map((item: any) => (
        <MovimientoItem movimiento={item} key={item.id_mov} eliminar />
      ))}
    </View>
  );
}

const HeaderComponent = ({ refetch, isRefetching }: { refetch: () => void; isRefetching: boolean }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRefetching) {
      rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1);
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0);
    }
  }, [isRefetching]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="mb-6 mt-4 px-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mr-3">
          <Ionicons name="time-outline" size={20} color="#34d399" />
        </View>
        <View>
          <Text className="text-xl font-black text-neutral-800 dark:text-white tracking-tight">Últimos Movimientos</Text>
          <Text className="text-neutral-500 dark:text-neutral-400 font-medium text-xs">Registros recientes de actividad.</Text>
        </View>
      </View>
      <Pressable onPress={refetch} disabled={isRefetching} className="active:opacity-50">
        <Animated.View style={animatedStyle}>
          <Ionicons name="refresh" size={30} color="#34d399" />
        </Animated.View>
      </Pressable>
    </View>
  );
};
