import { createClient } from "@supabase/supabase-js";

async function addContact(email) {
    const { MAILCHIMP_API_KEY, MAILCHIMP_USERNAME, MAILCHIMP_MAIN_AUDIENCE } = process.env;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_USERNAME || !MAILCHIMP_MAIN_AUDIENCE) {
        console.error('Missing Mailchimp configuration');
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic " + Buffer.from(`${MAILCHIMP_USERNAME}:${MAILCHIMP_API_KEY}`).toString('base64'));

    const raw = JSON.stringify({
        "language": "fr",
        "email_channel": {
            "email": email,
            "marketing_consent": {
                "status": "confirmed"
            }
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://us8.api.mailchimp.com/3.0/audiences/${MAILCHIMP_MAIN_AUDIENCE}/contacts`, requestOptions);
        const result = await response.json();

        if (!response.ok) {
            console.error("Mailchimp API error:", result);
            throw new Error(`Mailchimp API error: ${response.status}`);
        }
        console.log("Successfully added contact to Mailchimp:", email);
        return result;
    } catch (error) {
        console.error("Error adding contact to Mailchimp:", error);
        return null;
    };
}

async function updateSupabaseMailStatus(supabase, email) {
    try {
        await supabase
            .from('newsletter')
            .update({ mailchimp_synced: true })
            .eq('email', email)
            .then(({ error }) => {
                if (error) {
                    console.error('Error updating mailchimp_synced status:', error);
                } else {
                    console.log('Successfully updated mailchimp_synced status for:', email);
                }
            });
    } catch (error) {
        console.error('Unexpected error updating mailchimp_synced status:', error);
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // rows from newsletter table
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: users, error } = await supabase
            .from('newsletter')
            .select('email')

        if (error) {
            throw error;
        }

        // loop and add to mailchimp
        for (const user of users) {
            const resAddContact = await addContact(user.email);
            if (resAddContact) {
                await updateSupabaseMailStatus(supabase, user.email);
            }
        }

        res.status(200).json({ message: 'Sync completed successfully' });
    } catch (error) {
        console.error('Error during sync process:', error);
        res.status(500).json({ message: 'An error occurred during sync', error: error.message });
    }
}