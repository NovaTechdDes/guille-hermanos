import { useMutateInsumo } from "@/src/hooks/insumo/useMutateInsumo";
import { colors } from "@/src/theme/colors";
import { mensaje } from "@/src/utils/mensaje";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface ModalAddInsumoProps {
  isVisible: boolean;
  onClose: () => void;
}

const UNIDADES = [
  { label: "Kilogramos (KG)", value: "KG" },
  { label: "Litros (L)", value: "L" },
  { label: "Unidades (UN)", value: "UN" },
];

export default function ModalAddInsumo({
  isVisible,
  onClose,
}: ModalAddInsumoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { startPostInsumo } = useMutateInsumo();

  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleAdd = async () => {
    if (!nombre || !unidad) {
      setError(true);
      return;
    }

    const res = await startPostInsumo.mutateAsync({ nombre, unidad });

    if (res) {
      mensaje("success", "Insumo creado exitosamente", "");
      setNombre("");
      setUnidad(null);
      setError(false);
      onClose();
    } else {
      mensaje("error", "Error al crear el insumo", "");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-white dark:bg-neutral-900 rounded-[32px] w-full p-8 shadow-2xl border border-neutral-100 dark:border-neutral-800">
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
              <Ionicons name="leaf" size={24} color={colors.primary} />
            </View>
            <View>
              <Text className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">
                Nuevo Insumo
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 font-medium text-xs">
                Defina el producto y su unidad de medida.
              </Text>
            </View>
          </View>

          <View className="gap-6">
            {/* Campo Nombre */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">
                Nombre del Insumo
              </Text>
              <View className="flex-row items-center bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 h-14 rounded-2xl px-4">
                <TextInput
                  className="flex-1 text-neutral-800 dark:text-neutral-100 font-semibold"
                  placeholder="Ej: Glifosato Premium"
                  placeholderTextColor={isDark ? "#525252" : "#D4D4D4"}
                  value={nombre}
                  onChangeText={setNombre}
                />
                <Ionicons name="pencil-outline" size={18} color="#A3A3A3" />
              </View>
              {error && !nombre && (
                <Text className="text-red-500 text-xs ml-1 mt-2">
                  El nombre es obligatorio
                </Text>
              )}
            </View>

            {/* Campo Unidad */}
            <View>
              <Text className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[2px] mb-2 ml-1">
                Unidad de Medida
              </Text>
              <Dropdown
                data={UNIDADES}
                labelField="label"
                valueField="value"
                placeholder="Seleccione unidad..."
                value={unidad}
                onChange={(item) => setUnidad(item.value)}
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: isDark ? "#262626" : "#F9FAFB",
                    borderColor: isDark ? "#404040" : "#E5E7EB",
                  },
                ]}
                placeholderStyle={{
                  color: isDark ? "#737373" : "#A3A3A3",
                  fontSize: 14,
                  fontWeight: "500",
                }}
                selectedTextStyle={{
                  color: isDark ? "#F5F5F5" : "#171717",
                  fontSize: 14,
                  fontWeight: "600",
                }}
                containerStyle={{
                  backgroundColor: isDark ? "#171717" : "white",
                  borderColor: isDark ? "#404040" : "#E5E7EB",
                  borderRadius: 20,
                  marginTop: 8,
                  overflow: "hidden",
                }}
                itemTextStyle={{ color: isDark ? "#D4D4D4" : "#171717" }}
                activeColor={isDark ? "#262626" : "#F5F5F5"}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={18} color="#A3A3A3" />
                )}
              />
              {error && !unidad && (
                <Text className="text-red-500 text-xs ml-1 mt-2">
                  La unidad es obligatoria
                </Text>
              )}
            </View>

            {/* Botones de Acción */}
            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={onClose}
                className="flex-1 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl items-center justify-center"
              >
                <Text className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-tight">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                className="flex-[2] h-14 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
                onPress={handleAdd}
                disabled={startPostInsumo.isPending}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-black uppercase tracking-tight">
                    {startPostInsumo.isPending ? "Guardando..." : "Confirmar"}
                  </Text>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    width: "100%",
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
});
