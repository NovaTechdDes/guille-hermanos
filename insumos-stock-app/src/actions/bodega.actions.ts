import { bodega } from "../data/bodega";
import { Bodega } from "../interface/Bodega";

export const getBodegas = async (): Promise<Bodega[]> => {
  return bodega;
};
