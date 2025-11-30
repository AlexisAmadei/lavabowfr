import { ClicksItem } from "@/types/types";
import { supabase } from "./supabase";

/**
 * Fetches all Clicks content from the database.
 * @param setClicksContent - React state setter function to update Clicks content.
 */
export const fetchClicksContent = async (
    setClicksContent: (content: ClicksItem[]) => void
): Promise<void> => {
    const { data: clicks_paliers, error } = await supabase
        .from('clicks_paliers')
        .select('*')
        .order('id', { ascending: true })

    if (error) {
        console.error('Error fetching Clicks content:', error);
    } else {
        setClicksContent(clicks_paliers || []);
    }
}

/**
 * Inserts a new Clicks item into the database.
 * @param item - The Clicks item to insert.
 * @returns Array containing the inserted item data, or null if error.
 */
export const insertClicksItem = async (item: ClicksItem): Promise<ClicksItem[] | null> => {
    const { name, target } = item;

    if (!name || !target) {
        console.error('All fields are required to insert a Clicks item.');
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('clicks_paliers')
            .insert([
                { name, target }
            ])
            .select()

        if (error) {
            console.error('Error inserting Clicks item:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error inserting Clicks item:', error);
        return null;
    }
}

/**
 * Updates an existing Clicks item in the database.
 * @param id - The ID of the Clicks item to update.
 * @param updatedItem - The updated Clicks item data.
 * @returns Array containing the updated item data, or null if error.
 */
export const updateClicksItem = async (
    id: number,
    updatedItem: ClicksItem
): Promise<ClicksItem[] | null> => {
    const { name, target } = updatedItem;

    try {
        const { error: updateError } = await supabase
            .from('clicks_paliers')
            .update({ name, target })
            .eq('id', id)

        if (updateError) {
            console.error('Error updating Clicks item:', updateError);
            return null;
        }

        // Fetch the updated row
        const { data, error: selectError } = await supabase
            .from('clicks_paliers')
            .select('*')
            .eq('id', id)
            .single()

        if (selectError) {
            console.error('Error fetching updated item:', selectError);
            return [updatedItem];
        }

        return [data];
    } catch (error) {
        console.error('Exception updating Clicks item:', error);
        return null;
    }
}

/**
 * Deletes a Clicks item by ID.
 * @param id - The ID of the Clicks item to delete.
 * @returns True if deletion was successful, null if there was an error.
 */
export const deleteClicksItem = async (id: number): Promise<boolean | null> => {
    const { error: updateError } = await supabase
        .from('clicks_paliers')
        .delete()
        .eq('id', id)

    if (updateError) {
        console.error('Error deleting Clicks item:', updateError);
        return null;
    }

    return true;
}
