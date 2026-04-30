import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodegaComponent from '../../components/settings/BodegaComponent';
import DestinoComponent from '../../components/settings/DestinoComponent';
import ProvedorComponet from '../../components/settings/ProvedorComponent';
import UsuarioComponent from '../../components/settings/UsuarioComponent';

const data = [
  {
    label: 'Gestión de Usuarios',
    value: 'Usuarios',
    icon: 'people',
  },
  {
    label: 'Gestión de Bodegas',
    value: 'Bodegas',
    icon: 'business',
  },
  {
    label: 'Gestión de Proveedores',
    value: 'Proveedores',
    icon: 'cube',
  },
  {
    label: 'Gestión de Destinos',
    value: 'Destinos',
    icon: 'trail-sign',
  },
];

export default function SettingsScreen() {
  const [selected, setSelected] = useState('Usuarios');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dropdownStyles = {
    style: [
      styles.dropdown,
      {
        backgroundColor: isDark ? '#171717' : '#FFFFFF',
        borderColor: isDark ? '#262626' : '#E5E7EB',
      },
    ],
    placeholderStyle: [styles.placeholderStyle, { color: isDark ? '#737373' : '#9CA3AF' }],
    selectedTextStyle: [styles.selectedTextStyle, { color: isDark ? '#F5F5F5' : '#111827' }],
    containerStyle: [
      styles.containerStyle,
      {
        backgroundColor: isDark ? '#171717' : 'white',
        borderColor: isDark ? '#262626' : '#E5E7EB',
      },
    ],
    itemTextStyle: { color: isDark ? '#D4D4D4' : '#1F2937' },
    activeColor: isDark ? '#262626' : '#F9FAFB',
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        {/* Header Section */}
        <View className="px-6 pt-2 pb-8 bg-white dark:bg-neutral-900 rounded-b-[40px] shadow-xl shadow-black/5 border-b border-neutral-100 dark:border-neutral-800 z-10">
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Ionicons name="shield-checkmark" size={20} color="#f97316" />
            </View>
            <Text className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">Admin</Text>
          </View>

          {/* Section Selector */}
          <View>
            <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Módulo Activo</Text>
            <Dropdown
              data={data}
              {...dropdownStyles}
              valueField="value"
              labelField="label"
              placeholder="Seleccionar módulo"
              value={selected}
              onChange={(item) => setSelected(item.value)}
              renderLeftIcon={() => {
                const currentItem = data.find((d) => d.value === selected);
                return <Ionicons name={(currentItem?.icon as any) || 'settings'} size={20} color={isDark ? '#525252' : '#A3A3A3'} style={{ marginRight: 12 }} />;
              }}
              renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="#A3A3A3" />}
            />
          </View>
        </View>

        {/* Content Section */}
        <View className="flex-1 px-4 pt-6 pb-4">
          <View className="flex-1 bg-white dark:bg-neutral-900 rounded-[32px] p-6 shadow-xl shadow-black/5 border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            {selected === 'Usuarios' && <UsuarioComponent />}
            {selected === 'Bodegas' && <BodegaComponent />}
            {selected === 'Proveedores' && <ProvedorComponet />}
            {selected === 'Destinos' && <DestinoComponent />}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    width: '100%',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectedTextStyle: {
    fontSize: 15,
    fontWeight: '700',
  },
  containerStyle: {
    borderRadius: 20,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
});
