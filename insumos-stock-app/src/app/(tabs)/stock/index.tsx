import FiltersStock from "@/src/components/stock/FiltersStock";
import ListStockItem from "@/src/components/stock/ListStockItem";
import ModalAddInsumo from "@/src/components/stock/ModalAddInsumo";
import Loading from "@/src/components/ui/Loading";
import { useStock } from "@/src/hooks/data/useData";
import { useStockStore } from "@/src/store/useStockStore";
import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StockScreen() {
  const { data: stock, isLoading, refetch } = useStock();
  const [refreshing, setRefreshing] = useState(false);
  const { modalOpen, closeModal, buscador } = useStockStore();

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const filteredStock = useMemo(() => {
    if (!stock) return [];
    if (!buscador) return stock;

    return stock.filter((item) =>
      item.nombre.toLowerCase().includes(buscador.toLowerCase()),
    );
  }, [stock, buscador]);

  if (isLoading) {
    return <Loading text="Cargando datos Stock" />;
  }

  return (
    <SafeAreaView className="flex-1 px-4 bg-neutral-50 dark:bg-neutral-950">
      {/* Header Section */}
      <View className="mb-8">
        <Text className="text-4xl font-black text-neutral-800 dark:text-white tracking-tight">
          Stock
        </Text>
        <Text className="text-neutral-500 dark:text-neutral-400 font-medium mt-1">
          Control de insumos agroquímicos
        </Text>
      </View>

      {/* Filters Section */}
      <View className="mb-8">
        <FiltersStock filteredStock={filteredStock} />
      </View>

      {/* Stock List Card */}
      <FlatList
        data={filteredStock}
        ListEmptyComponent={<EmptyData />}
        renderItem={({ item, index }) => (
          <ListStockItem
            key={item.id_insumo}
            item={item}
            isLast={index === (filteredStock?.length ?? 0) - 1}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id_insumo.toString()}
      />

      {/* Modal Add Inusmo */}
      <ModalAddInsumo isVisible={modalOpen} onClose={closeModal} />
    </SafeAreaView>
  );
}

const EmptyData = () => (
  <View className="py-20 items-center">
    <Text className="text-neutral-400 dark:text-neutral-500 font-medium">
      No hay insumos cargados
    </Text>
  </View>
);
