export const sendEmail = async(body, api_url) => {
    let url;
    if(api_url == null){
        url= process.env.REACT_APP_API_URL;
    } else{
        url= api_url;
    }
    const response = await fetch(`${url}email/send`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};