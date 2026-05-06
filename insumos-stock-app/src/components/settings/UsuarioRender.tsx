import { Usuario } from '@/src/interface/Usuario';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  inputRef: React.RefObject<TextInput | null>;
  setUsuario: (usuario: Usuario | null) => void;
  handleActive: (item: Usuario) => void;
  item: Usuario;
}

export default function UsuarioRender({ inputRef, setUsuario, handleActive, item }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        setUsuario(item);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }}
      onLongPress={() => handleActive(item)}
      className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/50 rounded-2xl p-4 mb-3"
    >
      <View className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-full items-center justify-center mr-3 shadow-sm shadow-black/5">
        <Ionicons name="person" size={18} color="#0ea5e9" />
      </View>
      <View>
        <Text className="text-neutral-800 dark:text-neutral-500 font-bold flex-1">Usuario: {item.usuario}</Text>
        <Text className="text-neutral-800 dark:text-neutral-50  flex-1">Rol: {item.rol}</Text>
      </View>
      <View className="ml-auto">{item.activo ? <Ionicons name="checkmark-circle" size={24} color="green" /> : <Ionicons name="close-circle" size={24} color="red" />}</View>
    </TouchableOpacity>
  );
}
