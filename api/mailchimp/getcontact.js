export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate environment variables
    const { MAILCHIMP_API_KEY, MAILCHIMP_USERNAME, MAILCHIMP_MAIN_AUDIENCE } = process.env;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_USERNAME || !MAILCHIMP_MAIN_AUDIENCE) {
        return res.status(500).json({ error: 'Missing Mailchimp configuration' });
    }

    // Get query parameters
    const { count = 100, offset = 0 } = req.query;

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
        const url = `https://us8.api.mailchimp.com/3.0/audiences/${MAILCHIMP_MAIN_AUDIENCE}/contacts?fields=contacts,_links&count=${count}&offset=${offset}`;
        console.log('Fetching from:', url);

        const response = await fetch(url, requestOptions);

        console.log('Response status:', response.status, response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error text:', errorText);
            throw new Error(`Mailchimp API error: ${response.status}`);
        }

        const result = await response.json();

        return res.status(200).json(result);
    } catch (error) {
        console.error('Mailchimp API error:', error);
        return res.status(500).json({
            error: 'Failed to fetch Mailchimp contacts',
            message: error.message
        });
    }
}
