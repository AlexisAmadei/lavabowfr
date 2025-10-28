
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Signs in a user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{data: Object|null, error: Object|null}>} Object containing authentication data or error.
 */
export const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

/**
 * Fetches all spotlight content from the database.
 * @param {Function} setSpotlightContent - React state setter function to update spotlight content.
 * @returns {Promise<void>}
 */
export const fetchSpotlightContent = async (setSpotlightContent) => {
    let { data: section_spotlight, error } = await supabase
        .from('section_spotlight')
        .select('*')
        .neq('status', 'DELETED')
        .order('id', { ascending: true })
    if (error) {
        console.error('Error fetching spotlight content:', error);
    } else {
        setSpotlightContent(section_spotlight);
    }
}

/**
 * Inserts a new spotlight item into the database.
 * @param {Object} item - The spotlight item to insert.
 * @param {string} item.title - The title of the spotlight item.
 * @param {string} item.subtitle - The subtitle of the spotlight item.
 * @param {string} item.listen_link - The link to listen to the item.
 * @param {string} item.buy_link - The link to buy/purchase the item.
 * @returns {Promise<Object[]|null>} Array containing the inserted item data, or null if error.
 */
export const insertSpotlightItem = async (item) => {
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
    }
}

/**
 * Updates an existing spotlight item in the database.
 * @param {number|string} id - The ID of the spotlight item to update.
 * @param {Object} updatedItem - The updated spotlight item data.
 * @param {string} updatedItem.title - The updated title.
 * @param {string} updatedItem.subtitle - The updated subtitle.
 * @param {string} updatedItem.listen_link - The updated listen link.
 * @param {string} updatedItem.buy_link - The updated buy link.
 * @returns {Promise<Object[]|null>} Array containing the updated item data, or null if error.
 */
export const updateSpotlightItem = async (id, updatedItem) => {
    const { title, subtitle, listen_link, buy_link } = updatedItem;

    try {
        const { error: updateError } = await supabase
            .from('section_spotlight')
            .update({ title, subtitle, listen_link, buy_link })
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
 * @param {number} id - The ID of the spotlight item to delete.
 * @returns {Promise<boolean|null>} True if deletion was successful, null if there was an error.
 */
export const deleteSpotlightItem = async (id) => {
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
