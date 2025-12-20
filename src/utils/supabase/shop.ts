import { supabase } from "./supabase";

export interface MerchItem {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string[] | null;
    stock: number | null; // null means unlimited stock
}

export async function fetchMerchItems(): Promise<MerchItem[]> {
    try {
        let { data: merch_items, error } = await supabase
            .from('merch_items')
            .select('*');

        if (error) {
            console.error('Error fetching merch items:', error);
            return [];
        }
        return merch_items as MerchItem[];
    } catch (error) {
        console.error('Unexpected error fetching merch items:', error);
        return [];
    }
}