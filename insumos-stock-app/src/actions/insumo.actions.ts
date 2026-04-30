import { insumos } from '../data/insumo';
import { Insumo } from '../interface/Insumo';
import { supabase } from '../lib/supabase';

export const getInsumos = async (): Promise<Insumo[]> => {
  return insumos;
};

export const createNewInsumo = async (data: Partial<Insumo>): Promise<boolean> => {
  try {
    const { data: insumoCreado } = await supabase.from('insumo').insert([data]).select('*').single();

    if (insumoCreado) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateInsumo = async (id: string, data: Partial<Insumo>): Promise<boolean> => {
  try {
    const { data: insumoActualizado, error } = await supabase.from('insumo').update(data).eq('id_insumo', id).select('*').single();

    if (!insumoActualizado || error) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface Resultado {
  id_insumo: string;
  nombre: string;
  unidad: string;
  stock_global: number;
  stock_por_bodega: {
    bodega_nombre: string;
    stock: number;
  }[];
}

export const getInsumoById = async (id: string): Promise<Resultado | null> => {
  try {
    const { data, error } = await supabase.rpc('get_stock_insumo_detalle', {
      p_id_insumo: id,
    });

    if (error) {
      console.error('Error al obtener el insumo por id: ', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error al obtener el insumo por id: ', error);
    return null;
  }
};
