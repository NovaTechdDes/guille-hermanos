import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodegaComponent from '../../components/settings/BodegaComponent';
import DestinoComponent from '../../components/settings/DestinoComponent';
import ProvedorComponet from '../../components/settings/ProvedorComponent';
import UsuarioComponent from '../../components/settings/UsuarioComponent';

export default function SettingsScreen() {
  const [selected, setSelected] = useState('Usuarios');

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        {/* Content Section */}
        <View className="flex-1 px-4 pb-4">
          <View className="flex-1 bg-white dark:bg-neutral-900 rounded-[32px] p-6 shadow-xl shadow-black/5 border border-neutral-400 dark:border-neutral-800 overflow-hidden">
            {selected === 'Usuarios' && <UsuarioComponent selected={selected} setSelected={setSelected} />}
            {selected === 'Bodegas' && <BodegaComponent selected={selected} setSelected={setSelected} />}
            {selected === 'Proveedores' && <ProvedorComponet selected={selected} setSelected={setSelected} />}
            {selected === 'Destinos' && <DestinoComponent selected={selected} setSelected={setSelected} />}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
