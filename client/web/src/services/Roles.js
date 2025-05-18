export const readRole = async (query) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}roles?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const getRoles = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}roles`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

