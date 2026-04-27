import FiltersStock from "@/src/components/stock/FiltersStock";
import ListStockItem from "@/src/components/stock/ListStockItem";
import Loading from "@/src/components/ui/Loading";
import { useStock } from "@/src/hooks/data/useData";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function StockScreen() {
  const { data: stock, isLoading } = useStock();

  if (isLoading) {
    return <Loading text="Cargando datos Stock" />;
  }

  return (
    <KeyboardAwareScrollView
      className="w-full max-w-4xl bg-neutral-100 dark:bg-neutral-900 pt-12"
      enableOnAndroid
      extraScrollHeight={58}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingHorizontal: 32,
        paddingTop: 50,
        paddingBottom: 28,
      }}
    >
      {/*  Header */}
      <View className="mb-10">
        <Text className="text-3xl font-bold mb-2 dark:text-white">
          Inventario
        </Text>
        <Text className="text-neutral-400">Estado actual de insumos</Text>
      </View>

      {/*  Filters */}
      <FiltersStock />

      {/*  List */}
      <FlatList
        data={stock || []}
        renderItem={({ item }) => <ListStockItem item={item} />}
        keyExtractor={(item) => item.id_insumo}
        showsVerticalScrollIndicator={false}
        className="flex-1 mt-6"
        ListEmptyComponent={
          <Text className="text-center text-neutral-500 mt-12">
            No hay insumos cargados
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </KeyboardAwareScrollView>
  );
}
