import { generarPDF } from '@/src/actions/generarPDF.actions';
import MovimientoItem from '@/src/components/movimientos/MovimientoItem';
import Loading from '@/src/components/ui/Loading';
import SelectModal from '@/src/components/ui/SelectModal';
import { useTheme } from '@/src/hooks';
import { useData } from '@/src/hooks/data/useData';
import { useMovimientos } from '@/src/hooks/movimientos/useMovimientos';
import { Bodega } from '@/src/interface/Bodega';
import { Destino } from '@/src/interface/Destino';
import { Insumo } from '@/src/interface/Insumo';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { clsx } from 'clsx';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function MovimientoScreen() {
  const { isDark } = useTheme();
  const { data, isLoading, refetch } = useData();

  const { insumoId } = useLocalSearchParams();
  const { bodegas, insumos, destinos } = data || { bodegas: [], insumos: [], destinos: [] };

  const [desde, setDesde] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [hasta, setHasta] = useState<Date>(new Date());

  const [bodega, setBodega] = useState<string | null>(null);
  const [destino, setDestino] = useState<string | null>(null);
  const [insumo, setInsumo] = useState<string | null>(insumoId ? String(insumoId) : null);

  const [showBodegaModal, setShowBodegaModal] = useState(false);
  const [showDestinoModal, setShowDestinoModal] = useState(false);
  const [showInsumoModal, setShowInsumoModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const { data: movimientos, isLoading: isMovimientosLoading } = useMovimientos(desde.toLocaleDateString('en-CA'), hasta.toLocaleDateString('en-CA'));

  const [type, setType] = useState<'bodega' | 'destino'>('bodega');
  const segmentX = useSharedValue(0);

  useEffect(() => {
    segmentX.value = withSpring(type === 'bodega' ? 0 : 1, { damping: 15 });
  }, [type, segmentX]);

  useEffect(() => {
    if (insumoId) {
      setInsumo(String(insumoId));
    }
  }, [insumoId]);

  const animatedSegmentStyle = useAnimatedStyle(() => {
    return {
      left: `${segmentX.value * 50}%`,
    };
  });

  const [showDesde, setShowDesde] = useState(false);
  const [showHasta, setShowHasta] = useState(false);

  if (isLoading || isMovimientosLoading) return <Loading text="Cargando los datos" />;

  const filteredMovimientos = movimientos?.filter((mov) => {
    const matchBodega = bodega ? mov.bodega_id === bodega : true;
    const matchInsumo = insumo ? mov.insumo_id === insumo : true;
    const matchDestino = destino ? mov.destino_id === destino : true;
    return matchBodega && matchInsumo && matchDestino;
  });

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <FlatList
        data={filteredMovimientos}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => <MovimientoItem movimiento={item} />}
        keyExtractor={(item) => item.id_mov!}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* Header Filters */}
            <View className="px-6 pt-6 pb-8 bg-white dark:bg-neutral-900 rounded-b-[40px] shadow-xl shadow-black/5 border-b border-neutral-100 dark:border-neutral-800">
              <View className="mb-6">
                <View className="flex-row justify-between mb-4">
                  <Pressable onPress={() => generarPDF(filteredMovimientos || [])}>
                    <View className="flex-row items-center gap-2 bg-red-500 px-4 py-2 rounded-xl shadow-md">
                      <Text className="text-white font-bold text-sm">PDF</Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => console.log('Excel')}>
                    <View className="flex-row items-center gap-2 bg-green-500 px-4 py-2 rounded-xl shadow-md">
                      <Text className="text-white font-bold text-sm">EXCEL</Text>
                    </View>
                  </Pressable>
                </View>
                <Text className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">Historial de Movimientos</Text>
              </View>

              {/* Date Selectors */}
              <View className="flex-row gap-3 mb-6">
                <Pressable
                  onPress={() => setShowDesde(true)}
                  className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Desde</Text>
                    <Text className="text-neutral-900 dark:text-neutral-100 font-bold">{desde.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</Text>
                  </View>
                  <Ionicons name="calendar" size={18} color="#34d399" />
                  {showDesde && (
                    <DateTimePicker
                      value={desde}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        setShowDesde(false);
                        if (date) setDesde(date);
                      }}
                    />
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setShowHasta(true)}
                  className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Hasta</Text>
                    <Text className="text-neutral-900 dark:text-neutral-100 font-bold">{hasta.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</Text>
                  </View>
                  <Ionicons name="calendar" size={18} color="#34d399" />
                  {showHasta && (
                    <DateTimePicker
                      value={hasta}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        setShowHasta(false);
                        if (date) setHasta(date);
                      }}
                    />
                  )}
                </Pressable>
              </View>

              {/* Segmented Control */}
              <View className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl mb-6 relative flex-row h-14 overflow-hidden">
                <Animated.View className="absolute top-1 bottom-1 w-[48%] bg-white dark:bg-neutral-700 rounded-xl shadow-sm" style={animatedSegmentStyle} />
                <Pressable onPress={() => setType('bodega')} className="flex-1 items-center justify-center">
                  <Text className={clsx('font-black text-xs uppercase tracking-widest', type === 'bodega' ? 'text-primary' : 'text-neutral-500')}>Bodega</Text>
                </Pressable>
                <Pressable onPress={() => setType('destino')} className="flex-1 items-center justify-center">
                  <Text className={clsx('font-black text-xs uppercase tracking-widest', type === 'destino' ? 'text-primary' : 'text-neutral-500')}>Destino</Text>
                </Pressable>
              </View>

              {/* Dropdown Filters */}
              <View className="gap-3">
                {type === 'bodega' ? (
                  <View className="flex flex-row justify-between items-center gap-2">
                    <TouchableOpacity
                      onPress={() => setShowBodegaModal(true)}
                      className="flex-row flex-1 items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 px-4 rounded-2xl h-14"
                    >
                      <Ionicons name={type === 'bodega' ? 'business' : 'trail-sign'} size={18} color={isDark ? '#525252' : '#A3A3A3'} />
                      <Text className={clsx('font-bold text-base', bodega ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                        {bodega ? bodegas.find((item: Bodega) => item.id_bodega === bodega)?.nombre : 'Seleccionar Bodega'}
                      </Text>
                    </TouchableOpacity>
                    {bodega && (
                      <TouchableOpacity
                        onPress={() => setBodega(null)}
                        className="flex-row items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 px-4 rounded-2xl h-14"
                      >
                        <Ionicons name="trash" size={18} color={isDark ? '#525252' : '#A3A3A3'} />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View className="flex flex-row justify-between items-center gap-2">
                    <TouchableOpacity
                      onPress={() => setShowDestinoModal(true)}
                      className="flex-row flex-1 items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 px-4 rounded-2xl h-14"
                    >
                      <Ionicons name={type === 'destino' ? 'trail-sign' : 'business'} size={18} color={isDark ? '#525252' : '#A3A3A3'} />
                      <Text className={clsx('font-bold text-base', destino ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                        {destino ? destinos.find((item: Destino) => item.id_destino === destino)?.nombre : 'Seleccionar Destino'}
                      </Text>
                    </TouchableOpacity>
                    {destino && (
                      <TouchableOpacity
                        onPress={() => setDestino(null)}
                        className="flex-row items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 px-4 rounded-2xl h-14"
                      >
                        <Ionicons name="trash" size={18} color={isDark ? '#525252' : '#A3A3A3'} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View className="flex flex-row justify-between items-center gap-2">
                  <TouchableOpacity
                    onPress={() => setShowInsumoModal(true)}
                    className="flex-row flex-1 items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 px-4 rounded-2xl h-14"
                  >
                    <Ionicons name="leaf" size={18} color={isDark ? '#525252' : '#A3A3A3'} />
                    <Text className={clsx('font-bold text-base', insumo ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600')}>
                      {insumo ? insumos.find((item: Insumo) => item.id_insumo === insumo)?.nombre : 'Seleccionar Insumo'}
                    </Text>
                  </TouchableOpacity>
                  {insumo && (
                    <TouchableOpacity
                      onPress={() => setInsumo(null)}
                      className="flex-row items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 px-4 rounded-2xl h-14"
                    >
                      <Ionicons name="trash" size={18} color={isDark ? '#525252' : '#A3A3A3'} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* List Header Section */}
            <View className="flex-row justify-between items-end mb-6 px-6 pt-6">
              <View>
                <Text className="text-neutral-400 dark:text-neutral-500 text-[10px] font-black uppercase tracking-[2px] mb-1">Resultados</Text>
                <Text className="text-neutral-800 dark:text-neutral-100 font-black text-xl">{filteredMovimientos?.length || 0} Registros</Text>
              </View>
              <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                <Text className="text-primary font-bold text-xs">
                  {desde.toLocaleDateString('es-ES', { month: 'short' })} - {hasta.toLocaleDateString('es-ES', { month: 'short' })}
                </Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center px-10">
            <View className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full items-center justify-center mb-4">
              <Ionicons name="search-outline" size={32} color="#A3A3A3" />
            </View>
            <Text className="text-neutral-800 dark:text-neutral-100 font-bold text-lg text-center">Sin resultados</Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-center mt-2">No encontramos movimientos con los filtros seleccionados.</Text>
          </View>
        }
      />
      <SelectModal title="Seleccionar Bodega" data={bodegas} visible={showBodegaModal} onSelect={(item: Bodega) => setBodega(item.id_bodega!)} onClose={() => setShowBodegaModal(false)} />
      <SelectModal title="Seleccionar Destino" data={destinos} visible={showDestinoModal} onSelect={(item: Destino) => setDestino(item.id_destino!)} onClose={() => setShowDestinoModal(false)} />
      <SelectModal title="Seleccionar Insumo" data={insumos} visible={showInsumoModal} onSelect={(item: Insumo) => setInsumo(item.id_insumo!)} onClose={() => setShowInsumoModal(false)} />
    </View>
  );
}
