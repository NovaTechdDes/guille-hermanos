import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../components/ui/Button';
import Checkbox from '../components/ui/Checkbox';
import Text from '../components/ui/Text';
import { useTheme } from '../hooks';
import { useMutateUsuario } from '../hooks/usuarios/useMutateUsuario';
import { useUsuarioStore } from '../store/useUsuarioStore';
import { mensaje } from '../utils/mensaje';

export default function LoginScreen() {
  const { isDark } = useTheme();

  const { startPostLogin } = useMutateUsuario();
  const { setUsuario: setUsuarioStore } = useUsuarioStore();

  const [recordarme, setRecordarme] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (recordarme) {
      await AsyncStorage.setItem('usuario', usuario);
    } else {
      await AsyncStorage.removeItem('usuario');
    }

    const response = await startPostLogin.mutateAsync({ usuario, password });

    if (response.ok) {
      mensaje('success', '¡Usuario logueado correctamente!');
      setUsuarioStore(response.usuario);

      if (response.usuario.rol === 'EMPLEADO') {
        router.replace('/create');
      } else {
        router.replace('/stock');
      }
    } else {
      mensaje('error', 'Error al loguearse', 'Usuario o contraseña incorrectos');
    }
  };

  const loadUser = async () => {
    const remember = await AsyncStorage.getItem('usuario');
    if (remember) {
      setUsuario(remember);
      setRecordarme(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <KeyboardAwareScrollView
      className="w-full max-w-4xl bg-neutral-50 dark:bg-neutral-950 pt-12"
      enableOnAndroid
      extraScrollHeight={58}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingHorizontal: 32,
        paddingTop: 50,
        paddingBottom: 28,
      }}
    >
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-neutral-900 dark:text-white">Bienvenido</Text>
        <Text className="text-xl text-neutral-600 dark:text-neutral-400">Ingrese sus crendenciales para acceder</Text>
      </View>

      <View className="w-full gap-6">
        <View className="gap-5">
          <View className="flex-row items-center gap-2">
            <Ionicons name="person" size={24} color={isDark ? 'white' : 'black'} />
            <Text className="text-lg font-bold text-neutral-600 dark:text-white">Usuario</Text>
          </View>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg text-neutral-800 dark:text-white"
            placeholder="Usuario"
            placeholderTextColor="#9CA3AF"
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>
        <View className="gap-5">
          <View className="flex-row items-center gap-2">
            <Ionicons name="lock-closed" size={24} color={isDark ? 'white' : 'black'} />
            <Text className="text-lg font-bold text-neutral-600 dark:text-white">Contraseña</Text>
          </View>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg text-neutral-800 dark:text-white"
            placeholder="Contraseña"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Checkbox label="Recordarme" checked={recordarme} onChange={setRecordarme} className="self-center" />
      </View>

      <Button
        title={startPostLogin.isPending ? 'Ingresando...' : 'Ingresar'}
        onPress={handleLogin}
        variant="primary"
        className="w-full mt-6 py-2 flex-row items-center justify-center gap-2 text-black dark:text-white"
        icon="log-in-outline"
      />
    </KeyboardAwareScrollView>
  );
}
