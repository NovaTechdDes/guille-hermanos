import MovimientoItem from '@/src/components/movimientos/MovimientoItem';
import Loading from '@/src/components/ui/Loading';
import { useTheme } from '@/src/hooks';
import { useData } from '@/src/hooks/data/useData';
import { useMovimientos } from '@/src/hooks/movimientos/useMovimientos';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { clsx } from 'clsx';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MovimientoScreen() {
  const { isDark } = useTheme();
  const { data, isLoading } = useData();

  const { bodegas, insumos, destinos } = data || { bodegas: [], insumos: [] };

  const [desde, setDesde] = useState(new Date());
  const [hasta, setHasta] = useState(new Date());

  const [bodega, setBodega] = useState(null);
  const [insumo, setInsumo] = useState(null);
  const [destino, setDestino] = useState(null);

  const { data: movimientos, isLoading: isMovimientosLoading } = useMovimientos(
    desde.toLocaleDateString('en-CA'), // YYYY-MM-DD format
    hasta.toLocaleDateString('en-CA')
  );

  const [type, setType] = useState<'bodega' | 'destino'>('bodega');

  const [showDesde, setShowDesde] = useState(false);
  const [showHasta, setShowHasta] = useState(false);

  if (isLoading || isMovimientosLoading) return <Loading text="Cargando los datos" />;

  const filteredMovimientos = movimientos?.filter((mov) => {
    const matchBodega = bodega ? mov.bodega_id === (bodega as any).id_bodega : true;
    const matchInsumo = insumo ? mov.insumo_id === (insumo as any).id_insumo : true;
    const matchDestino = destino ? mov.destino_id === (destino as any).id_destino : true;
    return matchBodega && matchInsumo && matchDestino;
  });

  const handleType = () => {
    if (type === 'bodega') {
      setType('destino');
    } else {
      setType('bodega');
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header Filters */}
      <View className="p-4 bg-white dark:bg-neutral-900 shadow-sm">
        {/* Date Selectors */}
        <View className="flex-row gap-4 mb-4">
          <Pressable onPress={() => setShowDesde(true)} className="flex-1">
            <Text className="text-neutral-500 dark:text-neutral-400 text-xs mb-1 ml-1">Desde</Text>
            <View className="flex-row items-center justify-between border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg">
              <Text className="text-neutral-900 dark:text-neutral-100">{desde.toLocaleDateString()}</Text>
              <Ionicons name="calendar-outline" size={18} color="#A3A3A3" />
            </View>
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

          <Pressable onPress={() => setShowHasta(true)} className="flex-1">
            <Text className="text-neutral-500 dark:text-neutral-400 text-xs mb-1 ml-1">Hasta</Text>
            <View className="flex-row items-center justify-between border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg">
              <Text className="text-neutral-900 dark:text-neutral-100">{hasta.toLocaleDateString()}</Text>
              <Ionicons name="calendar-outline" size={18} color="#A3A3A3" />
            </View>
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
        <View className="flex-row bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl mb-4 justify-around py-5">
          <Pressable onPress={handleType}>
            <Text className={clsx('font-bold', type === 'bodega' ? 'text-orange-900 dark:text-orange-200' : 'text-neutral-500')}>Bodega</Text>
          </Pressable>
          <Pressable onPress={handleType}>
            <Text className={clsx('font-bold', type === 'destino' ? 'text-orange-900 dark:text-orange-200' : 'text-neutral-500')}>Destino</Text>
          </Pressable>
        </View>

        {/* Search Bars */}
        <View className="gap-2">
          {type === 'bodega' && (
            <View className="flex-row items-center border border-neutral-200 dark:border-neutral-800 px-3 rounded-lg">
              <Ionicons name="location-sharp" size={20} color="#7c2d12" />
              <Dropdown
                data={bodegas}
                search
                {...dropdownStyles}
                style={[dropdownStyles.style, { borderWidth: 0, flex: 1 }]}
                searchPlaceholder="Buscar Bodega..."
                valueField="id_bodega"
                labelField="nombre"
                placeholder="Buscar bodega..."
                value={bodega}
                onChange={(item) => setBodega(item)}
                renderRightIcon={() => null}
              />
            </View>
          )}

          {type === 'destino' && (
            <View className="flex-row items-center border border-neutral-200 dark:border-neutral-800 px-3 rounded-lg">
              <Ionicons name="location-sharp" size={20} color="#7c2d12" />
              <Dropdown
                data={destinos}
                search
                {...dropdownStyles}
                style={[dropdownStyles.style, { borderWidth: 0, flex: 1 }]}
                searchPlaceholder="Buscar Destino..."
                valueField="id_destino"
                labelField="nombre"
                placeholder="Buscar destino..."
                value={destino}
                onChange={(item) => setDestino(item)}
                renderRightIcon={() => null}
              />
            </View>
          )}

          <View className="flex-row items-center border border-neutral-200 dark:border-neutral-800 px-3 rounded-lg">
            <Ionicons name="cube-sharp" size={20} color="#7c2d12" />
            <Dropdown
              data={insumos as any}
              search
              {...dropdownStyles}
              style={[dropdownStyles.style, { borderWidth: 0, flex: 1 }]}
              searchPlaceholder="Buscar Insumo..."
              valueField="id_insumo"
              labelField="nombre"
              placeholder="Buscar insumo..."
              value={insumo}
              onChange={(item) => setInsumo(item)}
              renderRightIcon={() => null}
            />
          </View>
        </View>
      </View>

      {/* List Header */}
      <View className="flex-row justify-between items-center px-4 py-6">
        <Text className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">Movimientos Recientes</Text>
        <Text className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase">
          {new Date().toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      {/* movimientos */}
      <FlatList
        data={filteredMovimientos}
        renderItem={({ item }) => <MovimientoItem movimiento={item} />}
        keyExtractor={(item) => item.id_mov}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Text className="text-neutral-500">No hay movimientos en este rango</Text>
          </View>
        }
      />
    </SafeAreaView>
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
