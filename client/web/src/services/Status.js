export const readStatus = async (query) => {
    const response = await fetch('http://localhost:3000/status?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};