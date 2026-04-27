import { insumos } from "../data/insumo";
import { Insumo } from "../interface/Insumo";

export const getInsumos = async (): Promise<Insumo[]> => {
  return insumos;
};
