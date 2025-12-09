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

        // Validate required fields
        if (!event_type || !data) {
            return res.status(400).json({ error: 'Missing required fields: event_type, data' });
        }

        const { error } = await supabase
            .from('audit_log')
            .insert([{ event_type, data }]);

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: 'Failed to insert log' });
        }

        // Return 204 No Content for successful inserts
        return res.status(204).end();
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}