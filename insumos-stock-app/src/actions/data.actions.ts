import { supabase } from '../lib/supabase';

export const getData = async (id_usuario?: number) => {
  const { data, error } = await supabase.rpc('get_app_data', { p_usuario_id: Number(id_usuario) ?? 0 });

  if (error) {
    console.error('Error al obtener datos: ', error);
    throw error;
  }

  return data as any;
};

export interface Stock {
  id_insumo: string;
  nombre: string;
  stock: number;
  unidad: string;
}

export const getStock = async (): Promise<Stock[] | undefined> => {
  try {
    const { data, error } = await supabase.rpc('get_stock_insumos');
    if (error) throw error;

    const stock = data as Stock[];
    return stock;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
