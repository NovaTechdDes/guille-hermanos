import { Mov_insumo } from '../interface/Mov_insumo';
import { supabase } from '../lib/supabase';

export const getMovimientosForDate = async (desde: string, hasta: string): Promise<Mov_insumo[] | null> => {
  try {
    const { data, error } = await supabase
      .from('mov_insumo')
      .select('*, insumo(nombre, unidad), bodega(nombre), destino(nombre), provedor(nombre)')
      .gte('fecha', `${desde}T00:00:00`)
      .lte('fecha', `${hasta}T23:59:59.999`);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return null;
  }
};

export const addMovimiento = async (movimiento: Mov_insumo): Promise<boolean> => {
  console.log(movimiento);
  try {
    const { error } = await supabase.from('mov_insumo').insert([movimiento]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al agregar movimiento:', error);
    return false;
  }
};
