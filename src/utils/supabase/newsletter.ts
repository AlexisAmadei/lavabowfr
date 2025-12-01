import { supabase } from "./supabase";

const verifyEmailInBackground = async (email: string, id: number) => {
    console.log('Starting background verification for email:', email, 'ID:', id);
    try {
        // Pass the ID to the API so it can update the database directly
        const response = await fetch('/api/verifyEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, id })
        });
        const result = await response.json();
        console.log('Background verification complete:', result);
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
            },
        ])
        .select()

    // Trigger background verification without awaiting
    if (data && data[0]) {
        console.log('Triggering background verification for ID:', data[0].id);
        verifyEmailInBackground(item, data[0].id);
    } else {
        console.log('No data returned from insert, skipping verification');
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
    if (error) {
        console.error('Error fetching newsletter items:', error);
        return null;
    }
    return data;
}
