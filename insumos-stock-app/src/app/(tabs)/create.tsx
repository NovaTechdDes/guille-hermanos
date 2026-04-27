import Loading from "@/src/components/ui/Loading";
import { useTheme } from "@/src/hooks";
import { useData } from "@/src/hooks/data/useData";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Create() {
  const { isDark } = useTheme();
  const { data, isLoading } = useData();

  const { bodegas, provedores, destinos, insumos } = data;

  const [type, setType] = useState<"Ingreso" | "Egreso">("Ingreso");
  const [provedor, setProvedor] = useState<any>(null);
  const [insumo, setInsumo] = useState<any>(null);
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10).split("-").reverse().join("/"),
  );

  const [bodega, setBodega] = useState<any>(null);
  const [destino, setDestino] = useState<any>(null);

  const dropdownStyles = {
    style: [
      styles.dropdown,
      {
        backgroundColor: isDark ? "#1e293b" : "#f9fafb",
        borderColor: isDark ? "#334155" : "#6B7280",
      },
    ],
    placeholderStyle: [
      styles.placeholderStyle,
      { color: isDark ? "#94a3b8" : "#6B7280" },
    ],
    selectedTextStyle: [
      styles.selectedTextStyle,
      { color: isDark ? "white" : "black" },
    ],
    inputSearchStyle: [
      styles.inputSearchStyle,
      {
        color: isDark ? "white" : "black",
        backgroundColor: isDark ? "#0f172a" : "white",
      },
    ],
    containerStyle: [
      styles.containerStyle,
      {
        backgroundColor: isDark ? "#0f172a" : "white",
        borderColor: isDark ? "#334155" : "#e2e8f0",
      },
    ],
    itemTextStyle: { color: isDark ? "white" : "black" },
    activeColor: isDark ? "#334155" : "#f1f5f9",
  };

  if (isLoading) {
    return <Loading text="Cargando datos del sistema" />;
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
      <Text className="text-2xl font-bold text-black dark:text-white">
        Registrar Movimiento
      </Text>
      <Text className="text-lg text-neutral-600 dark:text-neutral-400">
        Complete los datos del suministro de carga
      </Text>

      <View className="gap-5">
        {/* Tipo de operacion */}
        <View>
          <Text>Tipo de operacion</Text>

          <View className="flex-row bg-gray-200 justify-around rounded-xl mt-2 p-2">
            <Pressable
              className={`flex-row items-center gap-2 w-1/2 justify-center p-2 rounded-xl ${type === "Ingreso" ? "bg-white" : "bg-blue"}`}
              onPress={() => setType("Ingreso")}
            >
              <Ionicons
                name="arrow-up-outline"
                size={24}
                color={type === "Ingreso" ? "green" : "black"}
              />
              <Text
                className={type === "Ingreso" ? "text-green-500" : "text-black"}
              >
                Ingreso
              </Text>
            </Pressable>

            <Pressable
              className={`flex-row items-center gap-2 w-1/2 justify-center p-2 rounded-xl ${type === "Egreso" ? "bg-white" : ""}`}
              onPress={() => setType("Egreso")}
            >
              <Ionicons
                name="arrow-down-outline"
                size={24}
                color={type === "Egreso" ? "red" : "black"}
              />
              <Text
                className={type === "Egreso" ? "text-red-500" : "text-black"}
              >
                Egreso
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Fecha */}
        <View>
          <Text className="text-lg font-bold">Fecha</Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-xl border border-neutral-500 dark:border-[#334155] w-full"
              value={fecha}
              onChangeText={setFecha}
              placeholder="Fecha"
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Provedor */}
        {type === "Ingreso" && (
          <View>
            <Text className="text-lg font-bold">Proveedor</Text>
            <Dropdown
              data={provedores as any}
              search
              {...dropdownStyles}
              searchPlaceholder="Buscar Provedor..."
              valueField="id_provedor"
              labelField="nombre"
              placeholder="Seleccione el provedor"
              value={provedor}
              onChange={(item) => setProvedor(item)}
            />
          </View>
        )}

        {/* Insumo */}
        <View>
          <Text className="text-lg font-bold">Insumo</Text>
          <Dropdown
            data={insumos as any}
            search
            {...dropdownStyles}
            searchPlaceholder="Buscar Insumo..."
            valueField="id_insumo"
            labelField="nombre"
            placeholder="Seleccione el Insumo"
            value={insumo}
            onChange={(item) => setInsumo(item)}
          />
        </View>

        {/* Cantidad */}
        <View>
          <Text className="text-lg font-bold">Cantidad</Text>
          <View className="flex-row items-center justify-between gap-2">
            <TextInput
              className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-xl w-[90%] border border-neutral-500 dark:border-neutral-300"
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="Cantidad"
              keyboardType="number-pad"
            />
            <View className="border rounded-xl p-2">
              <Text>Un</Text>
            </View>
          </View>
        </View>

        {/* Bodega */}
        <View>
          <Text className="text-lg font-bold">Bodega</Text>
          <Dropdown
            data={bodegas as any}
            search
            {...dropdownStyles}
            searchPlaceholder="Buscar Bodega..."
            valueField="id_bodega"
            labelField="nombre"
            placeholder="Seleccione la Bodega"
            value={bodega}
            onChange={(item) => setBodega(item)}
          />
        </View>

        {/* Destino */}
        {type === "Egreso" && (
          <View>
            <Text className="text-lg font-bold">Destino</Text>
            <Dropdown
              data={destinos as any}
              search
              {...dropdownStyles}
              searchPlaceholder="Buscar Destino..."
              valueField="id_destino"
              labelField="nombre"
              placeholder="Seleccione el Destino"
              value={destino}
              onChange={(item) => setDestino(item)}
            />
          </View>
        )}

        <Pressable className="bg-primary w-full rounded-xl p-4 mt-4 justify-center items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-bold text-lg">
              Confirmar Carga
            </Text>
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          </View>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#6B7280",
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    borderRadius: 8,
  },
  containerStyle: {
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0", // En un StyleSheet normal esto no se adapta mágicamente, pero la librería suele tener un modo oscuro si le pasas las variables de react-native. Alternativamente, usar className si el componente lo permite.
  },
});
