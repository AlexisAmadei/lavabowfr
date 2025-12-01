import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

async function addContact(email, apiKey) {
    const auth = 'Basic ' + Buffer.from(`anystring:${apiKey}`).toString('base64');
    const res = await fetch(`https://us8.api.mailchimp.com/3.0/${process.env.MAILCHIMP_MAIN_AUDIENCE}/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        },
        body: JSON.stringify({
            language: 'fr',
            email_channel: { email, marketing_consent: { status: 'confirmed' } }
        })
    });

    const body = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text());

    if (!res.ok) {
        return { ok: false, status: res.status, body };
    }
    return { ok: true, status: res.status, body };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // Optional: check a secret header for admin-only access
    if (req.headers['x-admin-secret'] !== process.env.MY_ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Mailchimp API key not configured' });

    // Fetch rows in a paginated way or with a small limit for safety
    const { data: users, error } = await supabase.from('newsletter').select('email').eq('mailchimp_synced', false).limit(100);
    if (error) return res.status(500).json({ error: error.message });

    const results = { added: 0, failed: 0, failures: [] };

    for (const u of users) {
        const r = await addContact(u.email, apiKey);
        if (r.ok) {
            results.added++;
            await supabase.from('newsletter').update({ mailchimp_synced: true }).eq('email', u.email);
        } else {
            results.failed++;
            results.failures.push({ email: u.email, status: r.status, body: r.body });
        }
    }

    return res.status(200).json(results);
}