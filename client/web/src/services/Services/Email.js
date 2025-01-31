export const sendEmail = async(body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}email/send`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};