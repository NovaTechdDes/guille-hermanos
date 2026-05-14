// src/components/ui/SelectModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import Text from './Text';

// Definimos que el componente usa un tipo "T" (genérico)
interface Props<T> {
  visible: boolean;
  data: T[];
  onSelect: (item: T) => void;
  onClose: () => void;
  title?: string;
}

export default function SelectModal<T extends { nombre: string }>({ visible, data, onSelect, onClose, title = 'Seleccionar' }: Props<T>) {
  const [search, setSearch] = useState<string>('');
  const filterData = (items: T[]) => {
    if (!search) return items;
    return items.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()));
  };

  const handleSelect = (item: T) => {
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
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
          </View>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
              <Ionicons name="close" size={24} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-3 mb-6 border border-neutral-200 dark:border-neutral-700">
            <Ionicons name="search" size={20} color="#A3A3A3" className="mr-2" />
            <TextInput placeholder="Buscar..." placeholderTextColor="#9ca3af" value={search} onChangeText={setSearch} className="flex-1 text-neutral-900 dark:text-white text-base" />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => `${item.nombre}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} className="py-4 border-b border-neutral-100 dark:border-neutral-800 flex-row justify-between items-center">
                <Text className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{item.nombre}</Text>
                <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
              </TouchableOpacity>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
