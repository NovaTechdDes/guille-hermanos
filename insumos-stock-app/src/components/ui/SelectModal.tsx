import { Bodega } from '@/src/interface/Bodega';
import { Destino } from '@/src/interface/Destino';
import { Insumo } from '@/src/interface/Insumo';
import { Provedor } from '@/src/interface/Provedor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import Text from './Text';

interface Props {
  visible: boolean;
  data: Bodega[] | Provedor[] | Destino[] | Insumo[];
  onSelect: (item: Bodega | Provedor | Destino | Insumo) => void;
  onClose: () => void;
  title?: string;
}

export default function SelectModal({ visible, data, onSelect, onClose, title = 'Seleccionar' }: Props) {
  const [search, setSearch] = useState<string>('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filterData = (data: Bodega[] | Provedor[] | Destino[] | Insumo[]) => {
    if (!search) return data;
    return data.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()));
  };

  const handleSelect = (item: Bodega | Provedor | Destino | Insumo) => {
    onSelect(item);
    setSearch('');
    onClose();
  };

  const filtered = filterData(data);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />

        <View className="bg-white dark:bg-neutral-900 rounded-t-[32px] p-6 h-[75%] shadow-2xl">
          {/* Handle indicator */}
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
              <Ionicons name="close" size={24} color={isDark ? '#A3A3A3' : '#A3A3A3'} className="text-neutral-600 dark:text-neutral-400" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-3 mb-6 border border-neutral-200 dark:border-neutral-700 focus:border-primary">
            <Ionicons name="search" size={20} color={isDark ? '#A3A3A3' : '#A3A3A3'} className=" mr-2" />
            <TextInput placeholder="Buscar..." placeholderTextColor="#9ca3af" value={search} onChangeText={setSearch} className="flex-1 text-neutral-900 dark:text-white text-base" />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#A3A3A3' : '#A3A3A3'} />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => `${item.nombre}-${index}`}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="items-center py-10">
                <Ionicons name="search-outline" size={48} className="text-neutral-300 dark:text-neutral-700 mb-2" />
                <Text className="text-neutral-500 dark:text-neutral-400 text-center">No se encontraron resultados</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="py-4 border-b border-neutral-100 dark:border-neutral-800 flex-row justify-between items-center active:bg-neutral-50 dark:active:bg-neutral-800/50"
              >
                <Text className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{item.nombre}</Text>
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#A3A3A3' : '#A3A3A3'} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
