import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View, Animated } from 'react-native';
import { authenticateBiometric, canUseBiometrics, getBiometricConfig } from '../lib/biometria';
import { supabase } from '../lib/supabase';
import { useUsuarioStore } from '../store/useUsuarioStore';
import { useTheme } from '../hooks';
import Text from '../components/ui/Text';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const { setUsuario, setSession } = useUsuarioStore();
  const { colors, isDark } = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace('/login');
      return;
    }

    const username = session.user.email?.split('@')[0];

    const { data: usuario, error } = await supabase.from('usuarios').select('*').eq('nombre', username).single();

    if (error || !usuario || !usuario.activo) {
      await supabase.auth.signOut();
      router.replace('/login');
      return;
    }

    setUsuario(usuario);
    setSession(session);

    const config = await getBiometricConfig();

    if (!config) {
      await supabase.auth.signOut();
      router.replace('/login');
      return;
    }

    const useBiometrics = config?.enabled && config.userId === session?.user.id;

    if (useBiometrics) {
      const avalible = await canUseBiometrics();
      if (avalible) {
        const result = await authenticateBiometric();
        if (!result.success) {
          await supabase.auth.signOut();
          router.replace('/login');
          return;
        }
      }
    }

    if (usuario.rol === 'EMPLEADO') {
      router.replace('/create');
    } else {
      router.replace('/stock');
    }
  };

  return (
    <View 
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Brand Icon */}
        <View 
          className="w-20 h-20 rounded-2xl items-center justify-center mb-6 shadow-md border"
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0',
          }}
        >
          <Ionicons name="cube" size={40} color={colors.primary} />
        </View>

        {/* Brand Name */}
        <Text className="text-3xl font-extrabold tracking-wider text-neutral-900 dark:text-white mb-1">
          Insumos GH
        </Text>
        
        {/* Subtitle */}
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 font-medium tracking-wide mb-12">
          Control de Gestión
        </Text>

        {/* Loading Spinner and Label */}
        <View className="flex-row items-center gap-3 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-full">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-widest">
            Iniciando
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
