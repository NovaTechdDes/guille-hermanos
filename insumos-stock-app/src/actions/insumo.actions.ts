import { insumos } from "../data/insumo";
import { Insumo } from "../interface/Insumo";
import { supabase } from "../lib/supabase";

export const getInsumos = async (): Promise<Insumo[]> => {
  return insumos;
};

export const createNewInsumo = async (
  data: Partial<Insumo>,
): Promise<boolean> => {
  try {
    const { data: insumoCreado } = await supabase
      .from("insumo")
      .insert([data])
      .select("*")
      .single();

    if (insumoCreado) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
