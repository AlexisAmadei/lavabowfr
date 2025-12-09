import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        const { event_type, data } = req.body;
        const { error } = await supabase
            .from('audit_log')
            .insert([{ event_type, data }]);
        if (error) {
            console.error('Error inserting log:', error);
            return res.status(500).json({ error: 'Failed to insert log' });
        }
        return res.status(200).json({ message: 'Log inserted successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}