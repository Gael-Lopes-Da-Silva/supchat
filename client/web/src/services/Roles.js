export const readRole = async (query) => {
    const response = await fetch('http://localhost:3000/roles?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};