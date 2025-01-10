export const createChannel = async(body) => {
    const response = await fetch('http://localhost:3000/channels', {
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
    const response = await fetch('http://localhost:3000/channels?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const updateChannel = async (id, body) => {
    const response = await fetch('http://localhost:3000/channels/' + id, {
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
    const response = await fetch('http://localhost:3000/channels/' + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const restoreChannel = async (id) => {
    const response = await fetch('http://localhost:3000/channels/' + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};