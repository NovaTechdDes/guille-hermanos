import { Bodega } from '@/src/interface/Bodega';
import { Destino } from '@/src/interface/Destino';
import { Insumo } from '@/src/interface/Insumo';
import { Provedor } from '@/src/interface/Provedor';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  data: Bodega[] | Provedor[] | Destino[] | Insumo[];
  onSelect: (item: Bodega | Provedor | Destino | Insumo) => void;
  onClose: () => void;
}

export default function SelectModal({ visible, data, onSelect, onClose }: Props) {
  const [search, setSearch] = useState<string>('');

  const filterData = (data: Bodega[] | Provedor[] | Destino[] | Insumo[]) => {
    if (!search) return data;
    return data.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()));
  };

  const handleSelect = (item: Bodega | Provedor | Destino | Insumo) => {
    onSelect(item);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl p-4 h-[70%]">
          <TextInput placeholder="Buscar..." value={search} onChangeText={setSearch} className="border rounded-xl px-3 h-10 mb-3" />

          <FlatList
            data={filterData(data)}
            keyExtractor={(item) => item.nombre.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text className="text-black text-lg font-bold">{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
