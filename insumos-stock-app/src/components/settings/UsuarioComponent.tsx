import { useMutateUsuario } from '@/src/hooks/usuarios/useMutateUsuario';
import { useAllUsuarios } from '@/src/hooks/usuarios/useUsuarios';
import { Usuario } from '@/src/interface/Usuario';
import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Button from '../ui/Button';
import Loading from '../ui/Loading';
import ToastConfirmacion from '../ui/ToastConfirmacion';

export default function UsuarioComponent() {
  const { data, isLoading } = useAllUsuarios();
  const { startUpdateLogin, startCreateUser } = useMutateUsuario();

  const [nombre, setNombre] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rol, setRol] = useState<string>('');

  const [isVisible, setIsVisible] = useState(false);
  const [idUsuario, setIdUsuario] = useState<string>('');
  const [activo, setActivo] = useState<boolean>(false);

  const isDark = useColorScheme() === 'dark';

  if (!data || isLoading) return <Loading text="Cargando datos..." />;

  const handleActive = (item: Usuario) => {
    setIsVisible(true);
    setIdUsuario(item.id_usuario);
    setActivo(item.activo);
  };

  const handleConfirm = async () => {
    try {
      const res = await startUpdateLogin.mutateAsync({ id_usuario: idUsuario, estado: !activo });
      if (res) {
        mensaje('success', 'Usuario actualizado correctamente');
      } else {
        mensaje('error', 'Error al actualizar el usuario');
      }
    } catch (error) {
      console.error(error);
      mensaje('error', 'Error al actualizar el usuario');
    }

    setIsVisible(false);
  };

  const dropdownStyles = {
    style: [
      styles.dropdown,
      {
        backgroundColor: isDark ? '#262626' : '#F9FAFB',
        borderColor: isDark ? '#404040' : '#E5E7EB',
      },
    ],
    placeholderStyle: [styles.placeholderStyle, { color: isDark ? '#737373' : '#A3A3A3' }],
    selectedTextStyle: [styles.selectedTextStyle, { color: isDark ? '#F5F5F5' : '#171717' }],
    inputSearchStyle: [
      styles.inputSearchStyle,
      {
        color: isDark ? 'white' : 'black',
        backgroundColor: isDark ? '#171717' : 'white',
      },
    ],
    containerStyle: [
      styles.containerStyle,
      {
        backgroundColor: isDark ? '#171717' : 'white',
        borderColor: isDark ? '#404040' : '#E5E7EB',
      },
    ],
    itemTextStyle: { color: isDark ? '#D4D4D4' : '#171717' },
    activeColor: isDark ? '#262626' : '#F5F5F5',
  };

  const handleCreateUser = async () => {
    if (!nombre || !password || !rol) {
      mensaje('error', 'Debe llenar todos los campos');
      return;
    }

    const res = await startCreateUser.mutateAsync({ nombre, password, rol });
    if (res) {
      mensaje('success', 'Usuario creado correctamente');
      setNombre('');
      setPassword('');
      setRol('EMPLEADO');
    } else {
      mensaje('error', 'Error al crear el usuario');
    }
  };

  const renderHeader = () => (
    <View className="mb-6 pb-10">
      <View className="mb-6">
        <Text className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2 ml-1">Agregar Usuario</Text>
        <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 h-14 mb-4">
          <Ionicons name="person" size={18} color={isDark ? '#525252' : '#A3A3A3'} style={{ marginRight: 12 }} />
          <TextInput
            value={nombre}
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
            ]}
            value={rol}
            onChange={(item) => setRol(item.value)}
            placeholder="Rol"
            valueField="value"
            labelField="label"
          />
        </View>
        <Button variant="primary" icon="add-circle" onPress={handleCreateUser} title={startCreateUser.isPending ? 'Creando...' : 'Crear Usuario'} className="py-3.5 rounded-2xl" />

        <View className="mt-8 mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-neutral-800 dark:text-neutral-200 ml-1">Usuarios Activos</Text>
          <View className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
            <Text className="text-xs font-black text-neutral-500 dark:text-neutral-400">{data.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={data}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item.id_usuario}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleActive(item)}
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
        )}
      />
      <ToastConfirmacion visible={isVisible} mensaje={`${activo ? 'Desactivar' : 'Activar'} Usuario?`} onCancel={() => setIsVisible(false)} onConfirm={handleConfirm} />
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 14,
    borderRadius: 12,
  },
  containerStyle: {
    borderRadius: 20,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
});
