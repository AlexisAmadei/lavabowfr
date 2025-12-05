import { SpotlightItem } from "@/types/types";
import { supabase } from "./supabase";

/**
 * Fetches all spotlight content from the database.
 * @param setSpotlightContent - React state setter function to update spotlight content.
 */
export const fetchSpotlightContent = async (
    setSpotlightContent: (content: SpotlightItem[]) => void
): Promise<void> => {
    const { data: section_spotlight, error } = await supabase
        .from('section_spotlight')
        .select('*')
        .neq('status', 'DELETED')
        .order('id', { ascending: true })

    if (error) {
        console.error('Error fetching spotlight content:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
    } else {
        setSpotlightContent(section_spotlight || []);
    }
}

/**
 * Inserts a new spotlight item into the database.
 * @param item - The spotlight item to insert.
 * @returns Array containing the inserted item data, or null if error.
 */
export const insertSpotlightItem = async (item: SpotlightItem): Promise<SpotlightItem[] | null> => {
    const { title, subtitle, listen_link, buy_link } = item;

    if (!title || !subtitle || !listen_link || !buy_link) {
        console.error('All fields are required to insert a spotlight item.');
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('section_spotlight')
            .insert([
                { title, subtitle, listen_link, buy_link }
            ])
            .select()

        if (error) {
            console.error('Error inserting spotlight item:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error inserting spotlight item:', error);
        return null;
    }
}

/**
 * Updates an existing spotlight item in the database.
 * @param id - The ID of the spotlight item to update.
 * @param updatedItem - The updated spotlight item data.
 * @returns Array containing the updated item data, or null if error.
 */
export const updateSpotlightItem = async (
    id: number,
    updatedItem: SpotlightItem
): Promise<SpotlightItem[] | null> => {
    const { title, subtitle, listen_link, buy_link, status } = updatedItem;

    try {
        const { error: updateError } = await supabase
            .from('section_spotlight')
            .update({ title, subtitle, listen_link, buy_link, status })
            .eq('id', id)

        if (updateError) {
            console.error('Error updating spotlight item:', updateError);
            return null;
        }

        // Fetch the updated row
        const { data, error: selectError } = await supabase
            .from('section_spotlight')
            .select('*')
            .eq('id', id)
            .single()

        if (selectError) {
            console.error('Error fetching updated item:', selectError);
            return [updatedItem];
        }

        return [data];
    } catch (error) {
        console.error('Exception updating spotlight item:', error);
        return null;
    }
}

/**
 * Deletes a spotlight item by ID.
 * @param id - The ID of the spotlight item to delete.
 * @returns True if deletion was successful, null if there was an error.
 */
export const deleteSpotlightItem = async (id: number): Promise<boolean | null> => {
    const { error: updateError } = await supabase
        .from('section_spotlight')
        .update({ status: 'DELETED' })
        .eq('id', id)

    if (updateError) {
        console.error('Error deleting spotlight item:', updateError);
        return null;
    }

    return true;
}
