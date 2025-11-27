export async function fetchMainAudience() {
    process.env.MAILCHIMP_API_KEY;
    process.env.MAILCHIMP_USERNAME;
    process.env.MAILCHIMP_MAIN_AUDIENCE;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic " + btoa(`${process.env.MAILCHIMP_USERNAME}:${process.env.MAILCHIMP_API_KEY}`));

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://us8.api.mailchimp.com/3.0/audiences?count=10&offset=0", requestOptions);
        const result = await response.text();
        console.log(result)
    } catch (error) {
        console.error(error);
    };
}