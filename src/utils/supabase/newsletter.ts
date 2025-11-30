import { supabase } from "./supabase";

const verifyEmailInBackground = async (email: string, id: number) => {
    try {
        await fetch('/api/verifyEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, id })
        });
    } catch (error) {
        console.error('Background email verification failed:', error);
    }
}

export const insertNewsletterItem = async (item: string) => {
    // First, check if email already exists in Supabase
    const { data: existing } = await supabase
        .from('newsletter')
        .select('id')
        .eq('email', item)
        .maybeSingle();

    if (existing) {
        // Return a specific error for duplicate
        return { data: null, error: { message: 'duplicate key value' } as any };
    }

    // Insert with pending status
    const { data, error } = await supabase
        .from('newsletter')
        .insert([
            {
                email: item,
                active: true,
            },
        ])
        .select()

    // Trigger background verification without awaiting
    if (data && data[0]) {
        verifyEmailInBackground(item, data[0].id);
    }

    return { data, error };
}

export const deleteNewsletterItem = async (id: number) => {
    const { data, error } = await supabase
        .from('newsletter')
        .delete()
        .eq('id', id)
        .select()
    if (error) {
        console.error('Error deleting newsletter item:', error);
        return null;
    }
    return data;
}

export const getNewsletterItems = async () => {
    const { data, error } = await supabase
        .from('newsletter')
        .select('*')
        .eq('active', true)
    if (error) {
        console.error('Error fetching newsletter items:', error);
        return null;
    }
    return data;
}
