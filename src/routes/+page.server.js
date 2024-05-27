import { supabase } from '$lib/supabaseClient';

export async function load() {
    const { data, error } = await supabase
        .from('cfx_temp_insumos_inventario')
        .select('*')
        .order('descripcion', { ascending: true });

    if (error) {
        console.error('Error fetching data:', error);
        return {
            data: [],
        };
    }

    return {
        data: data ?? [],
    };
}
