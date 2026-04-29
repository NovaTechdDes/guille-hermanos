import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View, useColorScheme } from 'react-native';

interface Props {
  visible: boolean;
  initialName?: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

export default function ToastNombre({ visible, initialName = '', onConfirm, onCancel }: Props) {
  const [nombre, setNombre] = useState(initialName);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    if (visible) {
      setNombre(initialName);
    }
  }, [visible, initialName]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          {/* Icon Header */}
          <View className="items-center pt-8 pb-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                <Ionicons name="pencil" size={28} color="#3b82f6" />
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="px-8 pb-8 pt-2">
            <Text className="text-center text-lg font-bold text-slate-900 dark:text-white mb-4">Modificar Nombre</Text>
            <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 h-14">
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                placeholder="Escribe el nombre..."
                placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
                className="flex-1 text-neutral-900 dark:text-neutral-100 font-medium"
                autoFocus
              />
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row border-t border-slate-100 dark:border-slate-800">
            <Pressable onPress={onCancel} className="flex-1 items-center justify-center py-5 active:bg-slate-50 dark:active:bg-slate-800" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Text className="text-base font-semibold text-slate-500 dark:text-slate-400">Cancelar</Text>
            </Pressable>
            <View className="w-[1px] bg-slate-100 dark:bg-slate-800" />
            <Pressable onPress={() => onConfirm(nombre.trim())} className="flex-1 items-center justify-center py-5 active:bg-slate-50 dark:active:bg-slate-800" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Text className="text-base font-bold text-blue-600 dark:text-blue-500">Modificar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
