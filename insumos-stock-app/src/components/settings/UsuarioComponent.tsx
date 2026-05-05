import { useMutateUsuario } from '@/src/hooks/usuarios/useMutateUsuario';
import { useAllUsuarios } from '@/src/hooks/usuarios/useUsuarios';
import { Usuario } from '@/src/interface/Usuario';
import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import Loading from '../ui/Loading';
import ToastConfirmacion from '../ui/ToastConfirmacion';
import UsuarioItem from './UsuarioItem';

export default function UsuarioComponent() {
  const { data, isLoading } = useAllUsuarios();
  const { startUpdateLogin, startCreateUser, startUpdateUser } = useMutateUsuario();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [nombre, setNombre] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rol, setRol] = useState<string>('');

  const [isVisible, setIsVisible] = useState(false);
  const [idUsuario, setIdUsuario] = useState<string>('');
  const [activo, setActivo] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);

  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.usuario);
      setRol(usuario.rol);
    } else {
      setNombre('');
      setPassword('');
      setRol('');
    }
  }, [usuario]);

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

  const handleUpdateUser = async () => {
    if (!usuario?.id_usuario) return;

    if (!password || !rol) {
      mensaje('error', 'Debe ingresar una contraseña y seleccionar un rol');
      return;
    }

    if (password.length < 6) {
      mensaje('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const res = await startUpdateUser.mutateAsync({ id_usuario: usuario?.id_usuario, usuario: nombre, password, rol });
    if (res) {
      mensaje('success', 'Usuario actualizado correctamente');
      setUsuario(null);
      setPassword('');
      setNombre('');
      setRol('EMPLEADO');
    } else {
      mensaje('error', 'Error al actualizar el usuario');
    }
  };
  return (
    <>
      <FlatList
        data={data}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <UsuarioItem
            nombre={nombre}
            inputRef={inputRef}
            password={password}
            rol={rol}
            setNombre={setNombre}
            setPassword={setPassword}
            setRol={setRol}
            isDark={isDark}
            dropdownStyles={dropdownStyles}
            usuario={usuario}
            startUpdateUser={startUpdateUser}
            startCreateUser={startCreateUser}
            handleUpdateUser={handleUpdateUser}
            handleCreateUser={handleCreateUser}
            data={data}
            setUsuario={setUsuario}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item.id_usuario}
        renderItem={({ item }) => (
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
