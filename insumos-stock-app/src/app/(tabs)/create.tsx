import ListaMovimientosVendedor from '@/src/components/create/ListaMovimientosVendedor';
import Loading from '@/src/components/ui/Loading';
import SelectModal from '@/src/components/ui/SelectModal';
import { useData } from '@/src/hooks/data/useData';
import { useMutateMovimiento } from '@/src/hooks/movimientos/useMutateMovimiento';
import { Mov_insumo } from '@/src/interface/Mov_insumo';
import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { mensaje } from '@/src/utils/mensaje';

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function Create() {
  const colorScheme = useColorScheme();
  const { usuario } = useUsuarioStore();
  const { data, isLoading, refetch, isRefetching, isError } = useData(usuario?.id_usuario || 0);
  const { startPostMovimiento } = useMutateMovimiento();

  const isDark = colorScheme === 'dark';

  const { bodegas, provedores, destinos, insumos, ultimos_movimientos } = data || {
    bodegas: [],
    provedores: [],
    destinos: [],
    insumos: [],
    movimientos: [],
  };

  const [error, setError] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  const [type, setType] = useState<'Ingreso' | 'Egreso'>('Ingreso');
  const typeX = useSharedValue(0);

  const [visibleProvedor, setVisibleProvedor] = useState<boolean>(false);
  const [visibleInsumo, setVisibleInsumo] = useState<boolean>(false);
  const [visibleBodega, setVisibleBodega] = useState<boolean>(false);
  const [visibleDestino, setVisibleDestino] = useState<boolean>(false);
  const [visibleBodegaFinal, setVisibleBodegaFinal] = useState<boolean>(false);

  const [provedor, setProvedor] = useState<any>(null);
  const [insumo, setInsumo] = useState<any>(null);
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState<Date>(new Date());
  const [destinoFinal, setDestinoFinal] = useState<boolean>(true);
  const [bodega, setBodega] = useState<any>(null);

  const [destino, setDestino] = useState<any>(null);
  const [bodegaFinal, setBodegaFinal] = useState<any>(null);

  const [observacion, setObservacion] = useState('');

  useEffect(() => {
    typeX.value = withSpring(type === 'Ingreso' ? 0 : 1, { damping: 15 });
  }, [type, typeX]);

  const animatedTypeStyle = useAnimatedStyle(() => {
    return {
      left: `${typeX.value * 50}%`,
    };
  });

  const limpiarDatos = () => {
    setType('Ingreso');
    setProvedor(null);
    setInsumo(null);
    setCantidad('');
    setFecha(new Date());
    setBodega(null);
    setDestino(null);
    setObservacion('');
    setError(false);
  };

  const handleAddMovimiento = async () => {
    setError(false);
    if (type === 'Ingreso') {
      if (!provedor || !insumo || !cantidad || !fecha || !bodega) {
        setError(true);
        return;
      }
    } else {
      if (destinoFinal) {
        if (!destino || !cantidad || !fecha || !bodega) {
          setError(true);
          return;
        }
      } else {
        if (!cantidad || !fecha || !bodega || !bodegaFinal) {
          setError(true);
          return;
        }
      }
    }

    const movimiento: Mov_insumo = {
      tipo: type.toUpperCase() as 'INGRESO' | 'EGRESO',
      provedor_id: provedor?.id_provedor,
      insumo_id: insumo?.id_insumo,
      cantidad: Number(cantidad.replace(',', '.')),
      fecha: fecha.toISOString().split('T')[0],
      bodega_id: bodega?.id_bodega,
      destino_id: destino?.id_destino,
      observacion: observacion,
      usuario_id: usuario?.id_usuario || 0,
      created_at: new Date().toISOString(),
    };

    if (!destinoFinal) {
      const movimientoIngreso: Mov_insumo = {
        tipo: 'INGRESO',
        provedor_id: provedor?.id_provedor,
        insumo_id: insumo?.id_insumo,
        cantidad: Number(cantidad.replace(',', '.')),
        fecha: fecha.toISOString().split('T')[0],
        bodega_id: bodegaFinal?.id_bodega,
        observacion: observacion,
        usuario_id: usuario?.id_usuario || 0,
        created_at: new Date().toISOString(),
      };

      const res = await startPostMovimiento.mutateAsync(movimientoIngreso);
      if (res) {
        mensaje('success', 'Movimiento agregado correctamente');
        limpiarDatos();
      } else {
        mensaje('error', 'Error al agregar movimiento');
      }
    }

    const res = await startPostMovimiento.mutateAsync(movimiento);
    if (res) {
      mensaje('success', 'Movimiento agregado correctamente');
      limpiarDatos();
    } else {
      mensaje('error', 'Error al agregar movimiento');
    }
  };

  if (isLoading) {
    return <Loading text="Cargando datos del sistema" />;
  }

  if (isError || (!data && !isLoading)) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 justify-center items-center p-6">
        <Ionicons name="cloud-offline-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-neutral-800 dark:text-white mt-4 text-center">No se pudieron cargar los datos</Text>
        <Text className="text-neutral-500 dark:text-neutral-400 text-center mt-2 mb-6">Verifique su conexión a internet e inténtelo nuevamente.</Text>

        <TouchableOpacity onPress={() => refetch()} disabled={isRefetching} className="bg-primary px-8 py-3.5 rounded-2xl flex-row items-center gap-2">
          <Ionicons name="refresh" size={20} color="white" />
          <Text className="text-white font-bold">{isRefetching ? 'Reintentando...' : 'Reintentar'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={58}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 100,
        }}
      >
        {/* Main Form Card */}
        <View className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 shadow-xl shadow-black/5 border border-neutral-100 dark:border-neutral-800">
          <View className="mb-8">
            <Text className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">Registrar Movimiento</Text>
            <Text className="text-neutral-500 dark:text-neutral-400 font-medium text-sm mt-1">Complete los datos del suministro a cargar.</Text>
          </View>

          <View className="gap-6">
            {/* Tipo de Operación */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-3 ml-1">Tipo de Operación</Text>
              <View className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl relative flex-row h-14 overflow-hidden">
                <Animated.View className="absolute top-1.5 bottom-1.5 w-[48.5%] bg-white dark:bg-neutral-700 rounded-xl shadow-sm" style={animatedTypeStyle} />
                <Pressable onPress={() => setType('Ingreso')} className="flex-1 items-center justify-center flex-row">
                  <Ionicons name="arrow-up-circle" size={18} color={type === 'Ingreso' ? '#10b981' : '#A3A3A3'} style={{ marginRight: 6 }} />
                  <Text className={clsx('font-black text-xs uppercase tracking-widest', type === 'Ingreso' ? 'text-green-600 dark:text-green-400' : 'text-neutral-500')}>Ingreso</Text>
                </Pressable>
                <Pressable onPress={() => setType('Egreso')} className="flex-1 items-center justify-center flex-row">
                  <Ionicons name="arrow-down-circle" size={18} color={type === 'Egreso' ? '#ef4444' : '#A3A3A3'} style={{ marginRight: 6 }} />
                  <Text className={clsx('font-black text-xs uppercase tracking-widest', type === 'Egreso' ? 'text-red-600 dark:text-red-400' : 'text-neutral-500')}>Egreso</Text>
                </Pressable>
              </View>
            </View>

            {/* Fecha */}
            <Pressable
              onPress={() => setShow(true)}
              className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
            >
              <View>
                <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Fecha</Text>
                <Text className="text-neutral-900 dark:text-neutral-100 font-bold">{fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
              </View>
              <Ionicons name="calendar" size={18} color="#34d399" />
              {show && (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShow(false);
                    if (date) setFecha(date);
                  }}
                />
              )}
            </Pressable>

            {/* Proveedor */}
            {type === 'Ingreso' && (
              <TouchableOpacity
                onPress={() => setVisibleProvedor(true)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Proveedor</Text>
                  <Text className={clsx('font-bold text-base', provedor ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                    {provedor?.nombre ?? 'Seleccionar proveedor'}
                  </Text>
                </View>
                <Ionicons name="business-outline" size={18} color={isDark ? 'white' : 'black'} />
                {error && !provedor && <Text className="absolute -bottom-5 left-1 text-red-500 text-[10px] font-bold">Campo requerido</Text>}
              </TouchableOpacity>
            )}

            {/* Insumo */}
            <TouchableOpacity
              onPress={() => setVisibleInsumo(true)}
              className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Insumo</Text>
                <Text className={clsx('font-bold text-base', insumo ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                  {insumo?.nombre ?? 'Seleccionar insumo'}
                </Text>
              </View>
              <Ionicons name="cube-outline" size={18} color={isDark ? 'white' : 'black'} />
              {error && !insumo && <Text className="absolute -bottom-5 left-1 text-red-500 text-[10px] font-bold">Campo requerido</Text>}
            </TouchableOpacity>

            {/* Cantidad */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Cantidad</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 h-14 rounded-2xl px-4 justify-center">
                  <TextInput
                    className="text-neutral-800 dark:text-neutral-100 font-bold text-lg"
                    value={cantidad}
                    onChangeText={(val) => setCantidad(val.replace(',', '.'))}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#525252' : '#D4D4D4'}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View className="h-14 px-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl items-center justify-center">
                  <Text className="font-black text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-tighter">{insumo?.unidad || 'UN'}</Text>
                </View>
              </View>
              {error && !cantidad && <Text className="text-red-600 text-xs ml-1">Debe ingresar una cantidad</Text>}
            </View>

            {/* Bodega */}
            <TouchableOpacity
              onPress={() => setVisibleBodega(true)}
              className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Bodega Origen</Text>
                <Text className={clsx('font-bold text-base', bodega ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                  {bodega?.nombre ?? 'Seleccionar bodega'}
                </Text>
              </View>
              <Ionicons name="home-outline" size={18} color={isDark ? 'white' : 'black'} />
              {error && !bodega && <Text className="absolute -bottom-5 left-1 text-red-500 text-[10px] font-bold">Campo requerido</Text>}
            </TouchableOpacity>

            {type === 'Egreso' && (
              <View>
                <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-3 ml-1">Tipo de Movimiento</Text>
                <View className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl relative flex-row h-14 overflow-hidden">
                  <Pressable onPress={() => setDestinoFinal(false)} className="flex-1 items-center justify-center flex-row">
                    <Ionicons name="arrow-up-circle" size={18} color={!destinoFinal ? '#10b981' : '#A3A3A3'} style={{ marginRight: 6 }} />
                    <Text className={clsx('font-black text-xs uppercase tracking-widest', !destinoFinal ? 'text-green-600 dark:text-green-400' : 'text-neutral-500')}>Entre Bodegas</Text>
                  </Pressable>
                  <Pressable onPress={() => setDestinoFinal(true)} className="flex-1 items-center justify-center flex-row">
                    <Ionicons name="arrow-down-circle" size={18} color={destinoFinal ? '#ef4444' : '#A3A3A3'} style={{ marginRight: 6 }} />
                    <Text className={clsx('font-black text-xs uppercase tracking-widest', destinoFinal ? 'text-red-600 dark:text-red-400' : 'text-neutral-500')}>Destino Final</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Destino (Solo Egreso) */}
            {destinoFinal && type === 'Egreso' && (
              <TouchableOpacity
                onPress={() => setVisibleDestino(true)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Destino</Text>
                  <Text className={clsx('font-bold text-base', destino ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                    {destino?.nombre ?? 'Seleccionar destino'}
                  </Text>
                </View>
                <Ionicons name="location-outline" size={18} color={isDark ? 'white' : 'black'} />
                {error && !destino && <Text className="absolute -bottom-5 left-1 text-red-500 text-[10px] font-bold">Campo requerido</Text>}
              </TouchableOpacity>
            )}
            {!destinoFinal && type === 'Egreso' && (
              <TouchableOpacity
                onPress={() => setVisibleBodegaFinal(true)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Bodega Final</Text>
                  <Text className={clsx('font-bold text-base', bodegaFinal ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                    {bodegaFinal?.nombre ?? 'Seleccionar bodega'}
                  </Text>
                </View>
                <Ionicons name="home-outline" size={18} color={isDark ? 'white' : 'black'} />
                {error && !bodegaFinal && <Text className="absolute -bottom-5 left-1 text-red-500 text-[10px] font-bold">Campo requerido</Text>}
              </TouchableOpacity>
            )}

            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Observacion</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 h-14 rounded-2xl px-4 justify-center">
                  <TextInput
                    className="text-neutral-800 dark:text-neutral-100 font-bold text-lg"
                    value={observacion}
                    onChangeText={setObservacion}
                    placeholder="Observaciones"
                    placeholderTextColor={isDark ? '#525252' : '#D4D4D4'}
                    keyboardType="default"
                  />
                </View>
              </View>
            </View>

            {/* Confirmar Movimiento */}
            <Pressable
              disabled={startPostMovimiento.isPending}
              onPress={handleAddMovimiento}
              className={clsx('bg-primary w-full h-16 rounded-2xl mt-4 justify-center items-center shadow-lg shadow-primary/20', startPostMovimiento.isPending && 'opacity-50')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-black text-lg uppercase tracking-tight">{startPostMovimiento.isPending ? 'Guardando...' : 'Confirmar Carga'}</Text>
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              </View>
            </Pressable>
          </View>

          {/* Lista de Movimientos */}
          {ultimos_movimientos && ultimos_movimientos.length > 0 && <ListaMovimientosVendedor isRefetching={isRefetching} refetch={refetch} movimientos={ultimos_movimientos} />}
          <SelectModal title="Seleccionar Proveedor" data={provedores} visible={visibleProvedor} onSelect={(item) => setProvedor(item)} onClose={() => setVisibleProvedor(false)} />
          <SelectModal title="Seleccionar Insumo" data={insumos} visible={visibleInsumo} onSelect={(item) => setInsumo(item)} onClose={() => setVisibleInsumo(false)} />
          <SelectModal title="Seleccionar Bodega" data={bodegas} visible={visibleBodega} onSelect={(item) => setBodega(item)} onClose={() => setVisibleBodega(false)} />
          <SelectModal title="Seleccionar Destino" data={destinos} visible={visibleDestino} onSelect={(item) => setDestino(item)} onClose={() => setVisibleDestino(false)} />
          <SelectModal title="Seleccionar Bodega Destino" data={bodegas} visible={visibleBodegaFinal} onSelect={(item) => setBodegaFinal(item)} onClose={() => setVisibleBodegaFinal(false)} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
