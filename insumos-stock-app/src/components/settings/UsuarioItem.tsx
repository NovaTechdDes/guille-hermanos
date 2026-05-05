import { Usuario } from '@/src/interface/Usuario';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Button from '../ui/Button';

interface Props {
  nombre: string;
  inputRef: React.RefObject<TextInput | null>;
  password: string;
  rol: string;
  setNombre: (value: string) => void;
  setPassword: (value: string) => void;
  setRol: (value: string) => void;
  isDark: boolean;
  dropdownStyles: any;
  usuario: Usuario | null;
  startUpdateUser: any;
  startCreateUser: any;
  handleUpdateUser: () => void;
  handleCreateUser: () => void;
  data: Usuario[];
  setUsuario: (usuario: Usuario | null) => void;
}

export default function UsuarioItem({
  nombre,
  inputRef,
  password,
  rol,
  setNombre,
  setPassword,
  setRol,
  isDark,
  dropdownStyles,
  usuario,
  startUpdateUser,
  startCreateUser,
  handleUpdateUser,
  handleCreateUser,
  data,
  setUsuario,
}: Props) {
  return (
    <View className="mb-2 pb-2">
      <View className="mb-6">
        <Text className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2 ml-1">Agregar Usuario</Text>

        {/* Nombre */}
        <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 h-14 mb-4">
          <Ionicons name="person" size={18} color={isDark ? '#525252' : '#A3A3A3'} style={{ marginRight: 12 }} />
          <TextInput
            value={nombre}
            ref={inputRef}
            onChangeText={setNombre}
            placeholder="Nombre de usuario"
            placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
            className="flex-1 text-neutral-900 dark:text-neutral-100 font-medium"
          />
        </View>

        <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 h-14 mb-4">
          <Ionicons name="lock-closed" size={18} color={isDark ? '#525252' : '#A3A3A3'} style={{ marginRight: 12 }} />
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
            className="flex-1 text-neutral-900 dark:text-neutral-100 font-medium"
          />
        </View>

        <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl  h-14 mb-4">
          {/* <Ionicons name="lock-closed" size={18} color={isDark ? '#525252' : '#A3A3A3'} style={{ marginRight: 12 }} /> */}
          <Dropdown
            {...dropdownStyles}
            data={[
              { label: 'Empleado', value: 'EMPLEADO' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'SuperAdmin', value: 'SUPERADMIN' },
            ]}
            value={rol}
            onChange={(item) => setRol(item.value)}
            placeholder="Rol"
            valueField="value"
            labelField="label"
          />
        </View>
        {/* si hay un usuario seleccionado, mostrar un boton de cancelar */}
        {usuario ? (
          <View className="flex-row gap-4">
            <Button variant="secondary" icon="close" onPress={() => setUsuario(null)} title="Cancelar" className="py-3.5 rounded-2xl px-2" />
            <Button variant="primary" icon="pencil" onPress={handleUpdateUser} title={startUpdateUser.isPending ? 'Actualizando...' : 'Actualizar Usuario'} className="py-3.5 rounded-2xl flex-1" />
          </View>
        ) : (
          <Button variant="primary" icon="add-circle" onPress={handleCreateUser} title={startCreateUser.isPending ? 'Creando...' : 'Crear Usuario'} className="py-3.5 rounded-2xl" />
        )}

        <View className="mt-8 mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-neutral-800 dark:text-neutral-200 ml-1">Usuarios Activos</Text>
          <View className="bg-neutral-100 dark:bg-neutral-800 px-3 rounded-full">
            <Text className="text-xs font-black text-neutral-500 dark:text-neutral-400">{data.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
