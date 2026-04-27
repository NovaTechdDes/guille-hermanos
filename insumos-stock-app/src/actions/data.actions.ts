import { supabase } from "../lib/supabase";

export const getData = async () => {
  try {
    const { data, error } = await supabase.rpc("get_app_data");
    if (error) throw error;

    return data as any;
  } catch (error) {
    console.error(error);
  }
};
