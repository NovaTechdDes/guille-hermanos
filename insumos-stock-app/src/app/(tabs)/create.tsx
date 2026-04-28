import ListaMovimientosVendedor from '@/src/components/create/ListaMovimientosVendedor';
import Loading from '@/src/components/ui/Loading';
import { useData } from '@/src/hooks/data/useData';
import { useMutateMovimiento } from '@/src/hooks/movimientos/useMutateMovimiento';
import { Mov_insumo } from '@/src/interface/Mov_insumo';
import { useUsuarioStore } from '@/src/store/useUsuarioStore';
import { colors } from '@/src/theme/colors';
import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Create() {
  const colorScheme = useColorScheme();
  const { usuario } = useUsuarioStore();
  const { data, isLoading, refetch, isRefetching } = useData(usuario?.id_usuario || '0');
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

  const [type, setType] = useState<'Ingreso' | 'Egreso'>('Ingreso');
  const [provedor, setProvedor] = useState<any>(null);
  const [insumo, setInsumo] = useState<any>(null);
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10).split('-').reverse().join('/'));

  const [bodega, setBodega] = useState<any>(null);
  const [destino, setDestino] = useState<any>(null);
  const [observacion, setObservacion] = useState('');

  const limpiarDatos = () => {
    setType('Ingreso');
    setProvedor(null);
    setInsumo(null);
    setCantidad('');
    setFecha(new Date().toISOString().slice(0, 10).split('-').reverse().join('/'));
    setBodega(null);
    setDestino(null);
    setObservacion('');
  };

  const handleAddMovimiento = async () => {
    if (type === 'Ingreso') {
      if (!provedor || !insumo || !cantidad || !fecha || !bodega || !observacion) {
        setError(true);
        return;
      }
    } else {
      if (!destino || !cantidad || !fecha || !bodega || !observacion) {
        setError(true);
        return;
      }
    }
    const movimiento: Mov_insumo = {
      tipo: type.toUpperCase() as 'INGRESO' | 'EGRESO',
      provedor_id: provedor?.id_provedor,
      insumo_id: insumo?.id_insumo,
      cantidad: Number(cantidad),
      fecha: fecha.slice(0, 10).split('/').reverse().join('/'),
      bodega_id: bodega?.id_bodega,
      destino_id: destino?.id_destino,
      observacion: observacion,
      usuario_id: usuario?.id_usuario || '',
    };

    const res = await startPostMovimiento.mutateAsync(movimiento);
    if (res) {
      mensaje('success', 'Movimiento agregado correctamente');
      limpiarDatos();
    } else {
      mensaje('error', 'Error al agregar movimiento');
    }
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

  if (isLoading) {
    return <Loading text="Cargando datos del sistema" />;
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
              <View className="flex-row bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
                <Pressable onPress={() => setType('Ingreso')} className={`flex-1 flex-row items-center justify-center py-3 rounded-xl `}>
                  <Ionicons name="arrow-up" size={18} color={type === 'Ingreso' ? colors.secondary : '#A3A3A3'} className="mr-2" />
                  <Text className={`font-bold text-sm ${type === 'Ingreso' ? 'text-green-600 dark:text-green-300' : 'text-neutral-400'}`}>Ingreso</Text>
                </Pressable>
                <Pressable onPress={() => setType('Egreso')} className={`flex-1 flex-row items-center justify-center py-3 rounded-xl `}>
                  <Ionicons name="arrow-down" size={18} color={type === 'Egreso' ? colors.primary : '#A3A3A3'} className="mr-2" />
                  <Text className={`font-bold text-sm ${type === 'Egreso' ? 'text-red-600 dark:text-red-300' : 'text-neutral-400'}`}>Egreso</Text>
                </Pressable>
              </View>
            </View>
            {/* Fecha */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Fecha</Text>
              <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 h-14 rounded-2xl px-4">
                <TextInput
                  className="flex-1 text-neutral-800 dark:text-neutral-100 font-semibold"
                  value={fecha}
                  onChangeText={setFecha}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor={isDark ? '#525252' : '#D4D4D4'}
                />
                <Ionicons name="calendar-outline" size={20} color="#A3A3A3" />
              </View>
            </View>

            {/* Proveedor / Insumo Grid */}
            {type === 'Ingreso' && (
              <View>
                <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Proveedor</Text>
                <Dropdown
                  data={provedores as any}
                  search
                  {...dropdownStyles}
                  searchPlaceholder="Buscar Provedor..."
                  valueField="id_provedor"
                  labelField="nombre"
                  placeholder="Seleccione un proveedor"
                  value={provedor}
                  onChange={(item) => setProvedor(item)}
                  renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="#A3A3A3" />}
                />
                {error && !provedor && <Text className="text-red-600 text-xs ml-1">Debe seleccionar un proveedor</Text>}
              </View>
            )}

            {/* Insumo */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Insumo</Text>
              <Dropdown
                data={insumos as any}
                search
                {...dropdownStyles}
                searchPlaceholder="Buscar Insumo..."
                valueField="id_insumo"
                labelField="nombre"
                placeholder="Seleccione un producto"
                value={insumo}
                onChange={(item) => setInsumo(item)}
                renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="#A3A3A3" />}
              />
              {error && !insumo && <Text className="text-red-600 text-xs ml-1">Debe seleccionar un insumo</Text>}
            </View>

            {/* Cantidad */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Cantidad</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 h-14 rounded-2xl px-4 justify-center">
                  <TextInput
                    className="text-neutral-800 dark:text-neutral-100 font-bold text-lg"
                    value={cantidad}
                    onChangeText={setCantidad}
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
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">Bodega Origen</Text>
              <Dropdown
                data={bodegas as any}
                search
                {...dropdownStyles}
                searchPlaceholder="Buscar Bodega..."
                valueField="id_bodega"
                labelField="nombre"
                placeholder="Seleccione una bodega"
                value={bodega}
                onChange={(item) => setBodega(item)}
                renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="#A3A3A3" />}
              />
              {error && !bodega && <Text className="text-red-600 text-xs ml-1">Debe seleccionar una bodega</Text>}
            </View>

            {/* Destino (Solo Egreso) */}
            {type === 'Egreso' && (
              <View className="bg-primary/5 dark:bg-primary/10 p-4 rounded-3xl border border-primary/10">
                <Text className="text-[10px] font-black text-primary uppercase tracking-[2px] mb-2 ml-1">Destino del Egreso</Text>
                <Dropdown
                  data={destinos as any}
                  search
                  {...dropdownStyles}
                  style={[dropdownStyles.style, { backgroundColor: isDark ? '#171717' : 'white' }]}
                  searchPlaceholder="Buscar Destino..."
                  valueField="id_destino"
                  labelField="nombre"
                  placeholder="Seleccione Lote / Cliente"
                  value={destino}
                  onChange={(item) => setDestino(item)}
                  renderRightIcon={() => <Ionicons name="chevron-down" size={18} color={colors.primary} />}
                />
                {error && !destino && <Text className="text-red-600 text-xs ml-1">Debe seleccionar un destino</Text>}
              </View>
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
              onPress={handleAddMovimiento}
              className="bg-primary w-full h-16 rounded-2xl mt-4 justify-center items-center shadow-lg shadow-primary/20"
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-black text-lg uppercase tracking-tight">Confirmar Carga</Text>
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              </View>
            </Pressable>
          </View>

          {/* Lista de Movimientos */}
          {ultimos_movimientos && ultimos_movimientos.length > 0 && <ListaMovimientosVendedor isRefetching={isRefetching} refetch={refetch} movimientos={ultimos_movimientos} />}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 16,
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
