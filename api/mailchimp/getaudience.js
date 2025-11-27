export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate environment variables
    const { MAILCHIMP_API_KEY, MAILCHIMP_USERNAME } = process.env;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_USERNAME) {
        return res.status(500).json({ error: 'Missing Mailchimp configuration' });
    }

    // Set up headers
    const myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        "Basic " + Buffer.from(`${MAILCHIMP_USERNAME}:${MAILCHIMP_API_KEY}`).toString('base64')
    );
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(
            "https://us8.api.mailchimp.com/3.0/audiences?count=10&offset=0",
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`Mailchimp API error: ${response.status}`);
        }

        const result = await response.json();
        return res.status(200).json(result);
    } catch (error) {
        console.error('Mailchimp API error:', error);
        return res.status(500).json({
            error: 'Failed to fetch Mailchimp data',
            message: error.message
        });
    }
}
