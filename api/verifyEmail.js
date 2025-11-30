import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, id } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const rapidHost = process.env.RAPID_API_HOST ?? '';
        const rapidKey = process.env.RAPIDAPI_KEY ?? '';

        if (!rapidHost || !rapidKey) {
            console.log('RapidAPI credentials not configured');
            return res.status(200).json({ status: 'unknown' });
        }

        const url = 'https://' + rapidHost + '/verify/v1?email=' + encodeURIComponent(email);
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': rapidKey,
                'x-rapidapi-host': rapidHost
            }
        };

        const response = await fetch(url, options);
        const result = await response.json();

        let status = 'unknown';
        if (result.reason === "The mailbox doesn't exist.") {
            status = 'invalid';
        } else if (result.status === 'valid') {
            status = 'valid';
        } else {
            status = 'unknown';
        }

        // Update database if ID is provided and we have Supabase credentials
        if (id && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );

            const { error: updateError } = await supabase
                .from('newsletter')
                .update({ verify_status: status })
                .eq('id', id);

            if (updateError) {
                console.error('Failed to update verify_status:', updateError);
            }
        } else {
            console.warn('Skipping database update: Missing ID or Supabase credentials');
        }

        return res.status(200).json({ status });
    } catch (error) {
        console.error('Error validating email:', error);
        return res.status(200).json({ status: 'unknown' });
    }
}