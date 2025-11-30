const rapidHost = process.env.RAPID_API_HOST ?? '';
const rapidKey = process.env.RAPIDAPI_KEY ?? '';

export const emailChecker = async (email: string) => {
    if (!rapidHost || !rapidKey) {
        return { status: 'unknown' };
    }

    const url = 'https://' + rapidHost + '/verify/v1?email=' + encodeURIComponent(email);
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': rapidKey,
            'x-rapidapi-host': rapidHost
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.reason === "The mailbox doesn't exist.") {
            return { status: 'invalid' };
        }
        return { status: result.status };
    } catch (error) {
        console.error('Error validating email:', error);
        return { status: 'invalid' }
    }
};