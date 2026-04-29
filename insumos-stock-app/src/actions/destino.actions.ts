import { supabase } from '../lib/supabase';

export const postDestino = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('destino').insert({ nombre }).select('*').single();

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
