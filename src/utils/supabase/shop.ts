import { supabase } from "./supabase";

export interface MerchItem {
    id?: number;
    name: string;
    description: string;
    price: number | string;
    tags: string[] | null;
    stock: number | string | null;
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

export async function updateMerchItem(item: MerchItem): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('merch_items')
            .update({
                name: item.name,
                description: item.description,
                price: item.price,
                tags: item.tags,
                stock: item.stock
            })
            .eq('id', item.id);
        if (error) {
            console.error('Error updating merch item:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Unexpected error updating merch item:', error);
        return false;
    }
}

export async function addMerchItem(item: Omit<MerchItem, 'id'>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('merch_items')
            .insert([{
                name: item.name,
                description: item.description,
                price: item.price,
                tags: item.tags,
                stock: item.stock
            }]);
        if (error) {
            console.error('Error adding merch item:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Unexpected error adding merch item:', error);
        return false;
    }
}