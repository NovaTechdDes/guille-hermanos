import { supabase } from '../lib/supabase';

export const postProvedor = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('provedor').insert({ nombre }).select('*').single();

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
