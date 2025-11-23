import { emailChecker } from "../emailChecker";
import { supabase } from "./supabase";

const verifyEmail = async (email: string) => {
    const { reason } = await emailChecker(email);

    if (reason === "The mailbox doesn't exist.") {
        return "invalid"
    }
    return "valid";
}

export const insertNewsletterItem = async (item: string) => {
    const validStatus = await verifyEmail(item);
    if (validStatus !== 'valid') {
        return { data: null, error: 'invalid'};
    }
    const { data, error } = await supabase
        .from('newsletter')
        .insert([
            {
                email: item,
                active: true,
            },
        ])
        .select()
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
