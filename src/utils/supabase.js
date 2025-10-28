
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

/* User sign-in */
export const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

export const fetchSpotlightContent = async (setSpotlightContent) => {
    let { data: section_spotlight, error } = await supabase
        .from('section_spotlight')
        .select('*')
    if (error) {
        console.error('Error fetching spotlight content:', error);
    } else {
        setSpotlightContent(section_spotlight);
    }
}

/* Insert spotlight item */
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
