import { useData } from '@/src/hooks/data/useData';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, View, useColorScheme } from 'react-native';

import { useMutateBodega } from '@/src/hooks/bodega/useMutateBodega';
import { mensaje } from '@/src/utils/mensaje';
import Button from '../ui/Button';
import Loading from '../ui/Loading';

export default function BodegaComponent() {
  const { data, isLoading, refetch } = useData();
  const { startPostBodega } = useMutateBodega();
  const [nombre, setNombre] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isDark = useColorScheme() === 'dark';

  if (!data || isLoading) return <Loading text="Cargando datos..." />;

  const { bodegas } = data;

  const handleAddBodega = async () => {
    if (!nombre) {
      setError(true);
      return;
    }

    const res = await startPostBodega.mutateAsync(nombre);

    if (res) {
      mensaje('success', 'Bodega creada exitosamente');
      setNombre('');
    } else {
      mensaje('error', 'Error al crear bodega');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
  };

  const renderHeader = () => (
    <View className="mb-6">
      <Text className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2 ml-1">Agregar Bodega</Text>
      <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 h-14 mb-4">
        <Ionicons name="business" size={18} color={isDark ? '#525252' : '#A3A3A3'} style={{ marginRight: 12 }} />
        <TextInput
          value={nombre}
          onChangeText={(text) => {
            setNombre(text);
            setError(false);
          }}
          placeholder="Nombre de la bodega"
          placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
          className="flex-1 text-neutral-900 dark:text-neutral-100 font-medium"
        />
      </View>
      {error && <Text className="text-red-500 text-sm font-medium ml-1">El nombre de la bodega es requerido</Text>}
      <Button variant="primary" icon="add-circle" onPress={handleAddBodega} title={startPostBodega.isPending ? 'Guardando...' : 'Guardar Bodega'} className="py-3.5 rounded-2xl" />

      <View className="mt-8 mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-bold text-neutral-800 dark:text-neutral-200 ml-1">Bodegas Registradas</Text>
        <View className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
          <Text className="text-xs font-black text-neutral-500 dark:text-neutral-400">{bodegas.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={bodegas}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      ListHeaderComponent={renderHeader()}
      contentContainerStyle={{ paddingBottom: 20 }}
      keyExtractor={(item) => item.id_bodega}
      renderItem={({ item }) => (
        <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/50 rounded-2xl p-4 mb-3">
          <View className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-full items-center justify-center mr-3 shadow-sm shadow-black/5">
            <Ionicons name="business" size={18} color="#3b82f6" />
          </View>
          <Text className="text-neutral-800 dark:text-neutral-100 font-bold flex-1">{item.nombre}</Text>
          <Ionicons name="chevron-forward" size={18} color={isDark ? '#525252' : '#D4D4D4'} />
        </View>
      )}
    />
  );
}
