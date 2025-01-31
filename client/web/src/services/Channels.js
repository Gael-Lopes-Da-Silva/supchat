export const createChannel = async (body) => {
    const response = await fetch(`${process.env.API_URL}channels`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readChannel = async (query) => {
    const response = query.id ? await fetch(`${process.env.API_URL}channels/` + query.id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }) : await fetch(`${process.env.API_URL}channels?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateChannel = async (id, body) => {
    const response = await fetch(`${process.env.API_URL}channels/` + id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const deleteChannel = async (id) => {
    const response = await fetch(`${process.env.API_URL}channels/` + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreChannel = async (id) => {
    const response = await fetch(`${process.env.API_URL}channels/` + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};