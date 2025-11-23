
export const emailChecker = async (email) => {
    const url = 'https://' + import.meta.env.VITE_RAPID_API_HOST + '/verify/v1?email=' + encodeURIComponent(email);
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return { status: 'invalid' }
    }
};