export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const { MAILCHIMP_API_KEY, MAILCHIMP_USERNAME, MAILCHIMP_MAIN_AUDIENCE } = process.env;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_USERNAME || !MAILCHIMP_MAIN_AUDIENCE) {
        return res.status(500).json({ error: 'Missing Mailchimp configuration' });
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic " + Buffer.from(`${MAILCHIMP_USERNAME}:${MAILCHIMP_API_KEY}`).toString('base64'));

    try {
        const response = await fetch(`https://us8.api.mailchimp.com/3.0/audiences/${MAILCHIMP_MAIN_AUDIENCE}/contacts`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                language: "fr",
                email_channel: {
                    email,
                    marketing_consent: { status: "confirmed" }
                }
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            if (result.title === 'Member Exists' || result.detail?.includes('already a list member')) {
                return res.status(409).json({ error: 'duplicate' });
            }
            return res.status(response.status).json({ error: result.detail || 'Mailchimp API error' });
        }

        return res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
